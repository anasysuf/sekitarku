import React, { useState } from 'react';
import { Activity, AlertTriangle, ShieldCheck, MapPin, Clock, ChevronDown, ChevronUp, List } from 'lucide-react';
import { getEarthquakeColor } from '../../utils/aqi';
import { translations } from '../../utils/i18n';

export function EarthquakeCard({ earthquake, recentQuakes = [], onFocusQuake, loading, lang = 'id' }) {
  const [showList, setShowList] = useState(false);
  const t = translations[lang] || translations.id;

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '1.25rem', minHeight: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Memuat data BMKG...</p>
      </div>
    );
  }

  if (!earthquake) {
    return (
      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.75rem' }}>
          <Activity size={16} color="var(--accent-brand)" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>{t.quakeTitle}</h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem' }}>Tidak ada gempa signifikan tercatat saat ini.</p>
      </div>
    );
  }

  const magColor = getEarthquakeColor(earthquake.magnitude);
  const isMajor = earthquake.magnitude >= 5.0;

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '1.25rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Activity size={16} color={magColor} />
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0 }}>{t.quakeTitle}</h3>
        </div>
        <span style={{
          fontSize: '0.725rem',
          fontWeight: '700',
          padding: '2px 8px',
          borderRadius: '4px',
          backgroundColor: `${magColor}15`,
          color: magColor,
          border: `1px solid ${magColor}35`
        }}>
          M {earthquake.magnitude}
        </span>
      </div>

      {/* Magnitude & Depth */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.75rem 0' }}>
        <div style={{
          fontSize: '2.8rem',
          fontWeight: '800',
          lineHeight: '1',
          color: magColor,
          letterSpacing: '-0.03em'
        }}>
          {earthquake.magnitude}
          <span style={{ fontSize: '1.1rem', fontWeight: '600', marginLeft: '3px' }}>SR</span>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <Clock size={12} />
            <span>{earthquake.date} - {earthquake.time}</span>
          </div>
          <div style={{ fontSize: '0.825rem', fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.15rem' }}>
            {t.depth}: {earthquake.depth}
          </div>
        </div>
      </div>

      {/* Location Area */}
      <div style={{
        padding: '0.6rem 0.75rem',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: 'var(--bg-surface-subtle)',
        border: '1px solid var(--border-color)',
        marginBottom: '0.85rem',
        fontSize: '0.775rem',
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.45rem'
      }}>
        <MapPin size={14} color={magColor} style={{ flexShrink: 0, marginTop: '2px' }} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{earthquake.wilayah}</span>
      </div>

      {/* Tsunami Status & List Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.775rem',
          fontWeight: '600',
          color: isMajor ? 'var(--accent-amber)' : 'var(--accent-brand)'
        }}>
          {isMajor ? <AlertTriangle size={14} /> : <ShieldCheck size={14} />}
          <span>{earthquake.potensi || t.noTsunami}</span>
        </div>

        {recentQuakes.length > 0 && (
          <button
            onClick={() => setShowList(!showList)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.725rem',
              fontWeight: '600',
              padding: '3px 7px',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-surface-subtle)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              cursor: 'pointer'
            }}
          >
            <List size={12} />
            <span>{showList ? t.closeQuakesBtn : t.recentQuakesBtn}</span>
            {showList ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        )}
      </div>

      {/* Collapsible History */}
      {showList && (
        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
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
                  padding: '5px 7px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  border: '1px solid var(--border-color)',
                  cursor: onFocusQuake ? 'pointer' : 'default',
                  fontSize: '0.725rem',
                  gap: '0.5rem'
                }}
              >
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: 1 }}>
                  <span style={{ fontWeight: '700', color: color, marginRight: '5px' }}>M {q.magnitude}</span>
                  <span style={{ color: 'var(--text-primary)' }}>{q.wilayah}</span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.675rem', whiteSpace: 'nowrap' }}>{q.time}</span>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
