// File: front/src/core/hooks/use-password-validation.hook.ts
// Last change: Added 'requireSpecialChar' rule from the old hook version.

import { useMemo } from 'react';

interface ValidationRules {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireDigit?: boolean;
  requireSpecialChar?: boolean;
}

export const usePasswordValidation = (password: string, confirmPassword?: string, rules: ValidationRules = {}) => {
  const passwordError = useMemo(() => {
    if (rules.minLength && password.length < rules.minLength) {
      return `Password must be at least ${rules.minLength} characters long.`;
    }
    if (rules.requireUppercase && !/[A-Z]/.test(password)) {
      return 'Password must contain an uppercase letter.';
    }
    if (rules.requireLowercase && !/[a-z]/.test(password)) {
      return 'Password must contain a lowercase letter.';
    }
    if (rules.requireDigit && !/\d/.test(password)) {
      return 'Password must contain a digit.';
    }
    if (rules.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must contain a special character.';
    }
    return null;
  }, [password, rules]);

  const confirmPasswordError = useMemo(() => {
    if (confirmPassword !== undefined && password !== confirmPassword) {
      return 'Passwords do not match.';
    }
    return null;
  }, [password, confirmPassword]);

  const isValid = !passwordError && !confirmPasswordError;

  return { passwordError, confirmPasswordError, isValid };
};
