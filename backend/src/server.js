import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoutes from "./routes/auth.js"
import jobRoutes from "./routes/jobs.js"
import cvRoutes from "./routes/cvs.js"
import applicationRoutes from "./routes/applications.js"
import aiRoutes from "./routes/ai.js"
import dashboardRoutes from "./routes/dashboard.js"
import paymentRoutes from "./routes/payments.js"

dotenv.config()

const app = express()

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173/",
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Database connection
mongoose
  .connect(process.env.MONGO_URI )
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/jobs", jobRoutes)
app.use("/api/cvs", cvRoutes)
app.use("/api/applications", applicationRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/payments", paymentRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "ULB JOB API is running" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
