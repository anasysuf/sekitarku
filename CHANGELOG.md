# Changelog — Sekitarku

Semua perubahan signifikan dan riwayat rilis pada platform **Sekitarku** didokumentasikan dalam berkas ini mengikuti format [Keep a Changelog](https://keepachangelog.com/id/1.0.0/) dan [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.3] — 2026-09-15

### 🌦️ Cuaca & Akurasi Prakiraan (Weather Accuracy & Calibration)
- **Kalibrasi Presipitasi Universal (*Ground Precipitation Threshold*)**: Mengatasi anomali *virga* (kelembapan mikro di awan atas $\le 0.2\text{ mm}$) pada model NWP Open-Meteo yang sebelumnya memicu status keliru "Gerimis" saat kondisi di darat sebenarnya kering/berawan tebal.
- **Korelasi Tutupan Awan (*Cloud Cover Correlation*)**: Menyesuaikan status cuaca riil secara akurat:
  - Tutupan awan $\ge 75\%$ tanpa hujan $\rightarrow$ **Berawan Tebal (Overcast)**
  - Tutupan awan $35\%\text{ s/d }74\%$ $\rightarrow$ **Berawan (Partly Cloudy)**
  - Tutupan awan $< 35\%$ $\rightarrow$ **Cerah / Cerah Berawan**
- **Kalibrasi Prakiraan 24 Jam & 7 Hari**: Menyelaraskan kode cuaca harian dan per jam di seluruh kota/koordinat di Indonesia agar hari kering dengan peluang hujan rendah ($< 35\%$) tidak menampilkan ikon gerimis/rintik.
- **Model Ensemble `models=best_match`**: Menggabungkan keluaran model prakiraan cuaca terbaik (ECMWF, GFS, ICON, JMA, GEM).
- **Standarisasi Nomenklatur WMO BMKG**: Penyesuaian nama dan ikon kondisi cuaca sesuai standar resmi Badan Meteorologi, Klimatologi, dan Geofisika.

### 🎯 Presisi Data & Geospasial
- **Zona Waktu Dinamis (`timezone=auto`)**: Menjamin sinkronisasi waktu lokal akurat untuk ketiga zona waktu Indonesia (WIB UTC+7, WITA UTC+8, WIT UTC+9).
- **Perhitungan Jarak Episentrum Gempa Akurat**: Menggunakan formula geodesik Haversine presisi tinggi untuk menghitung jarak pengguna ke pusat gempa bumi terkini BMKG.
- **Nullish Coalescing (`??`)**: Standardisasi penanganan nilai `0` pada data sensor (suhu, curah hujan, radiasi UV, titik panas).

### 🧹 Kerapian Kode & Optimasi (Code Hygiene & Performance)
- **Pembersihan Dead Code & Unused Variables**: Menghapus lebih dari 100 baris variabel/impor tidak terpakai di 24 berkas.
- **Optimalisasi Bundle Vite & Production Build**: Build produksi secepat $\approx 460\text{ ms}$ dengan *zero warnings* dan pemisahan *vendor chunks* (Leaflet, Recharts, Lucide).

---

## [1.2.2] — 2026-09-14
- Rilis fitur pemantauan titik panas kebakaran hutan dan lahan (Karhutla SiPongi+ & NASA FIRMS) 38 provinsi.
- Integrasi status 4 level aktivitas gunung api PVMBG / MAGMA ESDM.
- Penambahan kartu indeks kesehatan lingkungan (*Eco-Health Score*).
- Fitur ekspor kartu infografis (*Share Card Generator*).
