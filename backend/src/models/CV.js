import mongoose from "mongoose"

const cvSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    personalInfo: {
      fullName: String,
      email: String,
      phone: String,
      location: String,
      summary: String,
    },
    experience: [
      {
        title: String,
        company: String,
        location: String,
        startDate: String,
        endDate: String,
        current: Boolean,
        description: String,
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        location: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],
    skills: [String],
    certifications: [
      {
        name: String,
        issuer: String,
        date: String,
        url: String,
      },
    ],
    projects: [
      {
        name: String,
        description: String,
        url: String,
        technologies: [String],
      },
    ],
    atsScore: {
      type: Number,
      default: 0,
    },
    optimizationSuggestions: [String],
    keywords: [String],
  },
  {
    timestamps: true,
  },
)

export default mongoose.model("CV", cvSchema)
