import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { INDONESIA_CITIES } from '../../utils/cities';
import { INDONESIA_VOLCANOES, VOLCANO_STATUS_LEVELS } from '../../utils/volcanoes';
import { SATELLITE_HOTSPOTS } from '../../utils/karhutla';
import { translations } from '../../utils/i18n';
import { MapPin, Compass, ZoomIn, ZoomOut, Flame, Mountain, Activity, Satellite, Thermometer, Zap, ShieldAlert } from 'lucide-react';

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

const flamePinSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 30" width="24" height="30">
  <defs>
    <filter id="sh-flame" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#ef4444" flood-opacity="0.5"/>
    </filter>
  </defs>
  <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 18 8 18s8-12.75 8-18c0-4.42-3.58-8-8-8z" fill="#dc2626" stroke="#ffffff" stroke-width="1.5" filter="url(#sh-flame)"/>
  <path d="M12 8c-1.2 1.8-0.8 3 0 4.5 0.5-1.2 0.8-1.8 0-4.5z" fill="#fef08a"/>
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

const flameIcon = L.icon({
  iconUrl: flamePinSvg,
  iconSize: [22, 28],
  iconAnchor: [11, 28],
  popupAnchor: [0, -25]
});

function getEarthquakeColor(mag) {
  if (mag >= 7.0) return '#dc2626';
  if (mag >= 5.0) return '#f97316';
  return '#eab308';
}

function MapViewManager({ targetView, onZoomChange }) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 500);

    const resizeHandler = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', resizeHandler);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', resizeHandler);
    };
  }, [map]);

  useMapEvents({
    zoomend: () => {
      if (onZoomChange) onZoomChange(map.getZoom());
    }
  });

  useEffect(() => {
    if (!targetView) return;
    map.flyTo(targetView.center, targetView.zoom, {
      duration: 1.2,
      easeLinearity: 0.25
    });
  }, [targetView, map]);

  return null;
}

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
      <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-sm)', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', border: '1px solid var(--border-flat)' }}>
        <button
          onClick={() => map.zoomIn()}
          title="Zoom In (Perbesar)"
          aria-label="Perbesar peta"
          style={{
            width: '36px',
            height: '36px',
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
          aria-label="Perkecil peta"
          style={{
            width: '36px',
            height: '36px',
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
        aria-label="Fokus ke kota aktif"
        style={{
          padding: '6px 10px',
          minHeight: '36px',
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
        aria-label="Reset tampilan Nusantara"
        style={{
          padding: '6px 10px',
          minHeight: '36px',
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

export function IndonesiaMap({ currentLocation, earthquakes, hotspots = SATELLITE_HOTSPOTS, onSelectCity, isDark = false, lang = 'id' }) {
  const t = translations[lang] || translations.id;
  const initialCenter = useMemo(() => [currentLocation?.lat || -2.5489, currentLocation?.lon || 118.0149], [currentLocation?.lat, currentLocation?.lon]);
  
  // Layer toggles
  const [showCities, setShowCities] = useState(true);
  const [showVolcanoes, setShowVolcanoes] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showEarthquakes, setShowEarthquakes] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(9);

  const [targetView, setTargetView] = useState({
    center: initialCenter,
    zoom: 9
  });

  useEffect(() => {
    if (currentLocation?.lat && currentLocation?.lon) {
      setTargetView({
        center: [currentLocation.lat, currentLocation.lon],
        zoom: 10
      });
    }
  }, [currentLocation?.lat, currentLocation?.lon]);

  const handleResetNusantara = useCallback(() => {
    setTargetView({
      center: [-2.5489, 118.0149],
      zoom: 5
    });
  }, []);

  const handleFocusCity = useCallback(() => {
    if (currentLocation?.lat && currentLocation?.lon) {
      setTargetView({
        center: [currentLocation.lat, currentLocation.lon],
        zoom: 11
      });
    }
  }, [currentLocation?.lat, currentLocation?.lon]);

  const handleCityMarkerClick = useCallback((city) => {
    onSelectCity(city);
    setTargetView({
      center: [city.lat, city.lon],
      zoom: 11
    });
  }, [onSelectCity]);

  const visibleCities = useMemo(() => {
    const activeName = currentLocation?.city || currentLocation?.name;
    if (currentZoom <= 6) {
      const hubs = INDONESIA_CITIES.slice(0, 75);
      const activeObj = INDONESIA_CITIES.find(c => c.name === activeName);
      if (activeObj && !hubs.some(c => c.name === activeName)) {
        return [...hubs, activeObj];
      }
      return hubs;
    }
    return INDONESIA_CITIES;
  }, [currentZoom, currentLocation?.city, currentLocation?.name]);

  return (
    <div className="flat-card" style={{ padding: '1.5rem', position: 'relative' }}>
      {/* Header & Layer Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>{t.mapTitle}</h3>
            
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '2px 0 0 0', fontWeight: '500' }}>
            {t.mapSubtitle || (lang === 'en' ? 'Real-time environmental map: Air Quality, Seismic Events, Volcano Eruptions & Satellite Hotspots' : 'Peta sebaran lingkungan real-time: Kualitas Udara, Seismik Gempa, Erupsi PVMBG & Karhutla Satelit')}
          </p>
        </div>

        {/* Filter Badges / Layer Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowCities(!showCities)}
            aria-label="Toggle layer stasiun kota"
            style={{
              padding: '5px 10px',
              minHeight: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: showCities ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-muted)',
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
            <MapPin size={13} strokeWidth={2.2} />
            <span>{lang === 'en' ? 'Cities' : 'Kota'} ({visibleCities.length})</span>
          </button>

          <button
            onClick={() => setShowEarthquakes(!showEarthquakes)}
            aria-label="Toggle layer gempa bumi BMKG"
            style={{
              padding: '5px 10px',
              minHeight: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: showEarthquakes ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-muted)',
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
            <Activity size={13} strokeWidth={2.2} />
            <span>{lang === 'en' ? 'Quakes' : 'Gempa'} ({earthquakes ? earthquakes.length : 0})</span>
          </button>

          <button
            onClick={() => setShowVolcanoes(!showVolcanoes)}
            aria-label="Toggle layer gunung api PVMBG"
            style={{
              padding: '5px 10px',
              minHeight: '32px',
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
            <Mountain size={13} strokeWidth={2.2} />
            <span>{lang === 'en' ? 'Volcanoes' : 'Gunung Api'} ({INDONESIA_VOLCANOES.length})</span>
          </button>

          <button
            onClick={() => setShowHotspots(!showHotspots)}
            aria-label="Toggle layer titik panas karhutla"
            style={{
              padding: '5px 10px',
              minHeight: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: showHotspots ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-muted)',
              color: showHotspots ? '#dc2626' : 'var(--text-muted)',
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
            <Flame size={13} strokeWidth={2.2} />
            <span>{lang === 'en' ? 'Hotspots' : 'Titik Panas'} ({hotspots ? hotspots.length : 0})</span>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="map-wrapper" style={{ position: 'relative', width: '100%', height: '440px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <MapContainer
          key={'map-container'}
          center={initialCenter}
          zoom={9}
          minZoom={4}
          maxZoom={19}
          scrollWheelZoom={true}
          doubleClickZoom={true}
          touchZoom={true}
          zoomControl={false}
          preferCanvas={true}
          style={{ width: '100%', height: '100%' }}
        >
          <MapViewManager targetView={targetView} onZoomChange={setCurrentZoom} />
          <CustomMapControls
            onResetNusantara={handleResetNusantara}
            onFocusCity={handleFocusCity}
            cityName={currentLocation?.city || currentLocation?.name}
          />
          
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            subdomains={['a', 'b', 'c']}
            maxZoom={19}
          />

          {/* Current selected city indicator rings */}
          {currentLocation?.lat && currentLocation?.lon && (
            <>
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
            </>
          )}

          {/* City markers */}
          {showCities && visibleCities.map((city) => {
            const isSelected = city.name === (currentLocation?.city || currentLocation?.name);
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
                  <div style={{ padding: '6px', textAlign: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
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
                      Zoom & Pantau Kota Ini
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Karhutla Hotspot Satellite Markers */}
          {showHotspots && hotspots && hotspots.map((h) => {
            if (!h.lat || !h.lon) return null;
            return (
              <React.Fragment key={h.id}>
                <Circle
                  center={[h.lat, h.lon]}
                  radius={18000}
                  pathOptions={{
                    color: '#ef4444',
                    fillColor: '#dc2626',
                    fillOpacity: 0.35,
                    weight: 1.5
                  }}
                />
                <Marker
                  position={[h.lat, h.lon]}
                  icon={flameIcon}
                >
                  <Popup>
                    <div style={{ padding: '6px', textAlign: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111827' }}>{h.regency}</span>
                      </div>
                      <span style={{
                        display: 'inline-block',
                        margin: '4px 0',
                        padding: '2px 7px',
                        borderRadius: '3px',
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        fontSize: '0.7rem',
                        fontWeight: '800'
                      }}>
                        Satelit {h.satellite} · {h.confidence}
                      </span>
                      <p style={{ margin: '2px 0', fontSize: '0.75rem', color: '#4b5563', fontWeight: '600' }}>
                        {h.province} · {h.type}
                      </p>
                      <p style={{ margin: '2px 0 6px 0', fontSize: '0.7rem', color: '#6b7280' }}>
                        Suhu: {h.brightnessK} K · Daya: {h.frpMw} MW
                      </p>
                      <button
                        onClick={() => {
                          setTargetView({ center: [h.lat, h.lon], zoom: 11 });
                        }}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '4px',
                          backgroundColor: '#dc2626',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.725rem',
                          fontWeight: '800',
                          width: '100%'
                        }}
                      >
                        {lang === 'en' ? 'Focus on this Location' : 'Fokus ke Titik Ini'}
                      </button>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
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
                  <div style={{ padding: '4px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Mountain size={15} color={status.color} />
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
                      {lang === 'en' ? `PVMBG Danger Radius: ${v.dangerRadiusKm} km` : `Radius Bahaya PVMBG: ${v.dangerRadiusKm} km`}
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
                  <div style={{ padding: '4px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    <span style={{ fontWeight: '800', color: color, fontSize: '0.95rem', display: 'block' }}>
                      {lang === 'en' ? 'Quake' : 'Gempa'} M {q.magnitude}
                    </span>
                    <p style={{ margin: '3px 0 0 0', fontSize: '0.775rem', color: '#111827', fontWeight: '600' }}>{q.wilayah}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', color: '#6b7280' }}>{q.date} {q.time} • {lang === 'en' ? 'Depth' : 'Kedalaman'} {q.depth}</p>
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
