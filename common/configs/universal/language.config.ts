// File: common/configs/universal/language.config.ts
// Last change: Split flag URL functions into language-flag.utils.ts

import type { Language } from '../../types/shared/geo.types';

export const languageRestrictions: Record<string, string[]> | null = null;

export const LOCAL_FLAG_BASE_URL = '/flags/w20/';
export const CDN_FLAG_BASE_URL =
  'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/png250px/';
export const FLAG_FILE_EXTENSION = '.png';
export const FALLBACK_COUNTRY_CODE = 'gb';

export const PRELOAD_PRIORITY_LANGUAGES = ['sk', 'en', 'cz', 'de'];

export const STATIC_LANGUAGE_FALLBACKS: Language[] = [
  { lc: 'sk', cc: 'sk', name_en: 'Slovak', native_name: 'Slovenský', is_rtl: false },
  { lc: 'en', cc: 'gb', name_en: 'English', native_name: 'English', is_rtl: false },
  { lc: 'de', cc: 'de', name_en: 'German', native_name: 'Deutsch', is_rtl: false },
  { lc: 'fr', cc: 'fr', name_en: 'French', native_name: 'Français', is_rtl: false },
  { lc: 'es', cc: 'es', name_en: 'Spanish', native_name: 'Español', is_rtl: false },
];
