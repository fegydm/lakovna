// File: back/src/controllers/auth.controller.ts
// Last change: Fixed imports after Prisma regeneration

import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { Worker, WorkerRole, Prisma } from '@prisma/client';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, key] = hash.split(':');
  if (!salt || !key) {
    return false;
  }
  const keyBuffer = Buffer.from(key, 'hex');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;

  if (keyBuffer.length !== derivedKey.length) {
    return false;
  }
  return timingSafeEqual(keyBuffer, derivedKey);
}

const signToken = (worker: { id: string; role: WorkerRole }) => {
  const payload = { id: worker.id, role: worker.role };
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '24h' });
};

export const registerAndCreateOrg = async (req: Request, res: Response) => {
  const { organizationName, workerName, email, password } = req.body;

  if (!organizationName || !workerName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
  }

  try {
    const existingWorker = await prisma.worker.findUnique({ where: { email: email.toLowerCase() } });
    if (existingWorker) {
      return res.status(409).json({ message: 'A worker with this email already exists.' });
    }

    const hashedPassword = await hashPassword(password);

    const { newWorker, newOrganization } = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const organization = await tx.organization.create({
        data: { name: organizationName },
      });

      const worker = await tx.worker.create({
        data: {
          name: workerName,
          email: email.toLowerCase(),
          password: hashedPassword,
          role: WorkerRole.ADMIN,
          memberships: {
            create: {
              organizationId: organization.id,
              role: WorkerRole.ADMIN,
              status: 'ACTIVE',
            },
          },
        },
      });
      return { newWorker: worker, newOrganization: organization };
    });

    const token = signToken(newWorker);
    res.status(201).json({
      message: 'Organization and admin account created successfully!',
      token,
      worker: newWorker,
      organization: newOrganization,
    });
  } catch (error) {
    console.error('[AUTH] Registration Error:', error);
    res.status(500).json({ message: 'An unexpected error occurred during registration.' });
  }
};

export const loginWorker = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const worker = await prisma.worker.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        memberships: {
          where: { status: 'ACTIVE' },
          select: { organizationId: true, role: true },
        },
      }
    });

    if (!worker || !worker.password) {
      return res.status(401).json({ message: 'Invalid credentials or login method.' });
    }

    const isPasswordValid = await verifyPassword(password, worker.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = signToken(worker);
    res.status(200).json({ message: 'Login successful', token, worker });
  } catch (error) {
    console.error('[AUTH] Login Error:', error);
    res.status(500).json({ message: 'An unexpected error occurred during login.' });
  }
};

export const loginTerminal = async (req: Request, res: Response) => {
  const { authMethod, authValue } = req.body;
  
  if (!authMethod || !authValue) {
    return res.status(400).json({ message: 'Auth method and value are required.' });
  }

  try {
    let worker;
    
    switch (authMethod) {
      case 'rfid':
        worker = await prisma.worker.findUnique({
          where: { rfidTag: authValue },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            rfidTag: true,
            isActive: true,
            memberships: {
              where: { status: 'ACTIVE' },
              select: { organizationId: true, role: true },
            },
          }
        });
        break;
        
      case 'qr':
        worker = await prisma.worker.findUnique({
          where: { qrCode: authValue },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            qrCode: true,
            isActive: true,
            memberships: {
              where: { status: 'ACTIVE' },
              select: { organizationId: true, role: true },
            },
          }
        });
        break;
        
      case 'usb':
        worker = await prisma.worker.findUnique({
          where: { usbKeyId: authValue },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            usbKeyId: true,
            isActive: true,
            memberships: {
              where: { status: 'ACTIVE' },
              select: { organizationId: true, role: true },
            },
          }
        });
        break;
        
      default:
        return res.status(400).json({ message: 'Invalid auth method. Use: rfid, qr, or usb.' });
    }

    if (!worker) {
      return res.status(401).json({ message: 'Invalid credentials or worker not found.' });
    }

    if (!worker.isActive) {
      return res.status(403).json({ message: 'Worker account is deactivated.' });
    }

    await prisma.workSession.create({
      data: {
        workerId: worker.id,
        authMethod: authMethod,
      }
    });

    const token = signToken(worker);
    res.status(200).json({ 
      message: 'Terminal login successful', 
      token, 
      worker: {
        id: worker.id,
        name: worker.name,
        email: worker.email,
        role: worker.role,
        memberships: worker.memberships,
        authMethod: authMethod
      }
    });
  } catch (error) {
    console.error('[AUTH] Terminal Login Error:', error);
    res.status(500).json({ message: 'An unexpected error occurred during terminal login.' });
  }
};

export const getProfile = (req: Request, res: Response) => {
  res.json(req.user);
};