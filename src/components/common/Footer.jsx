import React from 'react';
import { Code2, Globe, Coffee, Code } from 'lucide-react';

export function Footer({ onOpenWidget }) {
  return (
    <footer style={{ marginTop: '4rem', padding: '2.5rem 0', borderTop: 'var(--border-thick)', textAlign: 'center' }}>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0, fontWeight: '700' }}>
        Sekitarku: Pantauan Lingkungan Hidup & Mitigasi Bencana Real-time
      </p>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontWeight: '500' }}>
        Sumber Data Resmi: BMKG (Badan Meteorologi, Klimatologi, dan Geofisika) & Open-Meteo.
      </p>

      {/* Traktir Kopi & Widget Action Buttons */}
      <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'center' }}>
        {onOpenWidget && (
          <button
            onClick={onOpenWidget}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 1.15rem',
              backgroundColor: 'var(--color-secondary-bg)',
              color: 'var(--color-secondary)',
              border: '1px solid var(--color-secondary)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            <Code size={17} strokeWidth={2.5} />
            <span>Pasang Widget</span>
          </button>
        )}
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

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.25rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
        <a
          href="https://github.com/anasysuf/sekitarku"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700' }}
        >
          <Code2 size={16} strokeWidth={2.5} /> GitHub Repository
        </a>
        <a
          href="https://data.bmkg.go.id"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700' }}
        >
          <Globe size={16} strokeWidth={2.5} /> BMKG Open Data
        </a>
      </div>
    </footer>
  );
}
