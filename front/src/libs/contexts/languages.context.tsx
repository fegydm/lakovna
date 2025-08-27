// File: sendeliver/front/src/libs/contexts/languages.context.tsx
// Last change: Updated to provide separate local and CDN flag URL functions.

import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import type { Language, GroupedLanguage } from '../types/domains/geo.types';
import { 
  languageRestrictions, 
  STATIC_LANGUAGE_FALLBACKS, 
  getLocalFlagUrl, 
  getCdnFlagUrl 
} from '../configs/language.config';
import {
  groupLanguagesByPriority as groupFn,
  filterLanguages as filterFn,
} from '../utils/language.utils';
import { useLocation } from "react-router-dom";

type LC = string;
type CC = string;

export interface LanguagesContextValue {
  languages: Language[];
  isLoading: boolean;
  error: Error | null;
  detectedLc: LC | null;
  isDetectedLcFallback: boolean;
  reload: () => Promise<void>;
  groupLanguagesByPriority: (
    primaryLc: LC,
    secondaryLc: LC | null,
    tertiaryLc: LC | null
  ) => {
    priorityLanguages: GroupedLanguage[];
    otherLanguages: GroupedLanguage[];
  };
  filterLanguages: (searchTerm: string) => Language[];
  getLocalFlagUrl: (cc: CC) => string;
  getCdnFlagUrl: (cc: CC) => string;
}

const toLc = (v: string | null | undefined): LC => (v ?? '').trim().toLowerCase();
const toCc = (v: string | null | undefined): CC => (v ?? '').trim().toLowerCase();

const LanguagesContext = createContext<LanguagesContextValue | undefined>(undefined);

interface LanguagesProviderProps {
  children: ReactNode;
  geoApi: {
    getLanguages: () => Promise<Language[]>;
    getCountryCodeByIP: () => Promise<{ code: string; isFallback: boolean }>;
  };
}

export const LanguagesProvider: React.FC<LanguagesProviderProps> = ({ children, geoApi }) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [detectedLc, setDetectedLc] = useState<LC | null>(null);
  const [isDetectedLcFallback, setIsDetectedLcFallback] = useState(false);
  const location = useLocation();

  const availableLangs = useMemo(() => {
    if (!languageRestrictions) {
      return undefined;
    }
    const restrictionKeys = Object.keys(languageRestrictions) as Array<keyof typeof languageRestrictions>;
    const restrictionKey = restrictionKeys.find(key =>
      location.pathname.includes(`/${String(key)}`)
    );
    return restrictionKey ? languageRestrictions[restrictionKey] : undefined;
  }, [location.pathname]);

  const filteredLanguageList = useMemo(() => {
    if (availableLangs && availableLangs.length > 0) {
      const lowercasedAvailableLangs = availableLangs.map(l => l.toLowerCase());
      return languages.filter(lang =>
        lang.lc && lowercasedAvailableLangs.includes(lang.lc.toLowerCase())
      );
    }
    return languages;
  }, [languages, availableLangs]);

  const loadLanguages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await geoApi.getLanguages();
      if (Array.isArray(data) && data.length > 0) {
        setLanguages(data);
      } else {
        setLanguages(STATIC_LANGUAGE_FALLBACKS);
        console.error('❌ [Languages] API returned empty or invalid data. Using fallback.');
      }
    } catch (err) {
      const e = err instanceof Error ? err : new Error('Failed to load languages');
      setError(e);
      console.error('❌ [Languages] Load error:', e);
      setLanguages(STATIC_LANGUAGE_FALLBACKS);
    } finally {
      setIsLoading(false);
    }
  }, [geoApi]);

  const detectLanguageByIp = useCallback(async () => {
    try {
      const result = await geoApi.getCountryCodeByIP();
      const language = languages.find(lang => toCc(lang.cc) === toCc(result.code));
      if (language) {
        setDetectedLc(language.lc);
      } else {
        setDetectedLc(toLc(result.code));
      }
      setIsDetectedLcFallback(result.isFallback);
    } catch (err) {
      console.error('❌ [Languages] IP detection failed:', err);
      setDetectedLc('en');
      setIsDetectedLcFallback(true);
    }
  }, [geoApi, languages]);

  useEffect(() => {
    loadLanguages();
  }, [loadLanguages]);

  useEffect(() => {
    if (languages.length > 0) {
      detectLanguageByIp();
    }
  }, [languages, detectLanguageByIp]);

  const groupLanguagesByPriorityCb = useCallback(
    (p1: LC, p2: LC | null, p3: LC | null) =>
      groupFn(filteredLanguageList, toLc(p1), p2 ? toLc(p2) : null, p3 ? toLc(p3) : null),
    [filteredLanguageList]
  );

  const filterLanguagesCb = useCallback(
    (term: string) => filterFn(filteredLanguageList, (term ?? '').toLowerCase()),
    [filteredLanguageList]
  );

  const value: LanguagesContextValue = useMemo(
    () => ({
      languages: filteredLanguageList,
      isLoading,
      error,
      detectedLc,
      isDetectedLcFallback,
      reload: loadLanguages,
      groupLanguagesByPriority: groupLanguagesByPriorityCb,
      filterLanguages: filterLanguagesCb,
      getLocalFlagUrl: getLocalFlagUrl,
      getCdnFlagUrl: getCdnFlagUrl,
    }),
    [filteredLanguageList, isLoading, error, detectedLc, isDetectedLcFallback, loadLanguages, groupLanguagesByPriorityCb, filterLanguagesCb]
  );

  return <LanguagesContext.Provider value={value}>{children}</LanguagesContext.Provider>;
};

export const useLanguages = (): LanguagesContextValue => {
  const ctx = useContext(LanguagesContext);
  if (!ctx) throw new Error('useLanguages must be used within a LanguagesProvider');
  return ctx;
};
