import express from "express"
import Stripe from "stripe"
import User from "../models/User.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const PRICING_PLANS = {
  candidate: {
    basic: { price: 999, priceId: "price_candidate_basic", name: "Basic Plan" },
    premium: { price: 1999, priceId: "price_candidate_premium", name: "Premium Plan" },
  },
  recruiter: {
    basic: { price: 4999, priceId: "price_recruiter_basic", name: "Basic Plan" },
    premium: { price: 9999, priceId: "price_recruiter_premium", name: "Premium Plan" },
    enterprise: { price: 19999, priceId: "price_recruiter_enterprise", name: "Enterprise Plan" },
  },
}

// Create checkout session
router.post("/create-checkout", authenticate, async (req, res) => {
  try {
    const { plan } = req.body
    const userRole = req.user.role === "recruiter" ? "recruiter" : "candidate"

    const planDetails = PRICING_PLANS[userRole][plan]

    if (!planDetails) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan",
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `ULB JOB ${planDetails.name}`,
              description: `Monthly subscription for ${userRole}s`,
            },
            unit_amount: planDetails.price,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
      client_reference_id: req.user._id.toString(),
      metadata: {
        userId: req.user._id.toString(),
        plan,
      },
    })

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// Webhook for Stripe events
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"]

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object

      await User.findByIdAndUpdate(session.metadata.userId, {
        "subscription.plan": session.metadata.plan,
        "subscription.status": "active",
        "subscription.startDate": new Date(),
        "subscription.stripeCustomerId": session.customer,
        "subscription.stripeSubscriptionId": session.subscription,
      })
    }

    res.json({ received: true })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

export default router
