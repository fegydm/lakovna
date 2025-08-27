// File: front/src/services/geo.api.ts
// Last change: Removed redundant getTranslations function, which is now in i18n.api.ts.

import type { Country, Language } from '../libs/types/domains/geo.types';

const DEV_MODE = false;

// --- Caching Constants ---
const COUNTRY_CACHE_KEY = 'countries-cache';
const COUNTRY_EXPECTED_COUNT = 110;
const COUNTRY_CACHE_VERSION = 1;
const COUNTRY_CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

const LANG_CACHE_KEY = 'languages-cache';
const LANG_EXPECTED_COUNT = 100;
const LANG_CACHE_VERSION = 1;
const LANG_CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

const IP_CACHE_KEY = "ip-country-cache";
const IP_CACHE_TTL = 30 * 24 * 60 * 60 * 1000;

interface CountryCacheData {
  countries: Country[];
  timestamp: number;
  version: number;
}

interface LanguageCacheData {
  languages: Language[];
  timestamp: number;
  version: number;
}

interface IpCacheData {
  code: string;
  isFallback: boolean;
  timestamp: number;
}

async function fetchJSONWithTimeout(resource: string, options: RequestInit = {}, timeout = 1000): Promise<{ data: any; elapsed: number }> {
  const controller = new AbortController();
  const startTime = performance.now();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, { ...options, signal: controller.signal });
    const elapsed = Math.round(performance.now() - startTime);
    clearTimeout(timer);
    if (!response.ok) {
      throw new Error(`Non-200 response from ${resource}: ${response.status}`);
    }
    const data = await response.json();
    return { data, elapsed };
  } catch (error) {
    clearTimeout(timer);
    throw error;
  }
}

async function getFromIpapi(): Promise<{ code: string; source: "ipapi"; elapsed: number }> {
  const { data, elapsed } = await fetchJSONWithTimeout("https://ipapi.co/json/");
  const code = data.country_code?.toLowerCase();
  if (!code) throw new Error("Invalid country code from ipapi.co");
  return { code, source: "ipapi", elapsed };
}

async function getFromIpinfo(): Promise<{ code: string; source: "ipinfo"; elapsed: number }> {
  const { data, elapsed } = await fetchJSONWithTimeout("https://ipinfo.io/json");
  const code = data.country?.toLowerCase();
  if (!code) throw new Error("Invalid country code from ipinfo.io");
  return { code, source: "ipinfo", elapsed };
}

export const GeoApi = {
  async getCountries(): Promise<Country[]> {
    const cacheRaw = localStorage.getItem(COUNTRY_CACHE_KEY);
    const cache: CountryCacheData | null = cacheRaw ? JSON.parse(cacheRaw) : null;

    if (cache && cache.version === COUNTRY_CACHE_VERSION && cache.countries.length >= COUNTRY_EXPECTED_COUNT && Date.now() - cache.timestamp < COUNTRY_CACHE_TTL) {
      return cache.countries;
    }
    try {
      const res = await fetch('/api/geo/countries');
      if (!res.ok) throw new Error(`API call failed with status: ${res.status}`);
      const data: Country[] = await res.json();
      if (!Array.isArray(data) || data.length < COUNTRY_EXPECTED_COUNT) {
        throw new Error("Unexpected country data from API");
      }
      localStorage.setItem(COUNTRY_CACHE_KEY, JSON.stringify({ countries: data, timestamp: Date.now(), version: COUNTRY_CACHE_VERSION }));
      return data;
    } catch (error) {
      console.error('[GeoApi] Error fetching countries:', error);
      if (cache?.countries.length) return cache.countries;
      throw error;
    }
  },

  async getLanguages(): Promise<Language[]> {
    const cacheRaw = localStorage.getItem(LANG_CACHE_KEY);
    const cache: LanguageCacheData | null = cacheRaw ? JSON.parse(cacheRaw) : null;

    if (cache && cache.version === LANG_CACHE_VERSION && cache.languages.length >= LANG_EXPECTED_COUNT && Date.now() - cache.timestamp < LANG_CACHE_TTL) {
      return cache.languages;
    }
    try {
      const res = await fetch('/api/geo/languages');
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      const data: Language[] = await res.json();
      if (!Array.isArray(data) || data.length < LANG_EXPECTED_COUNT) {
        throw new Error('Invalid language data format');
      }
      localStorage.setItem(LANG_CACHE_KEY, JSON.stringify({ languages: data, timestamp: Date.now(), version: LANG_CACHE_VERSION }));
      return data;
    } catch (error) {
      console.error('[GeoApi] Error fetching languages:', error);
      if (cache?.languages.length) return cache.languages;
      throw error;
    }
  },

  async getCountryCodeByIP(): Promise<IpCacheData> {
    if (DEV_MODE) return { code: "sk", isFallback: false, timestamp: Date.now() };

    try {
      const cachedRaw = localStorage.getItem(IP_CACHE_KEY);
      if (cachedRaw) {
        const cacheData: IpCacheData = JSON.parse(cachedRaw);
        if (Date.now() - cacheData.timestamp < IP_CACHE_TTL && cacheData.code && !cacheData.isFallback) {
          return cacheData;
        }
      }
    } catch (e) { console.error("[GeoApi] Error reading IP cache:", e); }

    const results = await Promise.allSettled([getFromIpapi(), getFromIpinfo()]);
    const successes = results.reduce<Array<{ code: string; source: 'ipapi' | 'ipinfo'; elapsed: number }>>((acc, result) => {
      if (result.status === 'fulfilled') acc.push(result.value);
      return acc;
    }, []);

    let chosenCode = "de";
    let isFallback = false;
    if (successes.length > 0) {
      chosenCode = successes[0].code;
    } else {
      isFallback = true;
    }

    const dataToCache: IpCacheData = { code: chosenCode, isFallback, timestamp: Date.now() };

    try {
      localStorage.setItem(IP_CACHE_KEY, JSON.stringify(dataToCache));
    } catch (e) { console.error("[GeoApi] Failed to update IP cache:", e); }

    return dataToCache;
  },
};
