import React, { useState } from 'react';
import { Flame, Mountain, ShieldAlert, AlertTriangle, ChevronRight, Compass } from 'lucide-react';
import { getNearbyVolcanoes } from '../../services/volcano';

export function VolcanoCard({ location, onOpenModal, onFocusVolcano, lang = 'id' }) {
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
              Aktivitas Gunung Api Terdekat
            </h3>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              Data Resmi PVMBG · MAGMA ESDM
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
          {nearest.status.code} ({nearest.status.name})
        </span>
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
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <strong style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
              {nearest.name}
            </strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>
              {nearest.elevation} mdpl
            </span>
          </div>
          <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600', marginTop: '0.15rem' }}>
            {nearest.province} ({nearest.type})
          </span>

          <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Compass size={16} color="var(--color-primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
              Jarak: <span style={{ color: 'var(--color-primary)' }}>{nearest.distanceKm} km</span> dari {location.name}
            </span>
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Rekomendasi & Zona Bahaya
          </span>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', margin: '0.25rem 0 0 0', fontWeight: '600', lineHeight: 1.4 }}>
            {nearest.note || nearest.status.recommendation}
          </p>
          <span style={{ fontSize: '0.725rem', color: isHighAlert ? 'var(--color-danger)' : 'var(--text-muted)', fontWeight: '700', display: 'block', marginTop: '0.35rem' }}>
            Radius steril PVMBG: {nearest.dangerRadiusKm} km dari kawah
          </span>
        </div>
      </div>

      {/* Safety Evaluation Status */}
      <div style={{
        padding: '0.65rem 0.95rem',
        backgroundColor: nearest.isInsideDangerZone ? 'var(--color-danger-bg)' : 'var(--bg-subtle)',
        border: `1.5px solid ${nearest.isInsideDangerZone ? 'var(--color-danger)' : 'var(--border-flat)'}`,
        borderRadius: 'var(--radius-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.775rem',
        fontWeight: '600',
        color: nearest.isInsideDangerZone ? 'var(--color-danger)' : 'var(--text-main)',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <span>
          {nearest.isInsideDangerZone
            ? '🚨 PERINGATAN: Posisi Anda berada di dalam zona bahaya radius kawah. Segera ikuti instruksi evakuasi BPBD!'
            : isNear
            ? `⚠️ Lokasi Anda berjarak ${nearest.distanceKm} km dari ${nearest.name}. Waspadai potensi hujan abu jika terjadi erupsi.`
            : `✅ Lokasi Anda berada di luar radius bahaya langsung (${nearest.distanceKm} km dari ${nearest.name}).`}
        </span>

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
          <span>Semua Gunung ({alertCount} Siaga/Awas)</span>
          <ChevronRight size={14} />
        </button>
      </div>

    </div>
  );
}
