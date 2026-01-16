import React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { jobsAPI } from "../api"
//import "../pages/JobsPage.css"

const JobsPage = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    type: "",
    category: "",
  })

  useEffect(() => {
    loadJobs()
  }, [filters])

  const loadJobs = async () => {
    try {
      setLoading(true)
      const response = await jobsAPI.getAll(filters)
      setJobs(response.data.jobs)
    } catch (error) {
      console.error("Failed to load jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse Jobs</h1>
          <p className="text-primary-100 text-lg">Find your next opportunity across Africa</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80 flex-shrink-0">
            <div className="card sticky top-20">
              <h3 className="text-xl font-semibold mb-6">Filters</h3>

              <div className="form-group">
                <label className="form-label">Search</label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="form-input"
                  placeholder="Job title, company..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="form-input"
                  placeholder="City, country..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Job Type</label>
                <select name="type" value={filters.type} onChange={handleFilterChange} className="form-input">
                  <option value="">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="remote">Remote</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="form-input"
                  placeholder="e.g. Technology"
                />
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-600 text-lg">No jobs found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <Link
                    to={`/jobs/${job._id}`}
                    key={job._id}
                    className="card hover:shadow-lg transition-all duration-200 hover:border-primary-300 block"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                        {job.title}
                      </h3>
                      <span className={`badge ${job.featured ? "badge-primary" : "badge-success"}`}>
                        {job.featured ? "Featured" : job.type}
                      </span>
                    </div>
                    <p className="text-gray-700 font-medium mb-1">{job.company}</p>
                    <p className="text-gray-600 mb-2 flex items-center gap-1">
                      <span>📍</span> {job.location}
                    </p>
                    {job.salary?.min && (
                      <p className="text-accent-700 font-semibold mb-3">
                        ${job.salary.min.toLocaleString()} - ${job.salary.max?.toLocaleString()} / year
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills?.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                      <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                      <span>{job.applicationsCount} applicants</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default JobsPage
