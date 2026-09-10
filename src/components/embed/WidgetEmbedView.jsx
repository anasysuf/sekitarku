import React from 'react';
import { ExternalLink, Wind, Droplets } from 'lucide-react';
import { getAqiInfo } from '../../utils/aqi';

export function WidgetEmbedView({ location, weatherData, airQualityData, loading, onRefresh }) {
  const cityName = location?.name || 'DKI Jakarta';
  const aqiVal = airQualityData?.current?.aqi || 42;
  const aqiInfo = getAqiInfo(aqiVal);
  const temp = Math.round(weatherData?.current?.temperature || weatherData?.current?.temperature_2m || 30);
  const weatherLabel = weatherData?.current?.weatherCodeInfo?.label || 'Cerah Berawan';
  const humidity = weatherData?.current?.relative_humidity_2m || 75;
  const windSpeed = Math.round(weatherData?.current?.wind_speed_10m || 12);
  const pm25 = airQualityData?.current?.pm25 || 15;

  const appUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/?city=${encodeURIComponent(cityName)}` 
    : `https://sekitarku.vercel.app/?city=${encodeURIComponent(cityName)}`;

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        boxSizing: 'border-box',
        margin: 0,
        padding: '0.85rem',
        fontFamily: 'Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
        backgroundColor: 'var(--bg-card, #ffffff)',
        color: 'var(--text-main, #0f172a)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* Top Row: Brand & City */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a
          href={appUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 6px #10b981'
            }}
          />
          <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '-0.2px' }}>
            Sekitarku
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', fontWeight: '600' }}>
            • {cityName}
          </span>
        </a>

        {/* AQI Pill */}
        <span
          style={{
            fontSize: '0.7rem',
            padding: '2px 8px',
            borderRadius: '999px',
            backgroundColor: aqiInfo.bg,
            color: aqiInfo.color,
            fontWeight: '800',
            border: `1px solid ${aqiInfo.color}33`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          AQI {aqiVal} ({aqiInfo.label})
        </span>
      </div>

      {/* Main Metric Row: Temperature & Key Stats */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-muted, #f8fafc)',
          padding: '0.55rem 0.85rem',
          borderRadius: '10px',
          border: '1px solid rgba(0,0,0,0.06)'
        }}
      >
        {/* Left: Temp & Weather Condition */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ fontSize: '1.45rem', fontWeight: '900', lineHeight: 1 }}>
            {temp}°C
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted, #64748b)',
              fontWeight: '600',
              maxWidth: '120px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {weatherLabel}
          </span>
        </div>

        {/* Right: PM2.5 & Humidity */}
        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.7rem', color: 'var(--text-muted, #64748b)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Droplets size={12} color="#0284c7" />
            <span style={{ fontWeight: '700' }}>{humidity}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Wind size={12} color="#10b981" />
            <span style={{ fontWeight: '700' }}>{windSpeed} km/h</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Source & Full App Link */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.675rem',
          color: 'var(--text-muted, #64748b)'
        }}
      >
        <span>Data: BMKG & Open-Meteo</span>
        <a
          href={appUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            color: 'var(--color-primary, #059669)',
            fontWeight: '700',
            textDecoration: 'none'
          }}
        >
          <span>Buka Pantauan Lengkap</span>
          <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
}
