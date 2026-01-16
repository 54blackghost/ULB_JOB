import React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import axios from "axios"

const AuthContext = createContext(null)

const API_URL = import.meta.env.VITE_API_URL

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem("token"))

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      loadUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const loadUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`)
      setUser(response.data.user)
    } catch (error) {
      console.error("Failed to load user:", error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    })
    const { token, user } = response.data
    localStorage.setItem("token", token)
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    setToken(token)
    setUser(user)
    return response.data
  }

  const register = async (email, password, fullName, role) => {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
      fullName,
      role,
    })
    const { token, user } = response.data
    localStorage.setItem("token", token)
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    setToken(token)
    setUser(user)
    return response.data
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    setToken(null)
    setUser(null)
  }

  const updateProfile = async (profileData) => {
    const response = await axios.put(`${API_URL}/auth/profile`, profileData)
    setUser(response.data.user)
    return response.data
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export default AuthContext
