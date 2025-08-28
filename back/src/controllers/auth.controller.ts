// File: back/src/controllers/auth.controller.ts
// Last change: Finalized separation of concerns, controller delegates all logic to service layer

import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const registerAndCreateOrg = async (req: Request, res: Response) => {
  const { organizationName, workerName, email, password } = req.body;

  if (!organizationName || !workerName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
  }

  try {
    const { token, worker, organization } =
      await authService.registerAndCreateOrgService(
        organizationName.trim(),
        workerName.trim(),
        email.toLowerCase(),
        password
      );

    return res.status(201).json({
      message: 'Organization and owner account created successfully!',
      token,
      worker,
      organization,
    });
  } catch (error: any) {
    console.error('[AUTH] Registration Error:', error);
    return res.status(error.statusCode ?? 500).json({
      message: error.message ?? 'Unexpected error during registration.',
    });
  }
};

export const loginWorker = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const { token, worker } = await authService.loginWorkerService(
      email.toLowerCase(),
      password
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      worker,
    });
  } catch (error: any) {
    console.error('[AUTH] Login Error:', error);
    return res.status(error.statusCode ?? 401).json({
      message: error.message ?? 'Invalid credentials.',
    });
  }
};

export const loginTerminal = async (req: Request, res: Response) => {
  const { authMethod, authValue } = req.body;

  if (!authMethod || !authValue) {
    return res.status(400).json({ message: 'Auth method and value are required.' });
  }

  try {
    const { token, worker } = await authService.loginTerminalService(authMethod, authValue);

    return res.status(200).json({
      message: 'Terminal login successful',
      token,
      worker,
    });
  } catch (error: any) {
    console.error('[AUTH] Terminal Login Error:', error);
    return res.status(error.statusCode ?? 401).json({
      message: error.message ?? 'Invalid terminal login.',
    });
  }
};

export const getProfile = (req: Request, res: Response) => {
  return res.json(req.user);
};
