// File: common/configs/language.config.ts
// Runtime config for supported languages and flag sources

import type { Language } from '../types/geo.types';

// --- Restrictions (null = no restriction)
export const LANGUAGE_RESTRICTIONS: Record<string, string[]> | null = null;

// --- Flag settings
export const LOCAL_FLAG_BASE_URL = '/flags/w20/';
export const CDN_FLAG_BASE_URL =
  'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/png250px/';
export const FLAG_FILE_EXTENSION = '.png';
export const FALLBACK_COUNTRY_CODE = 'gb';

// --- Preload priorities (e.g. for UI language switcher)
export const PRELOAD_PRIORITY_LANGUAGES = ['sk', 'en', 'cz', 'de'];

// --- Static fallbacks (minimal set for bootstrapping)
export const STATIC_LANGUAGE_FALLBACKS: readonly Language[] = [
  { lc: 'sk', cc: 'sk', name_en: 'Slovak', native_name: 'Slovenský', is_rtl: false },
  { lc: 'en', cc: 'gb', name_en: 'English', native_name: 'English', is_rtl: false },
  { lc: 'de', cc: 'de', name_en: 'German', native_name: 'Deutsch', is_rtl: false },
  { lc: 'fr', cc: 'fr', name_en: 'French', native_name: 'Français', is_rtl: false },
  { lc: 'es', cc: 'es', name_en: 'Spanish', native_name: 'Español', is_rtl: false },
];
