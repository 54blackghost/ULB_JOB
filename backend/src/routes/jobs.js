import express from "express"
import Job from "../models/Job.js"
import { authenticate, authorize } from "../middleware/auth.js"

const router = express.Router()

// Get all jobs with filters
router.get("/", async (req, res) => {
  try {
    const { search, location, type, category, minSalary, page = 1, limit = 20 } = req.query

    const query = { status: "active" }

    if (search) {
      query.$text = { $search: search }
    }
    if (location) {
      query.location = new RegExp(location, "i")
    }
    if (type) {
      query.type = type
    }
    if (category) {
      query.category = category
    }
    if (minSalary) {
      query["salary.min"] = { $gte: Number.parseInt(minSalary) }
    }

    const jobs = await Job.find(query)
      .populate("recruiter", "fullName profile.avatar")
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const count = await Job.countDocuments(query)

    res.json({
      success: true,
      jobs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// Get single job
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("recruiter", "fullName profile.avatar profile.phone email")

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }

    // Increment views
    job.views += 1
    await job.save()

    res.json({
      success: true,
      job,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// Create job (recruiters only)
router.post("/", authenticate, authorize("recruiter", "admin"), async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      recruiter: req.user._id,
    }

    const job = new Job(jobData)
    await job.save()

    // Update user usage
    req.user.usage.jobPosts += 1
    await req.user.save()

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// Update job
router.put("/:id", authenticate, authorize("recruiter", "admin"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }

    // Check ownership
    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    Object.assign(job, req.body)
    await job.save()

    res.json({
      success: true,
      message: "Job updated successfully",
      job,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// Delete job
router.delete("/:id", authenticate, authorize("recruiter", "admin"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      })
    }

    // Check ownership
    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    await job.deleteOne()

    res.json({
      success: true,
      message: "Job deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

export default router
