import React, { useState, useMemo, useEffect } from 'react';
import { Flame, X, Search, Satellite, Thermometer, Zap, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { SATELLITE_HOTSPOTS } from '../../utils/karhutla';
import { calculateDistance } from '../../utils/geo';

const REGIONS = ['Semua', 'Jawa', 'Sumatera', 'Kalimantan', 'Sulawesi', 'Bali & Nusa Tenggara', 'Maluku & Papua'];
const CONFIDENCE_FILTERS = [
  { id: 'ALL', label: 'Semua Tingkat' },
  { id: 'HIGH', label: 'Tinggi (>85%)' },
  { id: 'MODERATE', label: 'Sedang (70-85%)' }
];

export function KarhutlaListModal({ isOpen, onClose, userLocation, hotspots = SATELLITE_HOTSPOTS, onSelectHotspot }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Semua');
  const [confidenceFilter, setConfidenceFilter] = useState('ALL');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const rawList = hotspots && hotspots.length > 0 ? hotspots : SATELLITE_HOTSPOTS;

  const hotspotsWithDistance = useMemo(() => {
    return rawList.map((h) => {
      const dist = userLocation?.lat && userLocation?.lon
        ? Math.round(calculateDistance(userLocation.lat, userLocation.lon, h.lat, h.lon) * 10) / 10
        : null;
      return { ...h, distanceKm: dist };
    }).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  }, [rawList, userLocation]);

  const filteredHotspots = useMemo(() => {
    return hotspotsWithDistance.filter((h) => {
      const matchSearch = h.regency.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          h.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          h.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRegion = selectedRegion === 'Semua' || h.island === selectedRegion;

      let matchConfidence = true;
      if (confidenceFilter === 'HIGH') matchConfidence = h.confidence.includes('Tinggi') || h.confidenceLevel === 'HIGH';
      else if (confidenceFilter === 'MODERATE') matchConfidence = h.confidence.includes('Sedang') || h.confidenceLevel === 'MODERATE';

      return matchSearch && matchRegion && matchConfidence;
    });
  }, [hotspotsWithDistance, searchTerm, selectedRegion, confidenceFilter]);

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '720px',
          width: '95%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: 'var(--border-thick)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Flame size={19} strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                Daftar Titik Panas & Pantauan Karhutla
              </h3>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Observasi Satelit VIIRS SNPP (375m), NOAA-20 & MODIS (NASA FIRMS / SiPongi+ KLHK)
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flat-btn-secondary"
            style={{ width: '32px', height: '32px', padding: 0 }}
            aria-label="Tutup"
          >
            <X size={16} />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div style={{
          padding: '0.85rem 1.5rem',
          backgroundColor: 'var(--bg-muted)',
          borderBottom: 'var(--border-thick)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem'
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Cari lokasi, pulau, tipe lahan (cth: Bromo, Arjuno, Bengkalis, Gambut, Savana)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2rem',
                fontSize: '0.8rem',
                borderRadius: 'var(--radius-sm)',
                border: 'var(--border-thick)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-main)',
                outline: 'none'
              }}
            />
          </div>

          {/* Region Buttons */}
          <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '2px' }}>
            {REGIONS.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`flat-btn-secondary ${selectedRegion === region ? 'active' : ''}`}
                style={{
                  padding: '3px 9px',
                  fontSize: '0.7rem',
                  fontWeight: selectedRegion === region ? '800' : '600',
                  whiteSpace: 'nowrap',
                  minHeight: '26px'
                }}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Confidence Filter Chips & Quick Counter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto' }}>
              {CONFIDENCE_FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setConfidenceFilter(f.id)}
                  style={{
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.675rem',
                    fontWeight: '700',
                    border: confidenceFilter === f.id ? '1px solid #ef4444' : 'var(--border-thick)',
                    backgroundColor: confidenceFilter === f.id ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-card)',
                    color: confidenceFilter === f.id ? '#dc2626' : 'var(--text-muted)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>
              Menampilkan {filteredHotspots.length} dari {rawList.length} titik se-Indonesia
            </span>
          </div>
        </div>

        {/* Hotspots List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredHotspots.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
              <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem' }}>Tidak ada titik panas yang cocok dengan filter pencarian</p>
              <span style={{ fontSize: '0.75rem' }}>Coba ubah kata kunci atau pilih region 'Semua'.</span>
            </div>
          ) : (
            filteredHotspots.map((h) => {
              const isHigh = h.confidence.includes('Tinggi') || h.confidenceLevel === 'HIGH';
              return (
                <div
                  key={h.id}
                  style={{
                    padding: '0.85rem 1.15rem',
                    backgroundColor: 'var(--bg-card)',
                    border: 'var(--border-thick)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main)' }}>
                        {h.regency}
                      </strong>
                      <span style={{
                        fontSize: '0.675rem',
                        fontWeight: '800',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        backgroundColor: isHigh ? '#fee2e2' : '#fef3c7',
                        color: isHigh ? '#dc2626' : '#d97706'
                      }}>
                        {h.confidence}
                      </span>
                    </div>

                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', display: 'block', marginTop: '0.2rem' }}>
                      {h.province} ({h.island}) · <span style={{ color: 'var(--text-main)' }}>{h.type}</span>
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><Satellite size={12} /> {h.satellite}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><Thermometer size={12} /> {h.brightnessK} K</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><Zap size={12} /> {h.frpMw} MW</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#059669', fontWeight: '700' }}><ShieldCheck size={12} /> {h.source || 'NASA FIRMS / SiPongi+'}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                    {h.distanceKm !== null && (
                      <span style={{ fontSize: '0.825rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}><MapPin size={13} /> {h.distanceKm} km</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '0.85rem 1.5rem',
          borderTop: 'var(--border-thick)',
          backgroundColor: 'var(--bg-muted)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
          fontSize: '0.725rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span>Sumber: <strong>NASA FIRMS (VIIRS/MODIS)</strong> & <strong>KLHK SiPongi+</strong></span>
            <a
              href="https://sipongi.gakkum.kehutanan.go.id/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                color: 'var(--color-primary)',
                fontWeight: '700',
                textDecoration: 'none'
              }}
            >
              <span>Portal SiPongi+</span>
              <ExternalLink size={11} />
            </a>
          </div>

          <button
            onClick={onClose}
            className="flat-btn-secondary"
            style={{ padding: '4px 12px', fontSize: '0.75rem' }}
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}