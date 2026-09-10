import React from 'react';
import { Flame, Compass, ChevronRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import { getNearbyVolcanoes } from '../../services/volcano.js';
import { translations } from '../../utils/i18n.js';

export function VolcanoCard({ location, onOpenModal, onFocusVolcano, lang = 'id' }) {
  const t = translations[lang] || translations.id;
  const { nearest, alertCount } = getNearbyVolcanoes(location?.lat, location?.lon);

  if (!nearest) return null;

  const isHighAlert = nearest.statusLevel >= 3;
  const isNear = nearest.distanceKm <= 50;

  return (
    <div className="flat-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: nearest.status.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <Flame size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
              {t.volcanoTitle}
            </h3>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              {t.volcanoSubtitle}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <span style={{
          fontSize: '0.75rem',
          fontWeight: '800',
          padding: '4px 12px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: nearest.status.color,
          color: '#ffffff'
        }}>
          {nearest.status.code} ({lang === 'en' ? nearest.status.nameEn : nearest.status.name})
        </span>
      </div>

      {/* Main Info Box */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-muted)',
        padding: '1rem 1.15rem',
        borderRadius: 'var(--radius-md)',
        border: 'var(--border-thick)',
        margin: '0.75rem 0',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div>
          <strong style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', display: 'block' }}>
            {nearest.name}
          </strong>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            {nearest.regency}, {nearest.province} · {nearest.elevation}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Compass size={18} color="var(--color-primary)" />
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', fontWeight: '700', textTransform: 'uppercase' }}>
              {t.volcanoDistance}
            </span>
            <span style={{ fontSize: '1.1rem', fontWeight: '800', color: isNear ? 'var(--color-danger)' : 'var(--color-primary)' }}>
              {nearest.distanceKm} km
            </span>
          </div>
        </div>
      </div>

      {/* Advisory Banner */}
      <div style={{
        padding: '0.75rem 1rem',
        backgroundColor: isHighAlert ? 'var(--color-danger-bg)' : 'var(--bg-subtle)',
        border: isHighAlert ? '1.5px solid var(--color-danger)' : 'var(--border-flat)',
        borderRadius: 'var(--radius-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.775rem',
        fontWeight: '600',
        color: isHighAlert ? 'var(--color-danger)' : 'var(--text-main)',
        flexWrap: 'wrap',
        gap: '0.65rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 300px' }}>
          {isHighAlert ? <AlertTriangle size={16} /> : <ShieldCheck size={16} color="var(--color-primary)" />}
          <span>{isHighAlert ? t.volcanoAlertMsg : t.volcanoNormalMsg}</span>
        </div>

        <button
          onClick={onOpenModal}
          className="flat-btn-primary"
          style={{
            padding: '4px 10px',
            minHeight: '30px',
            fontSize: '0.725rem',
            gap: '0.3rem',
            whiteSpace: 'nowrap'
          }}
        >
          <span>{t.volcanoAllBtn}</span>
          <ChevronRight size={14} />
        </button>
      </div>

    </div>
  );
}
