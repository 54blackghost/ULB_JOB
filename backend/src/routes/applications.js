import express from "express"
import Application from "../models/Application.js"
import Job from "../models/Job.js"
import { authenticate, authorize } from "../middleware/auth.js"

const router = express.Router()

// Get applications (candidates see their own, recruiters see applications for their jobs)
router.get("/", authenticate, async (req, res) => {
  try {
    const query = {}

    if (req.user.role === "candidate") {
      query.candidate = req.user._id
    } else if (req.user.role === "recruiter") {
      const jobs = await Job.find({ recruiter: req.user._id }).select("_id")
      query.job = { $in: jobs.map((j) => j._id) }
    }

    const applications = await Application.find(query)
      .populate("job", "title company location type")
      .populate("candidate", "fullName email profile")
      .populate("cv")
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      applications,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// Apply for a job
router.post("/", authenticate, authorize("candidate"), async (req, res) => {
  try {
    const { jobId, cvId, coverLetter } = req.body

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user._id,
    })

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this job",
      })
    }

    const application = new Application({
      job: jobId,
      candidate: req.user._id,
      cv: cvId,
      coverLetter,
    })

    await application.save()

    // Update job applications count
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationsCount: 1 },
    })

    // Update user usage
    req.user.usage.applications += 1
    await req.user.save()

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// Update application status (recruiters only)
router.put("/:id", authenticate, authorize("recruiter", "admin"), async (req, res) => {
  try {
    const { status, notes } = req.body

    const application = await Application.findById(req.params.id).populate("job")

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      })
    }

    // Check ownership
    if (application.job.recruiter.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    application.status = status
    if (notes) application.notes = notes
    await application.save()

    res.json({
      success: true,
      message: "Application updated successfully",
      application,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

export default router
