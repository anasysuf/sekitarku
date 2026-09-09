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

export function getWeatherVisual(code, lang = 'id') {
  const c = Number(code) || 0;

  if (c === 0) {
    return {
      label: lang === 'en' ? 'Clear Sky' : 'Cerah',
      icon: Sun,
      color: '#f59e0b',
      bg: '#fffbeb'
    };
  } else if (c === 1) {
    return {
      label: lang === 'en' ? 'Mainly Clear' : 'Cerah Berawan',
      icon: SunMedium,
      color: '#f59e0b',
      bg: '#fffbeb'
    };
  } else if (c === 2) {
    return {
      label: lang === 'en' ? 'Partly Cloudy' : 'Sebagian Berawan',
      icon: CloudSun,
      color: '#3b82f6',
      bg: '#eff6ff'
    };
  } else if (c === 3) {
    return {
      label: lang === 'en' ? 'Overcast' : 'Berawan Mendung',
      icon: Cloud,
      color: '#6b7280',
      bg: '#f3f4f6'
    };
  } else if (c === 45 || c === 48) {
    return {
      label: lang === 'en' ? 'Foggy' : 'Berkabut',
      icon: CloudFog,
      color: '#9ca3af',
      bg: '#f3f4f6'
    };
  } else if (c >= 51 && c <= 57) {
    return {
      label: lang === 'en' ? 'Drizzle' : 'Gerimis',
      icon: CloudDrizzle,
      color: '#0ea5e9',
      bg: '#f0f9ff'
    };
  } else if (c >= 61 && c <= 67) {
    return {
      label: lang === 'en' ? 'Rain' : 'Hujan',
      icon: CloudRain,
      color: '#2563eb',
      bg: '#eff6ff'
    };
  } else if (c >= 80 && c <= 82) {
    return {
      label: lang === 'en' ? 'Heavy Rain' : 'Hujan Lebat',
      icon: CloudRainWind,
      color: '#1d4ed8',
      bg: '#eff6ff'
    };
  } else if (c >= 95) {
    return {
      label: lang === 'en' ? 'Thunderstorm' : 'Badai Petir',
      icon: CloudLightning,
      color: '#7c3aed',
      bg: '#f5f3ff'
    };
  }

  return {
    label: lang === 'en' ? 'Partly Cloudy' : 'Cerah Berawan',
    icon: CloudSun,
    color: '#3b82f6',
    bg: '#eff6ff'
  };
}

export function WeatherIcon({ code, size = 24, strokeWidth = 2.5, lang = 'id' }) {
  const visual = getWeatherVisual(code, lang);
  const IconComp = visual.icon;
  return <IconComp size={size} color={visual.color} strokeWidth={strokeWidth} />;
}
