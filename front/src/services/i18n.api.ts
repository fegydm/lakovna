// File: front/src/services/i18n.api.ts
// Last change: Implemented ETag support and dual-layer caching.

export type I18nManifest = { lc: string; manifest: Record<string, string> };
export type I18nBundle = { lc: string; namespace: string; version: string; entries: Record<string, string> };

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://localhost:10002';

const memManifest = new Map<string, { etag?: string; data: I18nManifest }>();
const memBundle = new Map<string, { etag?: string; data: I18nBundle }>();

function lsGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch { return null; }
}

function lsSet(key: string, val: unknown) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ }
}

async function fetchJson<T>(url: string, etag?: string): Promise<{ status: number; json?: T; etag?: string }>
{
  const res = await fetch(url, {
    method: 'GET',
    headers: etag ? { 'If-None-Match': etag } : undefined,
    credentials: 'include',
  });
  const nextEtag = res.headers.get('ETag') || undefined;
  if (res.status === 304) return { status: 304, etag: nextEtag };
  if (!res.ok) return { status: res.status };
  const json = (await res.json()) as T;
  return { status: res.status, json, etag: nextEtag };
}

export const I18nApi = {
  async getManifest(lc: string): Promise<I18nManifest | null> {
    lc = lc.trim().toLowerCase();
    const mem = memManifest.get(lc);
    const lsKey = `i18n.v1.manifest.${lc}`;
    const cached = mem?.data ?? lsGet<I18nManifest>(lsKey) ?? null;
    const etag = mem?.etag ?? (lsGet<{ etag?: string }>(`${lsKey}.__meta`)?.etag);

    const url = `${API_BASE_URL}/api/i18n/manifest?lc=${encodeURIComponent(lc)}`;
    const { status, json, etag: newEtag } = await fetchJson<I18nManifest>(url, etag);
    
    if (status === 304 && cached) return cached;
    if (json) {
      memManifest.set(lc, { etag: newEtag, data: json });
      lsSet(lsKey, json);
      lsSet(`${lsKey}.__meta`, { etag: newEtag });
      return json;
    }
    return cached;
  },

  async getBundle(lc: string, ns: string): Promise<I18nBundle | null> {
    lc = lc.trim().toLowerCase();
    ns = ns.trim().toLowerCase();
    const key = `${lc}:${ns}`;
    const mem = memBundle.get(key);
    const lsKey = `i18n.v1.bundle.${lc}.${ns}`;
    const cached = mem?.data ?? lsGet<I18nBundle>(lsKey) ?? null;
    const etag = mem?.etag ?? (lsGet<{ etag?: string }>(`${lsKey}.__meta`)?.etag);

    const url = `${API_BASE_URL}/api/i18n/bundle?lc=${encodeURIComponent(lc)}&ns=${encodeURIComponent(ns)}`;
    const { status, json, etag: newEtag } = await fetchJson<I18nBundle>(url, etag);

    if (status === 304 && cached) return cached;
    if (json) {
      memBundle.set(key, { etag: newEtag, data: json });
      lsSet(lsKey, json);
      lsSet(`${lsKey}.__meta`, { etag: newEtag });
      return json;
    }
    return cached;
  }
};
