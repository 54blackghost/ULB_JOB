import React from "react"
import { useState } from "react"
import { Link, useNavigate} from "react-router-dom"
import { useAuth } from "../context/AuthContext"
//import "./Navbar.css"

const Navbar = () => {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate();
  const handleLogout = () => {
    logout()
    navigate("/login");
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              ULB
            </span>
            <span className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">JOB</span>
          </Link>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-0.5 bg-gray-900 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
              ></span>
              <span className={`block h-0.5 bg-gray-900 transition-all ${menuOpen ? "opacity-0" : ""}`}></span>
              <span
                className={`block h-0.5 bg-gray-900 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              ></span>
            </div>
          </button>

          <div
            className={`${menuOpen ? "block" : "hidden"} md:flex md:items-center md:gap-6 absolute md:relative top-16 md:top-0 left-0 right-0 bg-white md:bg-transparent p-4 md:p-0 shadow-lg md:shadow-none`}
          >
            <Link
              to="/jobs"
              className="block md:inline-block py-2 md:py-0 text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Browse Jobs
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block md:inline-block py-2 md:py-0 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                {user.role === "candidate" && (
                  <>
                    <Link
                      to="/cv-builder"
                      className="block md:inline-block py-2 md:py-0 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                    >
                      CV Builder
                    </Link>
                    <Link
                      to="/recommendations"
                      className="block md:inline-block py-2 md:py-0 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                    >
                      Recommendations
                    </Link>
                  </>
                )}
                {user.role === "recruiter" && (
                  <Link
                    to="/post-job"
                    className="block md:inline-block py-2 md:py-0 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  >
                    Post Job
                  </Link>
                )}
                <div className="flex flex-col md:flex-row md:items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 mt-3 md:mt-0">
                  <span className="text-sm font-medium text-gray-700">{user.fullName}</span>
                  <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col md:flex-row gap-3 pt-3 md:pt-0 border-t md:border-t-0 mt-3 md:mt-0">
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
