// File: front/src/apps/portal/auth/verify-email.page.tsx
// Last change: Replaced hardcoded text with translation keys and fixed import paths.

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/auth.context';
import { useTranslation } from '../../../contexts/translation.context';
import { Button } from '../../../shared/base/button.base';
import './verify-email.page.css';

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://localhost:10001';

interface VerificationResponse {
  success: boolean;
  message: string;
  user?: any;
  alreadyVerified?: boolean;
}

type VerificationStatus = 'processing' | 'success' | 'error' | 'already-verified';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, setPendingEmailVerification } = useAuth();
  const { t } = useTranslation();
  
  const [status, setStatus] = useState<VerificationStatus>('processing');
  const [message, setMessage] = useState(t("common", "verifyEmail.status.processing"));
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage(t("common", "error.verifyEmail.noToken"));
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-email-by-link?token=${token}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        const data: VerificationResponse = await response.json().catch(() => ({ success: false, message: t("common", "error.invalidServerResponse") }));

        if (response.ok && data.success) {
          if (data.alreadyVerified) {
            setStatus('already-verified');
            setMessage(t("common", "verifyEmail.status.alreadyVerified"));
          } else {
            setStatus('success');
            setMessage(t("common", "verifyEmail.status.success"));
            if (data.user) setUser(data.user);
            setPendingEmailVerification(null);
            localStorage.removeItem('pendingEmailVerification');

            const bc = new BroadcastChannel('email_verification_channel');
            bc.postMessage({ type: 'EMAIL_VERIFIED_SUCCESS', user: data.user });
            bc.close();
          }
        } else {
          setStatus('error');
          setMessage(data.message || t("common", "error.verifyEmail.failed"));
        }
      } catch (error) {
        console.error('[VERIFY_EMAIL_PAGE] Network or unexpected error:', error);
        setMessage(t("common", "error.unexpected"));
        setStatus('error');
      }
    };

    verifyEmail();
  }, [searchParams, setUser, setPendingEmailVerification, t]);

  useEffect(() => {
    if (status === 'success' || status === 'already-verified') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
    return undefined;
  }, [status, navigate]);

  const getStatusInfo = () => {
    switch (status) {
      case 'processing': return { icon: '⏳', title: t("common", "verifyEmail.title.processing") };
      case 'success': return { icon: '✅', title: t("common", "verifyEmail.title.success") };
      case 'already-verified': return { icon: 'ℹ️', title: t("common", "verifyEmail.title.alreadyVerified") };
      case 'error': return { icon: '❌', title: t("common", "verifyEmail.title.error") };
      default: return { icon: '❓', title: t("common", "verifyEmail.title.unknown") };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="verify-email-page">
      <div className={`verify-email-card verify-email-card--${status}`}>
        <div className="verify-email-card__icon">
          {statusInfo.icon}
        </div>

        <h1 className="verify-email-card__title">
          {statusInfo.title}
        </h1>

        <p className="verify-email-card__message">
          {message}
        </p>

        {status === 'processing' && (
          <div className="verify-email-card__spinner-container">
            <div className="verify-email-card__spinner" />
            <span>{t("common", "verifyEmail.pleaseWait")}</span>
          </div>
        )}

        {(status === 'success' || status === 'already-verified') && (
          <div className="verify-email-card__redirect-info">
            <p>{t("common", "verifyEmail.redirectMessage").replace("{{countdown}}", String(countdown))}</p>
          </div>
        )}

        {status === 'error' && (
          <Button as={Link} to="/" variant="primary">
            {t("common", "actions.goToHome")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
