// File: sendeliver/front/src/libs/configs/language.config.ts
// Last change: Added CDN fallback URL for flag images.

import type { Language } from "../types/domains/geo.types";

export const languageRestrictions: Record<string, string[]> | null = null;

export const LOCAL_FLAG_BASE_URL = '/flags/w20/';
export const CDN_FLAG_BASE_URL = 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/png250px/';
export const FLAG_FILE_EXTENSION = '.png';
export const FALLBACK_COUNTRY_CODE = "gb";
export const PRELOAD_PRIORITY_LANGUAGES = ['sk', 'en', 'cz', 'de'];

export const getLocalFlagUrl = (countryCode: string): string => {
  const code = countryCode?.toLowerCase() || FALLBACK_COUNTRY_CODE;
  return `${LOCAL_FLAG_BASE_URL}${code}${FLAG_FILE_EXTENSION}`;
};

export const getCdnFlagUrl = (countryCode: string): string => {
  const code = countryCode?.toLowerCase() || FALLBACK_COUNTRY_CODE;
  return `${CDN_FLAG_BASE_URL}${code}${FLAG_FILE_EXTENSION}`;
};

export const STATIC_LANGUAGE_FALLBACKS: Language[] = [
  { lc: 'sk', cc: 'sk', name_en: 'Slovak', native_name: 'Slovenský', is_rtl: false },
  { lc: 'en', cc: 'gb', name_en: 'English', native_name: 'English', is_rtl: false },
  { lc: 'de', cc: 'de', name_en: 'German', native_name: 'Deutsch', is_rtl: false },
  { lc: 'fr', cc: 'fr', name_en: 'French', native_name: 'Français', is_rtl: false },
  { lc: 'es', cc: 'es', name_en: 'Spanish', native_name: 'Español', is_rtl: false },
];
