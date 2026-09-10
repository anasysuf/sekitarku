import React from 'react';
import { Flame, Compass, ChevronRight, AlertTriangle, ShieldCheck, ShieldAlert, Satellite } from 'lucide-react';

export function KarhutlaCard({
  karhutlaData,
  location,
  onOpenModal,
  loading,
  lang = 'id'
}) {
  if (loading || !karhutlaData || !karhutlaData.fdrs) {
    return (
      <div className="flat-card animate-pulse" style={{ padding: '1.5rem', marginBottom: '1.5rem', minHeight: '180px' }}>
        <div style={{ height: '24px', width: '40%', backgroundColor: 'var(--bg-muted)', borderRadius: '4px', marginBottom: '1rem' }} />
        <div style={{ height: '70px', backgroundColor: 'var(--bg-muted)', borderRadius: '8px' }} />
      </div>
    );
  }

  const { fdrs, nearest, totalInIndo } = karhutlaData;
  const isHighRisk = fdrs.code === 'TINGGI' || fdrs.code === 'EKSTREM';
  const isNear = nearest && nearest.distanceKm <= 50;

  return (
    <div className="flat-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: fdrs.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <Flame size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
              Indeks Kebakaran Hutan & Titik Panas
            </h3>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              Data FDRS BMKG · Satelit NASA FIRMS
            </span>
          </div>
        </div>

        {/* Status Badge */}
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
          <span>{fdrs.code} ({fdrs.label})</span>
        </div>
      </div>

      {/* Main Info */}
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
            Titik Panas Satelit Terdekat
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
                  Jarak: <span style={{ color: nearest.distanceKm <= 50 ? 'var(--color-danger)' : 'var(--color-primary)' }}>{nearest.distanceKm} km</span> dari {location.name}
                </span>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.35rem 0 0 0', fontWeight: '600' }}>
              Tidak ada titik panas dalam radius 400 km.
            </p>
          )}
        </div>

        {/* Right: FDRS Condition & Safety Notes */}
        <div>
          <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Potensi Kebakaran & Vegetasi ({location.name})
          </span>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', margin: '0.25rem 0 0 0', fontWeight: '600', lineHeight: 1.4 }}>
            {fdrs.desc}
          </p>
          <span style={{ fontSize: '0.725rem', color: isHighRisk ? 'var(--color-danger)' : 'var(--text-muted)', fontWeight: '700', display: 'block', marginTop: '0.35rem' }}>
            Satelit Pemantau: VIIRS SNPP, NOAA-20 & MODIS (Near Real-Time)
          </span>
        </div>
      </div>

      {/* Safety Evaluation Status Strip */}
      <div style={{
        padding: '0.65rem 0.95rem',
        backgroundColor: isNear ? 'var(--color-danger-bg)' : isHighRisk ? 'var(--color-warning-bg)' : 'var(--bg-subtle)',
        border: `1.5px solid ${isNear ? 'var(--color-danger)' : isHighRisk ? 'var(--color-warning)' : 'var(--border-flat)'}`,
        borderRadius: 'var(--radius-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.775rem',
        fontWeight: '600',
        color: isNear ? 'var(--color-danger)' : isHighRisk ? '#b45309' : 'var(--text-main)',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {isNear ? <ShieldAlert size={16} /> : isHighRisk ? <AlertTriangle size={16} /> : <ShieldCheck size={16} color="var(--color-primary)" />}
          <span>
            {isNear
              ? `Titik panas terdeteksi hanya berjarak ${nearest.distanceKm} km dari ${location.name}. Waspadai asap tebal!`
              : isHighRisk
              ? `Peringatan: Vegetasi di wilayah ${location.name} sangat mudah tersulut api karena cuaca kering/panas.`
              : `Tingkat kemudahan kebakaran di wilayah ${location.name} terpantau rendah dan terkendali.`}
          </span>
        </div>

        <button
          onClick={onOpenModal}
          className="flat-btn-primary"
          style={{
            padding: '4px 10px',
            minHeight: '30px',
            fontSize: '0.725rem',
            gap: '0.3rem'
          }}
        >
          <span>Semua Titik Api ({totalInIndo} Titik)</span>
          <ChevronRight size={14} />
        </button>
      </div>

    </div>
  );
}