export const translations = {
  // Navigation & Header
  appName: 'Sekitarku',
  appTagline: 'Pantauan Lingkungan & Mitigasi Bencana Real-Time',
  searchCity: 'Cari kota atau lokasi...',
  useGps: 'Gunakan Lokasi Saat Ini',
  gpsActive: 'Menggunakan GPS',
  refresh: 'Segarkan Data',
  lastUpdated: 'Terakhir diperbarui',
  offlineMode: 'Mode Offline (Menampilkan data cache)',
  installApp: 'Pasang Aplikasi',

  // AQI Card
  aqiTitle: 'Indeks Kualitas Udara',
  aqiGood: 'Baik',
  aqiModerate: 'Sedang',
  aqiUnhealthySensitive: 'Tidak Sehat bagi Kelompok Sensitif',
  aqiUnhealthy: 'Tidak Sehat',
  aqiVeryUnhealthy: 'Sangat Tidak Sehat',
  aqiHazardous: 'Berbahaya',
  pm25: 'PM2.5',
  pm10: 'PM10',
  co: 'Karbon Monoksida (CO)',
  no2: 'Nitrogen Dioksida (NO2)',
  o3: 'Ozon (O3)',
  so2: 'Sulfur Dioksida (SO2)',
  healthAdvice: 'Saran Kesehatan',
  cigsEquivalent: 'Setara menghisap',
  cigsPerDay: 'batang rokok/hari',
  dominantPollutant: 'Polutan Utama',

  // Weather Card
  weatherTitle: 'Cuaca & Atmosfer',
  temperature: 'Suhu',
  feelsLike: 'Terasa Seperti',
  humidity: 'Kelembaban Udara',
  windSpeed: 'Kecepatan Angin',
  windDirection: 'Arah Angin',
  pressure: 'Tekanan Udara',
  uvIndex: 'Indeks UV',
  uvLow: 'Rendah (Aman)',
  uvModerate: 'Sedang (Gunakan Tabir Surya)',
  uvHigh: 'Tinggi (Hindari Paparan Terik)',
  uvVeryHigh: 'Sangat Tinggi (Bahaya)',
  uvExtreme: 'Ekstrem (Sangat Berbahaya)',
  visibility: 'Jarak Pandang',

  // Earthquake Card
  quakeTitle: 'Aktivitas Seismik & Gempa',
  latestQuake: 'Gempa Terkini',
  magnitude: 'Magnitudo',
  depth: 'Kedalaman',
  epicenter: 'Pusat Gempa',
  tsunamiPotential: 'Potensi Tsunami',
  feltQuakes: 'Gempa Dirasakan Terbaru',
  quakeDistance: 'Jarak dari lokasi Anda',
  potensiTsunami: 'Berpotensi Tsunami',
  tidakPotensiTsunami: 'Tidak Berpotensi Tsunami',

  // Karhutla & Forest Fire Card
  karhutlaTitle: 'Indeks Kebakaran Hutan & Lahan',
  hotspotsNearby: 'Titik Panas Satelit (400 km)',
  activeHotspots: 'Titik Panas Terdeteksi',
  satelliteSource: 'Sumber Satelit: NASA FIRMS (VIIRS & MODIS)',
  fdrsIndex: 'Tingkat Kerawanan FDRS',
  fdrsLow: 'Rendah (Aman)',
  fdrsModerate: 'Sedang (Waspada)',
  fdrsHigh: 'Tinggi (Rawan Terbakar)',
  fdrsExtreme: 'Ekstrem (Sangat Rawan)',
  hazeStatus: 'Status Kabut Asap',
  hazeActive: 'Terpapar Kabut Asap',
  hazeNone: 'Udara Bebas Asap',
  viewKarhutlaList: 'Lihat Daftar Karhutla',

  // Volcano Card
  volcanoTitle: 'Aktivitas Gunung Api',
  activeVolcanoes: 'Gunung Api Aktif',
  nearestVolcano: 'Gunung Api Terdekat',
  dangerRadius: 'Radius Bahaya',
  volcanoStatus: 'Status Erupsi',
  levelNormal: 'Level I (Normal)',
  levelWaspada: 'Level II (Waspada)',
  levelSiaga: 'Level III (Siaga)',
  levelAwas: 'Level IV (Awas)',
  viewVolcanoList: 'Lihat Semua Gunung Api',

  // Forecast & Charts
  forecastTitle: 'Prakiraan Cuaca 7 Hari',
  chartAqiTitle: 'Tren Kualitas Udara 24 Jam',
  chartTempTitle: 'Tren Suhu 24 Jam',

  // Map
  mapTitle: 'Peta Pemantauan Lingkungan Indonesia',
  mapSubtitle: 'Peta sebaran lingkungan real-time: Kualitas Udara, Seismik Gempa, Erupsi PVMBG & Karhutla Satelit',
  legend: 'Legenda Peta',

  // Common & Action Buttons
  shareCard: 'Bagikan Kartu Kondisi',
  emergencyGuide: 'Panduan Darurat',
  embedWidget: 'Pasang Widget',
  aboutApp: 'Tentang Aplikasi',
  close: 'Tutup',
  loading: 'Memuat data lingkungan...',
  errorLoading: 'Gagal memuat sebagian data. Silakan coba lagi.',
  retry: 'Coba Lagi',
  shareBtn: 'Bagikan Gambar',
  downloadBtn: 'Unduh PNG',
  copied: 'Tautan disalin ke papan klip!',
  shareStoryText: 'Bagikan ringkasan visual kualitas udara, cuaca, gempa, dan karhutla terkini.'
};

// Aliases for compatibility
export const i18n = translations;
export default translations;
