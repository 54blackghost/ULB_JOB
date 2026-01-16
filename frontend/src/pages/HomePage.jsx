import React from "react"
import { Link } from "react-router-dom"

const HomePage = () => {
  return (
    <div className="bg-gray-50">
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6 inline-block">
              <span className="badge badge-primary text-base">AI-Powered Job Platform for Africa</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Find Your Dream Job in{" "}
              <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Africa
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Connect with top employers across the continent. Get AI-powered job recommendations, optimize your CV, and
              land your next opportunity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/jobs" className="btn btn-primary btn-lg">
                Browse Jobs →
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                For Recruiters
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary-600 mb-2">10K+</p>
                <p className="text-gray-600">Active Jobs</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary-600 mb-2">50K+</p>
                <p className="text-gray-600">Job Seekers</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary-600 mb-2">2K+</p>
                <p className="text-gray-600">Companies</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose ULB JOB?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powered by cutting-edge AI technology to help you succeed in your career journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card hover:shadow-lg transition-shadow duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                🎯
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Job Matching</h3>
              <p className="text-gray-600 leading-relaxed">
                Get personalized job recommendations based on your skills and experience
              </p>
            </div>

            <div className="card hover:shadow-lg transition-shadow duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                ✨
              </div>
              <h3 className="text-xl font-semibold mb-3">CV Optimization</h3>
              <p className="text-gray-600 leading-relaxed">
                AI-powered CV analysis and optimization to beat applicant tracking systems
              </p>
            </div>

            <div className="card hover:shadow-lg transition-shadow duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Apply</h3>
              <p className="text-gray-600 leading-relaxed">
                Apply to multiple jobs with one click using your optimized CV
              </p>
            </div>

            <div className="card hover:shadow-lg transition-shadow duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                🌍
              </div>
              <h3 className="text-xl font-semibold mb-3">Pan-African Network</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with opportunities across all major African countries
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of professionals finding their dream jobs across Africa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn btn-accent btn-lg">
              Create Free Account
            </Link>
            <Link
              to="/jobs"
              className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-medium rounded-lg transition-all duration-200"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white text-lg font-bold mb-4">ULB JOB</h4>
              <p className="text-gray-400 leading-relaxed">
                AI-powered job platform connecting talent with opportunities across Africa
              </p>
            </div>
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">For Job Seekers</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/jobs" className="hover:text-white transition-colors">
                    Browse Jobs
                  </Link>
                </li>
                <li>
                  <Link to="/cv-builder" className="hover:text-white transition-colors">
                    CV Builder
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-lg font-semibold mb-4">For Recruiters</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/post-job" className="hover:text-white transition-colors">
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-white transition-colors">
                    Pricing Plans
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">&copy; 2025 ULB JOB. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
