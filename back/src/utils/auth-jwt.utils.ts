// File: back/src/utils/auth-jwt.utils.ts
// COMPLETE CORRECTED CODE

import jwt, { SignOptions } from 'jsonwebtoken';
import { AuthUser, JWTPayload } from 'common/types/auth.types';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// FIX: Define a specific type for the expiresIn value to satisfy the library's strict types.
type JwtExpiresIn = `${number}${'d' | 'h' | 'm' | 's'}`;

export const signToken = (user: AuthUser): string => {
  const payload: JWTPayload = {
    id: user.id,
    role: user.accessRole,
    organizationIds: user.memberships?.map(m => m.organizationId) ?? [],
  };

  // Assert that the environment variable matches the expected format.
  const expiresIn: JwtExpiresIn = (process.env.JWT_EXPIRES_IN as JwtExpiresIn) || '24h';

  const options: SignOptions = {
    expiresIn,
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, options);
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
  } catch {
    return null;
  }
};

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
};