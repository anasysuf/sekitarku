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
  CloudLightning
} from 'lucide-react';

export function getWeatherVisual(code) {
  const c = Number(code) || 0;

  if (c === 0) {
    return { label: 'Cerah', icon: Sun, color: '#f59e0b', bg: '#fffbeb' };
  } else if (c === 1) {
    return { label: 'Cerah Berawan', icon: SunMedium, color: '#f59e0b', bg: '#fffbeb' };
  } else if (c === 2) {
    return { label: 'Sebagian Berawan', icon: CloudSun, color: '#3b82f6', bg: '#eff6ff' };
  } else if (c === 3) {
    return { label: 'Berawan Mendung', icon: Cloud, color: '#6b7280', bg: '#f3f4f6' };
  } else if (c === 45 || c === 48) {
    return { label: 'Berkabut', icon: CloudFog, color: '#9ca3af', bg: '#f3f4f6' };
  } else if (c >= 51 && c <= 57) {
    return { label: 'Gerimis', icon: CloudDrizzle, color: '#0ea5e9', bg: '#f0f9ff' };
  } else if (c >= 61 && c <= 67) {
    return { label: 'Hujan', icon: CloudRain, color: '#2563eb', bg: '#eff6ff' };
  } else if (c >= 80 && c <= 82) {
    return { label: 'Hujan Lebat', icon: CloudRainWind, color: '#1d4ed8', bg: '#eff6ff' };
  } else if (c >= 95) {
    return { label: 'Hujan Petir', icon: CloudLightning, color: '#7c3aed', bg: '#f5f3ff' };
  }

  return { label: 'Sebagian Berawan', icon: CloudSun, color: '#3b82f6', bg: '#eff6ff' };
}
