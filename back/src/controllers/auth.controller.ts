// File: back/src/controllers/auth.controller.ts
// Last change: Aligned with naming conventions (snake_case for functions, camelCase for API responses).

import { Request, Response } from 'express';
import * as auth_service from '../services/auth.service';
import { AuthUser } from 'common/types/auth backup.types';

// ==================================================
// Helper function for API response transformation
// ==================================================

/**
 * Converts object keys from snake_case to camelCase recursively.
 * This ensures the API response follows the camelCase convention.
 * @param obj The object to convert.
 * @returns A new object with camelCase keys.
 */
const to_camel_case = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => to_camel_case(v));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camel_key = key.replace(/([-_][a-z])/gi, ($1) =>
        $1.toUpperCase().replace('-', '').replace('_', '')
      );
      acc[camel_key] = to_camel_case(obj[key]);
      return acc;
    }, {} as { [key: string]: any });
  }
  return obj;
};


// ==================================================
// Controller Functions
// ==================================================

export const register_and_create_org = async (req: Request, res: Response) => {
  // Frontend sends camelCase, which we destructure here.
  const { organizationName, userName, email, password } = req.body;

  if (!organizationName || !userName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (typeof password !== 'string' || password.length < 8) {
    return res
      .status(400)
      .json({ message: 'Password must be at least 8 characters long.' });
  }

  try {
    // Service functions use snake_case for parameters and function names.
    const result =
      await auth_service.register_and_create_org_service(
        organizationName.trim(),
        userName.trim(),
        email.toLowerCase(),
        password
      );

    return res.status(201).json({
      message: 'Organization and owner account created successfully!',
      // Transform the snake_case result from the service to camelCase for the API response.
      data: to_camel_case(result),
    });
  } catch (error: any) {
    console.error('[AUTH] Registration Error:', error);
    // Custom errors from service layer can be used here.
    const status_code = error.name === 'AuthenticationError' ? 409 : 500;
    return res.status(status_code).json({
      message: error.message ?? 'Unexpected error during registration.',
    });
  }
};

export const login_worker = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Email and password are required.' });
  }

  try {
    const result = await auth_service.login_worker_service(
      email.toLowerCase(),
      password
    );

    return res.status(200).json({
      message: 'Login successful',
      data: to_camel_case(result),
    });
  } catch (error: any) {
    console.error('[AUTH] Login Error:', error);
    const status_code = error.name === 'UserNotFoundError' ? 401 : 500;
    return res.status(status_code).json({
      message: error.message ?? 'Invalid credentials.',
    });
  }
};

export const login_terminal = async (req: Request, res: Response) => {
  const { authMethod, authValue } = req.body;

  if (!authMethod || !authValue) {
    return res
      .status(400)
      .json({ message: 'Auth method and value are required.' });
  }

  if (!['rfid', 'qr', 'usb'].includes(authMethod)) {
    return res.status(400).json({ message: 'Invalid auth method.' });
  }

  try {
    const result = await auth_service.login_terminal_service(
      authMethod,
      authValue
    );

    return res.status(200).json({
      message: 'Terminal login successful',
      data: to_camel_case(result),
    });
  } catch (error: any) {
    console.error('[AUTH] Terminal Login Error:', error);
    const status_code = error.name === 'UserNotFoundError' ? 401 : 500;
    return res.status(status_code).json({
      message: error.message ?? 'Invalid terminal login.',
    });
  }
};

export const get_profile = (req: Request, res: Response) => {
  // req.user is populated by a middleware, which should provide it in a ready-to-use format.
  // We'll transform it to camelCase just in case to ensure consistency.
  const user_profile = req.user as AuthUser;
  return res.json(to_camel_case(user_profile));
};
