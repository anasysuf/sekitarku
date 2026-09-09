import React from 'react';
import { Wind } from 'lucide-react';
import { getAqiInfo } from '../../utils/aqi';
import { translations } from '../../utils/i18n';

export function AqiCard({ data, loading, lang = 'id' }) {
  const t = translations[lang] || translations.id;

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '1.25rem', minHeight: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Memuat AQI...</p>
      </div>
    );
  }

  const current = data?.current || {};
  const aqiInfo = getAqiInfo(current.aqi || 0, lang);

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '1.25rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Wind size={16} color={aqiInfo.color} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>{t.aqiTitle}</h3>
        </div>
        <span style={{
          fontSize: '0.725rem',
          fontWeight: '700',
          padding: '2px 8px',
          borderRadius: '4px',
          backgroundColor: aqiInfo.bg,
          color: aqiInfo.color,
          border: `1px solid ${aqiInfo.color}40`
        }}>
          {aqiInfo.label}
        </span>
      </div>

      {/* Main AQI */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.85rem', margin: '0.75rem 0' }}>
        <div style={{
          fontSize: '2.8rem',
          fontWeight: '800',
          lineHeight: '1',
          color: aqiInfo.color,
          letterSpacing: '-0.03em'
        }}>
          {current.aqi || '--'}
        </div>
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>{t.mainParticulate}</span>
          <strong style={{ fontSize: '0.925rem', color: 'var(--text-primary)' }}>{current.pm25 || 0} µg/m³</strong>
        </div>
      </div>

      {/* Advice */}
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0', lineHeight: '1.45' }}>
        {aqiInfo.advice}
      </p>

      {/* Pollutant Breakdown */}
      <div className="pollutant-grid">
        <div style={{ padding: '0.5rem 0.35rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-subtle)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>PM10</span>
          <div style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-primary)' }}>{current.pm10 || 0}</div>
        </div>
        <div style={{ padding: '0.5rem 0.35rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-subtle)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Ozon</span>
          <div style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-primary)' }}>{current.o3 || 0}</div>
        </div>
        <div style={{ padding: '0.5rem 0.35rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-subtle)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>NO₂</span>
          <div style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-primary)' }}>{current.no2 || 0}</div>
        </div>
        <div style={{ padding: '0.5rem 0.35rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-subtle)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>SO₂</span>
          <div style={{ fontSize: '0.825rem', fontWeight: '700', color: 'var(--text-primary)' }}>{current.so2 || 0}</div>
        </div>
      </div>

    </div>
  );
}
