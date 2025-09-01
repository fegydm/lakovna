// File: common/utils/language.utils.ts
// Last change: Extracted flag URL utilities from language.config.ts

import {
  LOCAL_FLAG_BASE_URL,
  CDN_FLAG_BASE_URL,
  FLAG_FILE_EXTENSION,
  FALLBACK_COUNTRY_CODE,
} from '../constants/language.constants';

export const getLocalFlagUrl = (countryCode: string): string => {
  const code = countryCode?.toLowerCase() || FALLBACK_COUNTRY_CODE;
  return `${LOCAL_FLAG_BASE_URL}${code}${FLAG_FILE_EXTENSION}`;
};

export const getCdnFlagUrl = (countryCode: string): string => {
  const code = countryCode?.toLowerCase() || FALLBACK_COUNTRY_CODE;
  return `${CDN_FLAG_BASE_URL}${code}${FLAG_FILE_EXTENSION}`;
};
