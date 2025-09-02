// File: common/utils/language-flag.utils.ts
// Last change: Updated to use consolidated LANGUAGE_CONFIG object and snake_case naming

import { LANGUAGE_CONFIG } from '../configs/language.config';

// --- Helpers ---
const normalize_code = (code?: string): string =>
  (code && /^[a-z]{2}$/i.test(code) ? code.toLowerCase() : LANGUAGE_CONFIG.fallback_country_code);

// --- URL builders ---
export const get_local_flag_url = (country_code?: string): string => {
  const code = normalize_code(country_code);
  return `${LANGUAGE_CONFIG.flag_base_url}${code}${LANGUAGE_CONFIG.flag_file_extension}`;
};

export const get_cdn_flag_url = (country_code?: string): string => {
  const code = normalize_code(country_code);
  return `${LANGUAGE_CONFIG.flag_cdn_url}${code}${LANGUAGE_CONFIG.flag_file_extension}`;
};

// --- Unified resolver ---
export const get_flag_url = (
  country_code?: string,
  options: { prefer_local?: boolean } = { prefer_local: true }
): string => {
  const code = normalize_code(country_code);
  return options.prefer_local
    ? get_local_flag_url(code)
    : get_cdn_flag_url(code);
};