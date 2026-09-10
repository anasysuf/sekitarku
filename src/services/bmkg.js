import { apiCache } from '../utils/apiCache.js';

export function getDefaultEarthquake() {
  return {
    date: '10 Sep 2026',
    time: '22:00:00 WIB',
    dateTime: '10 Sep 2026 22:00:00 WIB',
    lat: -6.82,
    lon: 107.14,
    magnitude: 3.8,
    depth: '10 km',
    wilayah: 'Pusat gempa berada di darat 12 km BaratDaya Kab. Cianjur',
    potensi: 'Tidak berpotensi tsunami',
    dirasakan: 'II-III Cianjur',
    shakemap: null
  };
}

export async function fetchLatestEarthquake(forceRefresh = false) {
  const cacheKey = 'bmkg_autogempa';

  if (!forceRefresh) {
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), 5000) : null;

  try {
    const res = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json', {
      headers: { 'Accept': 'application/json' },
      signal: controller ? controller.signal : undefined
    });
    if (!res.ok) throw new Error(`BMKG Error: ${res.status}`);
    const data = await res.json();
    const gempa = data?.Infogempa?.gempa;
    if (!gempa) return getDefaultEarthquake();

    const [latStr, lonStr] = gempa.Coordinates ? gempa.Coordinates.split(',') : [0, 0];
    const formatted = {
      date: gempa.Tanggal || '',
      time: gempa.Jam || '',
      dateTime: `${gempa.Tanggal || ''} ${gempa.Jam || ''}`.trim(),
      lat: parseFloat(latStr) || 0,
      lon: parseFloat(lonStr) || 0,
      magnitude: parseFloat(gempa.Magnitude) || 0,
      depth: gempa.Kedalaman || '-',
      wilayah: gempa.Wilayah || 'Wilayah Indonesia',
      potensi: gempa.Potensi || 'Tidak berpotensi tsunami',
      dirasakan: gempa.Dirasakan || '-',
      shakemap: gempa.Shakemap ? `https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}` : null
    };

    apiCache.set(cacheKey, formatted, 3 * 60 * 1000);
    return formatted;
  } catch (error) {
    console.warn('Gagal memuat gempa terkini BMKG:', error.message);
    return apiCache.get(cacheKey) || getDefaultEarthquake();
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export async function fetchRecentEarthquakes(forceRefresh = false) {
  const cacheKey = 'bmkg_gempaterkini';

  if (!forceRefresh) {
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), 5000) : null;

  try {
    const res = await fetch('https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json', {
      headers: { 'Accept': 'application/json' },
      signal: controller ? controller.signal : undefined
    });
    if (!res.ok) throw new Error(`BMKG Error: ${res.status}`);
    const data = await res.json();
    const list = data?.Infogempa?.gempa || [];
    
    const formatted = list.map((g, idx) => {
      const [latStr, lonStr] = g.Coordinates ? g.Coordinates.split(',') : [0, 0];
      return {
        id: `quake-${idx}-${g.Tanggal}-${g.Jam}`,
        date: g.Tanggal || '',
        time: g.Jam || '',
        dateTime: `${g.Tanggal || ''} ${g.Jam || ''}`.trim(),
        lat: parseFloat(latStr) || 0,
        lon: parseFloat(lonStr) || 0,
        magnitude: parseFloat(g.Magnitude) || 0,
        depth: g.Kedalaman || '-',
        wilayah: g.Wilayah || 'Indonesia',
        potensi: g.Potensi || 'Tidak berpotensi tsunami'
      };
    });

    apiCache.set(cacheKey, formatted, 3 * 60 * 1000);
    return formatted;
  } catch (error) {
    console.warn('Gagal memuat daftar gempa BMKG:', error.message);
    return apiCache.get(cacheKey) || [getDefaultEarthquake()];
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}
