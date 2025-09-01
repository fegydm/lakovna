// File: common/types/i18n.types.ts
// Universal translation and i18n types

// One namespace = keys → translated strings
export type TranslationData = Record<string, string>;

// All translations grouped by language code (e.g., 'en', 'sk')
export type Translations = Record<string, TranslationData>;

// Example runtime usage:
// const translations: Translations = {
//   en: { greeting: "Hello", farewell: "Bye" },
//   sk: { greeting: "Ahoj", farewell: "Čau" }
// };
