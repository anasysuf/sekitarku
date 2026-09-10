import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/common/Header';
import { EcoHealthCard } from './components/cards/EcoHealthCard';
import { AqiCard } from './components/cards/AqiCard';
import { WeatherCard } from './components/cards/WeatherCard';
import { EarthquakeCard } from './components/cards/EarthquakeCard';
import { UvCard } from './components/cards/UvCard';
import { VolcanoCard } from './components/cards/VolcanoCard';
import { KarhutlaCard } from './components/cards/KarhutlaCard';
import { fetchKarhutlaData } from './services/karhutla';
import { Footer } from './components/common/Footer';
import { WidgetEmbedView } from './components/embed/WidgetEmbedView';
import { INDONESIA_CITIES } from './utils/cities';
import { useGeolocation } from './hooks/useGeolocation';
import { useDarkMode } from './hooks/useDarkMode';
import { fetchWeatherData } from './services/weather';
import { fetchAirQualityData } from './services/airQuality';
import { fetchLatestEarthquake, fetchRecentEarthquakes } from './services/bmkg';
import { i18n } from './utils/i18n';
import { Download, AlertTriangle, X, Loader2 } from 'lucide-react';

// Lazy load heavy components for peak initial load speed & performance
const AqiChart = lazy(() =>
  import('./components/charts/AqiChart').then((m) => ({ default: m.AqiChart }))
);
const WeatherForecastChart = lazy(() =>
  import('./components/charts/WeatherForecastChart').then((m) => ({
    default: m.WeatherForecastChart
  }))
);
const IndonesiaMap = lazy(() =>
  import('./components/map/IndonesiaMap').then((m) => ({ default: m.IndonesiaMap }))
);
const CitySearchModal = lazy(() =>
  import('./components/common/CitySearchModal').then((m) => ({ default: m.CitySearchModal }))
);
const ShareCardModal = lazy(() =>
  import('./components/common/ShareCardModal').then((m) => ({ default: m.ShareCardModal }))
);
const EmergencyGuideModal = lazy(() =>
  import('./components/common/EmergencyGuideModal').then((m) => ({
    default: m.EmergencyGuideModal
  }))
);
const KarhutlaListModal = lazy(() =>
  import('./components/common/KarhutlaListModal').then((m) => ({
    default: m.KarhutlaListModal
  }))
);
const VolcanoListModal = lazy(() =>
  import('./components/common/VolcanoListModal').then((m) => ({
    default: m.VolcanoListModal
  }))
);
const EmbedWidgetModal = lazy(() =>
  import('./components/common/EmbedWidgetModal').then((m) => ({
    default: m.EmbedWidgetModal
  }))
);

// Loading Fallback Component
function ComponentSkeleton({ height = '200px', label = 'Memuat komponen...' }) {
  return (
    <div
      style={{
        minHeight: height,
        backgroundColor: 'var(--bg-card)',
        border: '2px solid var(--border-color, #e5e7eb)',
        borderRadius: 'var(--radius-lg, 12px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        color: 'var(--text-muted, #6b7280)',
        fontSize: '0.85rem',
        fontWeight: '600'
      }}
    >
      <Loader2 size={24} className="animate-spin" color="var(--color-primary, #3b82f6)" />
      <span>{label}</span>
    </div>
  );
}

export function App() {
  const { isDark, toggleDarkMode } = useDarkMode();
  const { location, selectCity, requestGpsLocation, gpsLoading } = useGeolocation();

  const [weatherData, setWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [latestEarthquake, setLatestEarthquake] = useState(null);
  const [recentEarthquakes, setRecentEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Language state: 'id' or 'en'
  const t = i18n.id;
// Embed mode check
  const isEmbedMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('embed') === 'true';
  const cityParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('city') : null;

  useEffect(() => {
    if (cityParam) {
      const match = INDONESIA_CITIES.find(
        (c) => c.name.toLowerCase() === cityParam.toLowerCase() ||
               c.name.toLowerCase().includes(cityParam.toLowerCase()) ||
               cityParam.toLowerCase().includes(c.name.toLowerCase())
      );
      if (match && (match.lat !== location.lat || match.lon !== location.lon)) {
        selectCity(match);
      }
    }
  }, [cityParam]);


  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isVolcanoOpen, setIsVolcanoOpen] = useState(false);
  const [isKarhutlaOpen, setIsKarhutlaOpen] = useState(false);
  const [karhutlaData, setKarhutlaData] = useState(null);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  // PWA Prompt
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showPwaBanner, setShowPwaBanner] = useState(true);

  // Notification state
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if ('serviceWorker' in navigator) {
      if (import.meta.env.PROD) {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.log('SW error:', err);
        });
      } else {
        // Unregister SW in development to prevent stale caches
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const reg of registrations) reg.unregister();
        });
      }
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallPwa = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  const handleRequestNotification = async () => {
    if (!('Notification' in window)) {
      alert('Browser ini tidak mendukung notifikasi Web.');
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      setNotificationsEnabled(true);
      new Notification('Sekitarku Aktif', {
        body: 'Notifikasi peringatan gempa, gunung api & kualitas udara berhasil diaktifkan.',
        icon: '/leaf.svg'
      });
    }
  };

  const loadData = async (force = false) => {
    setLoading(true);
    try {
      const [weather, aqi, quake, quakeList] = await Promise.all([
        fetchWeatherData(location.lat, location.lon, force),
        fetchAirQualityData(location.lat, location.lon, force),
        fetchLatestEarthquake(force),
        fetchRecentEarthquakes(force)
      ]);

      setWeatherData(weather);
      setAirQualityData(aqi);
      setLatestEarthquake(quake);
      setRecentEarthquakes(quakeList);
      const karhutla = fetchKarhutlaData(location.lat, location.lon, weather, force);
      setKarhutlaData(karhutla);
      setLastUpdated(new Date());

      if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
        if (aqi?.current?.aqi > 150) {
          new Notification('Peringatan Polusi Udara', {
            body: `AQI di ${location.name} mencapai ${aqi.current.aqi} (Tidak Sehat).`,
            icon: '/leaf.svg'
          });
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [location.lat, location.lon]);

  const handleFocusQuake = (quake) => {
    if (quake && quake.lat && quake.lon) {
      selectCity({
        name: `Lokasi Gempa (${quake.magnitude} SR)`,
        province: quake.wilayah,
        lat: quake.lat,
        lon: quake.lon
      });
    }
  };

  // Alerts
  const currentAqi = airQualityData?.current?.aqi || 0;
  const isAqiAlert = currentAqi > 150;
  const isQuakeAlert = latestEarthquake && latestEarthquake.magnitude >= 5.5;

  if (isEmbedMode) {
    return (
      <WidgetEmbedView
        location={location}
        weatherData={weatherData}
        airQualityData={airQualityData}
        loading={loading}
        onRefresh={() => loadData(true)}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Header */}
      <Header
        location={location}
        onOpenSearch={() => setIsSearchOpen(true)}
        onGpsClick={requestGpsLocation}
        gpsLoading={gpsLoading}
        isDark={isDark}
        onToggleDark={toggleDarkMode}
        onRefresh={() => loadData(true)}
        lastUpdated={lastUpdated}
        notificationsEnabled={notificationsEnabled}
        onRequestNotification={handleRequestNotification}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenWidget={() => setIsWidgetOpen(true)}
      />

      {/* Lazy Loaded City Search Modal */}
      {isSearchOpen && (
        <Suspense fallback={null}>
          <CitySearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelectCity={selectCity}
            currentCity={location}
          />
        </Suspense>
      )}

      {/* Lazy Loaded Share Card Modal */}
      {isShareOpen && (
        <Suspense fallback={null}>
          <ShareCardModal
            isOpen={isShareOpen}
            onClose={() => setIsShareOpen(false)}
            location={location}
            airQualityData={airQualityData}
            weatherData={weatherData}
            latestEarthquake={latestEarthquake}
            karhutlaData={karhutlaData}
          />
        </Suspense>
      )}

      {/* Lazy Loaded Emergency Guide Modal */}
      {isEmergencyOpen && (
        <Suspense fallback={null}>
          <EmergencyGuideModal
            isOpen={isEmergencyOpen}
            onClose={() => setIsEmergencyOpen(false)}
          />
        </Suspense>
      )}

      {/* Lazy Loaded Embed Widget Modal */}
      {isWidgetOpen && (
        <Suspense fallback={null}>
          <EmbedWidgetModal
            isOpen={isWidgetOpen}
            onClose={() => setIsWidgetOpen(false)}
            location={location}
            airQualityData={airQualityData}
            weatherData={weatherData}
          />
        </Suspense>
      )}

      
      {/* Lazy Loaded Karhutla Hotspot Modal */}
      {isKarhutlaOpen && (
        <Suspense fallback={null}>
          <KarhutlaListModal
            isOpen={isKarhutlaOpen}
            onClose={() => setIsKarhutlaOpen(false)}
            userLocation={location}
          />
        </Suspense>
      )}

      {/* Lazy Loaded Volcano List Modal */}
      {isVolcanoOpen && (
        <Suspense fallback={null}>
          <VolcanoListModal
            isOpen={isVolcanoOpen}
            onClose={() => setIsVolcanoOpen(false)}
            userLocation={location}
          />
        </Suspense>
      )}

      {/* PWA Install Banner */}
      {installPrompt && showPwaBanner && (
        <div className="pwa-banner animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Download size={18} color="var(--color-primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
              Pasang aplikasi Sekitarku di layar utama HP Anda untuk akses instan & offline.
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleInstallPwa}
              className="flat-btn-primary"
              style={{ minHeight: '36px', padding: '6px 14px', fontSize: '0.8rem' }}
            >
              {t.pwaInstall}
            </button>
            <button
              onClick={() => setShowPwaBanner(false)}
              aria-label="Tutup"
              className="flat-btn-secondary"
              style={{ minHeight: '36px', padding: '6px 10px' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Critical Alert Banner */}
      {(isAqiAlert || isQuakeAlert) && (
        <div className="alert-banner animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertTriangle size={20} color="var(--color-danger)" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ fontSize: '0.85rem', color: 'var(--color-danger)', display: 'block' }}>
                {isAqiAlert ? t.alertAqiTitle : t.alertQuakeTitle}
              </strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: '600' }}>
                {isAqiAlert
                  ? `${t.alertAqiDesc} (AQI: ${currentAqi})`
                  : `Gempa M ${latestEarthquake?.magnitude} terjadi di ${latestEarthquake?.wilayah}.`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* UNIQUE DIFFERENTIATOR: Eco-Health Hero Score & Outdoor Activity Matrix */}
      <EcoHealthCard
        aqiData={airQualityData}
        weatherData={weatherData}
        loading={loading}
      />

      {/* Row 1: AQI, Weather, Quake */}
      <div className="dashboard-grid-3">
        <AqiCard data={airQualityData} loading={loading} />
        <WeatherCard data={weatherData} locationName={location.name} loading={loading} />
        <EarthquakeCard
          earthquake={latestEarthquake}
          recentQuakes={recentEarthquakes}
          onFocusQuake={handleFocusQuake}
          loading={loading}
        />
      </div>

      
      {/* Karhutla & Fire Danger Rating Card (BMKG FDRS & NASA FIRMS) */}
      <KarhutlaCard
        karhutlaData={karhutlaData}
        airQualityData={airQualityData}
        location={location}
        onOpenModal={() => setIsKarhutlaOpen(true)}
        loading={loading}
      />

      {/* Volcano Proximity & Monitoring Card (PVMBG / MAGMA Indonesia) */}
      <VolcanoCard
        location={location}
        onOpenModal={() => setIsVolcanoOpen(true)}
      />

      {/* Row 2: UV + Hourly Chart */}
      <div className="dashboard-grid-2">
        <UvCard uvIndex={weatherData?.current?.uvIndex || 0} loading={loading} />
        <Suspense fallback={<ComponentSkeleton height="240px" label="Memuat Grafik Tren AQI..." />}>
          <AqiChart hourlyData={airQualityData?.hourly} />
        </Suspense>
      </div>

      {/* Row 3: 7-Day Forecast */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Suspense fallback={<ComponentSkeleton height="260px" label="Memuat Prakiraan Cuaca 7 Hari..." />}>
          <WeatherForecastChart dailyData={weatherData?.daily} />
        </Suspense>
      </div>

      {/* Row 4: Interactive Map */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Suspense fallback={<ComponentSkeleton height="360px" label="Memuat Peta Interaktif Indonesia..." />}>
          <IndonesiaMap
            currentLocation={location}
            earthquakes={recentEarthquakes}
            hotspots={karhutlaData?.allHotspots || []}
            onSelectCity={selectCity}
          />
        </Suspense>
      </div>

      {/* Footer */}
      <Footer onOpenWidget={() => setIsWidgetOpen(true)} />
    </div>
  );
}

export default App;
