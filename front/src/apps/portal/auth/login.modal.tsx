// File: front/src/apps/portal/auth/login.modal.tsx
// Last change: Updated fallback API port to 10001.

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuthOptional } from "../../../contexts/auth.optional";
import { useTranslation } from "../../../contexts/translation.context";
import { Modal } from "../../../shared/base/modal.base";
import { Input } from "../../../shared/base/input.base";
import { Button } from "../../../shared/base/button.base";
import "./login.modal.css";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToRegister: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || "http://localhost:10001";

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onNavigateToRegister,
}) => {
  const auth = useAuthOptional();
  const { t } = useTranslation();
  const location = useLocation();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (auth?.isAuthenticated && isOpen) {
      onClose();
    }
  }, [auth?.isAuthenticated, isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({ email: "", password: "" });
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!auth?.login) {
      setError(t("common", "error.authServiceUnavailable"));
      return;
    }

    if (!formData.email.trim() || !formData.password.trim()) {
      setError(t("common", "error.fillAllFields"));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await auth.login(formData.email.trim(), formData.password);
    } catch (err: any) {
      setError(err.message || t("common", "error.loginFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const fromPath = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";
    const googleUrl = `${API_BASE_URL}/api/auth/google?returnTo=${encodeURIComponent(fromPath)}`;
    window.location.href = googleUrl;
  };

  const handleClose = () => {
    setError(null);
    setIsLoading(false);
    setFormData({ email: "", password: "" });
    onClose();
  };

  const isFormValid = formData.email.trim() && formData.password.trim();

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t("common", "loginModal.title")}>
      <form className="login-modal__form" onSubmit={handleSubmit}>
        {error && (
          <div className="login-modal__error" role="alert">
            {error}
          </div>
        )}

        <div className="login-modal__field">
          <label htmlFor="email" className="login-modal__label">
            {t("common", "loginModal.emailLabel")}
          </label>
          <Input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={t("common", "loginModal.emailPlaceholder")}
            disabled={isLoading}
            required
          />
        </div>

        <div className="login-modal__field">
          <label htmlFor="password" className="login-modal__label">
            {t("common", "loginModal.passwordLabel")}
          </label>
          <Input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />
        </div>

        <Button
          variant="primary"
          type="submit"
          disabled={isLoading || !isFormValid}
          fullWidth
        >
          {isLoading ? t("common", "loginModal.loggingInButton") : t("common", "loginModal.logInButton")}
        </Button>
      </form>

      <div className="login-modal__separator">
        <span>{t("common", "loginModal.separator")}</span>
      </div>

      <Button variant="secondary" fullWidth onClick={handleGoogleLogin} disabled={isLoading}>
        <span className="login-modal__google-icon">G</span>
        {t("common", "loginModal.googleButton")}
      </Button>

      <p className="login-modal__signup">
        {t("common", "loginModal.noAccountPrompt")}{" "}
        <button
          type="button"
          className="login-modal__link"
          onClick={onNavigateToRegister}
          disabled={isLoading}
        >
          {t("common", "loginModal.registerLink")}
        </button>
      </p>
    </Modal>
  );
};

export default LoginModal;
