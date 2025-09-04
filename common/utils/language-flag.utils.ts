// File: common/utils/language-flag.utils.ts
// Last change: Updated to use correct I18N_CONFIG export and removed internal comments.

import { I18N_CONFIG } from '../configs/05-i18n.config';

const normalizeCode = (code?: string): string =>
  (code && /^[a-z]{2}$/i.test(code) ? code.toLowerCase() : I18N_CONFIG.fallbackCountryCode);

export const getLocalFlagUrl = (countryCode?: string): string => {
  const code = normalizeCode(countryCode);
  return `${I18N_CONFIG.flagBaseUrl}${code}${I18N_CONFIG.flagFileExtension}`;
};

export const getCdnFlagUrl = (countryCode?: string): string => {
  const code = normalizeCode(countryCode);
  return `${I18N_CONFIG.flagCdnUrl}${code}${I18N_CONFIG.flagFileExtension}`;
};

export const getFlagUrl = (
  countryCode?: string,
  options: { preferLocal?: boolean } = { preferLocal: true }
): string => {
  const code = normalizeCode(countryCode);
  return options.preferLocal
    ? getLocalFlagUrl(code)
    : getCdnFlagUrl(code);
};