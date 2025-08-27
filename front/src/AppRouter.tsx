// File: front/src/AppRouter.tsx
// Last change: Replaced non-existent dashboard pages with temporary placeholder components.

import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./shared/layouts/app.layout";
import ProtectedRoute from "./shared/guards/protected-route.guard";
import { APP_ROLE_PATHS } from "./libs/types/systems/app_role.types";
import { APP_PATHS } from "./libs/configs/paths.config";

const HomePage = lazy(() => import("./apps/portal/home/home.page"));
const Page404 = lazy(() => import("./apps/portal/404/404.page"));

const DashboardPlaceholder = () => (
  <div style={{ textAlign: "center", padding: "3rem" }}>
    <h1>Načítavam Dashboard...</h1>
    <p>Táto stránka je vo vývoji.</p>
  </div>
);

// --- Create placeholders for role-based pages ---
const SenderDashboard = DashboardPlaceholder;
const HaulerDashboard = DashboardPlaceholder;
const BrokerDashboard = DashboardPlaceholder;

export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<div className="text-center p-12">Načítavam...</div>}>
      <Routes>
        <Route path={APP_PATHS.public.home} element={<AppLayout />}>
          <Route index element={<HomePage />} />
          
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path={APP_ROLE_PATHS.sender} element={<SenderDashboard />} />
            <Route path={APP_ROLE_PATHS.hauler} element={<HaulerDashboard />} />
            <Route path={APP_ROLE_PATHS.broker} element={<BrokerDashboard />} />
          </Route>
          
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
