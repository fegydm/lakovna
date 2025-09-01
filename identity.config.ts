// File: identity.config.ts
// Root project identity – v5 template

export const PROJECT_IDENTITY = {
  name: 'lakovna',
  displayName: 'Lakovňa',
  description: 'Automotive Workshop Management System',
  domain: 'lakovna.com',
  version: 'v5.0.0',
} as const;

export type ProjectIdentity = typeof PROJECT_IDENTITY;
