import { apiCache } from '../utils/apiCache';

/**
 * Open-Meteo Air Quality API with 5-minute TTL Cache
 */
export async function fetchAirQualityData(lat, lon, forceRefresh = false) {
  const cacheKey = `aqi_${lat.toFixed(3)}_${lon.toFixed(3)}`;

  if (!forceRefresh) {
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;
  }

  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust&hourly=us_aqi,pm2_5,pm10,carbon_monoxide,ozone&timezone=Asia%2FJakarta&forecast_days=3`;
    
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`Open-Meteo Air Quality status: ${res.status}`);
    const data = await res.json();

    const formatted = {
      current: {
        aqi: Math.round(data.current?.us_aqi ?? 0),
        pm25: Math.round((data.current?.pm2_5 ?? 0) * 10) / 10,
        pm10: Math.round((data.current?.pm10 ?? 0) * 10) / 10,
        co: Math.round(data.current?.carbon_monoxide ?? 0),
        no2: Math.round((data.current?.nitrogen_dioxide ?? 0) * 10) / 10,
        so2: Math.round((data.current?.sulphur_dioxide ?? 0) * 10) / 10,
        o3: Math.round((data.current?.ozone ?? 0) * 10) / 10,
        dust: Math.round((data.current?.dust ?? 0) * 10) / 10,
        time: data.current?.time
      },
      hourly: data.hourly || {}
    };

    apiCache.set(cacheKey, formatted, 5 * 60 * 1000);
    return formatted;
  } catch (error) {
    console.error('Gagal mengambil data kualitas udara:', error);
    const stale = apiCache.get(cacheKey);
    if (stale) return stale;
    throw error;
  }
}
