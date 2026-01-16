"use client"

import { useState } from "react"
import { jobsAPI } from "../api"
import "./PostJobPage.css"

const PostJobPage = () => {
  const history = history()
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    requirements: "",
    location: "",
    type: "full-time",
    category: "",
    skills: "",
    benefits: "",
    salaryMin: "",
    salaryMax: "",
    currency: "USD",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const jobData = {
        title: formData.title,
        company: formData.company,
        description: formData.description,
        requirements: formData.requirements,
        location: formData.location,
        type: formData.type,
        category: formData.category,
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        benefits: formData.benefits
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        salary: {
          min: formData.salaryMin ? Number.parseInt(formData.salaryMin) : undefined,
          max: formData.salaryMax ? Number.parseInt(formData.salaryMax) : undefined,
          currency: formData.currency,
        },
      }

      await jobsAPI.create(jobData)
      history.push("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post job")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="post-job-page">
      <div className="container">
        <div className="post-job-header">
          <h1>Post a New Job</h1>
          <p>Fill in the details to create a job listing</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="post-job-form">
          <div className="card">
            <h2>Basic Information</h2>

            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="e.g. Senior Software Engineer"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="e.g. Tech Corp"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="e.g. Lagos, Nigeria"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Job Type *</label>
                <select name="type" value={formData.type} onChange={handleChange} className="form-input" required>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="e.g. Technology, Finance, Healthcare"
              />
            </div>
          </div>

          <div className="card">
            <h2>Job Details</h2>

            <div className="form-group">
              <label className="form-label">Job Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-input form-textarea"
                required
                placeholder="Describe the role, responsibilities, and what makes this position unique..."
                rows={6}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Requirements *</label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                className="form-input form-textarea"
                required
                placeholder="List the qualifications, experience, and skills required..."
                rows={6}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Required Skills</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="form-input"
                placeholder="Separate skills with commas: React, Node.js, MongoDB"
              />
              <small>Comma-separated list of skills</small>
            </div>

            <div className="form-group">
              <label className="form-label">Benefits</label>
              <input
                type="text"
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                className="form-input"
                placeholder="Health insurance, Remote work, Professional development"
              />
              <small>Comma-separated list of benefits</small>
            </div>
          </div>

          <div className="card">
            <h2>Compensation</h2>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Minimum Salary</label>
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="50000"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Maximum Salary</label>
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="80000"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Currency</label>
                <select name="currency" value={formData.currency} onChange={handleChange} className="form-input">
                  <option value="USD">USD</option>
                  <option value="NGN">NGN</option>
                  <option value="KES">KES</option>
                  <option value="ZAR">ZAR</option>
                  <option value="EGP">EGP</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => history.push("/dashboard")} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Posting..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PostJobPage
