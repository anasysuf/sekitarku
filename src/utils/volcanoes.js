/**
 * Database Geospasial Gunung Api Aktif di Indonesia
 * Standar Klasifikasi & Monitoring PVMBG (Pusat Vulkanologi dan Mitigasi Bencana Geologi) - MAGMA ESDM
 */

export const VOLCANO_STATUS_LEVELS = {
  1: {
    level: 1,
    name: 'Normal',
    nameEn: 'Normal',
    code: 'LEVEL I',
    color: '#10b981', // Green
    bg: 'rgba(16, 185, 129, 0.15)',
    description: 'Aktivitas visual dan seismik dasar. Tidak ada indikasi peningkatan ancaman.',
    recommendation: 'Aktivitas masyarakat dan pendakian aman dalam batas wajar sesuai rekomendasi PVMBG.'
  },
  2: {
    level: 2,
    name: 'Waspada',
    nameEn: 'Advisory',
    code: 'LEVEL II',
    color: '#f59e0b', // Amber/Yellow
    bg: 'rgba(245, 158, 11, 0.15)',
    description: 'Terjadi peningkatan aktivitas seismik, vulkanik, atau hembusan asap kawah.',
    recommendation: 'Masyarakat/wisatawan dilarang mendekati kawah dalam radius 1.5 - 3 km.'
  },
  3: {
    level: 3,
    name: 'Siaga',
    nameEn: 'Watch',
    code: 'LEVEL III',
    color: '#f97316', // Orange
    bg: 'rgba(249, 115, 22, 0.15)',
    description: 'Peningkatan intensif aktivitas vulkanik. Erupsi berpotensi mengancam pemukiman terdekat.',
    recommendation: 'Zona bahaya steril radius 3 - 5 km. Siapkan masker dan tas siaga bencana.'
  },
  4: {
    level: 4,
    name: 'Awas',
    nameEn: 'Warning',
    code: 'LEVEL IV',
    color: '#ef4444', // Red
    bg: 'rgba(239, 68, 68, 0.15)',
    description: 'Erupsi eksplosif atau awan panas guguran sedang/segera berlangsung.',
    recommendation: 'Evakuasi total seluruh warga dalam radius 6 - 8 km. Hindari aliran sungai lahar.'
  }
};

export const INDONESIA_VOLCANOES = [
  // JAWA
  {
    id: 'merapi',
    name: 'Gunung Merapi',
    province: 'D.I. Yogyakarta & Jawa Tengah',
    region: 'Jawa',
    lat: -7.5407,
    lon: 110.4457,
    elevation: 2968,
    type: 'Stratovolcano',
    statusLevel: 3, // Level III (Siaga)
    dangerRadiusKm: 5.0,
    lastEruption: 'Aktif (Guguran Lava & Awan Panas)',
    note: 'Waspadai potensi awan panas guguran ke sektor Barat Daya - Selatan (Kali Bebeng & Krasak).'
  },
  {
    id: 'semeru',
    name: 'Gunung Semeru',
    province: 'Jawa Timur',
    region: 'Jawa',
    lat: -8.108,
    lon: 112.922,
    elevation: 3676,
    type: 'Stratovolcano',
    statusLevel: 3, // Level III (Siaga)
    dangerRadiusKm: 5.0,
    lastEruption: 'Erupsi Berkala (Letusan Abu & Guguran)',
    note: 'Dilarang beraktivitas di sektor tenggara sepanjang Besuk Kobokan sejauh 13 km dari puncak.'
  },
  {
    id: 'bromo',
    name: 'Gunung Bromo',
    province: 'Jawa Timur',
    region: 'Jawa',
    lat: -7.942,
    lon: 112.953,
    elevation: 2329,
    type: 'Caldera / Cinder Cone',
    statusLevel: 2, // Level II (Waspada)
    dangerRadiusKm: 1.0,
    lastEruption: 'Hembusan Kawah Aktif',
    note: 'Tidak diperbolehkan memasuki kawah dalam radius 1 km dari pusat kawah aktif.'
  },
  {
    id: 'kelud',
    name: 'Gunung Kelud',
    province: 'Jawa Timur',
    region: 'Jawa',
    lat: -7.93,
    lon: 112.308,
    elevation: 1731,
    type: 'Stratovolcano',
    statusLevel: 1, // Level I (Normal)
    dangerRadiusKm: 1.5,
    lastEruption: '2014',
    note: 'Aktivitas normal. Wisata kubah lava dapat dikunjungi dengan mematuhi batas aman pengelola.'
  },
  {
    id: 'slamet',
    name: 'Gunung Slamet',
    province: 'Jawa Tengah',
    region: 'Jawa',
    lat: -7.242,
    lon: 109.208,
    elevation: 3432,
    type: 'Stratovolcano',
    statusLevel: 2, // Level II (Waspada)
    dangerRadiusKm: 2.0,
    lastEruption: 'Hembusan Asap Solfatara',
    note: 'Hindari aktivitas dalam radius 2 km dari kawah puncak.'
  },
  {
    id: 'tangkuban-parahu',
    name: 'Gunung Tangkuban Parahu',
    province: 'Jawa Barat',
    region: 'Jawa',
    lat: -6.77,
    lon: 107.60,
    elevation: 2084,
    type: 'Stratovolcano',
    statusLevel: 1, // Level I (Normal)
    dangerRadiusKm: 0.5,
    lastEruption: '2019',
    note: 'Waspadai gas beracun (CO, H2S) saat cuaca mendung/hujan di dasar Kawah Ratu & Upas.'
  },
  {
    id: 'gede',
    name: 'Gunung Gede',
    province: 'Jawa Barat',
    region: 'Jawa',
    lat: -6.78,
    lon: 106.98,
    elevation: 2958,
    type: 'Stratovolcano',
    statusLevel: 1,
    dangerRadiusKm: 0.5,
    lastEruption: '1957',
    note: 'Status normal. Jalur pendakian diatur berkala oleh Balai Besar TNGGP.'
  },
  {
    id: 'salak',
    name: 'Gunung Salak',
    province: 'Jawa Barat',
    region: 'Jawa',
    lat: -6.72,
    lon: 106.73,
    elevation: 2211,
    type: 'Stratovolcano',
    statusLevel: 1,
    dangerRadiusKm: 0.5,
    lastEruption: '1938',
    note: 'Waspadai hembusan gas kawah di Kawah Ratu saat mendekati fumarol.'
  },
  {
    id: 'ciremai',
    name: 'Gunung Ciremai',
    province: 'Jawa Barat',
    region: 'Jawa',
    lat: -6.89,
    lon: 108.40,
    elevation: 3078,
    type: 'Stratovolcano',
    statusLevel: 1,
    dangerRadiusKm: 0.5,
    lastEruption: '1951',
    note: 'Kondisi stabil.'
  },
  {
    id: 'papandayan',
    name: 'Gunung Papandayan',
    province: 'Jawa Barat',
    region: 'Jawa',
    lat: -7.32,
    lon: 107.73,
    elevation: 2665,
    type: 'Stratovolcano',
    statusLevel: 1,
    dangerRadiusKm: 0.5,
    lastEruption: '2002',
    note: 'Aktivitas kawah fumarol & belerang aktif namun dalam batas normal.'
  },
  {
    id: 'raung',
    name: 'Gunung Raung',
    province: 'Jawa Timur',
    region: 'Jawa',
    lat: -8.125,
    lon: 114.042,
    elevation: 3332,
    type: 'Stratovolcano',
    statusLevel: 2, // Level II (Waspada)
    dangerRadiusKm: 3.0,
    lastEruption: '2022',
    note: 'Masyarakat dilarang mendekati kawah kaldera dalam radius 3 km.'
  },
  {
    id: 'ijen',
    name: 'Gunung Ijen',
    province: 'Jawa Timur',
    region: 'Jawa',
    lat: -8.058,
    lon: 114.242,
    elevation: 2769,
    type: 'Stratovolcano / Kawah Asam',
    statusLevel: 2, // Level II (Waspada)
    dangerRadiusKm: 1.5,
    lastEruption: '2024 (Peningkatan Gas)',
    note: 'Pengunjung tidak diperbolehkan mendekati dasar kawah atau danau air asam.'
  },

  // SUMATERA & SELAT SUNDA
  {
    id: 'marapi-sumbar',
    name: 'Gunung Marapi',
    province: 'Sumatera Barat',
    region: 'Sumatera',
    lat: -0.381,
    lon: 100.473,
    elevation: 2891,
    type: 'Complex Volcano',
    statusLevel: 3, // Level III (Siaga)
    dangerRadiusKm: 4.5,
    lastEruption: 'Erupsi Eksplosif Abu & Lontaran Batu',
    note: 'Zona steril 4.5 km dari pusat kawah Verbeek. Waspadai lahar dingin saat hujan di hulu sungai.'
  },
  {
    id: 'sinabung',
    name: 'Gunung Sinabung',
    province: 'Sumatera Utara',
    region: 'Sumatera',
    lat: 3.17,
    lon: 98.392,
    elevation: 2460,
    type: 'Stratovolcano',
    statusLevel: 2, // Level II (Waspada)
    dangerRadiusKm: 3.0,
    lastEruption: 'Kubah Lava & Guguran',
    note: 'Waspadai potensi banjir lahar di sungai yang berhulu di lereng Sinabung.'
  },
  {
    id: 'anak-krakatau',
    name: 'Gunung Anak Krakatau',
    province: 'Lampung (Selat Sunda)',
    region: 'Sumatera',
    lat: -6.102,
    lon: 105.423,
    elevation: 157,
    type: 'Caldera Island',
    statusLevel: 3, // Level III (Siaga)
    dangerRadiusKm: 5.0,
    lastEruption: 'Erupsi Strombolian & Lontaran Pijar',
    note: 'Masyarakat/nelayan dilarang mendekati pulau Anak Krakatau dalam radius 5 km.'
  },
  {
    id: 'kerinci',
    name: 'Gunung Kerinci',
    province: 'Jambi & Sumatera Barat',
    region: 'Sumatera',
    lat: -1.697,
    lon: 101.264,
    elevation: 3805,
    type: 'Stratovolcano',
    statusLevel: 2, // Level II (Waspada)
    dangerRadiusKm: 3.0,
    lastEruption: 'Hembusan Asap & Abu',
    note: 'Hindari radius 3 km dari kawah aktif puncak.'
  },
  {
    id: 'dempo',
    name: 'Gunung Dempo',
    province: 'Sumatera Selatan',
    region: 'Sumatera',
    lat: -4.03,
    lon: 103.13,
    elevation: 3173,
    type: 'Stratovolcano',
    statusLevel: 2, // Level II (Waspada)
    dangerRadiusKm: 1.0,
    lastEruption: 'Hembusan Freatik',
    note: 'Radius 1 km dari kawah aktif dilarang untuk beraktivitas.'
  },

  // BALI & NUSA TENGGARA
  {
    id: 'agung',
    name: 'Gunung Agung',
    province: 'Bali',
    region: 'Bali & Nusa Tenggara',
    lat: -8.343,
    lon: 115.508,
    elevation: 3142,
    type: 'Stratovolcano',
    statusLevel: 1, // Level I (Normal)
    dangerRadiusKm: 1.5,
    lastEruption: '2019',
    note: 'Aktivitas normal. Tetap patuhi arahan pemandu saat pendakian.'
  },
  {
    id: 'batur',
    name: 'Gunung Batur',
    province: 'Bali',
    region: 'Bali & Nusa Tenggara',
    lat: -8.242,
    lon: 115.375,
    elevation: 1717,
    type: 'Caldera Volcano',
    statusLevel: 1,
    dangerRadiusKm: 1.0,
    lastEruption: '2000',
    note: 'Aman untuk wisata dan pendakian.'
  },
  {
    id: 'rinjani',
    name: 'Gunung Rinjani',
    province: 'Nusa Tenggara Barat',
    region: 'Bali & Nusa Tenggara',
    lat: -8.42,
    lon: 116.47,
    elevation: 3726,
    type: 'Stratovolcano & Kaldera Segara Anak',
    statusLevel: 1, // Level I (Normal)
    dangerRadiusKm: 1.5,
    lastEruption: '2016 (Barujari)',
    note: 'Aktivitas normal di kawah Gunung Barujari.'
  },
  {
    id: 'lewotobi',
    name: 'Gunung Lewotobi Laki-laki',
    province: 'Nusa Tenggara Timur (Flores Timur)',
    region: 'Bali & Nusa Tenggara',
    lat: -8.538,
    lon: 122.768,
    elevation: 1584,
    type: 'Stratovolcano',
    statusLevel: 4, // Level IV (Awas)
    dangerRadiusKm: 7.0,
    lastEruption: 'Erupsi Eksplosif Kolom Abu 5000m+',
    note: 'STATUS AWAS (LEVEL IV). Zona steril radius 7 km dari pusat kawah. Evakuasi pengungsi ke lokasi aman.'
  },
  {
    id: 'ile-lewotolok',
    name: 'Gunung Ile Lewotolok',
    province: 'Nusa Tenggara Timur (Lembata)',
    region: 'Bali & Nusa Tenggara',
    lat: -8.272,
    lon: 123.505,
    elevation: 1423,
    type: 'Stratovolcano',
    statusLevel: 3, // Level III (Siaga)
    dangerRadiusKm: 3.0,
    lastEruption: 'Erupsi Abu & Lontaran Lava Pijar',
    note: 'Masyarakat dilarang memasuki radius 3 km dari kawah.'
  },

  // SULAWESI & MALUKU
  {
    id: 'ruang',
    name: 'Gunung Ruang',
    province: 'Sulawesi Utara (Kep. Sitaro)',
    region: 'Sulawesi',
    lat: 2.298,
    lon: 125.367,
    elevation: 725,
    type: 'Stratovolcano Island',
    statusLevel: 3, // Level III (Siaga)
    dangerRadiusKm: 4.0,
    lastEruption: 'Erupsi Eksplosif Paroksismal 2024',
    note: 'Zona steril radius 4 km dari kawah puncak. Hindari area pesisir pulau Ruang.'
  },
  {
    id: 'lokon',
    name: 'Gunung Lokon',
    province: 'Sulawesi Utara (Tomohon)',
    region: 'Sulawesi',
    lat: 1.358,
    lon: 124.792,
    elevation: 1580,
    type: 'Stratovolcano',
    statusLevel: 2, // Level II (Waspada)
    dangerRadiusKm: 1.5,
    lastEruption: 'Hembusan Kawah Tompaluan',
    note: 'Masyarakat dan wisatawan dilarang mendekati Kawah Tompaluan dalam radius 1.5 km.'
  },
  {
    id: 'soputan',
    name: 'Gunung Soputan',
    province: 'Sulawesi Utara',
    region: 'Sulawesi',
    lat: 1.112,
    lon: 124.737,
    elevation: 1785,
    type: 'Stratovolcano',
    statusLevel: 2, // Level II (Waspada)
    dangerRadiusKm: 1.5,
    lastEruption: '2018',
    note: 'Radius 1.5 km dari kawah steril.'
  },
  {
    id: 'karangetang',
    name: 'Gunung Karangetang',
    province: 'Sulawesi Utara (Kep. Siau)',
    region: 'Sulawesi',
    lat: 2.78,
    lon: 125.40,
    elevation: 1784,
    type: 'Stratovolcano',
    statusLevel: 3, // Level III (Siaga)
    dangerRadiusKm: 3.5,
    lastEruption: 'Guguran Lava Pijar Berkala',
    note: 'Waspadai guguran lava ke arah Kali Batuawang & Kahetang.'
  },
  {
    id: 'ibu',
    name: 'Gunung Ibu',
    province: 'Maluku Utara (Halmahera Barat)',
    region: 'Maluku',
    lat: 1.488,
    lon: 127.63,
    elevation: 1325,
    type: 'Stratovolcano',
    statusLevel: 3, // Level III (Siaga)
    dangerRadiusKm: 4.0,
    lastEruption: 'Erupsi Harian Kolom Abu 1000 - 3000m',
    note: 'Dilarang beraktivitas dalam radius 4 km dari kawah aktif dan perluasan sektoral 5 km.'
  },
  {
    id: 'dukono',
    name: 'Gunung Dukono',
    province: 'Maluku Utara (Halmahera Utara)',
    region: 'Maluku',
    lat: 1.693,
    lon: 127.894,
    elevation: 1229,
    type: 'Complex Volcano',
    statusLevel: 2, // Level II (Waspada)
    dangerRadiusKm: 3.0,
    lastEruption: 'Erupsi Abu Vulkanik Menerus',
    note: 'Gunakan masker dan kacamata saat terjadi hujan abu di Tobelo dan sekitarnya.'
  },
  {
    id: 'gamalama',
    name: 'Gunung Gamalama',
    province: 'Maluku Utara (Kota Ternate)',
    region: 'Maluku',
    lat: 0.80,
    lon: 127.33,
    elevation: 1715,
    type: 'Stratovolcano',
    statusLevel: 2, // Level II (Waspada)
    dangerRadiusKm: 1.5,
    lastEruption: 'Hembusan Asap Kawah',
    note: 'Radius 1.5 km dari kawah puncak dilarang untuk beraktivitas.'
  }
];
