import { INDONESIA_VOLCANOES, VOLCANO_STATUS_LEVELS } from '../utils/volcanoes.js';
import { calculateDistance } from '../utils/geo.js';
import { apiCache } from '../utils/apiCache.js';

/**
 * Layanan Monitoring Vulkanologi & Gunung Api PVMBG / MAGMA Indonesia
 */
export function getNearbyVolcanoes(lat, lon, maxRadiusKm = 250) {
  if (!lat || !lon) return { nearest: null, list: [], alertCount: 0 };

  const cacheKey = `volcano_${lat.toFixed(2)}_${lon.toFixed(2)}`;
  const cached = apiCache.get(cacheKey);
  if (cached) return cached;

  const volcanoesWithDistance = INDONESIA_VOLCANOES.map((v) => {
    const distanceKm = Math.round(calculateDistance(lat, lon, v.lat, v.lon) * 10) / 10;
    const status = VOLCANO_STATUS_LEVELS[v.statusLevel] || VOLCANO_STATUS_LEVELS[1];
    const isInsideDangerZone = distanceKm <= v.dangerRadiusKm;
    const isCautionZone = distanceKm <= v.dangerRadiusKm * 4;

    return {
      ...v,
      distanceKm,
      status,
      isInsideDangerZone,
      isCautionZone
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);

  const nearest = volcanoesWithDistance[0] || null;
  const nearbyList = volcanoesWithDistance.filter((v) => v.distanceKm <= maxRadiusKm);
  const alertCount = INDONESIA_VOLCANOES.filter((v) => v.statusLevel >= 3).length;

  const result = {
    nearest,
    nearbyList,
    allVolcanoes: volcanoesWithDistance,
    alertCount
  };

  apiCache.set(cacheKey, result, 10 * 60 * 1000); // 10 minutes cache
  return result;
}
