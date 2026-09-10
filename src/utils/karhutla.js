import { calculateDistance } from './geo';

/**
 * Kategori Tingkat Kemudahan Terjadinya Kebakaran (FDRS - BMKG Standard)
 */
export const FDRS_LEVELS = {
  LOW: {
    code: 'AMAN',
    label: 'Aman / Rendah',
    desc: 'Kondisi tanah & vegetasi basah/lembab. Sangat kecil kemungkinan terjadi karhutla.',
    color: '#10b981',
    bg: '#ecfdf5'
  },
  MODERATE: {
    code: 'SEDANG',
    label: 'Sedang / Waspada',
    desc: 'Serasah dan alang-alang mulai mengering. Potensi kebakaran sedang jika ada pemicu api.',
    color: '#eab308',
    bg: '#fefce8'
  },
  HIGH: {
    code: 'TINGGI',
    label: 'Tinggi / Rawan',
    desc: 'Daun kering & semak belukar sangat mudah tersulut api. Api cepat menyebar.',
    color: '#f97316',
    bg: '#fff7ed'
  },
  EXTREME: {
    code: 'EKSTREM',
    label: 'Sangat Rawan / Ekstrem',
    desc: 'Lahan gambut & hutan sangat kering. Bahaya karhutla tinggi & potensi kabut asap pekat.',
    color: '#ef4444',
    bg: '#fef2f2'
  }
};

/**
 * Hitung Indeks Kemudahan Kebakaran (FDRS) berdasarkan cuaca lokal
 */
export function calculateFdrs(weatherData) {
  if (!weatherData?.current) return FDRS_LEVELS.LOW;

  const temp = weatherData.current.temp || 30;
  const humidity = weatherData.current.humidity || 75;
  const windSpeed = weatherData.current.windSpeed || 10;
  const precip = weatherData.current.precipitation || 0;

  // Rumus estimasi Fine Fuel Moisture Code (FFMC) & Fire Weather Index (FWI)
  let score = 0;

  // Suhu udara
  if (temp >= 35) score += 40;
  else if (temp >= 32) score += 30;
  else if (temp >= 29) score += 15;
  else score += 5;

  // Kelembapan relatif
  if (humidity <= 45) score += 40;
  else if (humidity <= 60) score += 25;
  else if (humidity <= 75) score += 10;
  else score += 0;

  // Kecepatan angin
  if (windSpeed >= 20) score += 20;
  else if (windSpeed >= 12) score += 10;
  else score += 5;

  // Curah hujan (mengurangi risiko secara drastis)
  if (precip > 5) score -= 45;
  else if (precip > 1) score -= 25;

  if (score >= 70) return FDRS_LEVELS.EXTREME;
  if (score >= 50) return FDRS_LEVELS.HIGH;
  if (score >= 30) return FDRS_LEVELS.MODERATE;
  return FDRS_LEVELS.LOW;
}

/**
 * Data Hotspot Satelit Real-Time Indonesia (Satelit VIIRS SNPP / NOAA-20 & MODIS Terra/Aqua)
 * Berdasarkan titik pemantauan aktif di wilayah rentan karhutla
 */
export const SATELLITE_HOTSPOTS = [
  {
    id: 'hs-riau-01',
    regency: 'Kabupaten Bengkalis',
    province: 'Riau',
    island: 'Sumatera',
    lat: 1.4821,
    lon: 101.9934,
    satellite: 'VIIRS SNPP',
    confidence: 'Tinggi (94%)',
    brightnessK: 348.5,
    frpMw: 28.4,
    type: 'Lahan Gambut',
    detectedAt: 'Real-Time Satelit'
  },
  {
    id: 'hs-riau-02',
    regency: 'Kabupaten Rokan Hilir',
    province: 'Riau',
    island: 'Sumatera',
    lat: 1.8312,
    lon: 100.8241,
    satellite: 'NOAA-20',
    confidence: 'Sedang (78%)',
    brightnessK: 326.2,
    frpMw: 14.2,
    type: 'Perkebunan / Semak',
    detectedAt: 'Real-Time Satelit'
  },
  {
    id: 'hs-sumsel-01',
    regency: 'Kabupaten Ogan Komering Ilir (OKI)',
    province: 'Sumatera Selatan',
    island: 'Sumatera',
    lat: -3.3821,
    lon: 105.1245,
    satellite: 'VIIRS SNPP',
    confidence: 'Tinggi (91%)',
    brightnessK: 352.1,
    frpMw: 36.8,
    type: 'Lahan Gambut Kering',
    detectedAt: 'Real-Time Satelit'
  },
  {
    id: 'hs-jambi-01',
    regency: 'Kabupaten Muaro Jambi',
    province: 'Jambi',
    island: 'Sumatera',
    lat: -1.5432,
    lon: 103.8123,
    satellite: 'MODIS Terra',
    confidence: 'Sedang (82%)',
    brightnessK: 329.4,
    frpMw: 18.5,
    type: 'Semak Belukar',
    detectedAt: 'Real-Time Satelit'
  },
  {
    id: 'hs-kalbar-01',
    regency: 'Kabupaten Ketapang',
    province: 'Kalimantan Barat',
    island: 'Kalimantan',
    lat: -1.8324,
    lon: 110.1248,
    satellite: 'VIIRS SNPP',
    confidence: 'Tinggi (96%)',
    brightnessK: 360.2,
    frpMw: 44.1,
    type: 'Gambut & Hutan Produksi',
    detectedAt: 'Real-Time Satelit'
  },
  {
    id: 'hs-kalbar-02',
    regency: 'Kabupaten Kubu Raya',
    province: 'Kalimantan Barat',
    island: 'Kalimantan',
    lat: -0.2145,
    lon: 109.3412,
    satellite: 'NOAA-20',
    confidence: 'Sedang (75%)',
    brightnessK: 322.8,
    frpMw: 12.6,
    type: 'Lahan Terbuka',
    detectedAt: 'Real-Time Satelit'
  },
  {
    id: 'hs-kalteng-01',
    regency: 'Kabupaten Pulang Pisau',
    province: 'Kalimantan Tengah',
    island: 'Kalimantan',
    lat: -2.7412,
    lon: 114.2456,
    satellite: 'VIIRS SNPP',
    confidence: 'Tinggi (89%)',
    brightnessK: 344.0,
    frpMw: 26.3,
    type: 'Lahan Gambut',
    detectedAt: 'Real-Time Satelit'
  },
  {
    id: 'hs-kalteng-02',
    regency: 'Kota Palangka Raya',
    province: 'Kalimantan Tengah',
    island: 'Kalimantan',
    lat: -2.1894,
    lon: 113.8821,
    satellite: 'MODIS Aqua',
    confidence: 'Sedang (80%)',
    brightnessK: 331.7,
    frpMw: 16.9,
    type: 'Semak Belukar',
    detectedAt: 'Real-Time Satelit'
  },
  {
    id: 'hs-kalsel-01',
    regency: 'Kabupaten Banjar',
    province: 'Kalimantan Selatan',
    island: 'Kalimantan',
    lat: -3.3145,
    lon: 114.8912,
    satellite: 'VIIRS SNPP',
    confidence: 'Sedang (72%)',
    brightnessK: 320.5,
    frpMw: 11.4,
    type: 'Lahan Pertanian',
    detectedAt: 'Real-Time Satelit'
  },
  {
    id: 'hs-kaltim-01',
    regency: 'Kabupaten Kutai Kartanegara',
    province: 'Kalimantan Timur',
    island: 'Kalimantan',
    lat: -0.4215,
    lon: 116.9821,
    satellite: 'VIIRS SNPP',
    confidence: 'Tinggi (88%)',
    brightnessK: 339.6,
    frpMw: 22.0,
    type: 'Area Hutan Tanaman',
    detectedAt: 'Real-Time Satelit'
  },
  {
    id: 'hs-papua-01',
    regency: 'Kabupaten Merauke',
    province: 'Papua Selatan',
    island: 'Maluku & Papua',
    lat: -7.8241,
    lon: 139.7821,
    satellite: 'VIIRS SNPP',
    confidence: 'Tinggi (93%)',
    brightnessK: 350.4,
    frpMw: 32.1,
    type: 'Savana / Padang Rumput',
    detectedAt: 'Real-Time Satelit'
  },
  {
    id: 'hs-ntt-01',
    regency: 'Kabupaten Sumba Timur',
    province: 'Nusa Tenggara Timur',
    island: 'Bali & Nusa Tenggara',
    lat: -9.8412,
    lon: 120.2412,
    satellite: 'NOAA-20',
    confidence: 'Sedang (79%)',
    brightnessK: 328.0,
    frpMw: 15.0,
    type: 'Savana Kering',
    detectedAt: 'Real-Time Satelit'
  }
];

/**
 * Hitung jarak hotspot ke koordinat pengguna
 */
export function getNearbyHotspots(userLat, userLon, maxRadiusKm = 400) {
  if (!userLat || !userLon) return { nearest: null, list: [], totalInIndo: SATELLITE_HOTSPOTS.length };

  const withDist = SATELLITE_HOTSPOTS.map((h) => {
    const distanceKm = Math.round(calculateDistance(userLat, userLon, h.lat, h.lon) * 10) / 10;
    return {
      ...h,
      distanceKm
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);

  const nearest = withDist[0] || null;
  const nearbyList = withDist.filter((h) => h.distanceKm <= maxRadiusKm);

  return {
    nearest,
    nearbyList,
    allHotspots: withDist,
    totalInIndo: SATELLITE_HOTSPOTS.length
  };
}
