import React from 'react';
import { HeartPulse, Bike, Footprints, Baby, Wind, ShieldCheck } from 'lucide-react';
import { calculateEcoHealthScore } from '../../utils/healthIndex';
import { translations } from '../../utils/i18n';

export function EcoHealthCard({ aqiData, weatherData, loading }) {
  const t = translations;

  

  const aqi = aqiData?.current?.aqi || 0;
  const pm25 = aqiData?.current?.pm25 || 0;
  const temp = weatherData?.current?.temp || 28;
  const humidity = weatherData?.current?.humidity || 70;
  const uvIndex = weatherData?.current?.uvIndex || 0;

  const health = calculateEcoHealthScore(aqi, temp, humidity, uvIndex, pm25);

  return (
    <div
      className="flat-card"
      style={{
        padding: '1.75rem',
        marginBottom: '1.5rem',
        backgroundColor: 'var(--bg-card)'
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        
        {/* Top: Score & Summary */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            
            {/* Flat Score Badge */}
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: health.color,
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <span style={{ fontSize: '1.75rem', fontWeight: '800', lineHeight: 1 }}>
                {health.score}
              </span>
              <span style={{ fontSize: '0.65rem', fontWeight: '700', opacity: 0.9 }}>
                /100
              </span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', color: health.color, display: 'block' }}>
                {t.ecoTitle}
              </span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', margin: '0.1rem 0', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                {health.category}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, fontWeight: '500' }}>
                {t.ecoSubtitle}
              </p>
            </div>

          </div>

          {/* Exposure Block */}
          <div
            style={{
              padding: '0.65rem 1.15rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: health.cigs > 1.5 ? 'var(--color-danger-bg)' : 'var(--bg-muted)',
              border: health.cigs > 1.5 ? '2px solid var(--color-danger)' : 'var(--border-thick)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: health.cigs > 1.5 ? 'var(--color-danger)' : 'var(--color-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <HeartPulse size={20} strokeWidth={2.5} />
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>
                {t.exposure}
              </span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '800' }}>
                {health.cigs > 0
                  ? `${health.cigs} ${t.cigsUnit}`
                  : t.cleanAir}
              </strong>
            </div>
          </div>

        </div>

        {/* Outdoor Activities Matrix */}
        <div style={{ paddingTop: '1.25rem', borderTop: 'var(--border-thick)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.85rem' }}>
            <ShieldCheck size={16} color="var(--color-secondary)" strokeWidth={2.5} />
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t.activitiesTitle}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.65rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-muted)', border: 'var(--border-thick)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', backgroundColor: health.activities.jogging.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                <Footprints size={16} strokeWidth={2.5} />
              </div>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Jogging</span>
                <strong style={{ fontSize: '0.825rem', color: 'var(--text-main)', fontWeight: '800' }}>
                  {health.activities.jogging.status}
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-muted)', border: 'var(--border-thick)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', backgroundColor: health.activities.cycling.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                <Bike size={16} strokeWidth={2.5} />
              </div>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Sepeda</span>
                <strong style={{ fontSize: '0.825rem', color: 'var(--text-main)', fontWeight: '800' }}>
                  {health.activities.cycling.status}
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-muted)', border: 'var(--border-thick)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', backgroundColor: health.activities.kidsAndSeniors.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                <Baby size={16} strokeWidth={2.5} />
              </div>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Anak & Lansia</span>
                <strong style={{ fontSize: '0.825rem', color: 'var(--text-main)', fontWeight: '800' }}>
                  {health.activities.kidsAndSeniors.status}
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-muted)', border: 'var(--border-thick)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', backgroundColor: health.activities.ventilation.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                <Wind size={16} strokeWidth={2.5} />
              </div>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Ventilasi</span>
                <strong style={{ fontSize: '0.825rem', color: 'var(--text-main)', fontWeight: '800' }}>
                  {health.activities.ventilation.status}
                </strong>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
