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

export function CitySearchModal({ isOpen, onClose, onSelectCity, currentCity }) {
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
        backgroundColor: 'rgba(15, 23, 42, 0.72)',
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
        className="flat-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '600px',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-card)',
          border: 'var(--border-thick)',
          overflow: 'hidden',
          padding: 0
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div style={{ padding: '1.25rem', borderBottom: 'var(--border-thick)', backgroundColor: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Compass size={18} strokeWidth={2.5} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                Pilih Kota & Kabupaten
              </h3>
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

          {/* Search Input Bar */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} strokeWidth={2.5} />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari 515 kota, kabupaten, atau provinsi..."
              style={{
                width: '100%',
                padding: '0.75rem 2.2rem 0.75rem 2.5rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-muted)',
                border: 'var(--border-thick)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                fontWeight: '600',
                outline: 'none'
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Quick Popular Pills */}
          {!searchTerm && selectedRegion === 'Semua' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', overflowX: 'auto', paddingTop: '0.75rem', scrollbarWidth: 'none' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                <Flame size={13} color="var(--color-accent)" strokeWidth={2.5} /> Populer:
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
                      padding: '3px 9px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.725rem',
                      fontWeight: '700',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      border: 'var(--border-thick)',
                      backgroundColor: 'var(--bg-muted)',
                      color: 'var(--text-main)'
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
              paddingTop: '0.75rem',
              scrollbarWidth: 'none'
            }}
          >
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: selectedRegion === r ? '2px solid var(--color-secondary)' : 'var(--border-thick)',
                  backgroundColor: selectedRegion === r ? 'var(--color-secondary-bg)' : 'var(--bg-muted)',
                  color: selectedRegion === r ? 'var(--color-secondary)' : 'var(--text-main)'
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.85rem 1.25rem', backgroundColor: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>
              Menampilkan {Math.min(filteredCities.length, 80)} dari {filteredCities.length} kota & kabupaten
            </span>
          </div>

          {filteredCities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0, color: 'var(--text-main)' }}>Tidak ditemukan kota "{searchTerm}".</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.35rem' }}>
                Periksa ejaan nama kota/kabupaten Anda atau pilih pulau lain.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.45rem' }}>
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
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--color-secondary-bg)' : 'var(--bg-muted)',
                      border: isSelected ? '2px solid var(--color-secondary)' : 'var(--border-thick)',
                      cursor: 'pointer',
                      transition: 'transform var(--anim-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: isSelected ? 'var(--color-secondary)' : 'var(--bg-card)',
                        color: isSelected ? '#fff' : 'var(--color-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <MapPin size={15} strokeWidth={2.5} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <strong style={{ fontSize: '0.9rem', color: isSelected ? 'var(--color-secondary)' : 'var(--text-main)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {city.name}
                        </strong>
                        <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: '600', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {city.province} • {city.region}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                      {isSelected ? (
                        <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--color-secondary)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-secondary-bg)', border: '1px solid var(--color-secondary)' }}>
                          Aktif
                        </span>
                      ) : (
                        <ChevronRight size={16} color="var(--text-muted)" strokeWidth={2.5} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div style={{ padding: '0.85rem 1.25rem', borderTop: 'var(--border-thick)', backgroundColor: 'var(--bg-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>
          <span>Tekan ESC untuk menutup</span>
          <span>BMKG Official 38 Provinsi (515 Wilayah)</span>
        </div>
      </div>
    </div>
  );
}
