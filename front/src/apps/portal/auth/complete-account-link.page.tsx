// File: front/src/apps/portal/auth/complete-account-link.page.tsx
// Last change: Replaced hardcoded text with translation keys and fixed import paths.

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '../../../contexts/translation.context';
import { Input } from '../../../shared/base/input.base';
import { Button } from '../../../shared/base/button.base';
import { usePasswordValidation } from '../../../hooks/use-password-validation.hook';
import './complete-account-link.page.css';

const CompleteAccountLinkPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { passwordError, confirmPasswordError, isValid } = usePasswordValidation(
    password, confirmPassword, { minLength: 8 }
  );

  useEffect(() => {
    if (!token) {
      setError(t("common", "error.invalidOrMissingToken"));
    }
  }, [token, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !isValid) {
      setError(passwordError || confirmPasswordError || t("common", "error.checkPassword"));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/complete-account-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || t("common", "error.completeAccountFailed"));
      }
      
      setSuccessMessage(t("common", "info.passwordSetSuccessRedirect"));

      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);

    } catch (err: any) {
      setError(err.message || t("common", "error.setPasswordFailedExpired"));
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="account-link-state">
          <h2 className="account-link-state__title error">{t("common", "completeAccount.errorTitle")}</h2>
          <p className="account-link-state__message">{error}</p>
          <Button as={Link} to="/" variant="primary">{t("common", "actions.goToHome")}</Button>
        </div>
      );
    }

    if (successMessage) {
        return (
            <div className="account-link-state">
                <h2 className="account-link-state__title success">{t("common", "completeAccount.successTitle")}</h2>
                <p className="account-link-state__message">{successMessage}</p>
            </div>
        )
    }

    if (!token) {
        return <div className="account-link-state">{t("common", "states.loading")}</div>
    }

    return (
      <form onSubmit={handleSubmit} className="account-link-form">
        <p className="account-link-form__description">{t("common", "completeAccount.description")}</p>
        
        <div className="account-link-form__field">
          <label htmlFor="password">{t("common", "completeAccount.newPasswordLabel")}</label>
          <Input 
            id="password"
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            state={passwordError ? 'error' : 'normal'}
            error={passwordError ?? undefined}
          />
        </div>

        <div className="account-link-form__field">
          <label htmlFor="confirmPassword">{t("common", "completeAccount.confirmPasswordLabel")}</label>
          <Input 
            id="confirmPassword"
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required 
            state={confirmPasswordError ? 'error' : 'normal'}
            error={confirmPasswordError ?? undefined}
          />
        </div>

        <Button type="submit" disabled={isLoading || !isValid}>
          {isLoading ? t("common", "actions.saving") : t("common", "completeAccount.submitButton")}
        </Button>
      </form>
    );
  }

  return (
    <div className="account-link-page">
      <h1 className="account-link-page__title">{t("common", "completeAccount.pageTitle")}</h1>
      {renderContent()}
    </div>
  );
};

export default CompleteAccountLinkPage;
