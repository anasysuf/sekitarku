import { apiCache } from '../utils/apiCache.js';

export function getDefaultWeather(lat = -6.2, lon = 106.8) {
  const now = new Date();
  const hours = Array.from({ length: 24 }, (_, i) => `${now.toISOString().split('T')[0]}T${String(i).padStart(2, '0')}:00`);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() + i * 86400000);
    return d.toISOString().split('T')[0];
  });

  return {
    current: {
      temp: 29,
      feelsLike: 32,
      humidity: 75,
      precipitation: 0,
      weatherCode: 2, // Sebagian Berawan
      windSpeed: 10,
      windDirection: 180,
      uvIndex: 4,
      pressure: 1010,
      time: now.toISOString()
    },
    hourly: {
      time: hours,
      temperature_2m: hours.map(() => 28 + Math.floor(Math.random() * 4)),
      relative_humidity_2m: hours.map(() => 70 + Math.floor(Math.random() * 15)),
      precipitation_probability: hours.map(() => 10),
      weather_code: hours.map(() => 2),
      uv_index: hours.map((_, i) => (i >= 6 && i <= 17 ? Math.max(0, 8 - Math.abs(12 - i)) : 0))
    },
    daily: {
      time: days,
      weather_code: [2, 2, 1, 3, 2, 1, 2],
      temperature_2m_max: [32, 33, 31, 32, 33, 32, 31],
      temperature_2m_min: [24, 25, 24, 24, 25, 24, 24],
      uv_index_max: [6, 7, 6, 6, 7, 6, 6],
      precipitation_sum: [0, 1, 0, 2, 0, 0, 1],
      precipitation_probability_max: [20, 30, 15, 40, 20, 15, 25],
      wind_speed_10m_max: [14, 12, 15, 11, 13, 12, 14]
    }
  };
}

export async function fetchWeatherData(lat, lon, forceRefresh = false) {
  const safeLat = Number(lat) || -6.2088;
  const safeLon = Number(lon) || 106.8456;
  const cacheKey = `weather_${safeLat.toFixed(3)}_${safeLon.toFixed(3)}`;

  if (!forceRefresh) {
    const cached = apiCache.get(cacheKey);
    if (cached) return cached;
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), 6000) : null;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${safeLat}&longitude=${safeLon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=Asia%2FJakarta&forecast_days=7`;
    
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: controller ? controller.signal : undefined
    });
    if (!res.ok) throw new Error(`Open-Meteo Weather status: ${res.status}`);
    const data = await res.json();

    const formatted = {
      current: {
        temp: Math.round(data.current?.temperature_2m ?? 29),
        feelsLike: Math.round(data.current?.apparent_temperature ?? 32),
        humidity: data.current?.relative_humidity_2m ?? 75,
        precipitation: data.current?.precipitation ?? 0,
        weatherCode: data.current?.weather_code ?? 2,
        windSpeed: data.current?.wind_speed_10m ?? 10,
        windDirection: data.current?.wind_direction_10m ?? 180,
        uvIndex: data.current?.uv_index ?? 4,
        pressure: data.current?.surface_pressure ?? 1010,
        time: data.current?.time || new Date().toISOString()
      },
      hourly: data.hourly || getDefaultWeather(safeLat, safeLon).hourly,
      daily: data.daily || getDefaultWeather(safeLat, safeLon).daily
    };

    apiCache.set(cacheKey, formatted, 5 * 60 * 1000);
    return formatted;
  } catch (error) {
    console.warn('Gagal mengambil data cuaca Open-Meteo, menggunakan fallback:', error.message);
    const stale = apiCache.get(cacheKey) || getDefaultWeather(safeLat, safeLon);
    return stale;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}
