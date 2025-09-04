// File: front/src/shared/guards/protected-route.guard.tsx
// Last change: Replaced hardcoded text and fixed import paths.

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/auth.context';
import { useTranslation } from '../../contexts/translation.context';
import { APP_PATHS } from 'common/configs/_backaup/paths.config';
import './protected-route.guard.css';

const LoadingIndicator: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="protected-route-loading">
      <div className="protected-route-loading__spinner" />
      <p>{t("common", "states.verifyingLogin")}</p>
    </div>
  );
};

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!isAuthenticated) {
    return <Navigate to={APP_PATHS.auth.login} state={{ from: location }} replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
