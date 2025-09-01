// File: common/utils/language-flag.utils.ts
// Provides functions to resolve local/CDN flag URLs

import { LOCAL_FLAG_BASE_URL, CDN_FLAG_BASE_URL, FLAG_FILE_EXTENSION, FALLBACK_COUNTRY_CODE } 
  from '../configs/universal/language.config';

export const getLocalFlagUrl = (countryCode: string): string => {
  const code = countryCode?.toLowerCase() || FALLBACK_COUNTRY_CODE;
  return `${LOCAL_FLAG_BASE_URL}${code}${FLAG_FILE_EXTENSION}`;
};

export const getCdnFlagUrl = (countryCode: string): string => {
  const code = countryCode?.toLowerCase() || FALLBACK_COUNTRY_CODE;
  return `${CDN_FLAG_BASE_URL}${code}${FLAG_FILE_EXTENSION}`;
};
