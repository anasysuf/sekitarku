/**
 * Perhitungan Skor Kelayakan Lingkungan Terpadu (Eco-Health Score) 0 - 100
 * Berdasarkan gabungan AQI (45%), Kenyamanan Termal/Suhu (30%), dan Radiasi UV (25%)
 */
export function calculateEcoHealthScore(aqi, temp, humidity, uvIndex, pm25, lang = 'id') {
  const safeAqi = Math.max(0, Number(aqi) || 0);
  const safeTemp = Number(temp) || 28;
  const safeHumidity = Number(humidity) || 70;
  const safeUv = Math.max(0, Number(uvIndex) || 0);
  const safePm25 = Math.max(0, Number(pm25) || 0);

  // 1. AQI Score (100 = Baik, 0 = Berbahaya)
  let aqiScore = 100;
  if (safeAqi <= 50) {
    aqiScore = 100 - (safeAqi / 50) * 15; // 85 - 100
  } else if (safeAqi <= 100) {
    aqiScore = 85 - ((safeAqi - 50) / 50) * 25; // 60 - 85
  } else if (safeAqi <= 150) {
    aqiScore = 60 - ((safeAqi - 100) / 50) * 25; // 35 - 60
  } else if (safeAqi <= 200) {
    aqiScore = 35 - ((safeAqi - 150) / 50) * 20; // 15 - 35
  } else {
    aqiScore = Math.max(0, 15 - ((safeAqi - 200) / 100) * 15); // 0 - 15
  }

  // 2. Thermal Comfort Score (Suhu optimal di Indonesia ~24-29°C, kelembaban 50-70%)
  let thermalScore = 100;
  const tempDiff = Math.abs(safeTemp - 26);
  thermalScore -= tempDiff * 6; // Pengurangan untuk suhu terlalu panas/dingin
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

  // Skor Gabungan Bobot
  const finalScore = Math.round(aqiScore * 0.5 + thermalScore * 0.25 + uvScore * 0.25);
  const boundedScore = Math.max(0, Math.min(100, finalScore));

  // Kategori & Warna
  let category = 'Sangat Sehat & Nyaman';
  let categoryEn = 'Very Healthy & Optimal';
  let color = '#10b981'; // Emerald
  let bg = 'rgba(16, 185, 129, 0.15)';

  if (boundedScore >= 80) {
    category = 'Sangat Sehat & Optimal';
    categoryEn = 'Very Healthy & Optimal';
    color = '#10b981';
    bg = 'rgba(16, 185, 129, 0.15)';
  } else if (boundedScore >= 60) {
    category = 'Cukup Baik & Layak';
    categoryEn = 'Moderate & Acceptable';
    color = '#f59e0b';
    bg = 'rgba(245, 158, 11, 0.15)';
  } else if (boundedScore >= 40) {
    category = 'Kurang Sehat / Berisiko';
    categoryEn = 'Unhealthy / Risky';
    color = '#f97316';
    bg = 'rgba(249, 115, 22, 0.15)';
  } else {
    category = 'Berbahaya Bagi Kesehatan';
    categoryEn = 'Hazardous to Health';
    color = '#ef4444';
    bg = 'rgba(239, 68, 68, 0.15)';
  }

  // 4. Kalkulator Ekuivalen Rokok (Berkeley Earth Formula: ~22 µg/m³ PM2.5 per 24 jam = 1 batang rokok)
  const cigs = Math.round((safePm25 / 22) * 10) / 10;

  // 5. Kesiapan Aktivitas Luar Ruangan (Outdoor Readiness)
  const activities = {
    jogging: {
      status: safeAqi <= 100 && safeTemp <= 32 ? 'Ideal' : safeAqi <= 150 ? 'Waspada' : 'Hindari',
      statusEn: safeAqi <= 100 && safeTemp <= 32 ? 'Ideal' : safeAqi <= 150 ? 'Caution' : 'Avoid',
      color: safeAqi <= 100 && safeTemp <= 32 ? '#10b981' : safeAqi <= 150 ? '#f59e0b' : '#ef4444'
    },
    cycling: {
      status: safeAqi <= 100 && safeUv <= 7 ? 'Ideal' : safeAqi <= 150 ? 'Waspada' : 'Hindari',
      statusEn: safeAqi <= 100 && safeUv <= 7 ? 'Ideal' : safeAqi <= 150 ? 'Caution' : 'Avoid',
      color: safeAqi <= 100 && safeUv <= 7 ? '#10b981' : safeAqi <= 150 ? '#f59e0b' : '#ef4444'
    },
    kidsAndSeniors: {
      status: safeAqi <= 50 ? 'Aman' : safeAqi <= 100 ? 'Batasi' : 'Di Dalam Ruangan',
      statusEn: safeAqi <= 50 ? 'Safe' : safeAqi <= 100 ? 'Limit' : 'Stay Indoors',
      color: safeAqi <= 50 ? '#10b981' : safeAqi <= 100 ? '#f59e0b' : '#ef4444'
    },
    ventilation: {
      status: safeAqi <= 80 ? 'Buka Jendela' : 'Tutup Jendela',
      statusEn: safeAqi <= 80 ? 'Open Windows' : 'Close Windows',
      color: safeAqi <= 80 ? '#10b981' : '#ef4444'
    }
  };

  return {
    score: boundedScore,
    category,
    categoryEn,
    color,
    bg,
    cigs,
    activities
  };
}
