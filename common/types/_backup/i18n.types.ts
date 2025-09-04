// File: common/types/i18n.types.ts
// Last change: Renamed Translations to TranslationMap for better clarity and consistency

// One namespace = keys → translated strings
export type TranslationData = Record<string, string>;

// All translations grouped by language code (e.g., 'en', 'sk')
export type TranslationMap = Record<string, TranslationData>;