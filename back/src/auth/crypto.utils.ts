// File: back/src/auth/crypto.utils.ts
// Last change: Refactored to use snake_case naming conventions

import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scrypt_async = promisify(scrypt);

export async function hash_password(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derived_key = (await scrypt_async(password, salt, 64)) as Buffer;
  return `${salt}:${derived_key.toString('hex')}`;
}

export async function verify_password(password: string, hash: string): Promise<boolean> {
  const [salt, key] = hash.split(':');
  if (!salt || !key) return false;

  const key_buffer = Buffer.from(key, 'hex');
  const derived_key = (await scrypt_async(password, salt, 64)) as Buffer;

  if (key_buffer.length !== derived_key.length) return false;
  return timingSafeEqual(key_buffer, derived_key);
}