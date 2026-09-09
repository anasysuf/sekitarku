import React from 'react';
import { Sun, Droplets, Wind, Gauge } from 'lucide-react';
import { formatWeatherCode } from '../../utils/format';
import { translations } from '../../utils/i18n';

export function WeatherCard({ data, locationName, loading, lang = 'id' }) {
  const t = translations[lang] || translations.id;

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '1.25rem', minHeight: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Memuat cuaca...</p>
      </div>
    );
  }

  const current = data?.current || {};
  const weather = formatWeatherCode(current.weatherCode || 0);

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '1.25rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Sun size={16} color="var(--accent-amber)" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>{t.weatherTitle}</h3>
        </div>
        <span style={{ fontSize: '0.725rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
          {weather.label}
        </span>
      </div>

      {/* Main Temp */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.85rem', margin: '0.75rem 0' }}>
        <div style={{
          fontSize: '2.8rem',
          fontWeight: '800',
          lineHeight: '1',
          color: 'var(--text-primary)',
          letterSpacing: '-0.03em'
        }}>
          {current.temp}°C
        </div>
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>{t.feelsLike}</span>
          <strong style={{ fontSize: '0.925rem', color: 'var(--text-primary)' }}>{current.feelsLike}°C</strong>
        </div>
      </div>

      {/* Summary */}
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>
        Kondisi umum di {locationName.replace(' (GPS)', '')} terpantau {weather.label.toLowerCase()}.
      </p>

      {/* Weather Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.45rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.5rem 0.55rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)' }}>
          <Droplets size={15} color="var(--accent-blue)" style={{ flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>{t.humidity}</span>
            <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{current.humidity}%</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.5rem 0.55rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)' }}>
          <Wind size={15} color="var(--accent-brand)" style={{ flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>{t.windSpeed}</span>
            <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{current.windSpeed} km/j</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', padding: '0.5rem 0.55rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)' }}>
          <Gauge size={15} color="var(--accent-amber)" style={{ flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>{t.pressure}</span>
            <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>{Math.round(current.pressure || 1012)} hPa</strong>
          </div>
        </div>
      </div>

    </div>
  );
}
