import React from 'react';
import { Flame, Compass, ChevronRight, AlertTriangle, ShieldCheck, Wind } from 'lucide-react';
import { getHazeStatus } from '../../utils/karhutla.js';
import { translations } from '../../utils/i18n.js';

export function KarhutlaCard({ karhutlaData, airQualityData, location, onOpenModal, loading }) {
  const t = translations;

  if (loading && (!karhutlaData || !karhutlaData.fdrs)) {
    return (
      <div className="flat-card animate-pulse" style={{ padding: '1.5rem', marginBottom: '1.5rem', minHeight: '180px' }}>
        <div style={{ height: '24px', width: '40%', backgroundColor: 'var(--bg-muted)', borderRadius: '4px', marginBottom: '1rem' }} />
        <div style={{ height: '70px', backgroundColor: 'var(--bg-muted)', borderRadius: '8px' }} />
      </div>
    );
  }

  const fdrs = karhutlaData.fdrs;
  const nearest = karhutlaData.nearest;
  const totalInIndo = karhutlaData.allHotspots?.length || 0;

  const aqi = airQualityData?.current?.aqi || 0;
  const pm25 = airQualityData?.current?.pm25 || airQualityData?.current?.pm2_5 || 0;

  // Evaluasi Status Kabut Asap Terkini
  const { isHazeActive, isVeryNear } = getHazeStatus(nearest, aqi, pm25);

  const isHighRisk = fdrs.code === 'TINGGI' || fdrs.code === 'EKSTREM' || fdrs.code === 'HIGH' || fdrs.code === 'EXTREME';
  const isModerateRisk = fdrs.code === 'SEDANG' || fdrs.code === 'MODERATE';

  let statusBannerBg = 'var(--bg-subtle)';
  let statusBorder = 'var(--border-flat)';
  let statusTextColor = 'var(--text-main)';
  let statusIcon = <ShieldCheck size={16} color="var(--color-primary)" />;
  let statusMessage = nearest && nearest.distanceKm <= 50
    ? `Terdeteksi titik kebakaran lahan sangat dekat (${nearest.distanceKm} km dari ${nearest.regency}). Risiko asap pekat tinggi.`
    : (t.statusSafeMsg || `Kondisi lahan di ${location.name} terpantau AMAN dan bebas dari paparan kabut asap karhutla.`);

  if (isHazeActive) {
    statusBannerBg = 'var(--color-danger-bg)';
    statusBorder = 'var(--color-danger)';
    statusTextColor = 'var(--color-danger)';
    statusIcon = <Wind size={16} color="var(--color-danger)" />;
    statusMessage = `PERINGATAN KABUT ASAP: Udara terpapar asap kiriman dari titik api ${nearest?.regency || 'wilayah sekitar'} (${nearest?.distanceKm || 0} km). Lahan setempat aman dari api, namun gunakan masker N95 untuk pernapasan!`;
  } else if (isHighRisk) {
    statusBannerBg = 'var(--color-danger-bg)';
    statusBorder = 'var(--color-danger)';
    statusTextColor = 'var(--color-danger)';
    statusIcon = <AlertTriangle size={16} color="var(--color-danger)" />;
    statusMessage = `STATUS RAWAN: Vegetasi di wilayah ${location.name} sangat kering & mudah terbakar akibat suhu panas.`;
  } else if (isModerateRisk) {
    statusBannerBg = 'var(--color-warning-bg)';
    statusBorder = 'var(--color-warning)';
    statusTextColor = '#b45309';
    statusIcon = <AlertTriangle size={16} color="#b45309" />;
    statusMessage = `STATUS WASPADA: Semak & alang-alang mulai mengering. Hindari pembakaran sampah di ${location.name}.`;
  }

  return (
    <div className="flat-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: isHazeActive ? '#ef4444' : fdrs.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <Flame size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
              {t.karhutlaTitle}
            </h3>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              {t.karhutlaSubtitle}
            </span>
          </div>
        </div>

        {/* Status Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {isHazeActive ? (
            <span style={{
              fontSize: '0.725rem',
              fontWeight: '800',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#dc2626',
              border: '1px solid #dc2626',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Wind size={12} strokeWidth={2.5} />
              <span>{t.hazeActiveBadge}</span>
            </span>
          ) : (
            <span style={{
              fontSize: '0.725rem',
              fontWeight: '800',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              color: '#059669',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>{t.hazeCleanBadge}</span>
            </span>
          )}

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.75rem',
            fontWeight: '800',
            padding: '4px 12px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: fdrs.color,
            color: '#ffffff'
          }}>
            <Flame size={13} strokeWidth={2.5} />
            <span>{t.landLocalBadge}: {fdrs.code}</span>
          </div>
        </div>
      </div>

      {/* Main Info Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1rem',
        backgroundColor: 'var(--bg-muted)',
        padding: '1rem 1.15rem',
        borderRadius: 'var(--radius-md)',
        border: 'var(--border-thick)',
        margin: '0.75rem 0'
      }}>
        {/* Left: Nearest Hotspot */}
        <div>
          <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t.nearestHotspotLabel}
          </span>
          {nearest ? (
            <div style={{ marginTop: '0.25rem' }}>
              <strong style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', display: 'block' }}>
                {nearest.regency}
              </strong>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600', marginTop: '0.1rem' }}>
                {nearest.province} · {nearest.type}
              </span>
              <div style={{ marginTop: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Compass size={16} color="var(--color-primary)" />
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  Jarak: <span style={{ color: isVeryNear ? 'var(--color-danger)' : 'var(--color-primary)' }}>{nearest.distanceKm} km</span> dari {location.name}
                </span>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.35rem 0 0 0', fontWeight: '600' }}>
              {t.noHotspotsNearby}
            </p>
          )}
        </div>

        {/* Right: FDRS Condition */}
        <div>
          <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t.landConditionTitle} ({location.name})
          </span>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', margin: '0.25rem 0 0 0', fontWeight: '600', lineHeight: 1.4 }}>
            {fdrs.desc}
          </p>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '500', display: 'block', marginTop: '0.35rem' }}>
            {t.fdrsExplExplanation}
          </span>
        </div>
      </div>

      {/* Safety Evaluation Status Strip */}
      <div style={{
        padding: '0.75rem 1rem',
        backgroundColor: statusBannerBg,
        border: `1.5px solid ${statusBorder}`,
        borderRadius: 'var(--radius-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.775rem',
        fontWeight: '600',
        color: statusTextColor,
        flexWrap: 'wrap',
        gap: '0.65rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 300px' }}>
          {statusIcon}
          <span style={{ lineHeight: 1.4 }}>{statusMessage}</span>
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
          <span>{t.allHotspotsBtn} ({totalInIndo})</span>
          <ChevronRight size={14} />
        </button>
      </div>

    </div>
  );
}
