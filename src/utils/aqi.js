export const AQI_LEVELS = [
  { max: 50, label: 'Baik', labelEn: 'Good', color: '#2ea043', bg: 'rgba(46, 160, 67, 0.12)', advice: 'Kualitas udara sangat baik. Ideal untuk seluruh aktivitas luar ruangan.', adviceEn: 'Air quality is satisfactory and poses little or no risk.' },
  { max: 100, label: 'Sedang', labelEn: 'Moderate', color: '#d29922', bg: 'rgba(210, 153, 34, 0.12)', advice: 'Kualitas udara dapat diterima. Kelompok sangat sensitif perlu berhati-hati.', adviceEn: 'Air quality is acceptable for most people.' },
  { max: 150, label: 'Tidak Sehat (Sensitif)', labelEn: 'Unhealthy for Sensitive', color: '#db6d28', bg: 'rgba(219, 109, 40, 0.12)', advice: 'Kelompok rentan (anak, lansia, asma) sebaiknya mengurangi aktivitas fisik di luar.', adviceEn: 'Sensitive groups should reduce strenuous outdoor exertion.' },
  { max: 200, label: 'Tidak Sehat', labelEn: 'Unhealthy', color: '#f85149', bg: 'rgba(248, 81, 73, 0.12)', advice: 'Gunakan masker saat keluar ruangan. Hindari olahraga berat di luar.', adviceEn: 'Everyone should begin limiting prolonged outdoor exertion.' },
  { max: 300, label: 'Sangat Tidak Sehat', labelEn: 'Very Unhealthy', color: '#bc8cff', bg: 'rgba(188, 140, 255, 0.12)', advice: 'Peringatan darurat kesehatan. Seluruh populasi disarankan tetap di dalam ruangan.', adviceEn: 'Health emergency alert. Everyone is likely to be affected.' },
  { max: Infinity, label: 'Berbahaya', labelEn: 'Hazardous', color: '#8b1827', bg: 'rgba(139, 24, 39, 0.18)', advice: 'Kondisi udara darurat berbahaya. Hindari segala aktivitas luar ruangan.', adviceEn: 'Health warning of emergency conditions. Avoid all outdoor activity.' }
];

export function getAqiInfo(aqiValue, lang = 'id') {
  const val = Number(aqiValue) || 0;
  const level = AQI_LEVELS.find(l => val <= l.max) || AQI_LEVELS[AQI_LEVELS.length - 1];
  return {
    value: val,
    label: lang === 'en' ? level.labelEn : level.label,
    color: level.color,
    bg: level.bg,
    advice: lang === 'en' ? level.adviceEn : level.advice
  };
}

export function getUvInfo(uvIndex, lang = 'id') {
  const uv = Number(uvIndex) || 0;
  if (uv < 3) {
    return { value: uv, label: lang === 'en' ? 'Low' : 'Rendah', color: '#2ea043', advice: lang === 'en' ? 'Safe to stay outdoors with standard protection.' : 'Aman berada di luar tanpa perlindungan khusus.' };
  } else if (uv < 6) {
    return { value: uv, label: lang === 'en' ? 'Moderate' : 'Sedang', color: '#d29922', advice: lang === 'en' ? 'Wear sunglasses and apply sunscreen during midday.' : 'Gunakan tabir surya (sunscreen) jika berada di terik matahari.' };
  } else if (uv < 8) {
    return { value: uv, label: lang === 'en' ? 'High' : 'Tinggi', color: '#db6d28', advice: lang === 'en' ? 'Reduce exposure during peak hours (10:00 - 16:00).' : 'Kurangi waktu di bawah matahari langsung pukul 10:00 - 16:00.' };
  } else if (uv < 11) {
    return { value: uv, label: lang === 'en' ? 'Very High' : 'Sangat Tinggi', color: '#f85149', advice: lang === 'en' ? 'Extra protection needed: SPF 30+, hat, and shade.' : 'Perlindungan ekstra: tabir surya SPF 30+, topi, baju tertutup.' };
  } else {
    return { value: uv, label: lang === 'en' ? 'Extreme' : 'Ekstrem', color: '#bc8cff', advice: lang === 'en' ? 'Take all precautions. Skin and eyes can burn rapidly.' : 'Hindari paparan sinar langsung, kulit rentan terbakar cepat.' };
  }
}

export function getEarthquakeColor(magnitude) {
  const mag = parseFloat(magnitude) || 0;
  if (mag < 4.0) return '#2ea043';
  if (mag < 5.0) return '#58a6ff';
  if (mag < 6.0) return '#d29922';
  if (mag < 7.0) return '#db6d28';
  return '#f85149';
}
