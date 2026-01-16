import mongoose from "mongoose"

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: String,
      required: true,
    },
    salary: {
      min: Number,
      max: Number,
      currency: { type: String, default: "USD" },
    },
    location: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "remote"],
      default: "full-time",
    },
    category: {
      type: String,
      required: true,
    },
    skills: [String],
    benefits: [String],
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "closed", "draft"],
      default: "active",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    expiresAt: Date,
  },
  {
    timestamps: true,
  },
)

jobSchema.index({ title: "text", description: "text", company: "text" })

export default mongoose.model("Job", jobSchema)
