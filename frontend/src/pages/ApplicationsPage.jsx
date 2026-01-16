"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { applicationsAPI } from "../api"
import { Link } from "react-router-dom"
import "./ApplicationsPage.css"

const ApplicationsPage = () => {
  const { user } = useAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      const response = await applicationsAPI.getAll()
      setApplications(response.data.applications)
    } catch (error) {
      console.error("Failed to load applications:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateApplicationStatus = async (id, status) => {
    try {
      await applicationsAPI.update(id, { status })
      loadApplications()
    } catch (error) {
      console.error("Failed to update application:", error)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending: "badge-warning",
      reviewing: "badge-info",
      shortlisted: "badge-primary",
      interviewed: "badge-primary",
      accepted: "badge-success",
      rejected: "badge-danger",
    }
    return badges[status] || "badge-warning"
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="applications-page">
      <div className="container">
        <div className="applications-header">
          <h1>{user?.role === "candidate" ? "My Applications" : "Applications"}</h1>
          <p>
            {user?.role === "candidate"
              ? "Track the status of your job applications"
              : "Review and manage candidate applications"}
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="empty-state">
            <p>No applications yet</p>
            {user?.role === "candidate" && (
              <Link to="/jobs" className="btn btn-primary">
                Browse Jobs
              </Link>
            )}
          </div>
        ) : (
          <div className="applications-grid">
            {applications.map((application) => (
              <div key={application._id} className="application-card">
                <div className="application-header">
                  <div>
                    <h3>
                      <Link to={`/jobs/${application.job._id}`}>{application.job.title}</Link>
                    </h3>
                    <p className="application-company">{application.job.company}</p>
                  </div>
                  <span className={`badge ${getStatusBadge(application.status)}`}>{application.status}</span>
                </div>

                <div className="application-meta">
                  <span>{application.job.location}</span>
                  <span>•</span>
                  <span>{application.job.type}</span>
                  <span>•</span>
                  <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                </div>

                {user?.role === "candidate" && application.coverLetter && (
                  <div className="application-cover-letter">
                    <h4>Cover Letter</h4>
                    <p>{application.coverLetter.substring(0, 200)}...</p>
                  </div>
                )}

                {user?.role === "recruiter" && (
                  <div className="application-candidate">
                    <h4>Candidate</h4>
                    <p>
                      {application.candidate.fullName} ({application.candidate.email})
                    </p>
                    {application.candidate.profile?.phone && <p>Phone: {application.candidate.profile.phone}</p>}

                    <div className="application-actions">
                      {application.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateApplicationStatus(application._id, "reviewing")}
                            className="btn btn-secondary btn-sm"
                          >
                            Review
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(application._id, "shortlisted")}
                            className="btn btn-primary btn-sm"
                          >
                            Shortlist
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(application._id, "rejected")}
                            className="btn btn-secondary btn-sm"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {application.status === "reviewing" && (
                        <>
                          <button
                            onClick={() => updateApplicationStatus(application._id, "shortlisted")}
                            className="btn btn-primary btn-sm"
                          >
                            Shortlist
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(application._id, "interviewed")}
                            className="btn btn-accent btn-sm"
                          >
                            Interview
                          </button>
                        </>
                      )}
                      {application.status === "shortlisted" && (
                        <>
                          <button
                            onClick={() => updateApplicationStatus(application._id, "interviewed")}
                            className="btn btn-accent btn-sm"
                          >
                            Interview
                          </button>
                        </>
                      )}
                      {application.status === "interviewed" && (
                        <>
                          <button
                            onClick={() => updateApplicationStatus(application._id, "accepted")}
                            className="btn btn-accent btn-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(application._id, "rejected")}
                            className="btn btn-secondary btn-sm"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {application.notes && user?.role === "recruiter" && (
                  <div className="application-notes">
                    <h4>Notes</h4>
                    <p>{application.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ApplicationsPage
