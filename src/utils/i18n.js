/**
 * Sekitarku - Kamus Bahasa Indonesia Lengkap & Mandiri
 */
const dictionaryId = {
  // Navigation & Header
  appName: 'Sekitarku',
  appTitle: 'Sekitarku',
  appSubtitle: 'Pantauan Lingkungan Hidup & Mitigasi Bencana Real-Time',
  appTagline: 'Pantauan Lingkungan & Mitigasi Bencana Real-Time',
  liveBadge: 'DATA REAL-TIME',
  selectCity: 'Pilih Kota',
  searchCity: 'Cari kota atau lokasi...',
  gps: 'Lokasi Saya',
  useGps: 'Gunakan Lokasi Saat Ini',
  gpsActive: 'Menggunakan GPS',
  refresh: 'Segarkan Data',
  lastUpdated: 'Terakhir diperbarui',
  offlineMode: 'Mode Offline (Menampilkan data cache)',
  pwaInstall: 'Pasang Aplikasi',
  installApp: 'Pasang Aplikasi',
  share: 'Bagikan',
  emergency: 'Darurat 112',
  themeToggle: 'Tema',
  lightMode: 'Terang',
  darkMode: 'Gelap',
  notifyEnable: 'Notifikasi',
  notifyActive: 'Aktif',

  // Alerts
  alertAqiTitle: 'Peringatan Polusi Udara',
  alertAqiDesc: 'Kualitas udara saat ini tidak sehat. Disarankan memakai masker medis saat keluar ruangan.',
  alertQuakeTitle: 'Peringatan Gempa Terkini',

  // EcoHealth Card
  ecoTitle: 'Kondisi Lingkungan Hidup',
  ecoSubtitle: 'Indeks komposit kualitas udara, suhu panas, dan radiasi UV',
  ecoScoreTitle: 'SKOR KUALITAS LINGKUNGAN',
  exposure: 'Paparan',
  cigsUnit: 'batang rokok/hari',
  cleanAir: 'Udara Bersih',
  activitiesTitle: 'Kesiapan Aktivitas Luar',
  cigsEquiv: 'Perkiraan setara dengan',
  cigsEquivalent: 'Setara menghisap',
  cigsPerDay: 'batang rokok/hari',

  // Air Quality Card
  aqiTitle: 'Kualitas Udara',
  aqiSubtitle: 'Indeks Standar Pencemar Udara (ISPU & US-AQI)',
  mainParticulate: 'Partikulat PM2.5',
  standardLabel: 'Standar US-EPA & ISPU',
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
  dominantPollutant: 'Polutan Utama',

  // Weather Card
  weatherTitle: 'Cuaca & Iklim',
  weatherSubtitle: 'Kondisi atmosfer & kenyamanan termal saat ini',
  temperature: 'Suhu',
  feelsLike: 'Terasa Seperti',
  humidity: 'Kelembaban Udara',
  windSpeed: 'Kecepatan Angin',
  windDirection: 'Arah Angin',
  pressure: 'Tekanan Udara',
  visibility: 'Jarak Pandang',

  // UV Card
  uvTitle: 'Radiasi Sinar UV',
  uvSubtitle: 'Indeks Paparan Ultraviolet Global (WHO)',
  uvIndex: 'Indeks UV',
  uvLow: 'Rendah (Aman)',
  uvModerate: 'Sedang (Waspada)',
  uvHigh: 'Tinggi (Bahaya)',
  uvVeryHigh: 'Sangat Tinggi (Ekstrem)',
  uvExtreme: 'Ekstrem (Sangat Berbahaya)',
  uvAdviceLow: 'Paparan aman untuk aktivitas luar ruangan.',
  uvAdviceMod: 'Gunakan kacamata hitam atau topi pelindung jika terik.',
  uvAdviceHigh: 'Gunakan tabir surya (SPF 30+) dan cari tempat teduh.',
  uvAdviceExtreme: 'Hindari kontak langsung sinar matahari di tengah hari.',

  // Karhutla & Wildfire Card
  karhutlaTitle: 'Indeks Kebakaran Hutan & Lahan (Karhutla)',
  karhutlaSubtitle: 'Data FDRS BMKG · Satelit NASA FIRMS · Deteksi Kabut Asap Lintas Wilayah',
  karhutlaCardHeader: 'STATUS KARHUTLA & KABUT ASAP',
  hazeActiveBadge: '⚠️ Terdeteksi Paparan Asap',
  hazeCleanBadge: '🟢 Kabut Asap: Bersih / Aman',
  landLocalBadge: 'Lahan Setempat',
  nearestHotspotLabel: 'Titik Panas Terdekat',
  noHotspotsNearby: 'Tidak terdeteksi titik panas dalam radius 400 km.',
  landConditionTitle: 'Tingkat Kerawanan Kebakaran Lahan (FDRS)',
  fdrsExplExplanation: '*💡 Catatan: Status "Lahan Aman" berarti tanah & vegetasi setempat lembab dan aman dari kebakaran langsung, namun udara tetap dapat terpapar kabut asap kiriman dari titik api tetangga.',
  allHotspotsBtn: 'Lihat Semua Titik Panas',
  statusSafeTitle: 'AMAN',
  statusSafeMsg: 'Kondisi lahan setempat AMAN dan bebas dari paparan kabut asap karhutla.',
  hazeAlertMsg: '🚨 PERINGATAN KABUT ASAP: Udara terpapar asap kiriman dari titik api {regency} ({dist} km). Lahan setempat aman, namun gunakan masker N95 untuk pernapasan!',
  rawanAlertMsg: 'STATUS RAWAN: Vegetasi di wilayah setempat sangat kering & mudah terbakar.',
  waspadaAlertMsg: 'STATUS WASPADA: Semak & alang-alang mulai mengering. Hindari pembakaran sampah.',
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
  volcanoTitle: 'Aktivitas Gunung Api Terdekat',
  volcanoSubtitle: 'Data Resmi PVMBG · MAGMA Indonesia',
  volcanoDistance: 'Jarak',
  volcanoStatusLevel: 'Status',
  volcanoAllBtn: 'Semua Gunung Api',
  volcanoNormalMsg: 'Kondisi normal. Tidak ada aktivitas erupsi yang mengancam wilayah ini.',
  volcanoAlertMsg: 'Waspada peningkatan aktivitas vulkanik. Patuhi zona bahaya rekomendasi PVMBG.',
  activeVolcanoes: 'Gunung Api Aktif',
  nearestVolcano: 'Gunung Api Terdekat',
  dangerRadius: 'Radius Bahaya',
  volcanoStatus: 'Status Erupsi',
  levelNormal: 'Level I (Normal)',
  levelWaspada: 'Level II (Waspada)',
  levelSiaga: 'Level III (Siaga)',
  levelAwas: 'Level IV (Awas)',
  viewVolcanoList: 'Lihat Semua Gunung Api',

  // Earthquake Card
  quakeTitle: 'Aktivitas Seismik & Gempa BMKG',
  latestQuake: 'Gempa Terkini',
  magnitude: 'Magnitudo',
  depth: 'Kedalaman',
  epicenter: 'Pusat Gempa',
  tsunamiPotential: 'Potensi Tsunami',
  feltQuakes: 'Gempa Dirasakan Terbaru',
  quakeDistance: 'Jarak dari lokasi Anda',
  potensiTsunami: 'Berpotensi Tsunami',
  tidakPotensiTsunami: 'Tidak Berpotensi Tsunami',
  noTsunami: 'Tidak Berpotensi Tsunami',
  tsunamiAlert: 'Potensi Tsunami',
  recentQuakesBtn: 'Riwayat Gempa',
  closeQuakesBtn: 'Tutup Riwayat',

  // Forecast & Charts
  aqiTrend: 'Tren Kualitas Udara (24 Jam)',
  aqiTrendSubtitle: 'Riwayat fluktuasi per jam (ISPU & US-EPA)',
  forecast7Title: 'Prakiraan Cuaca 7 Hari',
  forecast7Subtitle: 'Proyeksi cuaca mingguan & potensi hujan',
  chartAqiTitle: 'Tren Kualitas Udara 24 Jam',
  chartTempTitle: 'Tren Suhu 24 Jam',
  metricAqi: 'Indeks AQI',
  metricPm25: 'Partikel PM2.5',
  avg24h: 'Rata-rata 24 Jam',
  peak24h: 'Puncak Tertinggi',
  clean24h: 'Waktu Terbersih',
  rainProb: 'Peluang Hujan',
  today: 'Hari Ini',
  tomorrow: 'Besok',

  // Map
  mapTitle: 'Peta Pantauan Nusantara',
  mapSubtitle: 'Stasiun pantau kualitas udara, gempa bumi BMKG & sebaran titik api satelit',
  legend: 'Legenda Peta',

  // Share Modal
  shareCard: 'Bagikan Kartu Kondisi',
  shareModalTitle: 'Bagikan Kondisi Lingkungan',
  shareModalSubtitle: 'Format Story HD (9:16) untuk WhatsApp & Instagram',
  shareBtn: 'Bagikan Gambar',
  downloadPngBtn: 'Unduh PNG',
  copyTextBtn: 'Salin Teks',
  copiedBtn: 'Tersalin!',
  shareSupportHint: 'Mendukung WhatsApp Status, Instagram Stories, Twitter/X, & aplikasi lainnya',
  shareStoryText: 'Bagikan ringkasan visual kualitas udara, cuaca, gempa, dan karhutla terkini.',

  // Footer & Common
  footerTitle: 'Sekitarku: Pantauan Lingkungan Hidup & Mitigasi Bencana Real-Time',
  footerSources: 'Sumber Data Resmi: BMKG (Meteorologi, Klimatologi & Geofisika), PVMBG / Magma Indonesia (Aktivitas Gunung Api), NASA FIRMS (Satelit Titik Panas Karhutla), dan Open-Meteo / Copernicus (Kualitas Udara ISPU & AQI).',
  treatCoffee: 'Traktir Kopi',
  embedWidget: 'Pasang Widget',
  repoLink: 'GitHub Repository',
  emergencyGuide: 'Panduan Darurat',
  aboutApp: 'Tentang Aplikasi',
  close: 'Tutup',
  loading: 'Memuat data lingkungan...',
  errorLoading: 'Gagal memuat sebagian data. Silakan coba lagi.',
  retry: 'Coba Lagi',
  copied: 'Tautan disalin ke papan klip!'
};

// Create a fail-safe proxy so missing keys return an empty string or the key itself instead of throwing undefined
export const translations = new Proxy(dictionaryId, {
  get(target, prop) {
    if (prop === 'id' || prop === 'en') {
      return target;
    }
    if (prop in target) {
      return target[prop];
    }
    return '';
  }
});

// Backward-compatibility aliases
export const i18n = translations;
export default translations;
