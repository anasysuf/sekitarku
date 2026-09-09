/**
 * Open-Meteo Air Quality API
 */
export async function fetchAirQualityData(lat, lon) {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust&hourly=us_aqi,pm2_5,pm10,carbon_monoxide,ozone&timezone=Asia%2FJakarta&forecast_days=3`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Open-Meteo Air Quality status: ${res.status}`);
    const data = await res.json();

    return {
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
      hourly: data.hourly
    };
  } catch (error) {
    console.error('Gagal mengambil data kualitas udara:', error);
    throw error;
  }
}
