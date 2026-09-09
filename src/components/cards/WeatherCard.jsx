import React from 'react';
import { Sun, Droplets, Wind, Gauge } from 'lucide-react';
import { formatWeatherCode } from '../../utils/format';
import { translations } from '../../utils/i18n';

export function WeatherCard({ data, locationName, loading, lang = 'id' }) {
  const t = translations[lang] || translations.id;

  if (loading) {
    return (
      <div className="flat-card" style={{ padding: '1.5rem', minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>Memuat data cuaca...</p>
      </div>
    );
  }

  const current = data?.current || {};
  const weather = formatWeatherCode(current.weatherCode || 0);

  return (
    <div className="flat-card" style={{ padding: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Sun size={18} strokeWidth={2.5} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>{t.weatherTitle}</h3>
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: '800', padding: '3px 8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-muted)', color: 'var(--text-main)', border: 'var(--border-thick)' }}>
          {weather.label}
        </span>
      </div>

      {/* Main Temp */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', margin: '1rem 0' }}>
        <div style={{
          fontSize: '3.2rem',
          fontWeight: '800',
          lineHeight: '1',
          color: 'var(--text-main)',
          letterSpacing: '-0.04em'
        }}>
          {current.temp}°C
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>{t.feelsLike}</span>
          <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: '800' }}>{current.feelsLike}°C</strong>
        </div>
      </div>

      {/* Summary */}
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1.25rem 0', fontWeight: '500' }}>
        Kondisi cuaca di {locationName.replace(' (GPS)', '')} terpantau {weather.label.toLowerCase()}.
      </p>

      {/* Weather Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 0.65rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-muted)', border: 'var(--border-thick)' }}>
          <Droplets size={17} color="var(--color-primary)" strokeWidth={2.5} style={{ flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>{t.humidity}</span>
            <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '800' }}>{current.humidity}%</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 0.65rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-muted)', border: 'var(--border-thick)' }}>
          <Wind size={17} color="var(--color-secondary)" strokeWidth={2.5} style={{ flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>{t.windSpeed}</span>
            <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '800' }}>{current.windSpeed} km/j</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.55rem 0.65rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-muted)', border: 'var(--border-thick)' }}>
          <Gauge size={17} color="var(--color-accent)" strokeWidth={2.5} style={{ flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>{t.pressure}</span>
            <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '800' }}>{Math.round(current.pressure || 1012)} hPa</strong>
          </div>
        </div>
      </div>

    </div>
  );
}
