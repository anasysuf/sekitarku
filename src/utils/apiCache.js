/**
 * Smart Client-side API Cache with TTL (Time To Live)
 * Uses in-memory Map with fallback to sessionStorage for lightning fast instant city navigation.
 */

const memoryCache = new Map();
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes

export const apiCache = {
  get(key) {
    // 1. Check memory cache
    const memItem = memoryCache.get(key);
    if (memItem) {
      if (Date.now() < memItem.expiry) {
        return memItem.data;
      }
      memoryCache.delete(key);
    }

    // 2. Check sessionStorage
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const raw = sessionStorage.getItem('sekitarku_cache_' + key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Date.now() < parsed.expiry) {
            memoryCache.set(key, parsed);
            return parsed.data;
          }
          sessionStorage.removeItem('sekitarku_cache_' + key);
        }
      }
    } catch {
      // Ignore sessionStorage errors (e.g. quota or incognito)
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
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem('sekitarku_cache_' + key, JSON.stringify(item));
      }
    } catch {
      // Storage quota exceeded or disabled
    }
  },

  clear() {
    memoryCache.clear();
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const keys = Object.keys(sessionStorage).filter(k => k.startsWith('sekitarku_cache_'));
        keys.forEach(k => sessionStorage.removeItem(k));
      }
    } catch {
      // Ignore
    }
  }
};
