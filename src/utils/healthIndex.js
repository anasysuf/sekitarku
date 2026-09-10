/**
 * Menghitung skor kesehatan lingkungan komposit (0-100) dan ekuivalensi hisapan rokok pasif.
 * Mengintegrasikan AQI US-EPA, konsentrasi PM2.5, kenyamanan termal (suhu & kelembapan), dan indeks radiasi UV.
 *
 * @param {number} aqi - Indeks Kualitas Udara (AQI US 0-500)
 * @param {number} temp - Suhu udara aktual (°C)
 * @param {number} humidity - Kelembapan relatif (%)
 * @param {number} uvIndex - Indeks radiasi ultraviolet (0-11+)
 * @param {number} pm25 - Konsentrasi partikulat halus PM2.5 (µg/m³)
 * @returns {Object} Skor terikat (0-100), label kategori, palet warna, estimasi rokok pasif, dan rekomendasi aktivitas
 */
export function calculateEcoHealthScore(aqi, temp, humidity, uvIndex, pm25) {
  const safeAqi = Math.max(0, Number(aqi) || 0);
  const safeTemp = Number(temp) || 28;
  const safeHumidity = Number(humidity) || 70;
  const safeUv = Math.max(0, Number(uvIndex) || 0);
  const safePm25 = Math.max(0, Number(pm25) || 0);

  // 1. AQI Score (100 = Baik, 0 = Berbahaya)
  let aqiScore = 100;
  if (safeAqi <= 50) {
    aqiScore = 100 - (safeAqi / 50) * 15;
  } else if (safeAqi <= 100) {
    aqiScore = 85 - ((safeAqi - 50) / 50) * 25;
  } else if (safeAqi <= 150) {
    aqiScore = 60 - ((safeAqi - 100) / 50) * 25;
  } else if (safeAqi <= 200) {
    aqiScore = 35 - ((safeAqi - 150) / 50) * 20;
  } else {
    aqiScore = Math.max(0, 15 - ((safeAqi - 200) / 300) * 15);
  }

  // 2. Thermal Comfort (Ideal 22 - 27 C, Penalti jika terlalu panas/dingin)
  let thermalScore = 100;
  if (safeTemp > 27) {
    thermalScore -= (safeTemp - 27) * 6;
  } else if (safeTemp < 22) {
    thermalScore -= (22 - safeTemp) * 5;
  }

  if (safeHumidity > 80 || safeHumidity < 40) {
    thermalScore -= 15;
  }
  thermalScore = Math.max(10, Math.min(100, thermalScore));

  // 3. UV Score (UV 0-2 = 100, UV 3-5 = 80, UV 6-7 = 55, UV 8-10 = 30, UV 11+ = 10)
  let uvScore = 100;
  if (safeUv <= 2) uvScore = 100;
  else if (safeUv <= 5) uvScore = 80;
  else if (safeUv <= 7) uvScore = 55;
  else if (safeUv <= 10) uvScore = 30;
  else uvScore = 10;

  // Skor Gabungan
  const finalScore = Math.round(aqiScore * 0.5 + thermalScore * 0.25 + uvScore * 0.25);
  const boundedScore = Math.max(0, Math.min(100, finalScore));

  // Kategori & Warna
  let category = 'Sangat Sehat & Optimal';
  let color = '#10b981';
  let bg = 'rgba(16, 185, 129, 0.15)';

  if (boundedScore >= 80) {
    category = 'Sangat Sehat & Optimal';
    color = '#10b981';
    bg = 'rgba(16, 185, 129, 0.15)';
  } else if (boundedScore >= 60) {
    category = 'Cukup Baik & Layak';
    color = '#f59e0b';
    bg = 'rgba(245, 158, 11, 0.15)';
  } else if (boundedScore >= 40) {
    category = 'Kurang Sehat / Berisiko';
    color = '#f97316';
    bg = 'rgba(249, 115, 22, 0.15)';
  } else {
    category = 'Berbahaya Bagi Kesehatan';
    color = '#ef4444';
    bg = 'rgba(239, 68, 68, 0.15)';
  }

  // Cigarette equivalency: 1 batang rokok ~ 22 ug/m3 PM2.5 per 24 jam (Berkeley Earth)
  const cigsEquivalent = Math.round((safePm25 / 22) * 10) / 10;

  // Rekomendasi Aktivitas
  const activities = {
    jogging: {
      status: safeAqi <= 100 && safeTemp <= 32 ? 'Ideal' : safeAqi <= 150 ? 'Waspada' : 'Hindari',
      color: safeAqi <= 100 && safeTemp <= 32 ? '#10b981' : safeAqi <= 150 ? '#f59e0b' : '#ef4444'
    },
    cycling: {
      status: safeAqi <= 100 && safeUv <= 7 ? 'Ideal' : safeAqi <= 150 ? 'Waspada' : 'Hindari',
      color: safeAqi <= 100 && safeUv <= 7 ? '#10b981' : safeAqi <= 150 ? '#f59e0b' : '#ef4444'
    },
    kidsAndSeniors: {
      status: safeAqi <= 50 ? 'Aman' : safeAqi <= 100 ? 'Batasi' : 'Di Dalam Ruangan',
      color: safeAqi <= 50 ? '#10b981' : safeAqi <= 100 ? '#f59e0b' : '#ef4444'
    },
    ventilation: {
      status: safeAqi <= 80 ? 'Buka Jendela' : 'Tutup Jendela',
      color: safeAqi <= 80 ? '#10b981' : '#ef4444'
    }
  };

  return {
    score: boundedScore,
    category,
    color,
    bg,
    cigs: cigsEquivalent,
    cigarettesEquivalent: cigsEquivalent,
    activities,
    thermalScore,
    aqiScore,
    uvScore
  };
}
