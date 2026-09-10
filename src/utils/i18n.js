export const translations = {
  id: {
    appTitle: 'Sekitarku',
    appSubtitle: 'Pantauan Lingkungan Hidup & Mitigasi Bencana Real-Time',
    liveBadge: 'LIVE DATA',
    selectCity: 'Pilih Kota',
    searchCity: 'Cari Kota...',
    gps: 'Lokasi Saya',
    refresh: 'Segarkan',
    themeToggle: 'Tema',
    langToggle: 'Bahasa',
    notifyEnable: 'Notifikasi',
    notifyActive: 'Aktif',
    pwaInstall: 'Pasang Aplikasi',
    share: 'Bagikan',
    emergency: 'Darurat 112',
    lightMode: 'Terang',
    darkMode: 'Gelap',
    
    // Alerts
    alertAqiTitle: 'Peringatan Polusi Udara',
    alertAqiDesc: 'Kualitas udara saat ini tidak sehat. Disarankan memakai masker di luar ruangan.',
    alertQuakeTitle: 'Peringatan Gempa Terkini',
    
    // EcoHealth Card
    ecoTitle: 'Kondisi Lingkungan',
    ecoSubtitle: 'Indeks gabungan udara, suhu, dan radiasi UV',
    ecoScoreTitle: 'SKOR KUALITAS LINGKUNGAN',
    exposure: 'Paparan',
    cigsUnit: 'batang rokok/hari',
    cleanAir: 'Udara Bersih',
    activitiesTitle: 'Kesiapan Aktivitas',
    cigsEquiv: 'Perkiraan setara paparan',
    
    // Air Quality Card
    aqiTitle: 'Kualitas Udara',
    aqiSubtitle: 'Indeks Standar Pencemar Udara (ISPU & US-AQI)',
    mainParticulate: 'Partikel PM2.5',
    standardLabel: 'Standar US-EPA & ISPU',
    
    // Weather Card
    weatherTitle: 'Cuaca',
    weatherSubtitle: 'Kondisi atmosfer & kenyamanan termal',
    feelsLike: 'Sensasi Suhu',
    humidity: 'Kelembapan',
    windSpeed: 'Kecepatan Angin',
    pressure: 'Tekanan Udara',
    
    // Karhutla Card
    karhutlaTitle: 'Indeks Kebakaran Hutan & Status Kabut Asap',
    karhutlaSubtitle: 'Data FDRS BMKG · Satelit NASA FIRMS · Deteksi Asap Lintas Wilayah',
    karhutlaCardHeader: 'STATUS KARHUTLA & KABUT ASAP',
    hazeActiveBadge: '⚠️ Terpapar Kabut Asap',
    hazeCleanBadge: '🟢 Asap: Bersih',
    landLocalBadge: 'Lahan Lokal',
    nearestHotspotLabel: 'Titik Panas Satelit Terdekat',
    noHotspotsNearby: 'Tidak ada titik panas satelit dalam radius 400 km.',
    landConditionTitle: 'Kondisi Lahan & Vegetasi',
    fdrsExplExplanation: '*💡 Penjelasan: Status "Lahan Aman" berarti rumput/tanah lokal sedang basah & tidak mudah menyala, tetapi udara tetap bisa terpapar asap dari titik api di wilayah sekitar.',
    allHotspotsBtn: 'Semua Titik Api',
    statusSafeTitle: 'AMAN',
    statusSafeMsg: 'Kondisi lahan terpantau AMAN dan bebas dari kabut asap.',
    hazeAlertMsg: '🚨 PERINGATAN KABUT ASAP: Udara terpapar asap kiriman dari titik api {regency} ({dist} km). Lahan setempat aman dari api, namun gunakan masker N95 untuk pernapasan!',
    rawanAlertMsg: 'STATUS RAWAN: Vegetasi sangat kering & mudah terbakar akibat suhu panas / rendah hujan.',
    waspadaAlertMsg: 'STATUS WASPADA: Semak & alang-alang mulai mengering. Hindari pembakaran sampah sembarangan.',
    
    // Volcano Card
    volcanoTitle: 'Aktivitas Gunung Api Terdekat',
    volcanoSubtitle: 'Data Resmi PVMBG · MAGMA ESDM',
    volcanoDistance: 'Jarak',
    volcanoStatusLevel: 'Status',
    volcanoAllBtn: 'Semua Gunung Api',
    volcanoNormalMsg: 'Kondisi normal. Tidak ada aktivitas erupsi yang mengancam wilayah ini.',
    volcanoAlertMsg: 'Waspada peningkatan aktivitas vulkanik. Patuhi zona bahaya rekomendasi PVMBG.',
    
    // Earthquake Card
    quakeTitle: 'Gempa Terkini',
    depth: 'Kedalaman',
    noTsunami: 'Aman dari Tsunami',
    tsunamiAlert: 'Potensi Tsunami',
    recentQuakesBtn: 'Riwayat Gempa',
    closeQuakesBtn: 'Tutup',
    magnitude: 'Magnitudo',
    
    // UV Card
    uvTitle: 'Radiasi Sinar UV',
    uvSubtitle: 'Indeks Paparan Ultraviolet Global (WHO)',
    uvLow: 'Rendah (Aman)',
    uvModerate: 'Sedang (Waspada)',
    uvHigh: 'Tinggi (Bahaya)',
    uvVeryHigh: 'Sangat Tinggi (Ekstrem)',
    uvAdviceLow: 'Paparan aman untuk aktivitas luar.',
    uvAdviceMod: 'Gunakan kacamata hitam atau topi pelindung.',
    uvAdviceHigh: 'Gunakan tabir surya (SPF 30+) dan cari tempat teduh.',
    uvAdviceExtreme: 'Kurangi kontak matahari langsung pada tengah hari.',

    // Charts
    aqiTrend: 'Tren Kualitas Udara (24 Jam)',
    aqiTrendSubtitle: 'Riwayat fluktuasi per jam (ISPU & US-EPA)',
    forecast7Title: 'Prakiraan Cuaca 7 Hari',
    forecast7Subtitle: 'Proyeksi cuaca mingguan & potensi hujan',
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
    
    // Share Modal
    shareModalTitle: 'Bagikan Kondisi Lingkungan',
    shareModalSubtitle: 'Format Story HD (9:16) untuk WhatsApp & Instagram',
    shareBtn: 'Bagikan Gambar',
    downloadPngBtn: 'Unduh PNG',
    copyTextBtn: 'Salin Teks',
    copiedBtn: 'Tersalin!',
    shareSupportHint: 'Mendukung WhatsApp Status, Instagram Stories, Twitter/X, & aplikasi lainnya',
    
    // Footer
    footerTitle: 'Sekitarku: Pantauan Lingkungan Hidup & Mitigasi Bencana Real-time',
    footerSources: 'Sumber Data Resmi: BMKG (Meteorologi, Klimatologi & Geofisika), PVMBG / Magma Indonesia (Aktivitas Gunung Api), NASA FIRMS (Satelit Titik Panas Karhutla), dan Open-Meteo / Copernicus (Kualitas Udara ISPU & AQI).',
    treatCoffee: 'Traktir Kopi',
    embedWidget: 'Pasang Widget',
    repoLink: 'GitHub Repository'
  },
  en: {
    appTitle: 'Sekitarku',
    appSubtitle: 'Real-Time Environmental Living & Disaster Mitigation Platform',
    liveBadge: 'LIVE DATA',
    selectCity: 'Select City',
    searchCity: 'Search City...',
    gps: 'My Location',
    refresh: 'Refresh',
    themeToggle: 'Theme',
    langToggle: 'Language',
    notifyEnable: 'Alerts',
    notifyActive: 'Active',
    pwaInstall: 'Install App',
    share: 'Share',
    emergency: 'Emergency 112',
    lightMode: 'Light',
    darkMode: 'Dark',
    
    // Alerts
    alertAqiTitle: 'Air Pollution Alert',
    alertAqiDesc: 'Current air quality is unhealthy. Outdoor masks are strongly recommended.',
    alertQuakeTitle: 'Recent Earthquake Alert',
    
    // EcoHealth Card
    ecoTitle: 'Living Environment',
    ecoSubtitle: 'Composite index of air, heat, and UV hazard',
    ecoScoreTitle: 'ENVIRONMENT QUALITY SCORE',
    exposure: 'Exposure',
    cigsUnit: 'cigarettes/day',
    cleanAir: 'Clean Air',
    activitiesTitle: 'Activity Readiness',
    cigsEquiv: 'Estimated equivalent to',
    
    // Air Quality Card
    aqiTitle: 'Air Quality',
    aqiSubtitle: 'Air Pollutant Standard Index (ISPU & US-AQI)',
    mainParticulate: 'PM2.5 Particulate',
    standardLabel: 'US-EPA & ISPU Standards',
    
    // Weather Card
    weatherTitle: 'Weather & Climate',
    weatherSubtitle: 'Atmospheric conditions & thermal comfort',
    feelsLike: 'Feels Like',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    pressure: 'Air Pressure',
    
    // Karhutla Card
    karhutlaTitle: 'Wildfire Danger Index & Smoke Haze Status',
    karhutlaSubtitle: 'BMKG FDRS Data · NASA FIRMS Satellites · Cross-Regional Haze Detection',
    karhutlaCardHeader: 'WILDFIRE & HAZE STATUS',
    hazeActiveBadge: '⚠️ Active Haze Detected',
    hazeCleanBadge: '🟢 Haze: Clean / Safe',
    landLocalBadge: 'Local Land',
    nearestHotspotLabel: 'Nearest Satellite Hotspot',
    noHotspotsNearby: 'No satellite hotspots detected within 400 km radius.',
    landConditionTitle: 'Land & Vegetation Condition',
    fdrsExplExplanation: '*💡 Note: "Safe Land" status means local soil/grass is moist and unlikely to ignite locally, but ambient air may still be exposed to smoke blown from neighboring hotspots.',
    allHotspotsBtn: 'All Hotspots',
    statusSafeTitle: 'SAFE',
    statusSafeMsg: 'Local land conditions are SAFE and free from wildfire smoke haze.',
    hazeAlertMsg: '🚨 HAZE ADVISORY: Air is exposed to incoming wildfire smoke from hotspot in {regency} ({dist} km). Local land is safe, but please wear N95 masks for outdoor breathing!',
    rawanAlertMsg: 'HIGH RISK: Vegetation is dry and flammable due to high heat / low precipitation.',
    waspadaAlertMsg: 'WARNING: Grass and brush are drying out. Avoid open burning.',
    
    // Volcano Card
    volcanoTitle: 'Nearest Active Volcano',
    volcanoSubtitle: 'Official Data from PVMBG · MAGMA Indonesia',
    volcanoDistance: 'Distance',
    volcanoStatusLevel: 'Status',
    volcanoAllBtn: 'All Volcanoes',
    volcanoNormalMsg: 'Normal conditions. No eruptive activity threatening this area.',
    volcanoAlertMsg: 'Volcanic activity alert. Follow recommended safety zones by PVMBG.',
    
    // Earthquake Card
    quakeTitle: 'Recent Earthquake',
    depth: 'Depth',
    noTsunami: 'No Tsunami Hazard',
    tsunamiAlert: 'Tsunami Hazard',
    recentQuakesBtn: 'Past Quakes',
    closeQuakesBtn: 'Close',
    magnitude: 'Magnitude',
    
    // UV Card
    uvTitle: 'UV Solar Radiation',
    uvSubtitle: 'Global Ultraviolet Exposure Index (WHO)',
    uvLow: 'Low (Safe)',
    uvModerate: 'Moderate (Caution)',
    uvHigh: 'High (Hazard)',
    uvVeryHigh: 'Very High (Extreme)',
    uvAdviceLow: 'Safe for outdoor activities without special protection.',
    uvAdviceMod: 'Wear sunglasses and protective hats outdoors.',
    uvAdviceHigh: 'Apply SPF 30+ sunscreen and seek shade during peak hours.',
    uvAdviceExtreme: 'Minimize direct sun exposure during midday.',

    // Charts
    aqiTrend: '24-Hour Air Quality Trend',
    aqiTrendSubtitle: 'Hourly fluctuation history (ISPU & US-EPA)',
    forecast7Title: '7-Day Weather Forecast',
    forecast7Subtitle: 'Weekly weather projections & rain probability',
    metricAqi: 'AQI Index',
    metricPm25: 'PM2.5 Particles',
    avg24h: '24-Hour Average',
    peak24h: 'Peak Pollution',
    clean24h: 'Cleanest Hour',
    rainProb: 'Rain Probability',
    today: 'Today',
    tomorrow: 'Tomorrow',
    
    // Map
    mapTitle: 'Interactive Archipelago Map',
    mapSubtitle: 'Air quality stations, BMKG seismic events & active satellite hotspots',
    
    // Share Modal
    shareModalTitle: 'Share Environment Report',
    shareModalSubtitle: 'High-Resolution 9:16 Story Format for WhatsApp & Instagram',
    shareBtn: 'Share Image',
    downloadPngBtn: 'Download PNG',
    copyTextBtn: 'Copy Text',
    copiedBtn: 'Copied!',
    shareSupportHint: 'Supports WhatsApp Status, Instagram Stories, Twitter/X, & more',
    
    // Footer
    footerTitle: 'Sekitarku: Real-Time Environmental Health & Disaster Mitigation',
    footerSources: 'Official Data Sources: BMKG (Meteorology, Climatology & Geophysics), PVMBG / Magma Indonesia (Volcanic Activity), NASA FIRMS (Wildfire Hotspot Satellites), and Open-Meteo / Copernicus (Air Quality ISPU & AQI).',
    treatCoffee: 'Buy Me a Coffee',
    embedWidget: 'Embed Widget',
    repoLink: 'GitHub Repository'
  }
};

export const i18n = translations;
