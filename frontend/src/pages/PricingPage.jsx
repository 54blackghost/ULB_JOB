import React from "react"
import { useNavigate } from "react-router"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { paymentsAPI } from "../api"
import "./PricingPage.css"

const PricingPage = () => {
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const navigate = useNavigate();

  const candidatePlans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      period: "forever",
      features: ["Browse all jobs", "Apply to jobs", "Create 1 CV", "Basic job alerts", "Community support"],
      limits: "Limited features",
    },
    {
      id: "basic",
      name: "Basic",
      price: 9.99,
      period: "month",
      features: [
        "Everything in Free",
        "Create unlimited CVs",
        "5 AI CV optimizations/month",
        "10 AI recommendations/month",
        "Priority job alerts",
        "Email support",
      ],
      popular: false,
    },
    {
      id: "premium",
      name: "Premium",
      price: 19.99,
      period: "month",
      features: [
        "Everything in Basic",
        "Unlimited AI CV optimizations",
        "Unlimited AI recommendations",
        "AI cover letter generation",
        "Featured profile",
        "Interview preparation tools",
        "Priority support",
      ],
      popular: true,
    },
  ]

  const recruiterPlans = [
    {
      id: "basic",
      name: "Starter",
      price: 49.99,
      period: "month",
      features: ["Post up to 5 jobs/month", "Basic applicant tracking", "Email notifications", "Standard support"],
      limits: "Perfect for small teams",
    },
    {
      id: "premium",
      name: "Professional",
      price: 99.99,
      period: "month",
      features: [
        "Post up to 20 jobs/month",
        "Advanced applicant tracking",
        "AI job description optimization",
        "Candidate search",
        "Analytics dashboard",
        "Priority support",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 199.99,
      period: "month",
      features: [
        "Unlimited job postings",
        "Full applicant tracking system",
        "AI-powered candidate matching",
        "Advanced analytics",
        "Dedicated account manager",
        "Custom integrations",
        "24/7 priority support",
      ],
      limits: "Best for large organizations",
    },
  ]

  const plans = user?.role === "recruiter" ? recruiterPlans : candidatePlans

  const handleSubscribe = async (planId) => {
    if (!isAuthenticated) {
      navigate("/login");
      return
    }

    if (planId === "free") {
      return
    }

    setLoading(true)
    setSelectedPlan(planId)

    try {
      const response = await paymentsAPI.createCheckout({ plan: planId })
      window.location.href = response.data.url
    } catch (error) {
      alert("Failed to start checkout process")
      setLoading(false)
      setSelectedPlan(null)
    }
  }

  return (
    <div className="pricing-page">
      <div className="pricing-header">
        <div className="container">
          <h1 className="text-3xl font-bold mb-2 text-blue-800">Choose Your Plan</h1>
          <p className="text-gray-600">Select the perfect plan for your needs</p>
        </div>
      </div>

      <div className="container">
        <div className="pricing-grid m-10">
          {plans.map((plan) => (
            <div key={plan.id} className={`pricing-card ${plan.popular ? "popular" : ""}`}>
              {plan.popular && <div className="popular-badge">Most Popular</div>}

              <div className="pricing-card-header">
                <h3>{plan.name}</h3>
                <div className="pricing-amount">
                  <span className="currency">$</span>
                  <span className="price">{plan.price}</span>
                  {plan.price > 0 && <span className="period">/{plan.period}</span>}
                </div>
                {plan.limits && <p className="plan-limits">{plan.limits}</p>}
              </div>

              <ul className="pricing-features">
                {plan.features.map((feature, index) => (
                  <li key={index}>
                    <span className="check-icon">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                className={`btn ${plan.popular ? "btn-primary" : "btn-secondary"} btn-block`}
                disabled={loading && selectedPlan === plan.id}
              >
                {loading && selectedPlan === plan.id
                  ? "Processing..."
                  : plan.price === 0
                    ? "Current Plan"
                    : user?.subscription?.plan === plan.id
                      ? "Current Plan"
                      : "Subscribe"}
              </button>
            </div>
          ))}
        </div>

        <div className="pricing-faq">
          <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
          <div className="faq-grid m-10">
            <div className="faq-item">
              <h3 className="text-3xl font-bold mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your
                billing period.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="text-3xl font-bold mb-2">What payment methods do you accept?</h3>
              <p>We accept all major credit cards, debit cards, and mobile money payments through Stripe.</p>
            </div>
            <div className="faq-item">
              <h3 className="text-3xl font-bold mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-gray-600">
                Yes, you can change your plan at any time. The changes will be reflected immediately, and we'll prorate
                the charges.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="text-3xl font-bold mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">
                Our free plan is available forever with basic features. You can upgrade to a paid plan anytime to unlock
                more features.
              </p>
            </div>
          </div>
        </div>

        <div className="pricing-cta">
          <div className="card">
            <h2 className="text-3xl font-bold mb-2 text-blue-800">Need a custom solution?</h2>
            <p className="text-gray-600">
              Contact us for enterprise pricing and custom integrations tailored to your organization's specific needs.
            </p>
            <button className="btn btn-primary text-black">Contact Sales</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingPage
