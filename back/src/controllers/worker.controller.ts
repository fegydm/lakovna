// File: back/src/controllers/worker.controller.ts
// Last change: Fixed imports to use unified prisma client

import { Request, Response } from 'express';
import { prisma } from '../clients/prisma.js';
import jwt from 'jsonwebtoken';
import { hashPassword, signToken } from '../security/auth.utils.js';

export const requestPasswordLink = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required.' });

  try {
    const worker = await prisma.worker.findUnique({ where: { email: email.toLowerCase() } });

    if (!worker || !worker.googleId || worker.password) {
      return res.status(404).json({ message: "This account is not eligible for password linking." });
    }

    const linkToken = jwt.sign(
      { workerId: worker.id, purpose: 'link-password' },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );
    
    const verificationUrl = `${process.env.FRONTEND_URL}/link-password?token=${linkToken}`;
    console.log(`[DEV] Password link URL for ${worker.email}: ${verificationUrl}`);

    res.status(200).json({ message: 'Password link instructions have been sent.' });
  } catch (error) {
    console.error("[WORKER] Error requesting password link:", error);
    res.status(500).json({ message: 'Failed to process request.' });
  }
};

export const completePasswordLink = async (req: Request, res: Response) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ message: 'Token and new password are required.' });
  if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters long.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { workerId: string; purpose: string; };
    
    if (decoded.purpose !== 'link-password') {
      return res.status(400).json({ message: 'Invalid token purpose.' });
    }

    const hashedPassword = await hashPassword(password);
    
    const updatedWorker = await prisma.worker.update({
      where: { id: decoded.workerId },
      data: { password: hashedPassword },
    });
    
    const authToken = signToken(updatedWorker);
    res.status(200).json({ 
      message: 'Password has been successfully linked to your account.',
      token: authToken,
      worker: updatedWorker 
    });
  } catch (error) {
    console.error("[WORKER] Error completing password link:", error);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export const getAllWorkers = async (req: Request, res: Response) => {
  try {
    const workers = await prisma.worker.findMany({
      select: { id: true, name: true, email: true, role: true, isActive: true }
    });
    res.status(200).json(workers);
  } catch (error) {
    console.error('[WORKER] Error fetching workers:', error);
    res.status(500).json({ message: 'Failed to fetch workers.' });
  }
};

export const getWorkerById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const worker = await prisma.worker.findUnique({
            where: { id },
            select: { id: true, name: true, email: true, role: true, isActive: true, rfidTag: true, qrCode: true, usbKeyId: true }
        });
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found.' });
        }
        res.status(200).json(worker);
    } catch (error) {
        console.error(`[WORKER] Error fetching worker ${id}:`, error);
        res.status(500).json({ message: 'Failed to fetch worker.' });
    }
};

export const updateWorker = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, role, isActive, rfidTag } = req.body;
    try {
        const updatedWorker = await prisma.worker.update({
            where: { id },
            data: { name, email, role, isActive, rfidTag },
        });
        res.status(200).json(updatedWorker);
    } catch (error) {
        console.error(`[WORKER] Error updating worker ${id}:`, error);
        res.status(500).json({ message: 'Failed to update worker.' });
    }
};