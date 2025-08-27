// File: front/src/libs/contexts/translation.context.tsx
// Last change: Adapted to work with the new caching I18nApi service.

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { I18nManifest, I18nBundle } from "../../services/i18n.api";

type LC = string;
type Namespace = string;
type Key = string;
type Entries = Record<Key, string>;
type Bundles = Record<LC, Record<Namespace, Entries>>;
type ManifestStatus = {
  status: 'idle' | 'loading' | 'loaded' | 'failed';
  namespaces: Set<Namespace>;
};

interface I18nContextValue {
  lc: LC;
  setLc: (next: LC) => void;
  t: (ns: Namespace, key: Key) => string;
  hasNamespace: (ns: Namespace, lcOverride?: LC) => boolean;
  ensureNamespace: (ns: Namespace, lcOverride?: LC) => Promise<void>;
}

const DEV = import.meta.env.DEV ?? false;
const LOG_SOURCES = DEV;

const toLc = (value: string | null | undefined): LC => {
  const v = (value ?? "").trim().toLowerCase().replace("_", "-");
  if (!v) return "en";
  const [base] = v.split("-");
  return base || "en";
};

const humanizeKey = (key: string): string => {
  const s = key.replace(/[._-]+/g, " ").trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : key;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
  staticFallbacks: Bundles;
  i18nApi: {
    getManifest: (lc: LC) => Promise<I18nManifest | null>;
    getBundle: (lc: LC, ns: Namespace) => Promise<I18nBundle | null>;
  };
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  children,
  staticFallbacks,
  i18nApi,
}) => {
  const initialLc = (() => {
    try {
      const stored = localStorage.getItem("i18n.lc");
      if (stored) return toLc(stored);
    } catch {}
    const nav =
      (navigator.languages && navigator.languages[0]) || navigator.language || "en";
    return toLc(nav);
  })();

  const [lc, setLcState] = useState<LC>(initialLc);
  const setLc = useCallback((next: LC) => {
    const normalized = toLc(next);
    setLcState(normalized);
    try {
      localStorage.setItem("i18n.lc", normalized);
    } catch {}
  }, []);

  const bundlesRef = useRef<Bundles>({});
  const inflightRef = useRef<Map<string, Promise<any>>>(new Map());
  const manifestsRef = useRef<Record<LC, ManifestStatus>>({});
  const [, bump] = useState(0);
  const forceUpdate = useCallback(() => bump((x) => x + 1), []);

  const ensureManifest = useCallback(async (useLc: LC): Promise<Set<Namespace>> => {
    const manifest = manifestsRef.current[useLc];
    if (manifest?.status === 'loaded' || manifest?.status === 'failed') {
      return manifest.namespaces;
    }

    const key = `manifest|${useLc}`;
    if (inflightRef.current.has(key)) {
      await inflightRef.current.get(key);
      return manifestsRef.current[useLc]?.namespaces || new Set();
    }

    const p = (async () => {
      manifestsRef.current[useLc] = { status: 'loading', namespaces: new Set() };
      try {
        const json = await i18nApi.getManifest(useLc);
        const namespaces = new Set<Namespace>(Object.keys(json?.manifest || {}));
        manifestsRef.current[useLc] = { status: 'loaded', namespaces };
        if (LOG_SOURCES) {
          console.info(`[i18n] Manifest for '${useLc}' loaded:`, namespaces);
        }
      } catch (err) {
        manifestsRef.current[useLc] = { status: 'failed', namespaces: new Set() };
        if (DEV) console.warn(`[i18n] Could not load manifest for '${useLc}'.`);
      }
    })().finally(() => {
      inflightRef.current.delete(key);
    });

    inflightRef.current.set(key, p);
    await p;
    return manifestsRef.current[useLc]?.namespaces || new Set();
  }, [i18nApi]);

  const loadStaticFallback = useCallback((targetLc: LC, ns: Namespace) => {
    const fallback = staticFallbacks[targetLc]?.[ns] || staticFallbacks.en?.[ns] || null;
    if (fallback) {
      bundlesRef.current[targetLc] ||= {};
      if (!bundlesRef.current[targetLc][ns]) {
        bundlesRef.current[targetLc][ns] = fallback;
        forceUpdate();
        if (LOG_SOURCES) {
          console.info(`[i18n-fallback] static:en ns="${ns}" injected for ${targetLc}`);
        }
      }
    }
  }, [forceUpdate, staticFallbacks]);

  const fetchBundle = useCallback(
    async (useLc: LC, ns: Namespace): Promise<void> => {
      const key = `bundle|${useLc}|${ns}`;
      if (bundlesRef.current[useLc]?.[ns]) return;

      const existing = inflightRef.current.get(key);
      if (existing) return existing;

      const p = (async () => {
        const json = await i18nApi.getBundle(useLc, ns);
        if (!json) throw new Error(`Bundle for ${useLc}:${ns} not found`);
        
        const entries: Entries = json.entries || {};
        bundlesRef.current[useLc] ||= {};
        bundlesRef.current[useLc][ns] = entries;
        if (LOG_SOURCES) {
          console.info(`[i18n-load] db:${useLc} ns="${ns}" (${Object.keys(entries).length} keys)`);
        }
        forceUpdate();
      })().finally(() => {
        inflightRef.current.delete(key);
      });

      inflightRef.current.set(key, p);
      return p;
    },
    [forceUpdate, i18nApi]
  );

  const ensureNamespace = useCallback(
    async (ns: Namespace, lcOverride?: LC): Promise<void> => {
      const targetLc = toLc(lcOverride ?? lc);
      const availableNamespaces = await ensureManifest(targetLc);
      const shouldFetch = availableNamespaces.has(ns);

      if (shouldFetch) {
        try {
          await fetchBundle(targetLc, ns);
        } catch (err) {
          if (DEV) {
            console.error(`[i18n] CRITICAL: Manifest for '${targetLc}' listed ns '${ns}', but fetch failed.`, err);
          }
          loadStaticFallback(targetLc, ns);
        }
      } else {
        loadStaticFallback(targetLc, ns);
      }

      if (targetLc !== "en") {
        const enManifest = await ensureManifest("en");
        if(enManifest.has(ns)) {
          fetchBundle("en", ns).catch(() => {});
        } else {
          loadStaticFallback("en", ns);
        }
      }
    },
    [lc, ensureManifest, fetchBundle, loadStaticFallback]
  );

  const t = useCallback(
    (ns: Namespace, key: Key): string => {
      const dbLc = bundlesRef.current[lc]?.[ns]?.[key];
      if (dbLc != null) return dbLc;

      const dbEn = bundlesRef.current.en?.[ns]?.[key];
      if (dbEn != null) return dbEn;

      const stLc = staticFallbacks[lc]?.[ns]?.[key];
      if (stLc != null) return stLc;

      const stEn = staticFallbacks.en?.[ns]?.[key];
      if (stEn != null) return stEn;

      const manifest = manifestsRef.current[lc];
      const bundleWasExpected = manifest?.status === 'loaded' && manifest.namespaces.has(ns);
      const bundleIsLoaded = !!bundlesRef.current[lc]?.[ns];

      if (DEV && bundleWasExpected && bundleIsLoaded) {
        console.warn(`[i18n-miss] ${ns}:${key} → key missing in loaded DB bundle.`);
      }
      
      return humanizeKey(key);
    },
    [lc, staticFallbacks]
  );

  useEffect(() => {
    ensureManifest(lc);
  }, [lc, ensureManifest]);

  const hasNamespace = useCallback(
    (ns: Namespace, lcOverride?: LC): boolean => {
      const useLc = toLc(lcOverride ?? lc);
      if (manifestsRef.current[useLc]?.namespaces.has(ns)) return true;
      if (staticFallbacks.en?.[ns]) return true;
      return false;
    },
    [lc, staticFallbacks]
  );

  const value = useMemo<I18nContextValue>(
    () => ({ lc, setLc, t, hasNamespace, ensureNamespace }),
    [lc, setLc, t, hasNamespace, ensureNamespace]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useTranslation = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used within a TranslationProvider");
  return ctx;
};
