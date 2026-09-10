import { apiCache } from '../utils/apiCache.js';

function getDefaultAqi() {
  const now = new Date();
  const hours = Array.from({ length: 24 }, (_, i) => `${now.toISOString().split('T')[0]}T${String(i).padStart(2, '0')}:00`);

  return {
    current: {
      aqi: 45,
      pm25: 12.5,
      pm10: 22.0,
      co: 280,
      no2: 8.5,
      so2: 4.2,
      o3: 25.0,
      dust: 8.0,
      time: now.toISOString()
    },
    hourly: {
      time: hours,
      us_aqi: hours.map(() => 40 + Math.floor(Math.random() * 15)),
      pm2_5: hours.map(() => 10 + Math.floor(Math.random() * 8)),
      pm10: hours.map(() => 18 + Math.floor(Math.random() * 10)),
      carbon_monoxide: hours.map(() => 250 + Math.floor(Math.random() * 60)),
      ozone: hours.map(() => 20 + Math.floor(Math.random() * 15))
    }
  };
}

export async function fetchAirQualityData(lat, lon, forceRefresh = false) {
  const safeLat = Number(lat) || -6.2088;
  const safeLon = Number(lon) || 106.8456;
  const cacheKey = `aqi_${safeLat.toFixed(3)}_${safeLon.toFixed(3)}`;

  if (!forceRefresh) {
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), 6000) : null;

  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${safeLat}&longitude=${safeLon}&current=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust&hourly=us_aqi,pm2_5,pm10,carbon_monoxide,ozone&timezone=Asia%2FJakarta&forecast_days=3`;
    
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: controller ? controller.signal : undefined
    });
    if (!res.ok) throw new Error(`Open-Meteo Air Quality status: ${res.status}`);
    const data = await res.json();

    const formatted = {
      current: {
        aqi: Math.round(data.current?.us_aqi ?? 45),
        pm25: Math.round((data.current?.pm2_5 ?? 12.5) * 10) / 10,
        pm10: Math.round((data.current?.pm10 ?? 22.0) * 10) / 10,
        co: Math.round(data.current?.carbon_monoxide ?? 280),
        no2: Math.round((data.current?.nitrogen_dioxide ?? 8.5) * 10) / 10,
        so2: Math.round((data.current?.sulphur_dioxide ?? 4.2) * 10) / 10,
        o3: Math.round((data.current?.ozone ?? 25.0) * 10) / 10,
        dust: Math.round((data.current?.dust ?? 8.0) * 10) / 10,
        time: data.current?.time || new Date().toISOString()
      },
      hourly: data.hourly || getDefaultAqi().hourly
    };

    apiCache.set(cacheKey, formatted, 5 * 60 * 1000);
    return formatted;
  } catch (error) {
    console.warn('Gagal mengambil data kualitas udara Open-Meteo, menggunakan fallback:', error.message);
    const stale = apiCache.get(cacheKey) || getDefaultAqi();
    return stale;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}
