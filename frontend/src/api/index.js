import axios from "axios"

const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_URL,
})

// Jobs API
export const jobsAPI = {
  getAll: (params) => api.get("/jobs", { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post("/jobs", data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
}

// CVs API
export const cvsAPI = {
  getAll: () => api.get("/cvs"),
  getById: (id) => api.get(`/cvs/${id}`),
  create: (data) => api.post("/cvs", data),
  update: (id, data) => api.put(`/cvs/${id}`, data),
  delete: (id) => api.delete(`/cvs/${id}`),
}

// Applications API
export const applicationsAPI = {
  getAll: () => api.get("/applications"),
  create: (data) => api.post("/applications", data),
  update: (id, data) => api.put(`/applications/${id}`, data),
}

// AI API
export const aiAPI = {
  recommendJobs: (data) => api.post("/ai/recommend-jobs", data),
  optimizeCV: (data) => api.post("/ai/optimize-cv", data),
  generateCoverLetter: (data) => api.post("/ai/generate-cover-letter", data),
}

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get("/dashboard/stats"),
}

// Payments API
export const paymentsAPI = {
  createCheckout: (data) => api.post("/payments/create-checkout", data),
}

export default api
