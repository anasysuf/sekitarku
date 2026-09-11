import { apiCache } from '../utils/apiCache.js';
import { calculateFdrs, getNearbyHotspots, SATELLITE_HOTSPOTS } from '../utils/karhutla.js';
import { calculateDistance } from '../utils/geo.js';

/**
 * Layanan data Karhutla (Kebakaran Hutan & Lahan) & Hotspot Satelit KLHK SiPongi+ / NASA FIRMS / BMKG
 */

/**
 * Fetch live NASA FIRMS data jika API Key tersedia di environment
 */
export async function fetchLiveFirmsHotspots(mapKey) {
  if (!mapKey) return null;
  try {
    const url = `https://firms.modaps.eosdis.nasa.gov/api/country/csv/${mapKey}/VIIRS_SNPP_NRT/IDN/1`;
    const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!response.ok) return null;

    const csvText = await response.text();
    const lines = csvText.trim().split('\n');
    if (lines.length <= 1) return null;

    const headers = lines[0].split(',').map((h) => h.trim());
    const latIdx = headers.indexOf('latitude');
    const lonIdx = headers.indexOf('longitude');
    const brightIdx = headers.indexOf('bright_ti4');
    const confIdx = headers.indexOf('confidence');
    const frpIdx = headers.indexOf('frp');
    const satIdx = headers.indexOf('satellite');

    if (latIdx === -1 || lonIdx === -1) return null;

    const parsed = lines.slice(1).map((line, idx) => {
      const cols = line.split(',');
      const lat = parseFloat(cols[latIdx]);
      const lon = parseFloat(cols[lonIdx]);
      const brightnessK = brightIdx !== -1 ? parseFloat(cols[brightIdx]) : 330.0;
      const frpMw = frpIdx !== -1 ? parseFloat(cols[frpIdx]) : 15.0;
      const confStr = confIdx !== -1 ? cols[confIdx] : 'nominal';
      const sat = satIdx !== -1 ? cols[satIdx] : 'VIIRS SNPP (375m)';

      const isHigh = confStr === 'h' || confStr === 'high';
      const confidence = isHigh ? 'Tinggi (>85%)' : 'Sedang (70-85%)';

      return {
        id: `firms-live-${idx}`,
        regency: `Titik Panas (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
        province: 'Wilayah Terdeteksi Satelit',
        island: lon < 108 ? (lat > -2 ? 'Sumatera' : 'Jawa') : lon < 118 ? (lat > 0 ? 'Kalimantan' : 'Jawa') : 'Indonesia',
        lat,
        lon,
        satellite: sat || 'VIIRS SNPP (375m)',
        confidence,
        confidenceLevel: isHigh ? 'HIGH' : 'MODERATE',
        brightnessK,
        frpMw,
        type: 'Deteksi Termal Aktif',
        source: 'NASA FIRMS NRT Live',
        detectedAt: 'Live Satelit (NRT)'
      };
    }).filter((h) => !isNaN(h.lat) && !isNaN(h.lon));

    return parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

export function fetchKarhutlaData(lat, lon, weatherData, forceRefresh = false) {
  const cacheKey = `karhutla_${lat?.toFixed?.(2) || 0}_${lon?.toFixed?.(2) || 0}`;

  if (!forceRefresh) {
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;
  }

  const fdrs = calculateFdrs(weatherData);
  const hotspotInfo = getNearbyHotspots(lat, lon);

  const result = {
    fdrs,
    nearest: hotspotInfo.nearest,
    nearbyList: hotspotInfo.nearbyList,
    allHotspots: hotspotInfo.allHotspots,
    totalInIndo: hotspotInfo.totalInIndo,
    dataSource: 'NASA FIRMS (VIIRS 375m / NOAA-20) & KLHK SiPongi+',
    lastSync: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  };

  apiCache.set(cacheKey, result, 5 * 60 * 1000); // 5 min TTL
  return result;
}
