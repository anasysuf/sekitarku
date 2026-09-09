import React, { useState } from 'react';
import { Activity, AlertTriangle, ShieldCheck, MapPin, Clock, ChevronDown, ChevronUp, List } from 'lucide-react';
import { getEarthquakeColor } from '../../utils/aqi';
import { translations } from '../../utils/i18n';

export function EarthquakeCard({ earthquake, recentQuakes = [], onFocusQuake, loading, lang = 'id' }) {
  const [showList, setShowList] = useState(false);
  const t = translations[lang] || translations.id;

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '1.5rem', minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Memuat data BMKG...</p>
      </div>
    );
  }

  if (!earthquake) {
    return (
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Activity size={18} color="var(--accent-brand)" />
          <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>{t.quakeTitle}</h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Tidak ada aktivitas gempa signifikan saat ini.</p>
      </div>
    );
  }

  const magColor = getEarthquakeColor(earthquake.magnitude);
  const isMajor = earthquake.magnitude >= 5.0;

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} color={magColor} />
          <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>{t.quakeTitle}</h3>
        </div>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: '700',
          padding: '3px 8px',
          borderRadius: '4px',
          backgroundColor: `${magColor}15`,
          color: magColor,
          border: `1px solid ${magColor}35`
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
          letterSpacing: '-0.03em'
        }}>
          {earthquake.magnitude}
          <span style={{ fontSize: '1.2rem', fontWeight: '600', marginLeft: '4px' }}>SR</span>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <Clock size={13} />
            <span>{earthquake.date} - {earthquake.time}</span>
          </div>
          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            {t.depth}: {earthquake.depth}
          </div>
        </div>
      </div>

      {/* Location Area */}
      <div style={{
        padding: '0.75rem 0.85rem',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        marginBottom: '1rem',
        fontSize: '0.825rem',
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.5rem'
      }}>
        <MapPin size={15} color={magColor} style={{ flexShrink: 0, marginTop: '2px' }} />
        <span>{earthquake.wilayah}</span>
      </div>

      {/* Tsunami Status & List Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.8rem',
          fontWeight: '600',
          color: isMajor ? 'var(--accent-amber)' : 'var(--accent-brand)'
        }}>
          {isMajor ? <AlertTriangle size={15} /> : <ShieldCheck size={15} />}
          <span>{earthquake.potensi || t.noTsunami}</span>
        </div>

        {recentQuakes.length > 0 && (
          <button
            onClick={() => setShowList(!showList)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.75rem',
              fontWeight: '600',
              padding: '4px 8px',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer'
            }}
          >
            <List size={13} />
            <span>{showList ? t.closeQuakesBtn : t.recentQuakesBtn}</span>
            {showList ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        )}
      </div>

      {/* Collapsible History */}
      {showList && (
        <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
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
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  cursor: onFocusQuake ? 'pointer' : 'default',
                  fontSize: '0.75rem',
                  gap: '0.5rem'
                }}
              >
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: 1 }}>
                  <span style={{ fontWeight: '700', color: color, marginRight: '6px' }}>M {q.magnitude}</span>
                  <span style={{ color: 'var(--text-primary)' }}>{q.wilayah}</span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', whiteSpace: 'nowrap' }}>{q.time}</span>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
