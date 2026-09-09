import React, { useState } from 'react';
import { Activity, AlertTriangle, ShieldCheck, MapPin, Clock, ChevronDown, ChevronUp, List } from 'lucide-react';
import { getEarthquakeColor } from '../../utils/aqi';
import { translations } from '../../utils/i18n';

export function EarthquakeCard({ earthquake, recentQuakes = [], onFocusQuake, loading, lang = 'id' }) {
  const [showList, setShowList] = useState(false);
  const t = translations[lang] || translations.id;

  if (loading) {
    return (
      <div className="flat-card" style={{ padding: '1.5rem', minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>Memuat data seismik BMKG...</p>
      </div>
    );
  }

  if (!earthquake) {
    return (
      <div className="flat-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Activity size={18} strokeWidth={2.5} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0 }}>{t.quakeTitle}</h3>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>Tidak ada gempa signifikan saat ini.</p>
      </div>
    );
  }

  const magColor = getEarthquakeColor(earthquake.magnitude);
  const isMajor = earthquake.magnitude >= 5.0;

  return (
    <div className="flat-card" style={{ padding: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', backgroundColor: magColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Activity size={18} strokeWidth={2.5} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>{t.quakeTitle}</h3>
        </div>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: '800',
          padding: '3px 10px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: magColor,
          color: '#ffffff'
        }}>
          M {earthquake.magnitude}
        </span>
      </div>

      {/* Magnitude & Depth */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', margin: '1rem 0' }}>
        <div style={{
          fontSize: '3.2rem',
          fontWeight: '800',
          lineHeight: '1',
          color: magColor,
          letterSpacing: '-0.04em'
        }}>
          {earthquake.magnitude}
          <span style={{ fontSize: '1.2rem', fontWeight: '700', marginLeft: '4px' }}>SR</span>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.775rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            <Clock size={13} strokeWidth={2.2} />
            <span>{earthquake.date} - {earthquake.time}</span>
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.2rem' }}>
            {t.depth}: {earthquake.depth}
          </div>
        </div>
      </div>

      {/* Location Area */}
      <div style={{
        padding: '0.7rem 0.85rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--bg-muted)',
        border: 'var(--border-thick)',
        marginBottom: '1rem',
        fontSize: '0.825rem',
        fontWeight: '600',
        color: 'var(--text-main)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.5rem'
      }}>
        <MapPin size={16} color={magColor} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: '1px' }} />
        <span>{earthquake.wilayah}</span>
      </div>

      {/* Tsunami Status & List Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.8rem',
          fontWeight: '800',
          color: isMajor ? 'var(--color-accent)' : 'var(--color-secondary)'
        }}>
          {isMajor ? <AlertTriangle size={16} strokeWidth={2.5} /> : <ShieldCheck size={16} strokeWidth={2.5} />}
          <span>{earthquake.potensi || t.noTsunami}</span>
        </div>

        {recentQuakes.length > 0 && (
          <button
            onClick={() => setShowList(!showList)}
            className="flat-btn-secondary"
            style={{
              minHeight: '32px',
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem'
            }}
          >
            <List size={13} strokeWidth={2.2} />
            <span>{showList ? t.closeQuakesBtn : t.recentQuakesBtn}</span>
            {showList ? <ChevronUp size={13} strokeWidth={2.2} /> : <ChevronDown size={13} strokeWidth={2.2} />}
          </button>
        )}
      </div>

      {/* Collapsible History */}
      {showList && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: 'var(--border-thick)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {recentQuakes.slice(0, 5).map((q, idx) => {
            const color = getEarthquakeColor(q.magnitude);
            return (
              <div
                key={q.id || idx}
                onClick={() => onFocusQuake && onFocusQuake(q)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-muted)',
                  border: 'var(--border-thick)',
                  cursor: onFocusQuake ? 'pointer' : 'default',
                  fontSize: '0.75rem',
                  gap: '0.5rem',
                  transition: 'transform var(--anim-fast)'
                }}
              >
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: 1 }}>
                  <span style={{ fontWeight: '800', color: color, marginRight: '6px' }}>M {q.magnitude}</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{q.wilayah}</span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', whiteSpace: 'nowrap', fontWeight: '500' }}>{q.time}</span>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
