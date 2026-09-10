export const AQI_LEVELS = [
  { max: 50, label: 'Baik', color: '#2ea043', bg: 'rgba(46, 160, 67, 0.12)', advice: 'Kualitas udara sangat baik. Ideal untuk seluruh aktivitas luar ruangan.' },
  { max: 100, label: 'Sedang', color: '#d29922', bg: 'rgba(210, 153, 34, 0.12)', advice: 'Kualitas udara dapat diterima. Kelompok sangat sensitif perlu berhati-hati.' },
  { max: 150, label: 'Tidak Sehat (Sensitif)', color: '#db6d28', bg: 'rgba(219, 109, 40, 0.12)', advice: 'Kelompok rentan (anak, lansia, asma) sebaiknya mengurangi aktivitas fisik di luar.' },
  { max: 200, label: 'Tidak Sehat', color: '#f85149', bg: 'rgba(248, 81, 73, 0.12)', advice: 'Semua orang berisiko mengalami gangguan pernapasan. Gunakan masker saat di luar.' },
  { max: 300, label: 'Sangat Tidak Sehat', color: '#a371f7', bg: 'rgba(163, 113, 247, 0.12)', advice: 'Peringatan bahaya kesehatan. Hindari aktivitas luar ruangan sama sekali.' },
  { max: 500, label: 'Berbahaya', color: '#8b0000', bg: 'rgba(139, 0, 0, 0.15)', advice: 'Kondisi darurat kesehatan! Wajib berada di dalam ruangan dan nyalakan penjernih udara.' }
];

export function getAqiInfo(aqi) {
  const safeAqi = Math.max(0, Number(aqi) || 0);
  for (const level of AQI_LEVELS) {
    if (safeAqi <= level.max) {
      return {
        label: level.label,
        color: level.color,
        bg: level.bg,
        advice: level.advice
      };
    }
  }
  return {
    label: 'Berbahaya',
    color: '#8b0000',
    bg: 'rgba(139, 0, 0, 0.15)',
    advice: 'Kondisi darurat kesehatan! Wajib berada di dalam ruangan.'
  };
}

export function getUvInfo(uvIndex) {
  const val = Math.max(0, Math.round(Number(uvIndex) || 0));
  if (val <= 2) {
    return {
      value: val,
      label: 'Rendah (Aman)',
      color: '#10b981',
      advice: 'Tingkat bahaya sangat rendah. Aman beraktivitas di luar ruangan.'
    };
  } else if (val <= 5) {
    return {
      value: val,
      label: 'Sedang (Waspada)',
      color: '#eab308',
      advice: 'Gunakan tabir surya SPF 30+ dan kacamata hitam jika berada di bawah terik matahari.'
    };
  } else if (val <= 7) {
    return {
      value: val,
      label: 'Tinggi (Bahaya)',
      color: '#f97316',
      advice: 'Kurangi waktu di bawah sinar matahari antara pukul 10.00 hingga 16.00 WIB.'
    };
  } else if (val <= 10) {
    return {
      value: val,
      label: 'Sangat Tinggi',
      color: '#ef4444',
      advice: 'Risiko kerusakan kulit & mata sangat tinggi. Gunakan pelindung maksimal (topi, payung, sunscreen).'
    };
  }
  return {
    value: val,
    label: 'Ekstrem (Sangat Berbahaya)',
    color: '#8b5cf6',
    advice: 'Bahaya paparan radiasi matahari ekstrem! Hindari kontak langsung sinar matahari.'
  };
}

export function getEarthquakeColor(magnitude) {
  const mag = parseFloat(magnitude) || 0;
  if (mag < 5.0) return '#10b981';
  if (mag < 6.0) return '#f59e0b';
  if (mag < 7.0) return '#f97316';
  return '#ef4444';
}
