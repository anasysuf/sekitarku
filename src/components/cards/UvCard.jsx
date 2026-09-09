import React from 'react';
import { SunMedium } from 'lucide-react';
import { getUvInfo } from '../../utils/aqi';
import { translations } from '../../utils/i18n';

export function UvCard({ uvIndex, loading, lang = 'id' }) {
  const t = translations[lang] || translations.id;

  if (loading) {
    return (
      <div className="flat-card" style={{ padding: '1.5rem', minHeight: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>Memuat radiasi UV...</p>
      </div>
    );
  }

  const uvInfo = getUvInfo(uvIndex, lang);

  return (
    <div className="flat-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)', backgroundColor: uvInfo.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <SunMedium size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>{t.uvTitle}</h4>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: uvInfo.color }}>
              {uvInfo.label}
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2.2rem', fontWeight: '800', color: uvInfo.color, lineHeight: 1, letterSpacing: '-0.03em' }}>
            {uvInfo.value}
          </div>
        </div>
      </div>
      <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.85rem', margin: 0, paddingTop: '0.85rem', borderTop: 'var(--border-thick)', fontWeight: '500' }}>
        {uvInfo.advice}
      </p>
    </div>
  );
}
