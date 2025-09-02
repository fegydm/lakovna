// File: front/src/apps/portal/auth/register.modal.tsx
// Last change: Replaced hardcoded text with translation keys and fixed import paths.

import React, { useState } from "react";
import { useAuthOptional } from "../../../contexts/auth.optional";
import { useTranslation } from "../../../contexts/translation.context";
import { Modal } from "../../../shared/base/modal.base";
import { Input } from '../../../shared/base/input.base';
import { Button } from '../../../shared/base/button.base';
import { usePasswordValidation } from '../../../hooks/use-password-validation.hook';
import "./register.modal.css";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EyeIcon = ({ closed }: { closed: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {closed ? (
      <>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
        <line x1="2" x2="22" y1="2" y2="22"></line>
      </>
    ) : (
      <>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </>
    )}
  </svg>
);

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const auth = useAuthOptional();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', organizationName: '', vatNumber: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRegType, setSelectedRegType] = useState<'individual' | 'organization'>('individual');

  const { passwordError, confirmPasswordError, isValid } = usePasswordValidation(
    formData.password, formData.confirmPassword, { minLength: 8, requireUppercase: true, requireLowercase: true, requireDigit: true }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid) {
      setError(passwordError || confirmPasswordError || t("common", "error.checkPasswordEntries"));
      return;
    }
    setIsLoading(true);
    setError(null);

    if (!auth?.register || !auth?.setPendingEmailVerification) {
        setError(t("common", "error.registrationServiceUnavailable"));
        setIsLoading(false);
        return;
    }

    try {
      if (selectedRegType === 'individual') {
        await auth.register(formData.name, formData.email, formData.password);
        const expiresAt = Date.now() + (15 * 60 * 1000);
        auth.setPendingEmailVerification({ email: formData.email, expiresAt: expiresAt });
        onClose();
      } else if (selectedRegType === 'organization') {
        const response = await fetch('/api/auth/register-organization', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            organizationName: formData.organizationName,
            vatNumber: formData.vatNumber,
            adminEmail: formData.email,
            adminPassword: formData.password,
            adminName: formData.name
          }),
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || t("common", "error.orgRegistrationFailed"));
        }
        setError(t("common", "info.orgRegisteredCheckEmail"));
        onClose();
      }
    } catch (err: any) {
      setError(err.message || t("common", "error.registrationFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("common", "registerModal.title")} description={t("common", "registerModal.description")}>
      <div className="register-modal__type-selection">
        <button type="button" className={`register-modal__type-button ${selectedRegType === 'individual' ? 'active' : ''}`} onClick={() => setSelectedRegType('individual')}>
          <h3 className="register-modal__type-title">{t("common", "registerModal.individualTitle")}</h3>
          <p className="register-modal__type-desc">{t("common", "registerModal.individualDesc")}</p>
        </button>
        <button type="button" className={`register-modal__type-button ${selectedRegType === 'organization' ? 'active' : ''}`} onClick={() => setSelectedRegType('organization')}>
          <h3 className="register-modal__type-title">{t("common", "registerModal.organizationTitle")}</h3>
          <p className="register-modal__type-desc">{t("common", "registerModal.organizationDesc")}</p>
        </button>
      </div>

      <form id="register-form" className="register-modal__form" onSubmit={handleSubmit}>
        {error && <p className="register-modal__error">{error}</p>}
        
        {selectedRegType === 'organization' && (
          <>
            <div className="register-modal__field">
              <label htmlFor="organizationName">{t("common", "registerModal.orgNameLabel")}</label>
              <Input id="organizationName" name="organizationName" type="text" value={formData.organizationName} onChange={handleChange} required />
            </div>
            <div className="register-modal__field">
              <label htmlFor="vatNumber">{t("common", "registerModal.vatLabel")}</label>
              <Input id="vatNumber" name="vatNumber" type="text" value={formData.vatNumber} onChange={handleChange} />
            </div>
          </>
        )}

        <div className="register-modal__field">
          <label htmlFor="name">{selectedRegType === 'individual' ? t("common", "registerModal.yourNameLabel") : t("common", "registerModal.adminNameLabel")}</label>
          <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="register-modal__field">
          <label htmlFor="email">{selectedRegType === 'individual' ? t("common", "registerModal.yourEmailLabel") : t("common", "registerModal.adminEmailLabel")}</label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="register-modal__field register-modal__field--password">
          <label htmlFor="password">{t("common", "registerModal.passwordLabel")}</label>
          <Input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} required />
          <button type="button" className="password-toggle-btn" onClick={() => setShowPassword(!showPassword)} aria-label={t("common", "registerModal.togglePasswordVisibility")}>
            <EyeIcon closed={!showPassword} />
          </button>
          {passwordError && <p className="register-modal__error-inline">{passwordError}</p>}
        </div>
        <div className="register-modal__field register-modal__field--password">
          <label htmlFor="confirmPassword">{t("common", "registerModal.confirmPasswordLabel")}</label>
          <Input id="confirmPassword" name="confirmPassword" type={showPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} required />
          {confirmPasswordError && <p className="register-modal__error-inline">{confirmPasswordError}</p>}
        </div>
        
        <div className="register-modal__actions">
          <Button variant="cancel" type="button" onClick={onClose} disabled={isLoading}>{t("common", "actions.cancel")}</Button>
          <Button variant="primary" type="submit" form="register-form" disabled={isLoading || !isValid || (selectedRegType === 'organization' && !formData.organizationName)}>
            {isLoading ? t("common", "registerModal.creatingAccountButton") : t("common", "registerModal.createAccountButton")}
          </Button>
        </div>
      </form>

      <div className="register-modal__connect-org">
        <p>{t("common", "registerModal.invitationPrompt")}</p>
        <button type="button" className="modal-link" disabled={isLoading}>
          {t("common", "registerModal.connectToOrgLink")}
        </button>
      </div>
    </Modal>
  );
};

export default RegisterModal;
