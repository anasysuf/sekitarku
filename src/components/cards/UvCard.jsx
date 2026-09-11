import React from 'react';
import { SunMedium, Info } from 'lucide-react';
import { getUvInfo } from '../../utils/aqi';
import { translations } from '../../utils/i18n';

export function UvCard({ uvIndex, loading }) {
  const t = translations;

  if (loading) {
    return (
      <div className="flat-card animate-pulse" style={{ padding: '1.5rem', minHeight: '220px' }}>
        <div style={{ height: '24px', width: '45%', backgroundColor: 'var(--bg-muted)', borderRadius: '4px', marginBottom: '1rem' }} />
        <div style={{ height: '54px', width: '30%', backgroundColor: 'var(--bg-muted)', borderRadius: '6px', marginBottom: '0.85rem' }} />
        <div style={{ height: '8px', backgroundColor: 'var(--bg-muted)', borderRadius: '999px', marginBottom: '1rem' }} />
        <div style={{ height: '36px', backgroundColor: 'var(--bg-muted)', borderRadius: '6px' }} />
      </div>
    );
  }

  const uvInfo = getUvInfo(uvIndex);
  const numVal = Number(uvInfo.value) || 0;
  const progressPercent = Math.min(100, Math.max(8, (numVal / 12) * 100));

  return (
    <div className="flat-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: uvInfo.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <SunMedium size={18} strokeWidth={2.5} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
              {t.uvTitle}
            </h3>
          </div>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: '800',
            padding: '3px 10px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: uvInfo.color,
            color: '#ffffff'
          }}>
            {uvInfo.label}
          </span>
        </div>

        {/* Main UV Readout */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.85rem', margin: '0.85rem 0 0.5rem 0' }}>
          <div style={{
            fontSize: '3.4rem',
            fontWeight: '800',
            lineHeight: '1',
            color: uvInfo.color,
            letterSpacing: '-0.04em'
          }}>
            {uvInfo.value}
          </div>
          <div>
            <strong style={{ fontSize: '1.15rem', color: 'var(--text-main)', display: 'block', fontWeight: '800', lineHeight: 1.2 }}>
              {uvInfo.label}
            </strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              {t.uvSubtitle || 'Indeks Paparan Ultraviolet Global'}
            </span>
          </div>
        </div>

        {/* Progress Track */}
        <div style={{
          width: '100%',
          height: '6px',
          borderRadius: '999px',
          backgroundColor: 'var(--bg-muted)',
          overflow: 'hidden',
          margin: '0.75rem 0 0.5rem 0'
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            backgroundColor: uvInfo.color,
            borderRadius: '999px',
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Footer Advice */}
      <div style={{
        marginTop: '0.75rem',
        paddingTop: '0.75rem',
        borderTop: 'var(--border-thick)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        fontSize: '0.8rem',
        color: 'var(--text-main)',
        fontWeight: '600',
        lineHeight: 1.35
      }}>
        <Info size={15} color="var(--color-primary)" style={{ flexShrink: 0 }} />
        <span>{uvInfo.advice}</span>
      </div>
    </div>
  );
}
