// File: common/utils/validation-helpers.ts
// Last change: Refactored to contain only simple, universal validation functions

export const is_valid_email = (email: string): boolean => {
  const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email_regex.test(email);
};

export const is_valid_registration = (registration: string): boolean => {
  const regex_sk = /^[A-Z]{2}\s?\d{3}\s?[A-Z]{2}$/;
  return regex_sk.test(registration);
};

export const is_valid_vin = (vin: string): boolean => {
  return vin.length === 17 && /^[A-HJ-NPR-Z0-9]+$/i.test(vin);
};

export const validate_required = (value: any): boolean => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return false;
  }
  return true;
};

export const validate_min_length = (value: string, min: number): boolean => {
  return value.length >= min;
};

export const validate_max_length = (value: string, max: number): boolean => {
  return value.length <= max;
};