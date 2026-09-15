import { apiCache } from '../utils/apiCache.js';

/**
 * Mengkalibrasi kode cuaca WMO agar akurat dengan kondisi di darat.
 * Model NWP (Numerical Weather Prediction) Open-Meteo sering mengeluarkan kode Gerimis/Hujan (51-57, 61, 80)
 * untuk kelembapan virga di awan atas (0.05-0.2 mm) padahal di darat tidak ada presipitasi dan hanya berawan tebal/berawan.
 */
export function calibrateWeatherCode({ weatherCode, precipitation = 0, cloudCover = 50 }) {
  const code = Number(weatherCode ?? 2);
  const precip = Number(precipitation ?? 0);
  const clouds = Number(cloudCover ?? 50);

  // Jika model memprediksi gerimis/hujan ringan namun presipitasi terukur di tanah < 0.25 mm (virga/kering)
  if (precip < 0.25 && ((code >= 51 && code <= 57) || code === 61 || code === 80)) {
    if (clouds >= 75) return 3; // Berawan Tebal (Overcast)
    if (clouds >= 35) return 2; // Berawan (Partly Cloudy)
    return 1; // Cerah Berawan
  }

  // Jika model menyatakan cerah tanpa awan padahal tutupan awan tinggi
  if (code === 0 && clouds >= 80) return 3;
  if (code === 0 && clouds >= 40) return 2;

  return code;
}

export function getDefaultWeather() {
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
      cloudCover: 50,
      isDay: 1,
      weatherCode: 2, // Berawan
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
      precipitation: hours.map(() => 0),
      weather_code: hours.map(() => 2),
      uv_index: hours.map((_, i) => (i >= 6 && i <= 17 ? Math.max(0, 8 - Math.abs(12 - i)) : 0)),
      cloud_cover: hours.map(() => 50)
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
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${safeLat}&longitude=${safeLon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index,cloud_cover,is_day&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,uv_index,cloud_cover&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto&models=best_match&forecast_days=7`;
    
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: controller ? controller.signal : undefined
    });
    if (!res.ok) throw new Error(`Open-Meteo Weather status: ${res.status}`);
    const data = await res.json();

    const rawPrecipitation = Number(data.current?.precipitation ?? 0);
    const rawCloudCover = Number(data.current?.cloud_cover ?? 50);
    const rawWeatherCode = Number(data.current?.weather_code ?? 2);

    const resolvedWeatherCode = calibrateWeatherCode({
      weatherCode: rawWeatherCode,
      precipitation: rawPrecipitation,
      cloudCover: rawCloudCover
    });

    // Kalibrasi kode cuaca per jam (hourly) untuk semua lokasi & waktu
    const calibratedHourlyWeatherCodes = (data.hourly?.weather_code || []).map((code, idx) => {
      const hPrecip = Number(data.hourly?.precipitation?.[idx] ?? 0);
      const hClouds = Number(data.hourly?.cloud_cover?.[idx] ?? 50);
      const hProb = Number(data.hourly?.precipitation_probability?.[idx] ?? 0);

      if ((hPrecip < 0.25 || hProb < 30) && ((code >= 51 && code <= 57) || code === 61 || code === 80)) {
        if (hClouds >= 75) return 3; // Berawan Tebal
        if (hClouds >= 35) return 2; // Berawan
        return 1; // Cerah Berawan
      }
      return calibrateWeatherCode({ weatherCode: code, precipitation: hPrecip, cloudCover: hClouds });
    });

    const calibratedHourly = data.hourly ? {
      ...data.hourly,
      weather_code: calibratedHourlyWeatherCodes
    } : getDefaultWeather().hourly;

    // Kalibrasi kode cuaca harian (7 hari) untuk mencegah hari kering salah didiagnosis gerimis di seluruh lokasi
    const calibratedDailyWeatherCodes = (data.daily?.weather_code || []).map((code, idx) => {
      const pSum = Number(data.daily?.precipitation_sum?.[idx] ?? 0);
      const pProb = Number(data.daily?.precipitation_probability_max?.[idx] ?? 0);
      if (pSum < 0.35 && pProb < 35 && ((code >= 51 && code <= 57) || code === 80 || code === 61)) {
        return 2; // Berawan
      }
      return code;
    });

    const calibratedDaily = data.daily ? {
      ...data.daily,
      weather_code: calibratedDailyWeatherCodes
    } : getDefaultWeather().daily;

    const formatted = {
      current: {
        temp: Math.round(data.current?.temperature_2m ?? 29),
        feelsLike: Math.round(data.current?.apparent_temperature ?? 32),
        humidity: data.current?.relative_humidity_2m ?? 75,
        precipitation: rawPrecipitation,
        cloudCover: rawCloudCover,
        isDay: data.current?.is_day ?? 1,
        weatherCode: resolvedWeatherCode,
        windSpeed: data.current?.wind_speed_10m ?? 10,
        windDirection: data.current?.wind_direction_10m ?? 180,
        uvIndex: data.current?.uv_index ?? 4,
        pressure: data.current?.surface_pressure ?? 1010,
        time: data.current?.time || new Date().toISOString()
      },
      hourly: calibratedHourly,
      daily: calibratedDaily
    };

    apiCache.set(cacheKey, formatted, 5 * 60 * 1000);
    return formatted;
  } catch (error) {
    console.warn('Gagal mengambil data cuaca Open-Meteo, menggunakan fallback:', error.message);
    const stale = apiCache.get(cacheKey) || getDefaultWeather();
    return stale;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

