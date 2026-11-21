import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage";




function App() {
  return (
       <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
      </Routes>
    </BrowserRouter>)

          {/* Routes protégées 
            <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:slug" element={<JobDetailPage />} />
        <Route path="/stages" element={<JobsPage />} />
        <Route path="/freelance" element={<JobsPage />} />
        <Route path="/remote" element={<JobsPage />} />
        <Route path="/career-advice" element={<CareerPage />} />
        <Route path="/career-advice/:slug" element={<CareerPage />} />
        <Route path="/create-cv" element={<CvPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
          
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
          
          
          */}
      
    
  
}

export default App;
