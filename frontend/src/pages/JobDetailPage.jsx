"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { jobsAPI, applicationsAPI } from "../api"
import "./JobDetailPage.css"

const JobDetailPage = () => {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const history = history()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadJob()
  }, [id])

  const loadJob = async () => {
    try {
      const response = await jobsAPI.getById(id)
      setJob(response.data.job)
    } catch (error) {
      console.error("Failed to load job:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    if (!isAuthenticated) {
      history.push("/login", { from: `/jobs/${id}` })
      return
    }

    setApplying(true)
    try {
      await applicationsAPI.create({
        jobId: id,
        coverLetter: "",
      })
      setSuccess(true)
    } catch (error) {
      alert(error.response?.data?.message || "Failed to apply")
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="container" style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <h2>Job not found</h2>
      </div>
    )
  }

  return (
    <div className="job-detail-page">
      <div className="container">
        <div className="job-detail-layout">
          <main className="job-detail-content">
            <div className="job-detail-header">
              <div>
                <h1>{job.title}</h1>
                <p className="job-company">{job.company}</p>
                <div className="job-meta">
                  <span>{job.location}</span>
                  <span>•</span>
                  <span className="badge badge-primary">{job.type}</span>
                  <span>•</span>
                  <span>{job.applicationsCount} applicants</span>
                </div>
              </div>
            </div>

            {success && (
              <div className="alert alert-success">
                Application submitted successfully! Check your dashboard for updates.
              </div>
            )}

            <div className="card">
              <h2>Job Description</h2>
              <p className="job-description">{job.description}</p>

              <h2>Requirements</h2>
              <p className="job-requirements">{job.requirements}</p>

              {job.skills && job.skills.length > 0 && (
                <>
                  <h2>Required Skills</h2>
                  <div className="job-skills">
                    {job.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {job.benefits && job.benefits.length > 0 && (
                <>
                  <h2>Benefits</h2>
                  <ul className="benefits-list">
                    {job.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </main>

          <aside className="job-detail-sidebar">
            <div className="card">
              {user?.role === "candidate" && !success && (
                <button onClick={handleApply} className="btn btn-primary btn-block" disabled={applying}>
                  {applying ? "Applying..." : "Apply Now"}
                </button>
              )}

              {success && (
                <button className="btn btn-accent btn-block" disabled>
                  ✓ Applied
                </button>
              )}

              {!isAuthenticated && (
                <button onClick={handleApply} className="btn btn-primary btn-block">
                  Login to Apply
                </button>
              )}

              <div className="job-info">
                <h3>Job Information</h3>
                <div className="info-item">
                  <span className="info-label">Category</span>
                  <span className="info-value">{job.category}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Job Type</span>
                  <span className="info-value">{job.type}</span>
                </div>
                {job.salary?.min && (
                  <div className="info-item">
                    <span className="info-label">Salary</span>
                    <span className="info-value">
                      ${job.salary.min.toLocaleString()} - ${job.salary.max?.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="info-item">
                  <span className="info-label">Posted</span>
                  <span className="info-value">{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default JobDetailPage
