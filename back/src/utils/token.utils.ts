import crypto from 'crypto';

export const generate_invite_token = (): string => {
  return crypto.randomUUID();
};
