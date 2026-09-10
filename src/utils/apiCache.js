/**
 * Persistent Client-side API Cache with TTL (Time To Live)
 * Uses in-memory Map + localStorage for instant 0ms offline & cross-session performance.
 */

const memoryCache = new Map();
const DEFAULT_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL

export const apiCache = {
  get(key) {
    // 1. Check memory cache first
    const memItem = memoryCache.get(key);
    if (memItem) {
      if (Date.now() < memItem.expiry) {
        return memItem.data;
      }
      memoryCache.delete(key);
    }

    // 2. Check localStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem('sekitarku_cache_' + key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Date.now() < parsed.expiry) {
            memoryCache.set(key, parsed);
            return parsed.data;
          }
          localStorage.removeItem('sekitarku_cache_' + key);
        }
      }
    } catch {
      // Storage quota or private browsing fallback
    }

    return null;
  },

  set(key, data, ttlMs = DEFAULT_TTL_MS) {
    if (!data) return;
    const item = {
      data,
      expiry: Date.now() + ttlMs,
      cachedAt: new Date().toISOString()
    };

    memoryCache.set(key, item);

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('sekitarku_cache_' + key, JSON.stringify(item));
      }
    } catch {
      // Auto-cleanup oldest cache items if quota exceeded
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const keys = Object.keys(localStorage).filter(k => k.startsWith('sekitarku_cache_'));
          keys.slice(0, 10).forEach(k => localStorage.removeItem(k));
          localStorage.setItem('sekitarku_cache_' + key, JSON.stringify(item));
        }
      } catch {}
    }
  },

  clear() {
    memoryCache.clear();
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const keys = Object.keys(localStorage).filter(k => k.startsWith('sekitarku_cache_'));
        keys.forEach(k => localStorage.removeItem(k));
      }
    } catch {}
  }
};
