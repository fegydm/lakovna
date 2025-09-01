// File: back/src/utils/jwt.utils.ts
// Last change: Fixed expiresIn typing by casting to StringValue

import jwt, { SignOptions } from 'jsonwebtoken';
import { AuthUser } from 'common/types/auth.types';
import { AccessRole } from 'common/types/access-role.types';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export interface JwtPayload {
  id: string;
  role: AccessRole;
  organizationIds: string[];
  iat?: number;
  exp?: number;
}

export const signToken = (user: AuthUser): string => {
  const payload: JwtPayload = {
    id: user.id,
    role: user.role,
    organizationIds: user.memberships?.map(m => m.organizationId) ?? [],
  };

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '24h') as `${number}${"ms" | "s" | "m" | "h" | "d" | "w" | "y"}`,
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, options);
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch {
    return null;
  }
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
};
