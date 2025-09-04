// File: back/src/controllers/user.controller.ts
// Last change: Refactored from worker.controller.ts to align with terminology and architecture.

import { Request, Response } from 'express';
import * as user_service from '../services/user.service';

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

export const request_password_link = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    await user_service.request_password_link_service(email);
    // Always return a generic success message to prevent user enumeration.
    res.status(200).json({ message: 'If your account is eligible, password link instructions have been sent.' });
  } catch (error) {
    console.error("[USER_CONTROLLER] Error requesting password link:", error);
    res.status(500).json({ message: 'Failed to process request.' });
  }
};

export const complete_password_link = async (req: Request, res: Response) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ message: 'Token and new password are required.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
  }

  try {
    const result = await user_service.complete_password_link_service(token, password);
    res.status(200).json({
      message: 'Password has been successfully linked to your account.',
      data: to_camel_case(result),
    });
  } catch (error: any) {
    console.error("[USER_CONTROLLER] Error completing password link:", error);
    const status_code = error.message === 'Invalid token purpose.' ? 400 : 401;
    return res.status(status_code).json({ message: error.message || 'Invalid or expired token.' });
  }
};

export const get_all_users = async (req: Request, res: Response) => {
  try {
    const users = await user_service.get_all_users_service();
    res.status(200).json(to_camel_case(users));
  } catch (error) {
    console.error('[USER_CONTROLLER] Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
};

export const get_user_by_id = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await user_service.get_user_by_id_service(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(to_camel_case(user));
  } catch (error) {
    console.error(`[USER_CONTROLLER] Error fetching user ${id}:`, error);
    res.status(500).json({ message: 'Failed to fetch user.' });
  }
};

export const update_user = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // req.body from the frontend should be in camelCase.
    // The service layer will handle it.
    const updated_user = await user_service.update_user_service(id, req.body);
    res.status(200).json(to_camel_case(updated_user));
  } catch (error) {
    console.error(`[USER_CONTROLLER] Error updating user ${id}:`, error);
    res.status(500).json({ message: 'Failed to update user.' });
  }
};
