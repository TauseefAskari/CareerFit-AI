import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout.jsx';
import { DashboardLayout } from '../layouts/DashboardLayout.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';

import { Home } from '../pages/Home.jsx';
import { Login } from '../pages/Login.jsx';
import { Register } from '../pages/Register.jsx';
import { Dashboard } from '../pages/Dashboard.jsx';
import { AnalyzeResume } from '../pages/AnalyzeResume.jsx';
import { AnalysisResults } from '../pages/AnalysisResults.jsx';
import { AnalysisHistory } from '../pages/AnalysisHistory.jsx';
import { Profile } from '../pages/Profile.jsx';
import { NotFound } from '../pages/NotFound.jsx';

/**
 * Top-level application routes structure
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes wrapped in MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/404" element={<NotFound />} />
      </Route>

      {/* Protected routes wrapped in ProtectedRoute and DashboardLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/analyze" element={<AnalyzeResume />} />
          <Route path="/dashboard/results/:id" element={<AnalysisResults />} />
          <Route path="/dashboard/history" element={<AnalysisHistory />} />
          <Route path="/dashboard/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
