// File: back/src/auth/jwt.utils.ts
// Last change: Refactored to use snake_case naming conventions and ensure type safety

import jwt, { SignOptions } from 'jsonwebtoken';
import { AuthUser, JWTPayload, AccessRole } from 'common/types/universal.types';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export const sign_token = (user: AuthUser): string => {
  const payload: JWTPayload = {
    id: user.id,
    role: user.access_role,
    organization_ids: user.memberships?.map(m => m.organization_id) ?? [],
  };

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '24h') as `${number}${"ms" | "s" | "m" | "h" | "d" | "w" | "y"}`,
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, options);
};

export const verify_token = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
  } catch {
    return null;
  }
};

export const decode_token = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
};