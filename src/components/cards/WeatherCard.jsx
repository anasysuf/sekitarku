import React from 'react';
import { Sun, Droplets, Wind, Gauge } from 'lucide-react';
import { formatWeatherCode } from '../../utils/format';
import { translations } from '../../utils/i18n';

export function WeatherCard({ data, locationName, loading, lang = 'id' }) {
  const t = translations[lang] || translations.id;

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '1.5rem', minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Memuat data...</p>
      </div>
    );
  }

  const current = data?.current || {};
  const weatherStatus = formatWeatherCode(current.weatherCode || 0);

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sun size={18} color="#d29922" />
          <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>{t.weatherTitle}</h3>
        </div>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: '600',
          padding: '3px 8px',
          borderRadius: '4px',
          backgroundColor: 'rgba(88, 166, 255, 0.1)',
          color: 'var(--accent-blue)',
          border: '1px solid rgba(88, 166, 255, 0.25)'
        }}>
          {weatherStatus.label}
        </span>
      </div>

      {/* Main Temperature */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', margin: '1rem 0' }}>
        <div style={{
          fontSize: '3.2rem',
          fontWeight: '800',
          lineHeight: '1',
          color: 'var(--text-primary)',
          letterSpacing: '-0.03em'
        }}>
          {current.temp ?? '--'}°<span style={{ fontSize: '1.8rem', fontWeight: '500', color: 'var(--text-secondary)' }}>C</span>
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{t.feelsLike}</span>
          <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{current.feelsLike ?? current.temp}°C</strong>
        </div>
      </div>

      <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: '0 0 1.25rem 0' }}>
        Kondisi umum atmosfer di wilayah {locationName}.
      </p>

      {/* Atmospheric Metrics */}
      <div className="weather-metrics-grid">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
          <Droplets size={16} color="var(--accent-blue)" />
          <div>
            <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', display: 'block' }}>{t.humidity}</span>
            <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{current.humidity}%</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
          <Wind size={16} color="var(--accent-brand)" />
          <div>
            <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', display: 'block' }}>{t.windSpeed}</span>
            <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{current.windSpeed} km/j</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
          <Gauge size={16} color="var(--accent-amber)" />
          <div>
            <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', display: 'block' }}>{t.pressure}</span>
            <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{Math.round(current.pressure || 1012)} hPa</strong>
          </div>
        </div>
      </div>

    </div>
  );
}
