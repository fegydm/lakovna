// File: sendeliver/front/src/libs/configs/language.config.ts
// Description: Configuration for language restrictions on specific pages.

/**
 * Defines which languages are available for specific parts of the application.
 * The key represents a URL path segment. If a user is on a page whose URL
 * includes this segment, the language list will be restricted to the languages
 * specified in the corresponding array.
 *
 * @example
 * 'docs': ['en', 'sk']
 * This means any URL containing '/docs' (e.g., /docs/getting-started)
 * will only allow English and Slovak languages.
 */
export const languageRestrictions: Record<string, string[]> = {
  doc: ["sk", "en"],
  // examples:
  // 'blog': ['en', 'de'],
  // 'legal': ['en', 'sk', 'hu'],
};