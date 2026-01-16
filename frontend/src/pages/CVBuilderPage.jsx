import React from "react"
import { useState, useEffect } from "react"
import { cvsAPI, aiAPI } from "../api"
import "./CVBuilderPage.css"

const CVBuilderPage = () => {
  const history = history()
  const [cvs, setCvs] = useState([])
  const [selectedCV, setSelectedCV] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
  })
  const [loading, setLoading] = useState(false)
  const [optimizing, setOptimizing] = useState(false)
  const [optimization, setOptimization] = useState(null)
  const [view, setView] = useState("list")

  useEffect(() => {
    loadCVs()
  }, [])

  const loadCVs = async () => {
    try {
      const response = await cvsAPI.getAll()
      setCvs(response.data.cvs)
    } catch (error) {
      console.error("Failed to load CVs:", error)
    }
  }

  const handleChange = (e, section, index, field) => {
    if (section && index !== undefined) {
      const newData = { ...formData }
      newData[section][index][field] = e.target.value
      setFormData(newData)
    } else if (section) {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: e.target.value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      })
    }
  }

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        {
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    })
  }

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          degree: "",
          institution: "",
          location: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    })
  }

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(",").map((s) => s.trim())
    setFormData({ ...formData, skills })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (selectedCV) {
        await cvsAPI.update(selectedCV, formData)
      } else {
        await cvsAPI.create(formData)
      }
      loadCVs()
      setView("list")
      resetForm()
    } catch (error) {
      alert("Failed to save CV")
    } finally {
      setLoading(false)
    }
  }

  const loadCV = async (id) => {
    try {
      const response = await cvsAPI.getById(id)
      setFormData(response.data.cv)
      setSelectedCV(id)
      setView("edit")
    } catch (error) {
      console.error("Failed to load CV:", error)
    }
  }

  const deleteCV = async (id) => {
    if (window.confirm("Are you sure you want to delete this CV?")) {
      try {
        await cvsAPI.delete(id)
        loadCVs()
      } catch (error) {
        alert("Failed to delete CV")
      }
    }
  }

  const optimizeCV = async (cvId) => {
    setOptimizing(true)
    try {
      const response = await aiAPI.optimizeCV({
        cvId,
        targetDomain: "general",
      })
      setOptimization(response.data.optimization)
      loadCV(cvId)
    } catch (error) {
      alert("Failed to optimize CV")
    } finally {
      setOptimizing(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      personalInfo: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        summary: "",
      },
      experience: [],
      education: [],
      skills: [],
      certifications: [],
      projects: [],
    })
    setSelectedCV(null)
    setOptimization(null)
  }

  if (view === "list") {
    return (
      <div className="cv-builder-page">
        <div className="container">
          <div className="cv-builder-header">
            <div>
              <h1>CV Builder</h1>
              <p>Create and manage your professional CVs</p>
            </div>
            <button
              onClick={() => {
                resetForm()
                setView("edit")
              }}
              className="btn btn-primary"
            >
              Create New CV
            </button>
          </div>

          {cvs.length === 0 ? (
            <div className="empty-state">
              <p>No CVs yet. Create your first CV to get started!</p>
            </div>
          ) : (
            <div className="cvs-grid">
              {cvs.map((cv) => (
                <div key={cv._id} className="cv-card">
                  <div className="cv-card-header">
                    <h3>{cv.title}</h3>
                    {cv.atsScore > 0 && (
                      <div className="ats-score">
                        <span className={`score ${cv.atsScore >= 70 ? "good" : cv.atsScore >= 50 ? "medium" : "low"}`}>
                          {cv.atsScore}
                        </span>
                        <span className="score-label">ATS Score</span>
                      </div>
                    )}
                  </div>
                  <p className="cv-meta">Last updated: {new Date(cv.updatedAt).toLocaleDateString()}</p>
                  <div className="cv-skills">
                    {cv.skills?.slice(0, 5).map((skill, idx) => (
                      <span key={idx} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="cv-actions">
                    <button onClick={() => loadCV(cv._id)} className="btn btn-secondary btn-sm">
                      Edit
                    </button>
                    <button onClick={() => optimizeCV(cv._id)} className="btn btn-accent btn-sm">
                      Optimize
                    </button>
                    <button onClick={() => deleteCV(cv._id)} className="btn btn-secondary btn-sm">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {optimizing && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="loading">
                  <div className="spinner"></div>
                  <p>Optimizing your CV with AI...</p>
                </div>
              </div>
            </div>
          )}

          {optimization && (
            <div className="modal-overlay" onClick={() => setOptimization(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>CV Optimization Results</h2>
                <div className="optimization-score">
                  <div className="score-circle">
                    <span className="score-value">{optimization.atsScore || 75}</span>
                    <span className="score-max">/100</span>
                  </div>
                  <p>ATS Score</p>
                </div>
                <div className="optimization-section">
                  <h3>Suggestions</h3>
                  <ul>
                    {optimization.suggestions?.map((suggestion, idx) => (
                      <li key={idx}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
                {optimization.keywords && optimization.keywords.length > 0 && (
                  <div className="optimization-section">
                    <h3>Recommended Keywords</h3>
                    <div className="keywords-list">
                      {optimization.keywords.map((keyword, idx) => (
                        <span key={idx} className="keyword-tag">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <button onClick={() => setOptimization(null)} className="btn btn-primary">
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="cv-builder-page">
      <div className="container">
        <div className="cv-builder-header">
          <div>
            <h1>{selectedCV ? "Edit CV" : "Create CV"}</h1>
            <p>Fill in your professional information</p>
          </div>
          <button onClick={() => setView("list")} className="btn btn-secondary">
            Back to List
          </button>
        </div>

        <form onSubmit={handleSubmit} className="cv-form">
          <div className="card">
            <h2>CV Title</h2>
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="e.g. Software Engineer CV"
              />
            </div>
          </div>

          <div className="card">
            <h2>Personal Information</h2>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                value={formData.personalInfo.fullName}
                onChange={(e) => handleChange(e, "personalInfo", null, "fullName")}
                className="form-input"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e) => handleChange(e, "personalInfo", null, "email")}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  value={formData.personalInfo.phone}
                  onChange={(e) => handleChange(e, "personalInfo", null, "phone")}
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                value={formData.personalInfo.location}
                onChange={(e) => handleChange(e, "personalInfo", null, "location")}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Professional Summary</label>
              <textarea
                value={formData.personalInfo.summary}
                onChange={(e) => handleChange(e, "personalInfo", null, "summary")}
                className="form-input form-textarea"
                rows={4}
              />
            </div>
          </div>

          <div className="card">
            <h2>Experience</h2>
            {formData.experience.map((exp, index) => (
              <div key={index} className="experience-item">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Job Title</label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => handleChange(e, "experience", index, "title")}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleChange(e, "experience", index, "company")}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => handleChange(e, "experience", index, "startDate")}
                      className="form-input"
                      placeholder="Jan 2020"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input
                      type="text"
                      value={exp.endDate}
                      onChange={(e) => handleChange(e, "experience", index, "endDate")}
                      className="form-input"
                      placeholder="Present"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => handleChange(e, "experience", index, "description")}
                    className="form-input form-textarea"
                    rows={3}
                  />
                </div>
              </div>
            ))}
            <button type="button" onClick={addExperience} className="btn btn-secondary">
              Add Experience
            </button>
          </div>

          <div className="card">
            <h2>Education</h2>
            {formData.education.map((edu, index) => (
              <div key={index} className="education-item">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleChange(e, "education", index, "degree")}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => handleChange(e, "education", index, "institution")}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input
                      type="text"
                      value={edu.startDate}
                      onChange={(e) => handleChange(e, "education", index, "startDate")}
                      className="form-input"
                      placeholder="2016"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input
                      type="text"
                      value={edu.endDate}
                      onChange={(e) => handleChange(e, "education", index, "endDate")}
                      className="form-input"
                      placeholder="2020"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={addEducation} className="btn btn-secondary">
              Add Education
            </button>
          </div>

          <div className="card">
            <h2>Skills</h2>
            <div className="form-group">
              <label className="form-label">Skills</label>
              <input
                type="text"
                value={formData.skills.join(", ")}
                onChange={handleSkillsChange}
                className="form-input"
                placeholder="JavaScript, React, Node.js"
              />
              <small>Comma-separated list of skills</small>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => setView("list")} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save CV"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CVBuilderPage
