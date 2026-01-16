import express from "express"
import { GoogleGenerativeAI } from "@google/generative-ai"
import Job from "../models/Job.js"
import CV from "../models/CV.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Recommend jobs based on user profile
router.post("/recommend-jobs", authenticate, async (req, res) => {
  try {
    const { skills, experience, location, preferences } = req.body

    // Get active jobs
    const jobs = await Job.find({ status: "active" }).limit(50).populate("recruiter", "fullName")

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
      As an AI job matching expert, analyze the following candidate profile and recommend the best matching jobs.
      
      Candidate Profile:
      - Skills: ${skills?.join(", ") || "Not specified"}
      - Experience: ${experience || "Not specified"}
      - Location: ${location || "Any"}
      - Preferences: ${preferences || "None"}
      
      Available Jobs (first 10):
      ${jobs
        .slice(0, 10)
        .map(
          (job, idx) => `
        ${idx + 1}. ${job.title} at ${job.company}
           Location: ${job.location}
           Type: ${job.type}
           Skills Required: ${job.skills?.join(", ")}
           Description: ${job.description.substring(0, 200)}...
      `,
        )
        .join("\n")}
      
      Provide:
      1. Top 5 recommended job matches with match percentage
      2. Reasoning for each recommendation
      3. Skills gap analysis
      4. Market insights for this profile
      
      Format as JSON.
    `

    const result = await model.generateContent(prompt)
    const response = result.response.text()

    // Update user usage
    req.user.usage.aiRecommendations += 1
    await req.user.save()

    res.json({
      success: true,
      recommendations: response,
      jobs: jobs.slice(0, 10),
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// Optimize CV with AI
router.post("/optimize-cv", authenticate, async (req, res) => {
  try {
    const { cvId, targetDomain } = req.body

    const cv = await CV.findOne({
      _id: cvId,
      user: req.user._id,
    })

    if (!cv) {
      return res.status(404).json({
        success: false,
        message: "CV not found",
      })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
      Analyze this CV and provide optimization suggestions for ${targetDomain || "general"} positions.
      
      CV Content:
      Name: ${cv.personalInfo?.fullName}
      Summary: ${cv.personalInfo?.summary}
      Skills: ${cv.skills?.join(", ")}
      Experience: ${JSON.stringify(cv.experience)}
      Education: ${JSON.stringify(cv.education)}
      
      Provide:
      1. ATS Score (0-100)
      2. Top 5 optimization suggestions
      3. Recommended keywords to add
      4. Content improvements
      5. Formatting suggestions
      
      Format as JSON with: { atsScore, suggestions, keywords, improvements }
    `

    const result = await model.generateContent(prompt)
    const response = result.response.text()

    let optimization
    try {
      optimization = JSON.parse(response.replace(/```json\n?|\n?```/g, ""))
    } catch {
      optimization = {
        atsScore: 75,
        suggestions: [response],
        keywords: [],
        improvements: [],
      }
    }

    // Update CV with optimization data
    cv.atsScore = optimization.atsScore || 75
    cv.optimizationSuggestions = optimization.suggestions || []
    cv.keywords = optimization.keywords || []
    await cv.save()

    // Update user usage
    req.user.usage.cvOptimizations += 1
    await req.user.save()

    res.json({
      success: true,
      optimization,
      cv,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// Generate cover letter
router.post("/generate-cover-letter", authenticate, async (req, res) => {
  try {
    const { jobId, cvId } = req.body

    const job = await Job.findById(jobId)
    const cv = await CV.findOne({ _id: cvId, user: req.user._id })

    if (!job || !cv) {
      return res.status(404).json({
        success: false,
        message: "Job or CV not found",
      })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `
      Write a professional cover letter for this job application.
      
      Job Details:
      - Title: ${job.title}
      - Company: ${job.company}
      - Description: ${job.description}
      - Requirements: ${job.requirements}
      
      Candidate Profile:
      - Name: ${cv.personalInfo?.fullName}
      - Skills: ${cv.skills?.join(", ")}
      - Experience: ${JSON.stringify(cv.experience?.slice(0, 2))}
      
      Write a compelling, personalized cover letter (300-400 words) that:
      1. Shows enthusiasm for the role
      2. Highlights relevant experience
      3. Explains why they're a great fit
      4. Is professional yet personable
    `

    const result = await model.generateContent(prompt)
    const coverLetter = result.response.text()

    res.json({
      success: true,
      coverLetter,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

export default router
