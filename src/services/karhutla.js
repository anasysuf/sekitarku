import { apiCache } from '../utils/apiCache';
import { calculateFdrs, getNearbyHotspots } from '../utils/karhutla';

/**
 * Layanan data Karhutla (Kebakaran Hutan & Lahan) & Hotspot Satelit BMKG / NASA FIRMS
 */
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
    lastSync: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  };

  apiCache.set(cacheKey, result, 5 * 60 * 1000); // 5 min TTL
  return result;
}
