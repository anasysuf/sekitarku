/**
 * Open-Meteo Weather Service
 */
export async function fetchWeatherData(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum&timezone=Asia%2FJakarta&forecast_days=7`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Open-Meteo Weather status: ${res.status}`);
    const data = await res.json();

    return {
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
      hourly: data.hourly,
      daily: data.daily
    };
  } catch (error) {
    console.error('Gagal mengambil data cuaca:', error);
    throw error;
  }
}
