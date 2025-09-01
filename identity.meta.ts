// File: identity.meta.ts
// Root project identity – meta information (not runtime config)

export const PROJECT_IDENTITY = {
  name: 'lakovna',
  displayName: 'Lakovňa',
  description: 'Automotive Workshop Management System',
  domain: 'lakovna.com',
  version: 'v5.0.0',
} as const;

export type ProjectIdentity = typeof PROJECT_IDENTITY;
