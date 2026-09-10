import React from 'react';
import { Wind } from 'lucide-react';
import { getAqiInfo } from '../../utils/aqi';
import { translations } from '../../utils/i18n';

export function AqiCard({ data, loading }) {
  const t = translations;

  if (loading) {
    return (
      <div className="flat-card" style={{ padding: '1.5rem', minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>Memuat kualitas udara...</p>
      </div>
    );
  }

  const current = data?.current || {};
  const aqi = Number(current.aqi) || 0;
  const aqiInfo = getAqiInfo(aqi);

  // Position percentage on standard 0-500 AQI scale
  const needlePercent = Math.min(100, Math.max(0, (aqi / 500) * 100));

  return (
    <div className="flat-card" style={{ padding: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
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

      {/* Main AQI Numeric Readout */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.85rem', margin: '0.85rem 0 0.5rem 0' }}>
        <div style={{
          fontSize: '3.4rem',
          fontWeight: '800',
          lineHeight: '1',
          color: aqiInfo.color,
          letterSpacing: '-0.04em'
        }}>
          {current.aqi || '--'}
        </div>
        <div>
          <strong style={{ fontSize: '1.15rem', color: 'var(--text-main)', display: 'block', fontWeight: '800', lineHeight: 1.2 }}>
            {aqiInfo.label}
          </strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            Indeks partikulat polusi aktif
          </span>
        </div>
      </div>

      {/* Official 0-500 Continuous Gauge Scale Bar with Needle Position Marker */}
      <div style={{ margin: '1.25rem 0 0.5rem 0' }}>
        <div
          style={{
            height: '10px',
            width: '100%',
            borderRadius: '4px',
            background: 'linear-gradient(to right, #10b981 0%, #10b981 10%, #eab308 10%, #eab308 20%, #f97316 20%, #f97316 30%, #ef4444 30%, #ef4444 40%, #a855f7 40%, #a855f7 60%, #7f1d1d 60%, #7f1d1d 100%)',
            position: 'relative',
            border: '1px solid rgba(0, 0, 0, 0.1)'
          }}
          title={`Posisi AQI: ${aqi} dari skala 500`}
        >
          {/* Vertical Needle / Pointer Indicator */}
          <div
            style={{
              position: 'absolute',
              top: '-6px',
              left: `${needlePercent}%`,
              width: '4px',
              height: '22px',
              backgroundColor: 'var(--text-main)',
              border: '1px solid #ffffff',
              borderRadius: '2px',
              transform: 'translateX(-50%)',
              transition: 'left 600ms cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
            }}
          />
        </div>

        {/* Scale Ticks / Threshold Indicators */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.675rem',
          color: 'var(--text-muted)',
          fontWeight: '600',
          marginTop: '0.45rem'
        }}>
          <span>0 Baik</span>
          <span>100 Sedang</span>
          <span>150 Sensitif</span>
          <span>200 Bahaya</span>
          <span>500 Max</span>
        </div>
      </div>

      {/* Advice */}
      <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.85rem 0 1.15rem 0', lineHeight: '1.45', fontWeight: '500' }}>
        {aqiInfo.advice}
      </p>

      {/* Pollutant Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
        <div style={{ padding: '0.5rem 0.35rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-muted)', textAlign: 'center', border: 'var(--border-thick)' }}>
          <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontWeight: '700' }}>PM2.5</span>
          <div style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--text-main)' }}>{current.pm25 || 0}</div>
        </div>
        <div style={{ padding: '0.5rem 0.35rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-muted)', textAlign: 'center', border: 'var(--border-thick)' }}>
          <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontWeight: '700' }}>PM10</span>
          <div style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--text-main)' }}>{current.pm10 || 0}</div>
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
