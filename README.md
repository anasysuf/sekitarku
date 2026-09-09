# Sekitarku

> **Sistem Monitoring Kesehatan Lingkungan Real-Time Indonesia**  
> Dashboard modern, responsif, dan open-source untuk memantau Kualitas Udara (AQI), Cuaca, Indeks UV, dan Gempa Bumi BMKG secara langsung.

---

## Fitur Utama

- **Skor Kelayakan Lingkungan Terpadu**: Indeks gabungan dari toksisitas udara, kenyamanan suhu atmosfer, dan radiasi matahari.
- **Kesiapan Aktivitas Luar Ruangan**: Rekomendasi langsung untuk jogging, bersepeda, anak/lansia, dan ventilasi udara rumah.
- **Estimasi Dampak Hirupan Polusi**: Perhitungan ekuivalen hisapan rokok pasif harian berdasarkan formula ilmiah Berkeley Earth.
- **Kualitas Udara (AQI)**: Pemantauan polutan PM2.5, PM10, CO, NO2, SO2, dan Ozon dengan skala US-EPA & rekomendasi kesehatan.
- **Cuaca Real-time**: Suhu, kelembapan, kecepatan & arah angin, tekanan udara, dan prakiraan cuaca 7 hari ke depan.
- **Deteksi Gempa BMKG**: Integrasi data auto-gempa dan daftar gempa terkini dari BMKG Indonesia lengkap dengan magnitude, kedalaman, wilayah, dan status potensi tsunami.
- **Peta Interaktif Nusantara**: Visualisasi berbasis Leaflet untuk memantau stasiun kota dan sebaran gempa aktif di seluruh Indonesia.
- **Cakupan Seluruh 38 Provinsi**: Dilengkapi modal pencarian instan dengan filter per wilayah kepulauan dan deteksi lokasi GPS otomatis.
- **Progressive Web App (PWA)**: Dapat dipasang langsung di layar utama ponsel dan mendukung notifikasi web real-time.
- **Bilingual & Dark Mode**: Mendukung Bahasa Indonesia dan English serta tema Dark dan Light yang nyaman di mata.

---

## Tech Stack

- **React 18** + **Vite**
- **Vanilla CSS** (Custom Design Tokens & Responsive Grid)
- **Leaflet & React-Leaflet** (Peta Interaktif)
- **Recharts** (Grafik Tren AQI 24 Jam)
- **Lucide Icons** (Ikon UI)
- **Sumber Data**: BMKG Open Data & Open-Meteo API

---

## Cara Menjalankan Lokal

```bash
# 1. Masuk ke direktori
cd C:/laragon/www/sekitarku

# 2. Install dependensi (jika baru di-clone)
npm install

# 3. Jalankan development server
npm run dev

# 4. Akses via peramban di http://localhost:3000
```

---

## Lisensi

Proyek ini dilisensikan di bawah lisensi [MIT](LICENSE).
