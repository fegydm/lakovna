// File: back/src/middlewares/auth.middleware.ts
// Last change: Switched from Prisma Worker to common AuthUser type

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { AccessRole } from 'common/types/access-role.types';
import { AuthUser } from 'common/types/auth-user.types';

export const protect = (allowedRoles?: AccessRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        role: AccessRole;
      };

      const worker = await prisma.worker.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          memberships: {
            where: { status: 'ACTIVE' },
            select: { organizationId: true, role: true },
          },
        },
      });

      if (!worker) {
        return res.status(401).json({ message: 'Unauthorized: Worker not found.' });
      }

      if (!worker.isActive) {
        return res.status(403).json({ message: 'Forbidden: Worker account disabled.' });
      }

      const authUser: AuthUser = {
        id: worker.id,
        email: worker.email,
        name: worker.name,
        role: worker.role as AccessRole,
        isActive: worker.isActive,
        memberships: worker.memberships.map(m => ({
          organizationId: m.organizationId,
          role: m.role as AccessRole,
        })),
      };

      if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(authUser.role)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions.' });
      }

      req.user = authUser;
      next();
    } catch {
      return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
  };
};
