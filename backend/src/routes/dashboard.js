import express from "express"
import Job from "../models/Job.js"
import Application from "../models/Application.js"
import CV from "../models/CV.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

// Get dashboard stats
router.get("/stats", authenticate, async (req, res) => {
  try {
    let stats = {}

    if (req.user.role === "candidate") {
      const applications = await Application.countDocuments({
        candidate: req.user._id,
      })
      const cvs = await CV.countDocuments({
        user: req.user._id,
      })
      const activeApplications = await Application.countDocuments({
        candidate: req.user._id,
        status: { $in: ["pending", "reviewing", "shortlisted", "interviewed"] },
      })

      stats = {
        totalApplications: applications,
        activeApplications,
        totalCVs: cvs,
        usage: req.user.usage,
      }
    } else if (req.user.role === "recruiter") {
      const jobs = await Job.countDocuments({
        recruiter: req.user._id,
      })
      const activeJobs = await Job.countDocuments({
        recruiter: req.user._id,
        status: "active",
      })

      const recruiterJobs = await Job.find({
        recruiter: req.user._id,
      }).select("_id")

      const applications = await Application.countDocuments({
        job: { $in: recruiterJobs.map((j) => j._id) },
      })
      const newApplications = await Application.countDocuments({
        job: { $in: recruiterJobs.map((j) => j._id) },
        status: "pending",
      })

      stats = {
        totalJobs: jobs,
        activeJobs,
        totalApplications: applications,
        newApplications,
        usage: req.user.usage,
      }
    }

    res.json({
      success: true,
      stats,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

export default router
