import React, { useState, useMemo } from 'react';
import { Flame, X, Search } from 'lucide-react';
import { getNearbyVolcanoes } from '../../services/volcano';

const REGIONS = ['Semua', 'Jawa', 'Sumatera', 'Bali & Nusa Tenggara', 'Sulawesi', 'Maluku'];
const STATUS_FILTERS = [
  { id: 'ALL', label: 'Semua Status' },
  { id: 'ALERT', label: 'Siaga & Awas (Level III/IV)' },
  { id: 'WASPADA', label: 'Waspada (Level II)' },
  { id: 'NORMAL', label: 'Normal (Level I)' }
];

export function VolcanoListModal({ isOpen, onClose, userLocation, onSelectVolcano }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const { allVolcanoes } = useMemo(() => {
    return getNearbyVolcanoes(userLocation?.lat, userLocation?.lon);
  }, [userLocation?.lat, userLocation?.lon]);

  const filteredVolcanoes = useMemo(() => {
    return (allVolcanoes || []).filter((v) => {
      const matchSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.province.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRegion = selectedRegion === 'Semua' || v.region === selectedRegion;
      
      let matchStatus = true;
      if (statusFilter === 'ALERT') matchStatus = v.statusLevel >= 3;
      else if (statusFilter === 'WASPADA') matchStatus = v.statusLevel === 2;
      else if (statusFilter === 'NORMAL') matchStatus = v.statusLevel === 1;

      return matchSearch && matchRegion && matchStatus;
    });
  }, [allVolcanoes, searchTerm, selectedRegion, statusFilter]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '640px',
          width: '95%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: 'var(--border-thick)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Flame size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                Pemantauan Gunung Api Indonesia
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, fontWeight: '600' }}>
                Status Aktivitas Vulkanik Resmi PVMBG / MAGMA ESDM
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="flat-btn-secondary"
            style={{ minHeight: '32px', padding: '4px 8px' }}
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Filters */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: 'var(--border-thick)', backgroundColor: 'var(--bg-card)' }}>
          {/* Search Input */}
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0.75rem'
          }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
            <input
              type="text"
              placeholder="Cari nama gunung api atau provinsi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: 'var(--radius-sm)',
                border: 'var(--border-thick)',
                backgroundColor: 'var(--bg-muted)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}
            />
          </div>

          {/* Region Tabs */}
          <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`flat-btn-secondary ${selectedRegion === r ? 'active' : ''}`}
                style={{
                  padding: '4px 10px',
                  minHeight: '28px',
                  fontSize: '0.75rem',
                  whiteSpace: 'nowrap'
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Volcano Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {filteredVolcanoes.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Tidak ada gunung api yang sesuai dengan pencarian.
              </div>
            ) : (
              filteredVolcanoes.map((v) => (
                <div
                  key={v.id}
                  style={{
                    padding: '0.9rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'var(--border-thick)',
                    backgroundColor: 'var(--bg-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <div>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: '800' }}>
                        {v.name}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
                        ({v.elevation} mdpl · {v.province})
                      </span>
                    </div>

                    <span style={{
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: v.status.color,
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: '800'
                    }}>
                      {v.status.code} ({v.status.name})
                    </span>
                  </div>

                  <p style={{ fontSize: '0.775rem', color: 'var(--text-main)', margin: 0, fontWeight: '600' }}>
                    {v.note || v.status.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '0.25rem',
                    fontSize: '0.725rem',
                    color: 'var(--text-muted)',
                    fontWeight: '600'
                  }}>
                    <span>📍 Jarak: <strong style={{ color: 'var(--color-primary)' }}>{v.distanceKm} km</strong> dari posisi Anda</span>
                    <span>`Radius bahaya: ${v.dangerRadiusKm} km`</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '0.75rem 1.25rem', borderTop: 'var(--border-thick)', backgroundColor: 'var(--bg-muted)', fontSize: '0.725rem', color: 'var(--text-muted)', textAlign: 'center', fontWeight: '600' }}>
          Data diperbarui berdasarkan pengamatan seismik & visual PVMBG Badan Geologi ESDM
        </div>
      </div>
    </div>
  );
}
