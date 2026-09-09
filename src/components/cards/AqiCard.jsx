import React from 'react';
import { Wind } from 'lucide-react';
import { getAqiInfo } from '../../utils/aqi';
import { translations } from '../../utils/i18n';

export function AqiCard({ data, loading, lang = 'id' }) {
  const t = translations[lang] || translations.id;

  if (loading) {
    return (
      <div className="flat-card" style={{ padding: '1.5rem', minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>Memuat kualitas udara...</p>
      </div>
    );
  }

  const current = data?.current || {};
  const aqiInfo = getAqiInfo(current.aqi || 0, lang);

  return (
    <div className="flat-card" style={{ padding: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', backgroundColor: aqiInfo.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Wind size={18} strokeWidth={2.5} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>{t.aqiTitle}</h3>
        </div>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: '800',
          padding: '3px 10px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: aqiInfo.color,
          color: '#ffffff'
        }}>
          {aqiInfo.label}
        </span>
      </div>

      {/* Main AQI */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', margin: '1rem 0' }}>
        <div style={{
          fontSize: '3.2rem',
          fontWeight: '800',
          lineHeight: '1',
          color: aqiInfo.color,
          letterSpacing: '-0.04em'
        }}>
          {current.aqi || '--'}
        </div>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>{t.mainParticulate}</span>
          <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: '800' }}>{current.pm25 || 0} µg/m³</strong>
        </div>
      </div>

      {/* Advice */}
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1.25rem 0', lineHeight: '1.45', fontWeight: '500' }}>
        {aqiInfo.advice}
      </p>

      {/* Pollutant Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
        <div style={{ padding: '0.5rem 0.35rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-muted)', textAlign: 'center', border: 'var(--border-thick)' }}>
          <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontWeight: '700' }}>PM10</span>
          <div style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--text-main)' }}>{current.pm10 || 0}</div>
        </div>
        <div style={{ padding: '0.5rem 0.35rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-muted)', textAlign: 'center', border: 'var(--border-thick)' }}>
          <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontWeight: '700' }}>Ozon</span>
          <div style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--text-main)' }}>{current.o3 || 0}</div>
        </div>
        <div style={{ padding: '0.5rem 0.35rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-muted)', textAlign: 'center', border: 'var(--border-thick)' }}>
          <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontWeight: '700' }}>NO₂</span>
          <div style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--text-main)' }}>{current.no2 || 0}</div>
        </div>
        <div style={{ padding: '0.5rem 0.35rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-muted)', textAlign: 'center', border: 'var(--border-thick)' }}>
          <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontWeight: '700' }}>SO₂</span>
          <div style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--text-main)' }}>{current.so2 || 0}</div>
        </div>
      </div>

    </div>
  );
}
