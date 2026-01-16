import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import JobsPage from "./pages/JobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import DashboardPage from "./pages/DashboardPage";
import CVBuilderPage from "./pages/CVBuilderPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import PostJobPage from "./pages/PostJobPage";
import PricingPage from "./pages/PricingPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/pricing" element={<PricingPage />} />

          {/* Routes protégées */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/cv-builder"
            element={
              <PrivateRoute>
                <CVBuilderPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/applications"
            element={
              <PrivateRoute>
                <ApplicationsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/recommendations"
            element={
              <PrivateRoute>
                <RecommendationsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/post-job"
            element={
              <PrivateRoute>
                <PostJobPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
