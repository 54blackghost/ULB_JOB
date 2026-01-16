import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["candidate", "recruiter", "admin"],
      default: "candidate",
    },
    profile: {
      phone: String,
      location: String,
      bio: String,
      skills: [String],
      experience: String,
      education: String,
      avatar: String,
    },
    subscription: {
      plan: {
        type: String,
        enum: ["free", "basic", "premium", "enterprise"],
        default: "free",
      },
      status: {
        type: String,
        enum: ["active", "inactive", "cancelled"],
        default: "active",
      },
      startDate: Date,
      endDate: Date,
      stripeCustomerId: String,
      stripeSubscriptionId: String,
    },
    usage: {
      cvOptimizations: { type: Number, default: 0 },
      aiRecommendations: { type: Number, default: 0 },
      jobPosts: { type: Number, default: 0 },
      applications: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model("User", userSchema)
