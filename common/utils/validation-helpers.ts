// File: common/utils/validation-helpers.ts
// Last change: Refactored to contain only simple, universal validation functions.

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidRegistration = (registration: string): boolean => {
  const regexSk = /^[A-Z]{2}\s?\d{3}\s?[A-Z]{2}$/;
  return regexSk.test(registration);
};

export const isValidVin = (vin: string): boolean => {
  return vin.length === 17 && /^[A-HJ-NPR-Z0-9]+$/i.test(vin);
};

export const validateRequired = (value: any): boolean => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return false;
  }
  return true;
};

export const validateMinLength = (value: string, min: number): boolean => {
  return value.length >= min;
};

export const validateMaxLength = (value: string, max: number): boolean => {
  return value.length <= max;
};