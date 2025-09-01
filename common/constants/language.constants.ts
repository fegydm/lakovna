// File: common/constants/language.constants.ts
// Last change: Extracted static constants from language.config.ts

export const LOCAL_FLAG_BASE_URL = '/flags/w20/' as const;
export const CDN_FLAG_BASE_URL =
  'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/png250px/' as const;
export const FLAG_FILE_EXTENSION = '.png' as const;
export const FALLBACK_COUNTRY_CODE = 'gb' as const;

export const PRELOAD_PRIORITY_LANGUAGES = ['sk', 'en', 'cz', 'de'] as const;
