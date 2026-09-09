import React from 'react';
import { HeartPulse, Bike, Footprints, Baby, Wind, ShieldCheck } from 'lucide-react';
import { calculateEcoHealthScore } from '../../utils/healthIndex';
import { translations } from '../../utils/i18n';

export function EcoHealthCard({ aqiData, weatherData, loading, lang = 'id' }) {
  const t = translations[lang] || translations.id;

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '1.75rem', minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Memuat kondisi lingkungan...</p>
      </div>
    );
  }

  const aqi = aqiData?.current?.aqi || 0;
  const pm25 = aqiData?.current?.pm25 || 0;
  const temp = weatherData?.current?.temp || 28;
  const humidity = weatherData?.current?.humidity || 70;
  const uvIndex = weatherData?.current?.uvIndex || 0;

  const health = calculateEcoHealthScore(aqi, temp, humidity, uvIndex, pm25);

  return (
    <div
      className="glass-card animate-fade-in"
      style={{
        padding: '1.5rem',
        marginBottom: '1.25rem'
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
        
        {/* Top: Score & Summary */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            
            {/* Score Badge */}
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: health.bg,
                border: `1px solid ${health.color}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <span style={{ fontSize: '1.45rem', fontWeight: '800', color: health.color, lineHeight: 1 }}>
                {health.score}
              </span>
              <span style={{ fontSize: '0.6rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                /100
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: health.color }}>
                  {t.ecoTitle}
                </span>
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '0.1rem 0', color: 'var(--text-primary)' }}>
                {lang === 'en' ? health.categoryEn : health.category}
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                {t.ecoSubtitle}
              </p>
            </div>

          </div>

          {/* Exposure Pill */}
          <div
            style={{
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: health.cigs > 1.5 ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-surface-subtle)',
              border: health.cigs > 1.5 ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <HeartPulse size={16} color={health.cigs > 1.5 ? 'var(--accent-rose)' : 'var(--accent-brand)'} />
            <div>
              <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', display: 'block' }}>
                {t.exposure}
              </span>
              <strong style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                {health.cigs > 0
                  ? `${health.cigs} ${t.cigsUnit}`
                  : t.cleanAir}
              </strong>
            </div>
          </div>

        </div>

        {/* Outdoor Activities Matrix */}
        <div style={{ paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.65rem' }}>
            <ShieldCheck size={14} color="var(--accent-brand)" />
            <span style={{ fontSize: '0.725rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              {t.activitiesTitle}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)' }}>
              <Footprints size={16} color={health.activities.jogging.color} />
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', display: 'block' }}>Jogging</span>
                <strong style={{ fontSize: '0.775rem', color: health.activities.jogging.color }}>
                  {lang === 'en' ? health.activities.jogging.statusEn : health.activities.jogging.status}
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)' }}>
              <Bike size={16} color={health.activities.cycling.color} />
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', display: 'block' }}>Sepeda</span>
                <strong style={{ fontSize: '0.775rem', color: health.activities.cycling.color }}>
                  {lang === 'en' ? health.activities.cycling.statusEn : health.activities.cycling.status}
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)' }}>
              <Baby size={16} color={health.activities.kidsAndSeniors.color} />
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', display: 'block' }}>Anak & Lansia</span>
                <strong style={{ fontSize: '0.775rem', color: health.activities.kidsAndSeniors.color }}>
                  {lang === 'en' ? health.activities.kidsAndSeniors.statusEn : health.activities.kidsAndSeniors.status}
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-color)' }}>
              <Wind size={16} color={health.activities.ventilation.color} />
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', display: 'block' }}>Ventilasi</span>
                <strong style={{ fontSize: '0.775rem', color: health.activities.ventilation.color }}>
                  {lang === 'en' ? health.activities.ventilation.statusEn : health.activities.ventilation.status}
                </strong>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
