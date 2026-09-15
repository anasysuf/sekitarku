import React from 'react';
import {
  Sun,
  SunMedium,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudLightning,
  CloudSnow
} from 'lucide-react';

/**
 * Pemetaan Kode Cuaca WMO (World Meteorological Organization)
 * Disesuaikan dengan Standar Nomenklatur Resmi BMKG Indonesia
 */
export function getWeatherVisual(code) {
  const c = Number(code) || 0;

  // 0: Cerah (Clear sky)
  if (c === 0) {
    return { label: 'Cerah', icon: Sun, color: '#f59e0b', bg: '#fffbeb' };
  }
  // 1: Cerah Berawan (Mainly clear)
  if (c === 1) {
    return { label: 'Cerah Berawan', icon: SunMedium, color: '#f59e0b', bg: '#fffbeb' };
  }
  // 2: Berawan (Partly cloudy)
  if (c === 2) {
    return { label: 'Berawan', icon: CloudSun, color: '#3b82f6', bg: '#eff6ff' };
  }
  // 3: Berawan Tebal (Overcast)
  if (c === 3) {
    return { label: 'Berawan Tebal', icon: Cloud, color: '#64748b', bg: '#f1f5f9' };
  }
  // 45, 48: Berkabut (Fog / Depositing rime fog)
  if (c === 45 || c === 48) {
    return { label: 'Berkabut', icon: CloudFog, color: '#94a3b8', bg: '#f8fafc' };
  }
  // 51, 53, 55: Gerimis / Rintik (Drizzle: Light, Moderate, Dense)
  if (c >= 51 && c <= 57) {
    return { label: 'Gerimis', icon: CloudDrizzle, color: '#0ea5e9', bg: '#f0f9ff' };
  }
  // 61: Hujan Ringan
  if (c === 61) {
    return { label: 'Hujan Ringan', icon: CloudRain, color: '#2563eb', bg: '#eff6ff' };
  }
  // 63: Hujan Sedang
  if (c === 63) {
    return { label: 'Hujan Sedang', icon: CloudRain, color: '#1d4ed8', bg: '#eff6ff' };
  }
  // 65, 66, 67: Hujan Lebat
  if (c >= 65 && c <= 67) {
    return { label: 'Hujan Lebat', icon: CloudRainWind, color: '#1e40af', bg: '#eff6ff' };
  }
  // 71 - 77: Salju (Puncak Jayawijaya Papua)
  if (c >= 71 && c <= 77) {
    return { label: 'Salju', icon: CloudSnow, color: '#38bdf8', bg: '#f0f9ff' };
  }
  // 80: Hujan Lokal Ringan (Showers)
  if (c === 80) {
    return { label: 'Hujan Lokal', icon: CloudRain, color: '#2563eb', bg: '#eff6ff' };
  }
  // 81, 82: Hujan Deras Lokal
  if (c === 81 || c === 82) {
    return { label: 'Hujan Deras', icon: CloudRainWind, color: '#1d4ed8', bg: '#eff6ff' };
  }
  // 85, 86: Hujan Salju Lokal
  if (c === 85 || c === 86) {
    return { label: 'Hujan Salju', icon: CloudSnow, color: '#38bdf8', bg: '#f0f9ff' };
  }
  // 95: Hujan Petir (Thunderstorm)
  if (c === 95) {
    return { label: 'Hujan Petir', icon: CloudLightning, color: '#7c3aed', bg: '#f5f3ff' };
  }
  // 96, 99: Hujan Badai Petir
  if (c >= 96) {
    return { label: 'Hujan Badai Petir', icon: CloudLightning, color: '#6d28d9', bg: '#f5f3ff' };
  }

  return { label: 'Cerah Berawan', icon: CloudSun, color: '#3b82f6', bg: '#eff6ff' };
}
