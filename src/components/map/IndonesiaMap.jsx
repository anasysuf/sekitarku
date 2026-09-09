import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { INDONESIA_CITIES } from '../../utils/cities';
import { INDONESIA_VOLCANOES, VOLCANO_STATUS_LEVELS } from '../../utils/volcanoes';
import { getEarthquakeColor } from '../../utils/aqi';
import { translations } from '../../utils/i18n';

// Official CARTO Basemaps API Key
const CARTO_API_KEY = import.meta.env.VITE_CARTO_API_KEY || 'cb1_33y9_1_f8ef25450161f96a4a3aa386';

// Fix default leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, 7, { duration: 1.2 });
    }
  }, [center[0], center[1], map]);
  return null;
}

export function IndonesiaMap({ currentLocation, earthquakes, onSelectCity, isDark = false, lang = 'id' }) {
  const t = translations[lang] || translations.id;
  const center = [currentLocation.lat || -2.5489, currentLocation.lon || 118.0149];
  const [showVolcanoes, setShowVolcanoes] = useState(true);

  // Official CARTO Basemaps URL with API key
  const tileUrl = isDark
    ? `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?api_key=${CARTO_API_KEY}`
    : `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?api_key=${CARTO_API_KEY}`;

  return (
    <div className="flat-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>{t.mapTitle}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, fontWeight: '500' }}>
            Stasiun kota, titik seismik BMKG, dan gunung api aktif PVMBG
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.75rem', fontWeight: '700', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-main)' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: 'var(--color-primary)' }}></span> Kota
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-main)' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: 'var(--color-danger)' }}></span> Gempa BMKG
          </span>
          <button
            onClick={() => setShowVolcanoes(!showVolcanoes)}
            style={{
              padding: '3px 8px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: showVolcanoes ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-muted)',
              color: showVolcanoes ? 'var(--color-danger)' : 'var(--text-muted)',
              border: '1px solid var(--border-flat)',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.725rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <span>🌋 Gunung Api ({showVolcanoes ? 'ON' : 'OFF'})</span>
          </button>
        </div>
      </div>

      <div className="map-wrapper">
        <MapContainer
          key={`map-${isDark ? 'dark' : 'light'}-${CARTO_API_KEY.slice(-6)}`}
          center={center}
          zoom={5}
          scrollWheelZoom={false}
          style={{ width: '100%', height: '100%' }}
        >
          <MapController center={center} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>'
            url={tileUrl}
            subdomains="abcd"
            maxZoom={19}
          />

          {/* Current selected city ring */}
          <Circle
            center={[currentLocation.lat, currentLocation.lon]}
            radius={35000}
            pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.35 }}
          />

          {/* City markers */}
          {INDONESIA_CITIES.slice(0, 100).map((city) => (
            <Marker
              key={city.name}
              position={[city.lat, city.lon]}
              eventHandlers={{
                click: () => onSelectCity(city)
              }}
            >
              <Popup>
                <div style={{ padding: '4px', textAlign: 'center', fontFamily: 'Outfit, sans-serif' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#111827' }}>{city.name}</strong>
                  <p style={{ margin: '3px 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>{city.province}</p>
                  <button
                    onClick={() => onSelectCity(city)}
                    style={{
                      marginTop: '6px',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      backgroundColor: '#10b981',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: '700'
                    }}
                  >
                    Pilih Kota
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Volcano markers */}
          {showVolcanoes && INDONESIA_VOLCANOES.map((v) => {
            const status = VOLCANO_STATUS_LEVELS[v.statusLevel] || VOLCANO_STATUS_LEVELS[1];
            return (
              <Circle
                key={v.id}
                center={[v.lat, v.lon]}
                radius={(v.dangerRadiusKm || 3) * 1000}
                pathOptions={{
                  color: status.color,
                  fillColor: status.color,
                  fillOpacity: 0.55
                }}
              >
                <Popup>
                  <div style={{ padding: '4px', fontFamily: 'Outfit, sans-serif' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '1rem' }}>🌋</span>
                      <strong style={{ fontSize: '0.9rem', color: '#111827' }}>{v.name}</strong>
                    </div>
                    <span style={{
                      display: 'inline-block',
                      margin: '4px 0',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      backgroundColor: status.color,
                      color: '#fff',
                      fontSize: '0.7rem',
                      fontWeight: '800'
                    }}>
                      {status.code} ({status.name})
                    </span>
                    <p style={{ margin: '2px 0', fontSize: '0.75rem', color: '#4b5563', fontWeight: '600' }}>
                      Elevasi: {v.elevation} mdpl · {v.province}
                    </p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', color: '#6b7280' }}>
                      Radius Bahaya: {v.dangerRadiusKm} km
                    </p>
                  </div>
                </Popup>
              </Circle>
            );
          })}

          {/* Earthquake markers */}
          {earthquakes && earthquakes.map((q, idx) => {
            if (!q.lat || !q.lon) return null;
            const color = getEarthquakeColor(q.magnitude);

            return (
              <Circle
                key={q.id || idx}
                center={[q.lat, q.lon]}
                radius={(q.magnitude || 4) * 15000}
                pathOptions={{ color: color, fillColor: color, fillOpacity: 0.45 }}
              >
                <Popup>
                  <div style={{ padding: '4px', fontFamily: 'Outfit, sans-serif' }}>
                    <span style={{ fontWeight: '800', color: color, fontSize: '0.9rem' }}>
                      Gempa M {q.magnitude}
                    </span>
                    <p style={{ margin: '3px 0 0 0', fontSize: '0.75rem', color: '#111827', fontWeight: '600' }}>{q.wilayah}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', color: '#6b7280' }}>{q.date} {q.time} • Kedalaman {q.depth}</p>
                  </div>
                </Popup>
              </Circle>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
