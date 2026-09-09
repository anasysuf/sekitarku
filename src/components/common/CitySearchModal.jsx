import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, MapPin, ChevronRight, Compass, Flame } from 'lucide-react';
import { INDONESIA_CITIES, REGIONS } from '../../utils/cities';

const POPULAR_CITIES = [
  'Jakarta Pusat',
  'Surabaya',
  'Bandung',
  'Medan',
  'Denpasar',
  'Nusantara (IKN Sepaku)',
  'Makassar',
  'Yogyakarta',
  'Semarang',
  'Palembang'
];

export function CitySearchModal({ isOpen, onClose, onSelectCity, currentCity, lang = 'id' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Semua');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setSearchTerm('');
      setSelectedRegion('Semua');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredCities = useMemo(() => {
    return INDONESIA_CITIES.filter((city) => {
      const matchRegion =
        selectedRegion === 'Semua' ||
        city.region === selectedRegion ||
        (selectedRegion === 'Nusantara' && city.name.includes('Nusantara'));

      if (!searchTerm) return matchRegion;

      const q = searchTerm.toLowerCase().trim();
      return (
        matchRegion &&
        (city.name.toLowerCase().includes(q) ||
         city.province.toLowerCase().includes(q) ||
         city.region.toLowerCase().includes(q))
      );
    });
  }, [searchTerm, selectedRegion]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        className="glass-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '580px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          padding: 0
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div style={{ padding: '1.15rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Compass size={18} color="var(--accent-brand)" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                Cari Kota & Kabupaten
              </h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Tutup"
              style={{
                background: 'var(--bg-surface-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '5px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Search Input Bar */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ketik nama kota, kabupaten, atau provinsi (515 wilayah)..."
              style={{
                width: '100%',
                padding: '0.65rem 2.2rem 0.65rem 2.4rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Quick Popular Pills */}
          {!searchTerm && selectedRegion === 'Semua' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', overflowX: 'auto', paddingTop: '0.6rem', scrollbarWidth: 'none' }}>
              <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                <Flame size={12} color="var(--accent-amber)" /> Populer:
              </span>
              {POPULAR_CITIES.map((name) => {
                const cityObj = INDONESIA_CITIES.find(c => c.name === name);
                if (!cityObj) return null;
                return (
                  <button
                    key={name}
                    onClick={() => {
                      onSelectCity(cityObj);
                      onClose();
                    }}
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          )}

          {/* Region Filter Pills */}
          <div
            style={{
              display: 'flex',
              gap: '0.35rem',
              overflowX: 'auto',
              paddingTop: '0.6rem',
              scrollbarWidth: 'none'
            }}
          >
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                style={{
                  padding: '3px 9px',
                  borderRadius: '999px',
                  fontSize: '0.725rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: selectedRegion === r ? '1px solid var(--accent-brand)' : '1px solid var(--border-color)',
                  backgroundColor: selectedRegion === r ? 'var(--accent-brand-bg)' : 'var(--bg-surface-subtle)',
                  color: selectedRegion === r ? 'var(--accent-brand)' : 'var(--text-secondary)'
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.65rem 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              Menampilkan {Math.min(filteredCities.length, 80)} dari {filteredCities.length} kota & kabupaten
            </span>
          </div>

          {filteredCities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>Tidak ditemukan kota "{searchTerm}".</p>
              <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Periksa ejaan nama kabupaten/kota Anda.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.35rem' }}>
              {filteredCities.slice(0, 80).map((city) => {
                const isSelected = currentCity.name.replace(' (GPS)', '') === city.name;
                return (
                  <div
                    key={city.name}
                    onClick={() => {
                      onSelectCity(city);
                      onClose();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isSelected ? 'var(--accent-brand-bg)' : 'var(--bg-surface-subtle)',
                      border: isSelected ? '1px solid var(--accent-brand)' : '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', minWidth: 0 }}>
                      <MapPin size={15} color={isSelected ? 'var(--accent-brand)' : 'var(--text-muted)'} style={{ flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <strong style={{ fontSize: '0.85rem', color: isSelected ? 'var(--accent-brand)' : 'var(--text-primary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {city.name}
                        </strong>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {city.province} • {city.region}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                      {isSelected ? (
                        <span style={{ fontSize: '0.675rem', fontWeight: '700', color: 'var(--accent-brand)', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--accent-brand-bg)' }}>
                          Aktif
                        </span>
                      ) : (
                        <ChevronRight size={15} color="var(--text-muted)" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div style={{ padding: '0.65rem 1rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
          <span>Tekan ESC untuk menutup</span>
          <span>BMKG Official 38 Provinsi</span>
        </div>
      </div>
    </div>
  );
}
