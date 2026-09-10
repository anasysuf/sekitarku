import { apiCache } from '../utils/apiCache.js';

/**
 * Open-Meteo Weather Service with 5-minute TTL Cache
 */
export async function fetchWeatherData(lat, lon, forceRefresh = false) {
  const cacheKey = `weather_${lat.toFixed(3)}_${lon.toFixed(3)}`;

  if (!forceRefresh) {
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=Asia%2FJakarta&forecast_days=7`;
    
    const res = await fetch(url, { headers: { 'Accept': 'application/json' }, signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error(`Open-Meteo Weather status: ${res.status}`);
    const data = await res.json();

    const formatted = {
      current: {
        temp: Math.round(data.current?.temperature_2m ?? 0),
        feelsLike: Math.round(data.current?.apparent_temperature ?? 0),
        humidity: data.current?.relative_humidity_2m ?? 0,
        precipitation: data.current?.precipitation ?? 0,
        weatherCode: data.current?.weather_code ?? 0,
        windSpeed: data.current?.wind_speed_10m ?? 0,
        windDirection: data.current?.wind_direction_10m ?? 0,
        uvIndex: data.current?.uv_index ?? 0,
        pressure: data.current?.surface_pressure ?? 0,
        time: data.current?.time
      },
      hourly: data.hourly || {},
      daily: data.daily || {}
    };

    apiCache.set(cacheKey, formatted, 5 * 60 * 1000);
    return formatted;
  } catch (error) {
    console.error('Gagal mengambil data cuaca:', error);
    const stale = apiCache.get(cacheKey);
    if (stale) return stale;
    throw error;
  }
}
