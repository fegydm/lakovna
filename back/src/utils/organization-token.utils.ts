// File back/src/utils/organization-token.utils.ts
// Changes: Aligned function name with camelCase convention.

import crypto from 'crypto';

export const generateInviteToken = (): string => {
  return crypto.randomUUID();
};
