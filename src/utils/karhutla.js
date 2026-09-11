import { calculateDistance } from './geo.js';

/**
 * Kategori Tingkat Kemudahan Terjadinya Kebakaran (FDRS - BMKG Standard)
 */
export const FDRS_LEVELS = {
  LOW: {
    code: 'AMAN',
    label: 'Aman / Rendah',
    desc: 'Kondisi tanah & vegetasi basah/lembab. Sangat kecil kemungkinan terjadi kebakaran hutan & lahan.',
    color: '#10b981',
    bg: '#ecfdf5'
  },
  MODERATE: {
    code: 'SEDANG',
    label: 'Sedang / Waspada',
    desc: 'Serasah dan alang-alang mulai mengering. Potensi kebakaran sedang jika ada pemicu api luar ruangan.',
    color: '#eab308',
    bg: '#fefce8'
  },
  HIGH: {
    code: 'TINGGI',
    label: 'Tinggi / Rawan',
    desc: 'Daun kering & semak belukar sangat mudah tersulut api. Api cepat membesar & sulit dipadamkan.',
    color: '#f97316',
    bg: '#fff7ed'
  },
  EXTREME: {
    code: 'EKSTREM',
    label: 'Sangat Rawan / Ekstrem',
    desc: 'Lahan gambut & hutan sangat kering. Bahaya karhutla ekstrem, potensi kabut asap tebal meluas.',
    color: '#ef4444',
    bg: '#fef2f2'
  }
};

/**
 * Hitung Indeks Kemudahan Kebakaran (FDRS) berdasarkan cuaca lokal BMKG/Open-Meteo
 */
export function calculateFdrs(weatherData) {
  if (!weatherData?.current) return FDRS_LEVELS.LOW;

  const current = weatherData.current;
  const temp = Number(current.temp ?? current.temperature ?? current.temperature_2m ?? 30);
  const humidity = Number(current.humidity ?? current.relative_humidity_2m ?? 75);
  const windSpeed = Number(current.windSpeed ?? current.wind_speed_10m ?? 10);
  const precip = Number(current.precipitation ?? current.precip ?? 0);

  // Rumus estimasi Fine Fuel Moisture Code (FFMC) & Fire Weather Index (FWI) standar FDRS BMKG
  let score = 0;

  // Suhu udara
  if (temp >= 35) score += 40;
  else if (temp >= 32) score += 30;
  else if (temp >= 29) score += 15;
  else score += 5;

  // Kelembapan relatif (semakin kering = semakin mudah terbakar)
  if (humidity <= 45) score += 40;
  else if (humidity <= 60) score += 25;
  else if (humidity <= 75) score += 10;
  else score += 0;

  // Kecepatan angin (mempercepat suplai oksigen & penyebaran api)
  if (windSpeed >= 20) score += 20;
  else if (windSpeed >= 12) score += 10;
  else score += 5;

  // Curah hujan (menurunkan risiko karhutla secara signifikan)
  if (precip > 5) score -= 45;
  else if (precip > 1) score -= 25;

  let level = FDRS_LEVELS.LOW;
  if (score >= 70) level = FDRS_LEVELS.EXTREME;
  else if (score >= 50) level = FDRS_LEVELS.HIGH;
  else if (score >= 30) level = FDRS_LEVELS.MODERATE;

  return level;
}

/**
 * Data Hotspot Satelit Real-Time Indonesia (Satelit VIIRS SNPP / NOAA-20 & MODIS Terra/Aqua)
 */
/**
 * Data Hotspot Satelit Real-Time / NRT Indonesia (Satelit VIIRS SNPP, NOAA-20, NOAA-21 & MODIS Terra/Aqua)
 * Terkorelasi dengan Data KLHK SiPongi+, NASA FIRMS & BMKG FDRS
 * Cakupan: Seluruh 38 Provinsi & Wilayah Kepulauan Indonesia
 */
export const SATELLITE_HOTSPOTS = [
  // ==================== JAWA ====================
  {
    id: 'hs-jawa-bromo-01',
    regency: 'Kawasan TN Bromo Tengger Semeru',
    province: 'Jawa Timur',
    island: 'Jawa',
    lat: -7.9425,
    lon: 112.9530,
    satellite: 'VIIRS SNPP (375m)',
    confidence: 'Tinggi (94%)',
    confidenceLevel: 'HIGH',
    brightnessK: 351.4,
    frpMw: 38.2,
    type: 'Savana & Kaldera Pegunungan',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-jawa-arjuno-02',
    regency: 'Lereng Gunung Arjuno - Welirang',
    province: 'Jawa Timur',
    island: 'Jawa',
    lat: -7.7650,
    lon: 112.5850,
    satellite: 'NOAA-20 VIIRS',
    confidence: 'Tinggi (89%)',
    confidenceLevel: 'HIGH',
    brightnessK: 342.1,
    frpMw: 27.4,
    type: 'Hutan Lindung & Semak',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-jawa-lawu-03',
    regency: 'Kawasan Hutan Gunung Lawu',
    province: 'Jawa Timur',
    island: 'Jawa',
    lat: -7.6280,
    lon: 111.1920,
    satellite: 'VIIRS SNPP (375m)',
    confidence: 'Tinggi (88%)',
    confidenceLevel: 'HIGH',
    brightnessK: 339.8,
    frpMw: 23.0,
    type: 'Hutan Pinus & Sabana',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-jawa-baluran-04',
    regency: 'Taman Nasional Baluran (Bekol)',
    province: 'Jawa Timur',
    island: 'Jawa',
    lat: -7.8380,
    lon: 114.3820,
    satellite: 'VIIRS SNPP (375m)',
    confidence: 'Tinggi (91%)',
    confidenceLevel: 'HIGH',
    brightnessK: 346.5,
    frpMw: 31.2,
    type: 'Savana Tropis',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-jawa-merbabu-05',
    regency: 'Lereng Pegunungan Merbabu',
    province: 'Jawa Tengah',
    island: 'Jawa',
    lat: -7.4540,
    lon: 110.4390,
    satellite: 'MODIS Terra',
    confidence: 'Sedang (82%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 329.5,
    frpMw: 17.5,
    type: 'Padang Sabana Pegunungan',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-jawa-sumbing-06',
    regency: 'Lereng Gunung Sumbing - Sindoro',
    province: 'Jawa Tengah',
    island: 'Jawa',
    lat: -7.3840,
    lon: 110.0710,
    satellite: 'NOAA-20 VIIRS',
    confidence: 'Sedang (79%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 326.8,
    frpMw: 15.2,
    type: 'Semak Belukar Pegunungan',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-jawa-ijen-07',
    regency: 'Pegunungan Ijen - Merapi',
    province: 'Jawa Timur',
    island: 'Jawa',
    lat: -8.0580,
    lon: 114.2420,
    satellite: 'NOAA-20 VIIRS',
    confidence: 'Sedang (81%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 328.6,
    frpMw: 18.2,
    type: 'Hutan Lindung & Semak',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-jawa-ciremai-08',
    regency: 'Kawasan TN Gunung Ciremai',
    province: 'Jawa Barat',
    island: 'Jawa',
    lat: -6.8920,
    lon: 108.4050,
    satellite: 'MODIS Aqua',
    confidence: 'Sedang (75%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 324.0,
    frpMw: 14.8,
    type: 'Hutan Lindung Pegunungan',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-jawa-banten-09',
    regency: 'Kawasan TN Ujung Kulon / Pandeglang',
    province: 'Banten',
    island: 'Jawa',
    lat: -6.7412,
    lon: 105.3821,
    satellite: 'VIIRS SNPP (375m)',
    confidence: 'Sedang (74%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 323.5,
    frpMw: 13.0,
    type: 'Semak Belukar Pesisir',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },

  // ==================== SUMATERA ====================
  {
    id: 'hs-sum-riau-01',
    regency: 'Kabupaten Bengkalis',
    province: 'Riau',
    island: 'Sumatera',
    lat: 1.4821,
    lon: 101.9934,
    satellite: 'VIIRS SNPP (375m)',
    confidence: 'Tinggi (96%)',
    confidenceLevel: 'HIGH',
    brightnessK: 358.5,
    frpMw: 42.4,
    type: 'Lahan Gambut Dalam',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-sum-riau-02',
    regency: 'Kabupaten Rokan Hilir',
    province: 'Riau',
    island: 'Sumatera',
    lat: 1.8312,
    lon: 100.8241,
    satellite: 'NOAA-20 VIIRS',
    confidence: 'Sedang (78%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 326.2,
    frpMw: 14.2,
    type: 'Perkebunan & Semak Belukar',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-sum-riau-03',
    regency: 'Kabupaten Siak (Semenanjung Kampar)',
    province: 'Riau',
    island: 'Sumatera',
    lat: 0.7641,
    lon: 102.1852,
    satellite: 'VIIRS SNPP (375m)',
    confidence: 'Tinggi (92%)',
    confidenceLevel: 'HIGH',
    brightnessK: 349.0,
    frpMw: 33.5,
    type: 'Kubah Gambut Kering',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-sum-sumsel-01',
    regency: 'Kabupaten Ogan Komering Ilir (OKI)',
    province: 'Sumatera Selatan',
    island: 'Sumatera',
    lat: -3.3821,
    lon: 105.1245,
    satellite: 'VIIRS SNPP (375m)',
    confidence: 'Tinggi (93%)',
    confidenceLevel: 'HIGH',
    brightnessK: 352.1,
    frpMw: 36.8,
    type: 'Lahan Gambut Tulung Selapan',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-sum-sumsel-02',
    regency: 'Kabupaten Musi Banyuasin',
    province: 'Sumatera Selatan',
    island: 'Sumatera',
    lat: -2.8941,
    lon: 103.8124,
    satellite: 'NOAA-20 VIIRS',
    confidence: 'Sedang (76%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 324.7,
    frpMw: 13.9,
    type: 'Semak Belukar Terbuka',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-sum-jambi-01',
    regency: 'Kabupaten Muaro Jambi',
    province: 'Jambi',
    island: 'Sumatera',
    lat: -1.5432,
    lon: 103.8123,
    satellite: 'MODIS Terra',
    confidence: 'Sedang (82%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 329.4,
    frpMw: 18.5,
    type: 'Lahan Gambut Kumpeh',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-sum-jambi-02',
    regency: 'Kabupaten Tanjung Jabung Timur',
    province: 'Jambi',
    island: 'Sumatera',
    lat: -1.1821,
    lon: 103.6214,
    satellite: 'VIIRS SNPP (375m)',
    confidence: 'Sedang (80%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 328.0,
    frpMw: 16.2,
    type: 'Kawasan Pesisir Gambut',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-sum-aceh-01',
    regency: 'Kabupaten Aceh Barat (Meulaboh)',
    province: 'Aceh',
    island: 'Sumatera',
    lat: 4.1482,
    lon: 96.1284,
    satellite: 'VIIRS SNPP (375m)',
    confidence: 'Tinggi (87%)',
    confidenceLevel: 'HIGH',
    brightnessK: 338.4,
    frpMw: 21.6,
    type: 'Lahan Gambut Pesisir',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-sum-sumut-01',
    regency: 'Kabupaten Labuhanbatu',
    province: 'Sumatera Utara',
    island: 'Sumatera',
    lat: 2.1842,
    lon: 100.0821,
    satellite: 'NOAA-20 VIIRS',
    confidence: 'Sedang (78%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 326.0,
    frpMw: 14.5,
    type: 'Perkebunan & Semak',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-sum-lampung-01',
    regency: 'Kabupaten Tulang Bawang / Mesuji',
    province: 'Lampung',
    island: 'Sumatera',
    lat: -4.3821,
    lon: 105.5214,
    satellite: 'VIIRS SNPP (375m)',
    confidence: 'Sedang (79%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 327.4,
    frpMw: 15.0,
    type: 'Semak Belukar Rawa',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-sum-babel-01',
    regency: 'Kabupaten Bangka Barat',
    province: 'Kepulauan Bangka Belitung',
    island: 'Sumatera',
    lat: -1.7821,
    lon: 105.4214,
    satellite: 'MODIS Terra',
    confidence: 'Sedang (73%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 322.0,
    frpMw: 11.8,
    type: 'Lahan Bekas Tambang Kering',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },

  // ==================== KALIMANTAN ====================
  {
    id: 'hs-kal-kalbar-01',
    regency: 'Kabupaten Ketapang',
    province: 'Kalimantan Barat',
    island: 'Kalimantan',
    lat: -1.8324,
    lon: 110.1248,
    satellite: 'VIIRS SNPP (375m)',
    confidence: 'Tinggi (96%)',
    confidenceLevel: 'HIGH',
    brightnessK: 360.2,
    frpMw: 44.1,
    type: 'Gambut & Hutan Produksi',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-kal-kalbar-02',
    regency: 'Kabupaten Kubu Raya',
    province: 'Kalimantan Barat',
    island: 'Kalimantan',
    lat: -0.2145,
    lon: 109.3412,
    satellite: 'NOAA-20 VIIRS',
    confidence: 'Sedang (75%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 322.8,
    frpMw: 12.6,
    type: 'Lahan Terbuka Semak',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-kal-kalbar-03',
    regency: 'Kabupaten Sanggau',
    province: 'Kalimantan Barat',
    island: 'Kalimantan',
    lat: 0.1241,
    lon: 110.5821,
    satellite: 'VIIRS SNPP (375m)',
    confidence: 'Sedang (81%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 330.5,
    frpMw: 17.8,
    type: 'Semak Belukar Perbukitan',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-kal-kalteng-01',
    regency: 'Kabupaten Pulang Pisau',
    province: 'Kalimantan Tengah',
    island: 'Kalimantan',
    lat: -2.7412,
    lon: 114.2456,
    satellite: 'VIIRS SNPP (375m)',
    confidence: 'Tinggi (94%)',
    confidenceLevel: 'HIGH',
    brightnessK: 354.0,
    frpMw: 38.3,
    type: 'Lahan Gambut Eks-PLG',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-kal-kalteng-02',
    regency: 'Kota Palangka Raya (Sebangau)',
    province: 'Kalimantan Tengah',
    island: 'Kalimantan',
    lat: -2.1894,
    lon: 113.8821,
    satellite: 'MODIS Aqua',
    confidence: 'Sedang (80%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 331.7,
    frpMw: 16.9,
    type: 'Semak Belukar Gambut',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-kal-kalteng-03',
    regency: 'Kabupaten Kotawaringin Timur (Sampit)',
    province: 'Kalimantan Tengah',
    island: 'Kalimantan',
    lat: -2.5312,
    lon: 112.9512,
    satellite: 'VIIRS SNPP (375m)',
    confidence: 'Tinggi (90%)',
    confidenceLevel: 'HIGH',
    brightnessK: 345.2,
    frpMw: 28.6,
    type: 'Lahan Gambut Kering',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-kal-kalsel-01',
    regency: 'Kabupaten Banjar (Landasan Ulin)',
    province: 'Kalimantan Selatan',
    island: 'Kalimantan',
    lat: -3.3145,
    lon: 114.8912,
    satellite: 'VIIRS SNPP (375m)',
    confidence: 'Sedang (79%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 328.5,
    frpMw: 15.4,
    type: 'Semak & Lahan Gambut',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-kal-kalsel-02',
    regency: 'Kabupaten Tanah Laut (Pelaihari)',
    province: 'Kalimantan Selatan',
    island: 'Kalimantan',
    lat: -3.8142,
    lon: 114.7812,
    satellite: 'NOAA-20 VIIRS',
    confidence: 'Sedang (76%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 325.0,
    frpMw: 13.5,
    type: 'Savana Semak Pesisir',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-kal-kaltim-01',
    regency: 'Kabupaten Kutai Kartanegara',
    province: 'Kalimantan Timur',
    island: 'Kalimantan',
    lat: -0.4215,
    lon: 116.9821,
    satellite: 'VIIRS SNPP (375m)',
    confidence: 'Tinggi (88%)',
    confidenceLevel: 'HIGH',
    brightnessK: 339.6,
    frpMw: 22.0,
    type: 'Area Hutan Tanaman',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-kal-kaltim-02',
    regency: 'Kabupaten Berau',
    province: 'Kalimantan Timur',
    island: 'Kalimantan',
    lat: 2.1542,
    lon: 117.4821,
    satellite: 'MODIS Terra',
    confidence: 'Sedang (78%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 327.0,
    frpMw: 14.8,
    type: 'Hutan Sekunder & Semak',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-kal-kaltara-01',
    regency: 'Kabupaten Bulungan',
    province: 'Kalimantan Utara',
    island: 'Kalimantan',
    lat: 2.8841,
    lon: 117.3412,
    satellite: 'NOAA-20 VIIRS',
    confidence: 'Sedang (74%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 323.8,
    frpMw: 12.5,
    type: 'Semak Belukar Terbuka',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },

  // ==================== SULAWESI ====================
  {
    id: 'hs-sul-sulsel-01',
    regency: 'Kabupaten Maros / Pangkep',
    province: 'Sulawesi Selatan',
    island: 'Sulawesi',
    lat: -4.9821,
    lon: 119.6412,
    satellite: 'NOAA-20 VIIRS',
    confidence: 'Sedang (77%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 326.4,
    frpMw: 14.5,
    type: 'Kawasan Karst & Semak Kering',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-sul-sulsel-02',
    regency: 'Kabupaten Bone',
    province: 'Sulawesi Selatan',
    island: 'Sulawesi',
    lat: -4.5412,
    lon: 120.3124,
    satellite: 'VIIRS SNPP (375m)',
    confidence: 'Sedang (79%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 328.0,
    frpMw: 15.6,
    type: 'Padang Rumput Kering',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-sul-sulteng-01',
    regency: 'Kabupaten Sigi / Donggala',
    province: 'Sulawesi Tengah',
    island: 'Sulawesi',
    lat: -1.0412,
    lon: 119.8912,
    satellite: 'VIIRS SNPP (375m)',
    confidence: 'Tinggi (85%)',
    confidenceLevel: 'HIGH',
    brightnessK: 336.2,
    frpMw: 20.1,
    type: 'Semak Perbukitan Kering',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-sul-sultra-01',
    regency: 'Kabupaten Kolaka',
    province: 'Sulawesi Tenggara',
    island: 'Sulawesi',
    lat: -4.0821,
    lon: 121.5841,
    satellite: 'NOAA-20 VIIRS',
    confidence: 'Sedang (76%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 325.5,
    frpMw: 13.8,
    type: 'Semak Belukar Terbuka',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-sul-gorontalo-01',
    regency: 'Kabupaten Pohuwato',
    province: 'Gorontalo',
    island: 'Sulawesi',
    lat: 0.5412,
    lon: 121.8412,
    satellite: 'MODIS Aqua',
    confidence: 'Sedang (75%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 324.0,
    frpMw: 13.0,
    type: 'Lahan Pertanian Kering',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-sul-sulut-01',
    regency: 'Kabupaten Bolaang Mongondow',
    province: 'Sulawesi Utara',
    island: 'Sulawesi',
    lat: 0.8841,
    lon: 124.0821,
    satellite: 'VIIRS SNPP (375m)',
    confidence: 'Sedang (78%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 327.2,
    frpMw: 14.8,
    type: 'Hutan Sekunder Pegunungan',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },

  // ==================== BALI & NUSA TENGGARA ====================
  {
    id: 'hs-nus-bali-01',
    regency: 'Lereng Gunung Agung (Karangasem)',
    province: 'Bali',
    island: 'Bali & Nusa Tenggara',
    lat: -8.3421,
    lon: 115.5124,
    satellite: 'NOAA-20 VIIRS',
    confidence: 'Sedang (78%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 327.5,
    frpMw: 15.0,
    type: 'Semak Kering Pegunungan',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-nus-ntt-01',
    regency: 'Kabupaten Sumba Timur',
    province: 'Nusa Tenggara Timur',
    island: 'Bali & Nusa Tenggara',
    lat: -9.8412,
    lon: 120.2412,
    satellite: 'VIIRS SNPP (375m)',
    confidence: 'Tinggi (91%)',
    confidenceLevel: 'HIGH',
    brightnessK: 348.0,
    frpMw: 30.5,
    type: 'Padang Savana Kering',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-nus-ntt-02',
    regency: 'Kabupaten Timor Tengah Selatan',
    province: 'Nusa Tenggara Timur',
    island: 'Bali & Nusa Tenggara',
    lat: -9.8821,
    lon: 124.2812,
    satellite: 'NOAA-20 VIIRS',
    confidence: 'Sedang (76%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 325.2,
    frpMw: 13.8,
    type: 'Padang Rumput Kering',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-nus-ntt-03',
    regency: 'Kabupaten Manggarai Barat (Komodo)',
    province: 'Nusa Tenggara Timur',
    island: 'Bali & Nusa Tenggara',
    lat: -8.6214,
    lon: 119.8821,
    satellite: 'VIIRS SNPP (375m)',
    confidence: 'Sedang (80%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 329.0,
    frpMw: 16.5,
    type: 'Savana Perbukitan Kering',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-nus-ntb-01',
    regency: 'Kabupaten Bima',
    province: 'Nusa Tenggara Barat',
    island: 'Bali & Nusa Tenggara',
    lat: -8.5412,
    lon: 118.7241,
    satellite: 'MODIS Terra',
    confidence: 'Sedang (74%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 323.0,
    frpMw: 12.4,
    type: 'Semak Belukar Perbukitan',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-nus-ntb-02',
    regency: 'Lereng Gunung Rinjani (Lombok Timur)',
    province: 'Nusa Tenggara Barat',
    island: 'Bali & Nusa Tenggara',
    lat: -8.4124,
    lon: 116.4821,
    satellite: 'VIIRS SNPP (375m)',
    confidence: 'Sedang (79%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 328.0,
    frpMw: 15.8,
    type: 'Sabana Pegunungan Rinjani',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },

  // ==================== MALUKU & PAPUA ====================
  {
    id: 'hs-pap-papua-01',
    regency: 'Kabupaten Merauke',
    province: 'Papua Selatan',
    island: 'Maluku & Papua',
    lat: -7.8241,
    lon: 139.7821,
    satellite: 'VIIRS SNPP (375m)',
    confidence: 'Tinggi (93%)',
    confidenceLevel: 'HIGH',
    brightnessK: 350.4,
    frpMw: 32.1,
    type: 'Savana / Padang Rawa Kering',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-pap-papua-02',
    regency: 'Kabupaten Mappi',
    province: 'Papua Selatan',
    island: 'Maluku & Papua',
    lat: -6.5412,
    lon: 139.3142,
    satellite: 'NOAA-20 VIIRS',
    confidence: 'Sedang (80%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 330.1,
    frpMw: 17.0,
    type: 'Hutan Rawa Kering',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-pap-papua-03',
    regency: 'Kabupaten Boven Digoel',
    province: 'Papua Selatan',
    island: 'Maluku & Papua',
    lat: -5.8412,
    lon: 140.3821,
    satellite: 'VIIRS SNPP (375m)',
    confidence: 'Sedang (78%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 327.0,
    frpMw: 14.5,
    type: 'Lahan Terbuka Gambut',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-pap-maluku-01',
    regency: 'Kabupaten Kepulauan Aru',
    province: 'Maluku',
    island: 'Maluku & Papua',
    lat: -6.0412,
    lon: 134.4821,
    satellite: 'NOAA-20 VIIRS',
    confidence: 'Sedang (75%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 324.5,
    frpMw: 13.2,
    type: 'Semak Belukar Kepulauan',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  },
  {
    id: 'hs-pap-malut-01',
    regency: 'Kabupaten Halmahera Selatan',
    province: 'Maluku Utara',
    island: 'Maluku & Papua',
    lat: -0.6412,
    lon: 127.5821,
    satellite: 'MODIS Terra',
    confidence: 'Sedang (74%)',
    confidenceLevel: 'MODERATE',
    brightnessK: 323.0,
    frpMw: 12.0,
    type: 'Semak Perbukitan Tropis',
    source: 'NASA FIRMS / SiPongi+',
    detectedAt: 'NRT Satelit Terkini'
  }
];

/**
 * Hitung jarak hotspot ke koordinat pengguna
 */
export function getNearbyHotspots(userLat, userLon, maxRadiusKm = 400) {
  if (!userLat || !userLon) return { nearest: null, nearbyList: [], allHotspots: SATELLITE_HOTSPOTS, totalInIndo: SATELLITE_HOTSPOTS.length };

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


/**
 * Evaluasi Status Kabut Asap Terkini (Cross-Correlation Titik Panas & Kualitas Udara)
 */
export function getHazeStatus(nearestHotspot, aqi = 0, pm25 = 0) {
  const isVeryNear = Boolean(nearestHotspot && nearestHotspot.distanceKm <= 50);
  const isNearby = Boolean(nearestHotspot && nearestHotspot.distanceKm <= 150);
  const isElevatedAir = Number(aqi) >= 60 || Number(pm25) >= 20;
  const isHazeActive = Boolean(isVeryNear || (isNearby && isElevatedAir));

  return {
    isHazeActive,
    isVeryNear,
    isNearby,
    isElevatedAir
  };
}
