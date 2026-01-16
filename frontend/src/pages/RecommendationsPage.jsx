"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { aiAPI } from "../api"
import { Link } from "react-router-dom"
import "./RecommendationsPage.css"

const RecommendationsPage = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState(null)
  const [formData, setFormData] = useState({
    skills: user?.profile?.skills?.join(", ") || "",
    experience: user?.profile?.experience || "",
    location: user?.profile?.location || "",
    preferences: "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await aiAPI.recommendJobs({
        skills: formData.skills.split(",").map((s) => s.trim()),
        experience: formData.experience,
        location: formData.location,
        preferences: formData.preferences,
      })

      setRecommendations(response.data)
    } catch (error) {
      alert("Failed to get recommendations")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="recommendations-page">
      <div className="container">
        <div className="recommendations-header">
          <h1>AI Job Recommendations</h1>
          <p>Get personalized job matches based on your profile</p>
        </div>

        <div className="recommendations-layout">
          <aside className="recommendations-sidebar">
            <div className="card">
              <h3>Your Profile</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Skills</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="JavaScript, React, Node.js"
                  />
                  <small>Comma-separated</small>
                </div>

                <div className="form-group">
                  <label className="form-label">Experience Level</label>
                  <select name="experience" value={formData.experience} onChange={handleChange} className="form-input">
                    <option value="">Select level</option>
                    <option value="entry">Entry Level (0-2 years)</option>
                    <option value="mid">Mid Level (3-5 years)</option>
                    <option value="senior">Senior (6+ years)</option>
                    <option value="lead">Lead/Principal</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Lagos, Nigeria"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Preferences</label>
                  <textarea
                    name="preferences"
                    value={formData.preferences}
                    onChange={handleChange}
                    className="form-input"
                    rows={3}
                    placeholder="Remote work, startup environment, etc."
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading ? "Analyzing..." : "Get Recommendations"}
                </button>
              </form>
            </div>
          </aside>

          <main className="recommendations-content">
            {loading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>AI is analyzing your profile and finding the best job matches...</p>
              </div>
            ) : recommendations ? (
              <>
                <div className="card">
                  <h2>AI Analysis</h2>
                  <div className="ai-response">
                    <pre>{recommendations.recommendations}</pre>
                  </div>
                </div>

                <div className="recommended-jobs">
                  <h2>Recommended Jobs</h2>
                  <div className="jobs-grid">
                    {recommendations.jobs?.map((job) => (
                      <Link to={`/jobs/${job._id}`} key={job._id} className="job-card">
                        <div className="job-card-header">
                          <h3>{job.title}</h3>
                          {job.featured && <span className="badge badge-primary">Featured</span>}
                        </div>
                        <p className="job-company">{job.company}</p>
                        <p className="job-location">{job.location}</p>
                        {job.salary?.min && (
                          <p className="job-salary">
                            ${job.salary.min.toLocaleString()} - ${job.salary.max?.toLocaleString()}
                          </p>
                        )}
                        <div className="job-skills">
                          {job.skills?.slice(0, 3).map((skill, index) => (
                            <span key={index} className="skill-tag">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <h3>No recommendations yet</h3>
                <p>Fill in your profile information and click "Get Recommendations" to see personalized job matches</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default RecommendationsPage
