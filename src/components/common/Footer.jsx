import React from 'react';
import { Code2, Globe, Coffee, Code, Flame, Mountain } from 'lucide-react';

export function Footer({ onOpenWidget }) {
  return (
    <footer style={{ marginTop: '4rem', padding: '2.5rem 0', borderTop: 'var(--border-thick)', textAlign: 'center' }}>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0, fontWeight: '700' }}>
        Sekitarku: Pantauan Lingkungan Hidup & Mitigasi Bencana Real-time
      </p>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontWeight: '500', maxWidth: '720px', margin: '0.4rem auto 0 auto', lineHeight: 1.6 }}>
        Sumber Data Resmi: <strong>BMKG</strong> (Meteorologi, Klimatologi & Geofisika), <strong>PVMBG / Magma Indonesia</strong> (Aktivitas Gunung Api), <strong>NASA FIRMS</strong> (Satelit Titik Panas Karhutla), dan <strong>Open-Meteo / Copernicus</strong> (Kualitas Udara ISPU & AQI).
      </p>

      {/* Traktir Kopi Support Button */}
      <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'center' }}>
        <a
          href="https://sociabuzz.com/1rengblox/tribe"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.55rem 1.15rem',
            backgroundColor: 'rgba(245, 158, 11, 0.12)',
            color: '#d97706',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            fontWeight: '800',
            textDecoration: 'none',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.08)'
          }}
        >
          <Coffee size={17} strokeWidth={2.5} />
          <span>Traktir Kopi</span>
        </a>
      </div>

      {/* Footer Navigation Links with Credit Badges */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.25rem', marginTop: '1.25rem', fontSize: '0.8rem', flexWrap: 'wrap' }}>
        <a
          href="https://github.com/anasysuf/sekitarku"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: '700' }}
        >
          <Code2 size={15} strokeWidth={2.5} /> GitHub Repository
        </a>

        {onOpenWidget && (
          <button
            onClick={onOpenWidget}
            style={{
              color: '#0284c7',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontWeight: '700',
              fontSize: '0.8rem',
              padding: 0
            }}
          >
            <Code size={15} strokeWidth={2.5} /> Pasang Widget
          </button>
        )}

        <a
          href="https://data.bmkg.go.id"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: '700' }}
        >
          <Globe size={15} strokeWidth={2.5} /> BMKG Open Data
        </a>

        <a
          href="https://magma.esdm.go.id"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#d97706', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: '700' }}
        >
          <Mountain size={15} strokeWidth={2.5} /> PVMBG Magma
        </a>

        <a
          href="https://firms.modaps.eosdis.nasa.gov"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#ef4444', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: '700' }}
        >
          <Flame size={15} strokeWidth={2.5} /> NASA FIRMS
        </a>
      </div>
    </footer>
  );
}
