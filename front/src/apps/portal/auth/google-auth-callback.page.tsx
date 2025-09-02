// File: front/src/pages/google-auth-callback.page.tsx
// Last change: Replaced hardcoded text and fixed import paths.

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/auth.context';
import { useTranslation } from '../../../contexts/translation.context';

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://localhost:10001';

const GoogleAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuthStatus } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const error = params.get('error');

    const handleCallback = async () => {
      if (status === 'success') {
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            if (data && data.id) {
              await checkAuthStatus();
              navigate('/dashboard', { replace: true });
            } else {
              navigate('/login?error=invalid_profile_response', { replace: true });
            }
          } else {
            navigate('/login?error=api_verification_failed', { replace: true });
          }
        } catch (apiError) {
          navigate('/login?error=network_error', { replace: true });
        }
      } else if (error) {
        navigate(`/login?error=${error}`, { replace: true });
      } else {
        navigate('/login?error=no_status_param', { replace: true });
      }
    };

    handleCallback();
  }, [location, navigate, checkAuthStatus]);

  return (
    <div className="google-auth-callback-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      color: '#333',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
      }}></div>
      <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{t("common", "googleCallback.title")}</p>
      <p>{t("common", "googleCallback.subtitle")}</p>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default GoogleAuthCallback;
