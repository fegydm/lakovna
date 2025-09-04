// File: common/configs/05-i18n.config.ts
// Last change: Created consolidated i18n config file.

import type { Language } from '../types/project.types';

export const I18N_CONFIG = {
  languageRestrictions: null as Record<string, string[]> | null,
  flagBaseUrl: '/flags/w20/',
  flagCdnUrl: 'https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/png250px/',
  flagFileExtension: '.png',
  fallbackCountryCode: 'gb',
  preloadPriority: ['sk', 'en', 'cz', 'de'] as const,
  fallbackLanguages: [
    { lcIso2: 'sk', ccIso2: 'sk', nameEn: 'Slovak', nativeName: 'Slovenský', isRtl: false },
    { lcIso2: 'en', ccIso2: 'gb', nameEn: 'English', nativeName: 'English', isRtl: false },
    { lcIso2: 'de', ccIso2: 'de', nameEn: 'German', nativeName: 'Deutsch', isRtl: false },
    { lcIso2: 'fr', ccIso2: 'fr', nameEn: 'French', nativeName: 'Français', isRtl: false },
    { lcIso2: 'es', ccIso2: 'es', nameEn: 'Spanish', nativeName: 'Español', isRtl: false },
  ] satisfies readonly Language[],
};