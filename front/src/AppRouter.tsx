// File: front/src/AppRouter.tsx
// Last change: Replaced role-based dashboards with Lakovňa project categories.

import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./shared/layouts/app.layout";
import ProtectedRoute from "./shared/guards/protected-route.guard";
import { PROJECT_CATEGORY_PATHS } from "common/configs/project-paths";
import { APP_PATHS } from "common/configs/paths.config";

const HomePage = lazy(() => import("./apps/home/home"));
const Page404 = lazy(() => import("./apps/portal/404/404.page"));

const DashboardPlaceholder = () => (
  <div style={{ textAlign: "center", padding: "3rem" }}>
    <h1>Načítavam Dashboard...</h1>
    <p>Táto stránka je vo vývoji.</p>
  </div>
);

// --- Placeholders for Lakovňa categories ---
const PaintDashboard = DashboardPlaceholder;
const MechanicalDashboard = DashboardPlaceholder;
const FullServiceDashboard = DashboardPlaceholder;

export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<div className="text-center p-12">Načítavam...</div>}>
      <Routes>
        <Route path={APP_PATHS.public.home} element={<AppLayout />}>
          <Route index element={<HomePage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path={PROJECT_CATEGORY_PATHS.paint} element={<PaintDashboard />} />
            <Route path={PROJECT_CATEGORY_PATHS.mechanical} element={<MechanicalDashboard />} />
            <Route path={PROJECT_CATEGORY_PATHS["full-service"]} element={<FullServiceDashboard />} />
          </Route>
          
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
