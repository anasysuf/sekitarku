import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { INDONESIA_CITIES } from '../../utils/cities';
import { getEarthquakeColor } from '../../utils/aqi';
import { translations } from '../../utils/i18n';

// Fix leaflet default icon issue in react
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

export function IndonesiaMap({ currentLocation, earthquakes, onSelectCity, lang = 'id' }) {
  const t = translations[lang] || translations.id;
  const center = [currentLocation.lat || -2.5489, currentLocation.lon || 118.0149];

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>{t.mapTitle}</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{t.mapSubtitle}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.75rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--accent-blue)' }}></span> Kota
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--accent-rose)' }}></span> Gempa BMKG
          </span>
        </div>
      </div>

      <div className="map-wrapper">
        <MapContainer center={center} zoom={5} scrollWheelZoom={false} style={{ width: '100%', height: '100%' }}>
          <MapController center={center} />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Current selected city ring */}
          <Circle
            center={[currentLocation.lat, currentLocation.lon]}
            radius={35000}
            pathOptions={{ color: '#2ea043', fillColor: '#2ea043', fillOpacity: 0.25 }}
          />

          {/* City markers */}
          {INDONESIA_CITIES.map(city => (
            <Marker
              key={city.name}
              position={[city.lat, city.lon]}
              eventHandlers={{
                click: () => onSelectCity(city)
              }}
            >
              <Popup>
                <div style={{ padding: '4px', textAlign: 'center' }}>
                  <strong style={{ fontSize: '0.85rem' }}>{city.name}</strong>
                  <p style={{ margin: '3px 0 0 0', fontSize: '0.75rem', color: '#666' }}>{city.province}</p>
                  <button
                    onClick={() => onSelectCity(city)}
                    style={{
                      marginTop: '6px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#2ea043',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.75rem'
                    }}
                  >
                    Pilih Kota
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Earthquake markers */}
          {earthquakes && earthquakes.map((q, idx) => {
            if (!q.lat || !q.lon) return null;
            const color = getEarthquakeColor(q.magnitude);

            return (
              <Circle
                key={q.id || idx}
                center={[q.lat, q.lon]}
                radius={(q.magnitude || 4) * 15000}
                pathOptions={{ color: color, fillColor: color, fillOpacity: 0.35 }}
              >
                <Popup>
                  <div style={{ padding: '4px' }}>
                    <span style={{ fontWeight: '700', color: color, fontSize: '0.85rem' }}>
                      Gempa M {q.magnitude}
                    </span>
                    <p style={{ margin: '3px 0 0 0', fontSize: '0.75rem' }}>{q.wilayah}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', color: '#666' }}>{q.date} {q.time} • Kedalaman {q.depth}</p>
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
