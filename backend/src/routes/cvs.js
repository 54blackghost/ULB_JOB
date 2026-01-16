import express from "express"
import CV from "../models/CV.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

// Get user's CVs
router.get("/", authenticate, async (req, res) => {
  try {
    const cvs = await CV.find({ user: req.user._id }).sort({ updatedAt: -1 })

    res.json({
      success: true,
      cvs,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// Get single CV
router.get("/:id", authenticate, async (req, res) => {
  try {
    const cv = await CV.findOne({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: "CV not found",
      })
    }

    res.json({
      success: true,
      cv,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// Create CV
router.post("/", authenticate, async (req, res) => {
  try {
    const cvData = {
      ...req.body,
      user: req.user._id,
    }

    const cv = new CV(cvData)
    await cv.save()

    res.status(201).json({
      success: true,
      message: "CV created successfully",
      cv,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// Update CV
router.put("/:id", authenticate, async (req, res) => {
  try {
    const cv = await CV.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, {
      new: true,
      runValidators: true,
    })

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: "CV not found",
      })
    }

    res.json({
      success: true,
      message: "CV updated successfully",
      cv,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// Delete CV
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const cv = await CV.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: "CV not found",
      })
    }

    res.json({
      success: true,
      message: "CV deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

export default router
