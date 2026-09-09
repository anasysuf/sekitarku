import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { INDONESIA_CITIES } from '../../utils/cities';
import { INDONESIA_VOLCANOES, VOLCANO_STATUS_LEVELS } from '../../utils/volcanoes';
import { translations } from '../../utils/i18n';
import { MapPin, Compass, ZoomIn, ZoomOut } from 'lucide-react';

// Inline SVG data URIs - 100% offline, 0 network requests, never broken image
const cityPinSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 30" width="24" height="30">
  <defs>
    <filter id="sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="1.2" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>
  <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 18 8 18s8-12.75 8-18c0-4.42-3.58-8-8-8z" fill="#059669" stroke="#ffffff" stroke-width="1.5" filter="url(#sh)"/>
  <circle cx="12" cy="10" r="3" fill="#ffffff"/>
</svg>
`)}`;

const activeCityPinSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 34" width="26" height="34">
  <defs>
    <filter id="sh-act" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#059669" flood-opacity="0.6"/>
    </filter>
  </defs>
  <path d="M13 2C7.5 2 3 6.5 3 12c0 6.5 10 20 10 20s10-13.5 10-20c0-5.5-4.5-10-10-10z" fill="#10b981" stroke="#ffffff" stroke-width="2" filter="url(#sh-act)"/>
  <circle cx="13" cy="12" r="4" fill="#ffffff"/>
</svg>
`)}`;

const cityIcon = L.icon({
  iconUrl: cityPinSvg,
  iconSize: [20, 25],
  iconAnchor: [10, 25],
  popupAnchor: [0, -22]
});

const activeCityIcon = L.icon({
  iconUrl: activeCityPinSvg,
  iconSize: [26, 34],
  iconAnchor: [13, 34],
  popupAnchor: [0, -30]
});

function getEarthquakeColor(mag) {
  if (mag >= 7.0) return '#dc2626';
  if (mag >= 5.0) return '#f97316';
  return '#eab308';
}

// Controller component to manage zoom, flyTo, and view resets
function MapViewManager({ targetView }) {
  const map = useMap();

  useEffect(() => {
    if (!targetView) return;
    map.flyTo(targetView.center, targetView.zoom, {
      duration: 1.2,
      easeLinearity: 0.25
    });
  }, [targetView, map]);

  return null;
}

// Custom on-map floating navigation controls
function CustomMapControls({ onResetNusantara, onFocusCity, cityName }) {
  const map = useMap();

  return (
    <div
      style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          border: '1px solid var(--border-flat)'
        }}
      >
        <button
          onClick={() => map.zoomIn()}
          title="Zoom In (Perbesar)"
          style={{
            width: '34px',
            height: '34px',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-main)',
            border: 'none',
            borderBottom: '1px solid var(--border-flat)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '900',
            fontSize: '1rem',
            transition: 'background-color 0.15s'
          }}
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={() => map.zoomOut()}
          title="Zoom Out (Perkecil)"
          style={{
            width: '34px',
            height: '34px',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-main)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '900',
            fontSize: '1rem',
            transition: 'background-color 0.15s'
          }}
        >
          <ZoomOut size={16} />
        </button>
      </div>

      <button
        onClick={onFocusCity}
        title={`Fokus ke kota ${cityName || 'terpilih'}`}
        style={{
          padding: '6px 10px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--bg-card)',
          color: 'var(--color-primary)',
          border: '1px solid var(--border-flat)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '0.725rem',
          fontWeight: '800'
        }}
      >
        <MapPin size={13} />
        <span>Kota</span>
      </button>

      <button
        onClick={onResetNusantara}
        title="Reset tampilan ke seluruh Nusantara"
        style={{
          padding: '6px 10px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-main)',
          border: '1px solid var(--border-flat)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '0.725rem',
          fontWeight: '800'
        }}
      >
        <Compass size={13} />
        <span>Nusantara</span>
      </button>
    </div>
  );
}

export function IndonesiaMap({ currentLocation, earthquakes, onSelectCity, isDark = false, lang = 'id' }) {
  const t = translations[lang] || translations.id;
  const initialCenter = [currentLocation.lat || -2.5489, currentLocation.lon || 118.0149];
  
  // Layer toggles
  const [showCities, setShowCities] = useState(true);
  const [showVolcanoes, setShowVolcanoes] = useState(true);
  const [showEarthquakes, setShowEarthquakes] = useState(true);

  // Dynamic target view state for smooth flyTo
  const [targetView, setTargetView] = useState({
    center: initialCenter,
    zoom: 9 // detailed zoom into active city on load
  });

  // Whenever currentLocation changes externally, fly directly into city zoom
  useEffect(() => {
    if (currentLocation.lat && currentLocation.lon) {
      setTargetView({
        center: [currentLocation.lat, currentLocation.lon],
        zoom: 10
      });
    }
  }, [currentLocation.lat, currentLocation.lon]);

  const handleResetNusantara = () => {
    setTargetView({
      center: [-2.5489, 118.0149],
      zoom: 5
    });
  };

  const handleFocusCity = () => {
    if (currentLocation.lat && currentLocation.lon) {
      setTargetView({
        center: [currentLocation.lat, currentLocation.lon],
        zoom: 11
      });
    }
  };

  const handleCityMarkerClick = (city) => {
    onSelectCity(city);
    setTargetView({
      center: [city.lat, city.lon],
      zoom: 11
    });
  };

  // 100% Free, Zero-Key, Zero-Watermark ESRI World Canvas tiles
  const esriTileUrl = isDark
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}'
    : 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';

  return (
    <div className="flat-card" style={{ padding: '1.5rem', position: 'relative' }}>
      {/* Header & Layer Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>{t.mapTitle}</h3>
            <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--bg-muted)', color: 'var(--text-muted)', fontWeight: '700' }}>
              Scroll & Pinch Zoom Aktif
            </span>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '2px 0 0 0', fontWeight: '500' }}>
            Gunakan scroll mouse atau cubit layar untuk zoom in/out detail kota hingga seluruh kepulauan
          </p>
        </div>

        {/* Filter Badges / Layer Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowCities(!showCities)}
            style={{
              padding: '4px 9px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: showCities ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-muted)',
              color: showCities ? 'var(--color-primary)' : 'var(--text-muted)',
              border: '1px solid var(--border-flat)',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.725rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: showCities ? 'var(--color-primary)' : '#9ca3af' }}></span>
            <span>Kota ({INDONESIA_CITIES.length})</span>
          </button>

          <button
            onClick={() => setShowEarthquakes(!showEarthquakes)}
            style={{
              padding: '4px 9px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: showEarthquakes ? 'rgba(239, 68, 68, 0.12)' : 'var(--bg-muted)',
              color: showEarthquakes ? 'var(--color-danger)' : 'var(--text-muted)',
              border: '1px solid var(--border-flat)',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.725rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: showEarthquakes ? 'var(--color-danger)' : '#9ca3af' }}></span>
            <span>Gempa ({earthquakes ? earthquakes.length : 0})</span>
          </button>

          <button
            onClick={() => setShowVolcanoes(!showVolcanoes)}
            style={{
              padding: '4px 9px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: showVolcanoes ? 'rgba(249, 115, 22, 0.15)' : 'var(--bg-muted)',
              color: showVolcanoes ? '#ea580c' : 'var(--text-muted)',
              border: '1px solid var(--border-flat)',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.725rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s'
            }}
          >
            <span>🌋 Gunung Api ({INDONESIA_VOLCANOES.length})</span>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="map-wrapper" style={{ position: 'relative' }}>
        <MapContainer
          key={'map-' + (isDark ? 'dark' : 'light')}
          center={initialCenter}
          zoom={9}
          minZoom={4}
          maxZoom={18}
          scrollWheelZoom={true}
          doubleClickZoom={true}
          touchZoom={true}
          zoomControl={false}
          style={{ width: '100%', height: '100%' }}
        >
          <MapViewManager targetView={targetView} />
          <CustomMapControls
            onResetNusantara={handleResetNusantara}
            onFocusCity={handleFocusCity}
            cityName={currentLocation.city || currentLocation.name}
          />
          
          <TileLayer
            key={isDark ? 'esri-dark' : 'esri-light'}
            attribution='&copy; <a href="https://www.esri.com/" target="_blank" rel="noopener noreferrer">Esri</a>, HERE, Garmin, METI/NASA, USGS'
            url={esriTileUrl}
            maxZoom={16}
          />

          {/* Current selected city indicator rings */}
          <Circle
            center={[currentLocation.lat, currentLocation.lon]}
            radius={25000}
            pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.25, weight: 2 }}
          />
          <Circle
            center={[currentLocation.lat, currentLocation.lon]}
            radius={8000}
            pathOptions={{ color: '#059669', fillColor: '#059669', fillOpacity: 0.65, weight: 3 }}
          />

          {/* City markers with crisp SVG icon */}
          {showCities && INDONESIA_CITIES.map((city) => {
            const isSelected = city.name === (currentLocation.city || currentLocation.name);
            return (
              <Marker
                key={city.name}
                position={[city.lat, city.lon]}
                icon={isSelected ? activeCityIcon : cityIcon}
                eventHandlers={{
                  click: () => handleCityMarkerClick(city)
                }}
              >
                <Popup>
                  <div style={{ padding: '6px', textAlign: 'center', fontFamily: 'Outfit, sans-serif' }}>
                    <strong style={{ fontSize: '0.95rem', color: '#111827', display: 'block' }}>{city.name}</strong>
                    <p style={{ margin: '3px 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>Provinsi: {city.province}</p>
                    <p style={{ margin: '2px 0 6px 0', fontSize: '0.7rem', color: '#9ca3af' }}>Koordinat: {city.lat.toFixed(2)}, {city.lon.toFixed(2)}</p>
                    <button
                      onClick={() => handleCityMarkerClick(city)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        backgroundColor: '#10b981',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: '800',
                        width: '100%'
                      }}
                    >
                      🔍 Zoom & Pantau Kota Ini
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}

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
                  fillOpacity: 0.55,
                  weight: 2
                }}
              >
                <Popup>
                  <div style={{ padding: '4px', fontFamily: 'Outfit, sans-serif' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>🌋</span>
                      <strong style={{ fontSize: '0.95rem', color: '#111827' }}>{v.name}</strong>
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
                      Radius Bahaya PVMBG: {v.dangerRadiusKm} km
                    </p>
                  </div>
                </Popup>
              </Circle>
            );
          })}

          {/* Earthquake markers */}
          {showEarthquakes && earthquakes && earthquakes.map((q, idx) => {
            if (!q.lat || !q.lon) return null;
            const color = getEarthquakeColor(q.magnitude);

            return (
              <Circle
                key={q.id || idx}
                center={[q.lat, q.lon]}
                radius={(q.magnitude || 4) * 15000}
                pathOptions={{ color: color, fillColor: color, fillOpacity: 0.45, weight: 2 }}
              >
                <Popup>
                  <div style={{ padding: '4px', fontFamily: 'Outfit, sans-serif' }}>
                    <span style={{ fontWeight: '800', color: color, fontSize: '0.95rem', display: 'block' }}>
                      Gempa M {q.magnitude}
                    </span>
                    <p style={{ margin: '3px 0 0 0', fontSize: '0.775rem', color: '#111827', fontWeight: '600' }}>{q.wilayah}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', color: '#6b7280' }}>{q.date} {q.time} • Kedalaman {q.depth}</p>
                    {q.potensi && (
                      <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '0.7rem', padding: '2px 5px', borderRadius: '3px', backgroundColor: '#fef2f2', color: '#b91c1c', fontWeight: '700' }}>
                        {q.potensi}
                      </span>
                    )}
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
