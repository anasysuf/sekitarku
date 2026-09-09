import React from 'react';
import { Code2, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer style={{ marginTop: '4rem', padding: '2.5rem 0', borderTop: 'var(--border-thick)', textAlign: 'center' }}>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0, fontWeight: '700' }}>
        Sekitarku: Pantauan Lingkungan Hidup & Mitigasi Bencana Real-time
      </p>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontWeight: '500' }}>
        Sumber Data Resmi: BMKG (Badan Meteorologi, Klimatologi, dan Geofisika) & Open-Meteo.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.25rem', fontSize: '0.85rem' }}>
        <a href="https://github.com/anasysuf/sekitarku" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700' }}>
          <Code2 size={16} strokeWidth={2.5} /> GitHub Repository
        </a>
        <a href="https://data.bmkg.go.id" target="_blank" rel="noreferrer" style={{ color: 'var(--color-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700' }}>
          <Globe size={16} strokeWidth={2.5} /> BMKG Open Data
        </a>
      </div>
    </footer>
  );
}
