// lakovna/common/src/validation-helpers.ts
// Simple validation functions without external dependencies

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidRegistration = (registration: string): boolean => {
  // Slovak format: BA 123 AB
  const regexSK = /^[A-Z]{2}\s?\d{3}\s?[A-Z]{2}$/;
  return regexSK.test(registration);
};

export const isValidVIN = (vin: string): boolean => {
  return vin.length === 17 && /^[A-HJ-NPR-Z0-9]+$/i.test(vin);
};

export const validateRequired = (value: any, fieldName: string): string | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateMinLength = (value: string, min: number, fieldName: string): string | null => {
  if (value.length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  return null;
};

export const validateMaxLength = (value: string, max: number, fieldName: string): string | null => {
  if (value.length > max) {
    return `${fieldName} must be no more than ${max} characters`;
  }
  return null;
};

// Validation utility
export const validateVehicle = (data: any): string[] => {
  const errors: string[] = [];
  
  const brandError = validateRequired(data.brand, 'Brand');
  if (brandError) errors.push(brandError);
  
  const modelError = validateRequired(data.model, 'Model');
  if (modelError) errors.push(modelError);
  
  if (data.registration && !isValidRegistration(data.registration)) {
    errors.push('Invalid registration format (e.g., BA 123 AB)');
  }
  
  if (data.email && !isValidEmail(data.email)) {
    errors.push('Invalid email format');
  }
  
  if (data.vin && !isValidVIN(data.vin)) {
    errors.push('Invalid VIN format');
  }
  
  return errors;
};