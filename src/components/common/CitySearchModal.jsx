import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, MapPin, X, Compass, ChevronRight } from 'lucide-react';
import { INDONESIA_CITIES, REGIONS } from '../../utils/cities';
import { translations } from '../../utils/i18n';

export function CitySearchModal({ isOpen, onClose, onSelectCity, currentCity, lang = 'id' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Semua');
  const inputRef = useRef(null);

  const t = translations[lang] || translations.id;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredCities = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    return INDONESIA_CITIES.filter((c) => {
      const matchRegion = selectedRegion === 'Semua' || c.region === selectedRegion;
      const matchQuery =
        !query ||
        c.name.toLowerCase().includes(query) ||
        c.province.toLowerCase().includes(query) ||
        c.region.toLowerCase().includes(query);
      return matchRegion && matchQuery;
    });
  }, [searchTerm, selectedRegion]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
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
          maxWidth: '600px',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color-light)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          overflow: 'hidden',
          padding: 0
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={20} color="#10b981" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                Cari Kota di Indonesia
              </h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Tutup"
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '6px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Search Input Bar */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-secondary)' }} />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ketik nama kota, kabupaten, atau provinsi (misal: Bandung, Bali, IKN)..."
              style={{
                width: '100%',
                padding: '0.75rem 2.2rem 0.75rem 2.6rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color-light)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
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
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Region Filter Pills */}
          <div
            style={{
              display: 'flex',
              gap: '0.4rem',
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
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: selectedRegion === r ? '1px solid #10b981' : '1px solid var(--border-color)',
                  backgroundColor: selectedRegion === r ? 'rgba(16, 185, 129, 0.18)' : 'var(--bg-primary)',
                  color: selectedRegion === r ? '#10b981' : 'var(--text-secondary)'
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Menampilkan {filteredCities.length} dari {INDONESIA_CITIES.length} Kota/Kabupaten
            </span>
          </div>

          {filteredCities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>Tidak ada kota yang cocok dengan "{searchTerm}".</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Coba periksa ejaan nama kota atau pilih pulau lainnya.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.4rem' }}>
              {filteredCities.map((city) => {
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
                      backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-primary)',
                      border: isSelected ? '1px solid #10b981' : '1px solid var(--border-color)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <MapPin size={16} color={isSelected ? '#10b981' : 'var(--text-muted)'} />
                      <div>
                        <strong style={{ fontSize: '0.9rem', color: isSelected ? '#10b981' : 'var(--text-primary)', display: 'block' }}>
                          {city.name}
                        </strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {city.province} • {city.region}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {isSelected ? (
                        <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#10b981', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(16,185,129,0.2)' }}>
                          Aktif
                        </span>
                      ) : (
                        <ChevronRight size={16} color="var(--text-muted)" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>Tekan ESC untuk menutup</span>
          <span>Mencakup 38 Provinsi</span>
        </div>
      </div>
    </div>
  );
}
