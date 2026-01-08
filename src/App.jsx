// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import MainLayout from "./components/layout/MainLayout";
import DashboardLayout from "./components/layout/DashboardLayout";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardHome from "./pages/DashboardHome";
import GlobalRadarPage from "./pages/GlobalRadarPage";
import PatentIntelligence from "./pages/PatentIntelligence";
import ResearchInsights from "./pages/ResearchInsights";
import TRLTracker from "./pages/TRLTracker";
import AlertsSignals from "./pages/AlertsSignals";
import ReportsGenerator from "./pages/ReportsGenerator";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";

import TechConver from "./pages/TechConver";
import CompanyIntelligenceEngine from "./pages/CompanyIntelligenceEngine";
import TechForecastingDashboard from "./pages/Demon";

import AIChatAssistant from "./components/AIChatAssistant";
import { AuthProvider } from "./context/AuthContext";

import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <>
      <Toaster />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public marketing site */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<LandingPage />} />
            </Route>

            {/* Authentication */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Dedicated Chat Page */}
            <Route path="/chat" element={<ChatPage />} />

            {/* Dashboard layout */}
            <Route path="/" element={<DashboardLayout />}>
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="radar" element={<GlobalRadarPage />} />
              <Route path="patents" element={<PatentIntelligence />} />
              <Route path="research" element={<ResearchInsights />} />
              <Route path="trl" element={<TRLTracker />} />
              <Route path="alerts" element={<AlertsSignals />} />
              <Route path="reports" element={<ReportsGenerator />} />
              <Route path="settings" element={<SettingsPage />} />

              {/* Tech Convergence */}
              <Route path="tech-convergence" element={<TechConver />} />

              {/* Company Intelligence */}
              <Route path="companies" element={<CompanyIntelligenceEngine />} />
              <Route path="tech-forecasting" element={<TechForecastingDashboard />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          <AIChatAssistant />
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
