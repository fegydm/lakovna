// File: back/src/auth/auth.utils.ts
// Last change: Updated signToken to use JWTPayload instead of AuthUser

import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { JWTPayload } from 'common/types/auth.types';

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, key] = hash.split(':');
  if (!salt || !key) return false;
  
  const keyBuffer = Buffer.from(key, 'hex');
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;

  if (keyBuffer.length !== derivedKey.length) return false;
  
  return timingSafeEqual(keyBuffer, derivedKey);
}

export const signToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '24h' });
};
