import mongoose from "mongoose"

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cv: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CV",
    },
    coverLetter: String,
    status: {
      type: String,
      enum: ["pending", "reviewing", "shortlisted", "interviewed", "rejected", "accepted"],
      default: "pending",
    },
    notes: String,
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model("Application", applicationSchema)
