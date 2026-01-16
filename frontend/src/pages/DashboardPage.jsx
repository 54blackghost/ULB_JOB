"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { dashboardAPI } from "../api"
import { Link } from "react-router-dom"
import "./DashboardPage.css"

const DashboardPage = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await dashboardAPI.getStats()
      setStats(response.data.stats)
    } catch (error) {
      console.error("Failed to load stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back, {user?.fullName}</p>
          </div>
          {user?.role === "recruiter" && (
            <Link to="/post-job" className="btn btn-primary">
              Post New Job
            </Link>
          )}
        </div>

        <div className="stats-grid">
          {user?.role === "candidate" && (
            <>
              <div className="stat-card">
                <div className="stat-icon primary">📝</div>
                <div>
                  <p className="stat-value">{stats?.totalApplications || 0}</p>
                  <p className="stat-label">Total Applications</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon accent">🎯</div>
                <div>
                  <p className="stat-value">{stats?.activeApplications || 0}</p>
                  <p className="stat-label">Active Applications</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon primary">📄</div>
                <div>
                  <p className="stat-value">{stats?.totalCVs || 0}</p>
                  <p className="stat-label">CVs Created</p>
                </div>
              </div>
            </>
          )}

          {user?.role === "recruiter" && (
            <>
              <div className="stat-card">
                <div className="stat-icon primary">💼</div>
                <div>
                  <p className="stat-value">{stats?.totalJobs || 0}</p>
                  <p className="stat-label">Total Jobs</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon accent">✅</div>
                <div>
                  <p className="stat-value">{stats?.activeJobs || 0}</p>
                  <p className="stat-label">Active Jobs</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon primary">👥</div>
                <div>
                  <p className="stat-value">{stats?.totalApplications || 0}</p>
                  <p className="stat-label">Total Applications</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon accent">🆕</div>
                <div>
                  <p className="stat-value">{stats?.newApplications || 0}</p>
                  <p className="stat-label">New Applications</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="dashboard-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {user?.role === "candidate" && (
              <>
                <Link to="/jobs" className="action-card">
                  <div className="action-icon">🔍</div>
                  <h3>Browse Jobs</h3>
                  <p>Find your next opportunity</p>
                </Link>
                <Link to="/cv-builder" className="action-card">
                  <div className="action-icon">📝</div>
                  <h3>Build CV</h3>
                  <p>Create or update your CV</p>
                </Link>
                <Link to="/recommendations" className="action-card">
                  <div className="action-icon">✨</div>
                  <h3>Get Recommendations</h3>
                  <p>AI-powered job matching</p>
                </Link>
                <Link to="/applications" className="action-card">
                  <div className="action-icon">📋</div>
                  <h3>My Applications</h3>
                  <p>Track your applications</p>
                </Link>
              </>
            )}

            {user?.role === "recruiter" && (
              <>
                <Link to="/post-job" className="action-card">
                  <div className="action-icon">➕</div>
                  <h3>Post Job</h3>
                  <p>Create a new job listing</p>
                </Link>
                <Link to="/applications" className="action-card">
                  <div className="action-icon">👥</div>
                  <h3>Applications</h3>
                  <p>Review candidates</p>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="subscription-info">
          <div className="card">
            <h3>Your Plan: {user?.subscription?.plan || "Free"}</h3>
            <p>
              {user?.role === "candidate"
                ? `CV Optimizations: ${stats?.usage?.cvOptimizations || 0} | AI Recommendations: ${stats?.usage?.aiRecommendations || 0}`
                : `Jobs Posted: ${stats?.usage?.jobPosts || 0}`}
            </p>
            <Link to="/pricing" className="btn btn-primary">
              Upgrade Plan
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
