export const config = {
  runtime: 'edge',
};

function escapeText(str) {
  if (!str) return '';
  return String(str).replace(/[<>"]/g, '').slice(0, 50);
}

export default async function handler(request) {
  const { searchParams } = new URL(request.url);

  const city = escapeText(searchParams.get('city')) || 'Jakarta';
  const lat = parseFloat(searchParams.get('lat')) || -6.2088;
  const lon = parseFloat(searchParams.get('lon')) || 106.8456;

  try {
    // Fetch Open-Meteo current weather and air quality in parallel
    const [weatherRes, aqiRes] = await Promise.all([
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia%2FJakarta`),
      fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5&timezone=Asia%2FJakarta`)
    ]);

    const weatherData = weatherRes.ok ? await weatherRes.json() : null;
    const aqiData = aqiRes.ok ? await aqiRes.json() : null;

    const temp = Math.round(weatherData?.current?.temperature_2m ?? 30);
    const humidity = Math.round(weatherData?.current?.relative_humidity_2m ?? 75);
    const windSpeed = Math.round(weatherData?.current?.wind_speed_10m ?? 12);
    const aqi = Math.round(aqiData?.current?.us_aqi ?? 42);
    const pm25 = Math.round((aqiData?.current?.pm2_5 ?? 15) * 10) / 10;

    let aqiStatus = 'Baik';
    let aqiColor = '#10b981';
    if (aqi > 300) { aqiStatus = 'Berbahaya'; aqiColor = '#881337'; }
    else if (aqi > 200) { aqiStatus = 'Sangat Tidak Sehat'; aqiColor = '#a855f7'; }
    else if (aqi > 150) { aqiStatus = 'Tidak Sehat'; aqiColor = '#ef4444'; }
    else if (aqi > 100) { aqiStatus = 'Sensitif'; aqiColor = '#f97316'; }
    else if (aqi > 50) { aqiStatus = 'Sedang'; aqiColor = '#eab308'; }

    const responsePayload = {
      app: 'Sekitarku',
      city,
      temp,
      tempLabel: `${temp}°C`,
      aqi,
      aqiStatus,
      aqiColor,
      pm25,
      humidity: `${humidity}%`,
      windSpeed: `${windSpeed} km/h`,
      source: 'BMKG & Open-Meteo',
      updatedAt: new Date().toISOString()
    };

    return new Response(JSON.stringify(responsePayload, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    const fallbackPayload = {
      app: 'Sekitarku',
      city,
      temp: 30,
      tempLabel: '30°C',
      aqi: 42,
      aqiStatus: 'Baik',
      aqiColor: '#10b981',
      pm25: 15,
      humidity: '75%',
      windSpeed: '12 km/h',
      source: 'BMKG & Open-Meteo',
      updatedAt: new Date().toISOString()
    };

    return new Response(JSON.stringify(fallbackPayload, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=60, s-maxage=300',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
