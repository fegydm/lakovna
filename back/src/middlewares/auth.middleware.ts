// File: back/src/middlewares/auth.middleware.ts
// Last change: Fixed mixed alias imports to use unified prisma client

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { WorkerRole } from '@prisma/client';

export const protect = (allowedRoles?: WorkerRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: WorkerRole };
      const worker = await prisma.worker.findUnique({ where: { id: decoded.id } });
      if (!worker) {
        return res.status(401).json({ message: 'Unauthorized: Worker not found.' });
      }
      if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(worker.role)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions.' });
      }
      req.user = worker;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
  };
};