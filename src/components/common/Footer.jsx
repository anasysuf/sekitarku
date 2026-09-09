import React from 'react';
import { Code2, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer style={{ marginTop: '4rem', padding: '2rem 0', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
      <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0 }}>
        Dibuat untuk pemantauan kualitas lingkungan hidup di seluruh Indonesia.
      </p>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
        Sumber Data: BMKG (Badan Meteorologi, Klimatologi, dan Geofisika) & Open-Meteo API.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.25rem', fontSize: '0.8rem' }}>
        <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Code2 size={15} /> Open Source (MIT)
        </a>
        <a href="https://data.bmkg.go.id" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Globe size={15} /> BMKG Open Data
        </a>
      </div>
    </footer>
  );
}
