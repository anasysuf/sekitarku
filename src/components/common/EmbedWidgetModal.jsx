import React, { useState } from 'react';
import { X, Copy, Check, Code, Globe } from 'lucide-react';
import { getAqiInfo } from '../../utils/aqi';

export function EmbedWidgetModal({ isOpen, onClose, location, airQualityData, weatherData, lang = 'id' }) {
  const [copiedType, setCopiedType] = useState(null);

  if (!isOpen) return null;

  const cityName = location?.name || location?.city || 'Jakarta';
  const aqiVal = airQualityData?.current?.aqi || 42;
  const aqiInfo = getAqiInfo(aqiVal, lang);
  const temp = Math.round(weatherData?.current?.temperature || weatherData?.current?.temperature_2m || 30);
  const weatherLabel = weatherData?.current?.weatherCodeInfo?.label || 'Cerah Berawan';

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sekitarku.vercel.app';
  
  // Embed Iframe URL
  const iframeUrl = `${baseUrl}/?embed=true&city=${encodeURIComponent(cityName)}`;
  const iframeCode = `<iframe src="${iframeUrl}" width="340" height="190" frameborder="0" style="border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.1);" title="Sekitarku Live Widget - ${cityName}"></iframe>`;

  // Dynamic SVG Badge URL
  const badgeUrl = `${baseUrl}/api/badge?city=${encodeURIComponent(cityName)}&aqi=${aqiVal}&status=${encodeURIComponent(aqiInfo.label)}&temp=${temp}`;
  const markdownBadge = `[![Sekitarku AQI & Cuaca ${cityName}](${badgeUrl})](${baseUrl})`;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div
        className="modal-content animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px', padding: '1.75rem', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ padding: '6px', backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary)', borderRadius: 'var(--radius-sm)' }}>
              <Code size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>
                Pasang Widget di Web & Blog
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Tampilkan kualitas udara & cuaca real-time di website Anda
              </p>
            </div>
          </div>
          <button onClick={onClose} className="flat-btn-secondary" style={{ padding: '6px' }} aria-label="Tutup">
            <X size={18} />
          </button>
        </div>

        {/* Live Preview Box */}
        <div style={{ marginBottom: '1.5rem', padding: '1.25rem', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', border: 'var(--border-thick)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Pratinjau Widget Live ({cityName})
          </span>

          {/* Mini Interactive Card Preview */}
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              border: 'var(--border-thick)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.1rem' }}>🌿</span>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Sekitarku • {cityName}</strong>
              </div>
              <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: aqiInfo.bg, color: aqiInfo.color, fontWeight: '800' }}>
                AQI {aqiVal} ({aqiInfo.label})
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-muted)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)' }}>
              <div>
                <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main)' }}>{temp}°C</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px' }}>{weatherLabel}</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Sumber: BMKG
              </span>
            </div>
          </div>

          {/* SVG Badge Preview */}
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', fontWeight: '600' }}>
              Pratinjau Markdown / SVG Badge:
            </span>
            <div style={{ display: 'inline-flex', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
              <div style={{ backgroundColor: '#059669', color: '#fff', padding: '4px 8px', fontSize: '0.7rem', fontWeight: '800' }}>🌿 Sekitarku</div>
              <div style={{ backgroundColor: '#1e293b', color: '#fff', padding: '4px 8px', fontSize: '0.7rem' }}>{cityName} ({temp}°C)</div>
              <div style={{ backgroundColor: aqiInfo.color, color: '#fff', padding: '4px 8px', fontSize: '0.7rem', fontWeight: '800' }}>AQI {aqiVal} • {aqiInfo.label}</div>
            </div>
          </div>
        </div>

        {/* Code Snippet 1: Iframe */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)' }}>
              1. HTML Iframe (Untuk WordPress, Web & Blog)
            </label>
            <button
              onClick={() => handleCopy(iframeCode, 'iframe')}
              className="flat-btn-secondary"
              style={{ padding: '3px 8px', fontSize: '0.725rem', gap: '4px' }}
            >
              {copiedType === 'iframe' ? <Check size={13} color="var(--color-primary)" /> : <Copy size={13} />}
              <span>{copiedType === 'iframe' ? 'Tersalin!' : 'Salin Kode'}</span>
            </button>
          </div>
          <textarea
            readOnly
            value={iframeCode}
            rows={2}
            style={{
              width: '100%',
              padding: '0.6rem',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              backgroundColor: 'var(--bg-muted)',
              border: 'var(--border-flat)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-main)',
              resize: 'none'
            }}
          />
        </div>

        {/* Code Snippet 2: Markdown */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)' }}>
              2. Markdown Badge (Untuk GitHub README / Notion)
            </label>
            <button
              onClick={() => handleCopy(markdownBadge, 'markdown')}
              className="flat-btn-secondary"
              style={{ padding: '3px 8px', fontSize: '0.725rem', gap: '4px' }}
            >
              {copiedType === 'markdown' ? <Check size={13} color="var(--color-primary)" /> : <Copy size={13} />}
              <span>{copiedType === 'markdown' ? 'Tersalin!' : 'Salin Markdown'}</span>
            </button>
          </div>
          <input
            readOnly
            value={markdownBadge}
            style={{
              width: '100%',
              padding: '0.6rem',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              backgroundColor: 'var(--bg-muted)',
              border: 'var(--border-flat)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-main)'
            }}
          />
        </div>

        {/* Footer info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: 'var(--border-thick)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>100% Gratis & Real-Time Open Data</span>
          <button onClick={onClose} className="flat-btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
