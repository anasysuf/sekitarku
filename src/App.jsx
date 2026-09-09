import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CitySearchModal } from './components/common/CitySearchModal';
import { EcoHealthCard } from './components/cards/EcoHealthCard';
import { AqiCard } from './components/cards/AqiCard';
import { WeatherCard } from './components/cards/WeatherCard';
import { EarthquakeCard } from './components/cards/EarthquakeCard';
import { UvCard } from './components/cards/UvCard';
import { IndonesiaMap } from './components/map/IndonesiaMap';
import { AqiChart } from './components/charts/AqiChart';
import { WeatherForecastChart } from './components/charts/WeatherForecastChart';
import { AlertTriangle, Download, X } from 'lucide-react';

import { useGeolocation } from './hooks/useGeolocation';
import { useDarkMode } from './hooks/useDarkMode';
import { fetchWeatherData } from './services/weather';
import { fetchAirQualityData } from './services/airQuality';
import { fetchLatestEarthquake, fetchRecentEarthquakes } from './services/bmkg';
import { translations } from './utils/i18n';

export function App() {
  const { location, selectCity, requestGpsLocation, loading: gpsLoading } = useGeolocation();
  const { isDark, toggleDarkMode } = useDarkMode();
  const [lang, setLang] = useState('id');

  const [weatherData, setWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [latestEarthquake, setLatestEarthquake] = useState(null);
  const [recentEarthquakes, setRecentEarthquakes] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Search Modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // PWA and Notification states
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showPwaBanner, setShowPwaBanner] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const t = translations[lang] || translations.id;

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log('SW registration skipped in dev:', err);
      });
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
      new Notification('Lingkunganku Active', {
        body: 'Notifikasi peringatan gempa & kualitas udara berhasil diaktifkan.',
        icon: '/leaf.svg'
      });
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [weather, aqi, quake, quakeList] = await Promise.all([
        fetchWeatherData(location.lat, location.lon),
        fetchAirQualityData(location.lat, location.lon),
        fetchLatestEarthquake(),
        fetchRecentEarthquakes()
      ]);

      setWeatherData(weather);
      setAirQualityData(aqi);
      setLatestEarthquake(quake);
      setRecentEarthquakes(quakeList);
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

  const toggleLang = () => {
    setLang(prev => prev === 'id' ? 'en' : 'id');
  };

  // Alerts
  const currentAqi = airQualityData?.current?.aqi || 0;
  const isAqiAlert = currentAqi > 150;
  const isQuakeAlert = latestEarthquake && latestEarthquake.magnitude >= 5.5;

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
        onRefresh={loadData}
        lastUpdated={lastUpdated}
        lang={lang}
        onToggleLang={toggleLang}
        notificationsEnabled={notificationsEnabled}
        onRequestNotification={handleRequestNotification}
      />

      {/* City Search Modal */}
      <CitySearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectCity={selectCity}
        currentCity={location}
        lang={lang}
      />

      {/* PWA Install Banner */}
      {installPrompt && showPwaBanner && (
        <div className="pwa-banner animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Download size={18} color="#10b981" />
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              Pasang aplikasi Lingkunganku di layar utama HP Anda untuk akses instan & offline.
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleInstallPwa}
              style={{
                padding: '4px 12px',
                borderRadius: '6px',
                backgroundColor: '#10b981',
                color: '#fff',
                border: 'none',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {t.pwaInstall}
            </button>
            <button
              onClick={() => setShowPwaBanner(false)}
              aria-label="Tutup"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
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
            <AlertTriangle size={20} color="#ef4444" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ fontSize: '0.85rem', color: '#ef4444', display: 'block' }}>
                {isAqiAlert ? t.alertAqiTitle : t.alertQuakeTitle}
              </strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)' }}>
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
        lang={lang}
      />

      {/* Row 1: AQI, Weather, Quake */}
      <div className="dashboard-grid-3">
        <AqiCard data={airQualityData} loading={loading} lang={lang} />
        <WeatherCard data={weatherData} locationName={location.name} loading={loading} lang={lang} />
        <EarthquakeCard
          earthquake={latestEarthquake}
          recentQuakes={recentEarthquakes}
          onFocusQuake={handleFocusQuake}
          loading={loading}
          lang={lang}
        />
      </div>

      {/* Row 2: UV + Hourly Chart */}
      <div className="dashboard-grid-2">
        <UvCard uvIndex={weatherData?.current?.uvIndex || 0} loading={loading} />
        <AqiChart hourlyData={airQualityData?.hourly} />
      </div>

      {/* Row 3: 7-Day Forecast */}
      <div style={{ marginBottom: '1rem' }}>
        <WeatherForecastChart dailyData={weatherData?.daily} lang={lang} />
      </div>

      {/* Row 4: Interactive Map */}
      <div style={{ marginBottom: '1rem' }}>
        <IndonesiaMap
          currentLocation={location}
          earthquakes={recentEarthquakes}
          onSelectCity={selectCity}
          lang={lang}
        />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
