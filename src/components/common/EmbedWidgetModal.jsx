import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Smartphone, Globe, CheckCircle2, AlertCircle } from 'lucide-react';
import { getAqiInfo } from '../../utils/aqi';

export function EmbedWidgetModal({ isOpen, onClose, location, airQualityData, weatherData, lang = 'id' }) {
  const [activeTab, setActiveTab] = useState('android'); // 'android' | 'web'
  const [copiedType, setCopiedType] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cityName = location?.name || location?.city || 'Jakarta';
  const aqiVal = airQualityData?.current?.aqi || 42;
  const aqiInfo = getAqiInfo(aqiVal, lang);
  const temp = Math.round(weatherData?.current?.temperature || weatherData?.current?.temperature_2m || 30);
  const weatherLabel = weatherData?.current?.weatherCodeInfo?.label || 'Cerah Berawan';
  const humidity = weatherData?.current?.relative_humidity_2m || 75;

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sekitarku.vercel.app';
  
  // Web Iframe & Markdown
  const iframeUrl = `${baseUrl}/?embed=true&city=${encodeURIComponent(cityName)}`;
  const iframeCode = `<iframe src="${iframeUrl}" width="340" height="190" frameborder="0" style="border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.1);" title="Sekitarku Live Widget - ${cityName}"></iframe>`;
  const badgeUrl = `${baseUrl}/api/badge?city=${encodeURIComponent(cityName)}&aqi=${aqiVal}&status=${encodeURIComponent(aqiInfo.label)}&temp=${temp}`;
  const markdownBadge = `[![Sekitarku AQI & Cuaca ${cityName}](${badgeUrl})](${baseUrl})`;

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content animate-scale-up"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          width: '95%',
          padding: '1.5rem',
          maxHeight: '90vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          position: 'relative',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 'var(--border-thick)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ padding: '7px', backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary)', borderRadius: 'var(--radius-sm)' }}>
              <Smartphone size={19} strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)' }}>
                Pasang Widget Sekitarku
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Pantau kualitas udara & cuaca langsung di Layar Utama HP Android atau Web Anda
              </p>
            </div>
          </div>
          <button onClick={onClose} className="flat-btn-secondary" style={{ padding: '6px' }} aria-label="Tutup Modal">
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: 'var(--bg-muted)', padding: '4px', borderRadius: 'var(--radius-sm)' }}>
          <button
            onClick={() => setActiveTab('android')}
            style={{
              flex: 1,
              padding: '7px 12px',
              borderRadius: 'var(--radius-sm)',
              border: activeTab === 'android' ? '1px solid var(--color-primary)' : 'none',
              backgroundColor: activeTab === 'android' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'android' ? 'var(--color-primary)' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Smartphone size={15} />
            <span>Widget Layar Utama Android</span>
          </button>

          <button
            onClick={() => setActiveTab('web')}
            style={{
              flex: 1,
              padding: '7px 12px',
              borderRadius: 'var(--radius-sm)',
              border: activeTab === 'web' ? '1px solid var(--color-primary)' : 'none',
              backgroundColor: activeTab === 'web' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'web' ? 'var(--color-primary)' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Globe size={15} />
            <span>Web & Blog (Iframe)</span>
          </button>
        </div>

        {/* TAB 1: ANDROID WIDGET */}
        {activeTab === 'android' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Widget Mockup Preview */}
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', border: 'var(--border-thick)' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Pratinjau Widget Android ({cityName})
              </span>

              <div
                style={{
                  maxWidth: '360px',
                  margin: '0 auto',
                  padding: '1rem 1.15rem',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '16px',
                  border: '1.5px solid var(--border-flat)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>Sekitarku • {cityName}</strong>
                  </div>
                  <span style={{ fontSize: '0.675rem', padding: '2px 7px', borderRadius: '4px', backgroundColor: aqiInfo.bg, color: aqiInfo.color, fontWeight: '800' }}>
                    AQI {aqiVal} · {aqiInfo.label}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '1.65rem', fontWeight: '900', color: 'var(--text-main)', lineHeight: 1 }}>{temp}°C</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>{weatherLabel}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    Lembap: {humidity}%
                  </span>
                </div>
              </div>
            </div>

            {/* Panduan Langkah Pemasangan di Android */}
            <div style={{ padding: '0.95rem 1.15rem', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: 'var(--border-thick)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.6rem' }}>
                <CheckCircle2 size={16} color="var(--color-primary)" />
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  Cara Memasang Widget di Layar Utama HP Android:
                </strong>
              </div>
              <ol style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.775rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                <li>Buka website <strong>sekitarku.vercel.app</strong> melalui browser <strong>Google Chrome</strong> di HP Android Anda.</li>
                <li>Tekan tombol menu titik tiga <strong>(⋮)</strong> di sudut kanan atas Chrome.</li>
                <li>Pilih opsi <strong>"Install Aplikasi"</strong> (atau <em>"Tambahkan ke Layar Utama"</em>).</li>
                <li>Setelah terpasang, pergi ke Layar Utama HP &rarr; <strong>Tekan dan tahan area kosong</strong> &rarr; Pilih <strong>Widget</strong> &rarr; Seret widget <strong>Sekitarku</strong> ke layar utama.</li>
              </ol>
            </div>

            {/* Catatan Kompatibilitas */}
            <div style={{ padding: '0.65rem 0.85rem', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-flat)', fontSize: '0.725rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={14} color="var(--color-secondary)" style={{ flexShrink: 0 }} />
              <span>
                Fitur widget home screen Android didukung pada Chrome versi 115+ dengan sistem PWA standar Google.
              </span>
            </div>

          </div>
        )}

        {/* TAB 2: WEB & BLOG IFRAME */}
        {activeTab === 'web' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Live Preview Box */}
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', border: 'var(--border-thick)' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Pratinjau Widget Live ({cityName})
              </span>

              {/* Mini Card Preview */}
              <div
                style={{
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-md)',
                  border: 'var(--border-thick)',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                    <strong style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>Sekitarku • {cityName}</strong>
                  </div>
                  <span style={{ fontSize: '0.7rem', padding: '2px 7px', borderRadius: '4px', backgroundColor: aqiInfo.bg, color: aqiInfo.color, fontWeight: '800' }}>
                    AQI {aqiVal} ({aqiInfo.label})
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-muted)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <span style={{ fontSize: '1.15rem', fontWeight: '900', color: 'var(--text-main)' }}>{temp}°C</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px' }}>{weatherLabel}</span>
                  </div>
                  <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    Sumber: BMKG
                  </span>
                </div>
              </div>
            </div>

            {/* Code Snippet 1: Iframe */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  1. HTML Iframe (Untuk WordPress, Web & Blog)
                </label>
                <button
                  onClick={() => handleCopy(iframeCode, 'iframe')}
                  className="flat-btn-secondary"
                  style={{ padding: '3px 8px', fontSize: '0.7rem', gap: '4px' }}
                >
                  {copiedType === 'iframe' ? <Check size={12} color="var(--color-primary)" /> : <Copy size={12} />}
                  <span>{copiedType === 'iframe' ? 'Tersalin!' : 'Salin Kode'}</span>
                </button>
              </div>
              <textarea
                readOnly
                value={iframeCode}
                rows={2}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '0.725rem',
                  fontFamily: 'monospace',
                  backgroundColor: 'var(--bg-muted)',
                  border: 'var(--border-flat)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-main)',
                  resize: 'none',
                  lineHeight: 1.4
                }}
              />
            </div>

            {/* Code Snippet 2: Markdown */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.775rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  2. Markdown Badge (Untuk GitHub README / Notion)
                </label>
                <button
                  onClick={() => handleCopy(markdownBadge, 'markdown')}
                  className="flat-btn-secondary"
                  style={{ padding: '3px 8px', fontSize: '0.7rem', gap: '4px' }}
                >
                  {copiedType === 'markdown' ? <Check size={12} color="var(--color-primary)" /> : <Copy size={12} />}
                  <span>{copiedType === 'markdown' ? 'Tersalin!' : 'Salin Markdown'}</span>
                </button>
              </div>
              <input
                readOnly
                value={markdownBadge}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: '0.725rem',
                  fontFamily: 'monospace',
                  backgroundColor: 'var(--bg-muted)',
                  border: 'var(--border-flat)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-main)'
                }}
              />
            </div>

          </div>
        )}

        {/* Footer info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: 'var(--border-thick)', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
          <span>100% Gratis & Real-Time Open Data BMKG</span>
          <button onClick={onClose} className="flat-btn-primary" style={{ padding: '5px 14px', fontSize: '0.775rem' }}>
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
