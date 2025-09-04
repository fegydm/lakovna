// File: common/configs/language.config.ts
// Last change: Consolidated all language settings into a single object and applied snake_case naming

import type { Language } from '../types/geo.types';

export const LANGUAGE_CONFIG = {
  // --- Restrictions (null = no restriction)
  language_restrictions: null as Record<string, string[]> | null,

  // --- Flag settings
  flag_base_url: '/flags/w20/',
  flag_cdn_url: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/png250px/',
  flag_file_extension: '.png',
  fallback_country_code: 'gb',

  // --- Preload priorities (e.g. for UI language switcher)
  preload_priority: ['sk', 'en', 'cz', 'de'] as const,

  // --- Static fallbacks (minimal set for bootstrapping)
  fallback_languages: [
    { lc_iso2: 'sk', cc_iso2: 'sk', name_en: 'Slovak', native_name: 'Slovenský', is_rtl: false },
    { lc_iso2: 'en', cc_iso2: 'gb', name_en: 'English', native_name: 'English', is_rtl: false },
    { lc_iso2: 'de', cc_iso2: 'de', name_en: 'German', native_name: 'Deutsch', is_rtl: false },
    { lc_iso2: 'fr', cc_iso2: 'fr', name_en: 'French', native_name: 'Français', is_rtl: false },
    { lc_iso2: 'es', cc_iso2: 'es', name_en: 'Spanish', native_name: 'Español', is_rtl: false },
  ] satisfies readonly Language[],
};