import React from 'react';
import { SunMedium } from 'lucide-react';
import { getUvInfo } from '../../utils/aqi';
import { translations } from '../../utils/i18n';

export function UvCard({ uvIndex, loading, lang = 'id' }) {
  const t = translations[lang] || translations.id;

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '1.25rem', minHeight: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Memuat data UV...</p>
      </div>
    );
  }

  const uvInfo = getUvInfo(uvIndex, lang);

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SunMedium size={20} color={uvInfo.color} />
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', margin: 0 }}>{t.uvTitle}</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>{t.uvSubtitle}</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: uvInfo.color, lineHeight: 1 }}>
            {uvInfo.value}
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: uvInfo.color }}>
            {uvInfo.label}
          </span>
        </div>
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.65rem', margin: 0, paddingTop: '0.65rem', borderTop: '1px solid var(--border-color)' }}>
        {uvInfo.advice}
      </p>
    </div>
  );
}
