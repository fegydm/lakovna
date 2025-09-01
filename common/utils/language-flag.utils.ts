// File: common/utils/language-flag.utils.ts
// Provides functions to resolve local/CDN flag URLs with fallback

import {
  LOCAL_FLAG_BASE_URL,
  CDN_FLAG_BASE_URL,
  FLAG_FILE_EXTENSION,
  FALLBACK_COUNTRY_CODE,
} from '../configs/language.config';

// --- Helpers ---
const normalizeCode = (code?: string): string =>
  (code && /^[a-z]{2}$/i.test(code) ? code.toLowerCase() : FALLBACK_COUNTRY_CODE);

// --- URL builders ---
export const getLocalFlagUrl = (countryCode?: string): string => {
  const code = normalizeCode(countryCode);
  return `${LOCAL_FLAG_BASE_URL}${code}${FLAG_FILE_EXTENSION}`;
};

export const getCdnFlagUrl = (countryCode?: string): string => {
  const code = normalizeCode(countryCode);
  return `${CDN_FLAG_BASE_URL}${code}${FLAG_FILE_EXTENSION}`;
};

// --- Unified resolver ---
export const getFlagUrl = (
  countryCode?: string,
  options: { preferLocal?: boolean } = { preferLocal: true }
): string => {
  const code = normalizeCode(countryCode);
  return options.preferLocal
    ? getLocalFlagUrl(code)
    : getCdnFlagUrl(code);
};
