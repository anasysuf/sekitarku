import { useState, useEffect } from 'react';
import { getCurrentPosition } from '../utils/geo';
import { INDONESIA_CITIES } from '../utils/cities';

const STORAGE_KEY = 'sekitarku_saved_city';

// Default canonical city for first-time access
export const DEFAULT_CITY = {
  name: 'Jakarta Pusat',
  province: 'DKI Jakarta',
  lat: -6.1805,
  lon: 106.8284,
  isGps: false
};

export function useGeolocation() {
  const [location, setLocation] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (
            parsed &&
            typeof parsed.name === 'string' &&
            typeof parsed.lat === 'number' &&
            !isNaN(parsed.lat) &&
            typeof parsed.lon === 'number' &&
            !isNaN(parsed.lon)
          ) {
            return parsed;
          }
        }
      } catch (err) {
        console.warn('Gagal membaca cache lokasi:', err);
      }
    }
    return DEFAULT_CITY;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync city state to persistent localStorage cache
  useEffect(() => {
    if (typeof window !== 'undefined' && location) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
      } catch (err) {
        console.warn('Gagal menyimpan cache lokasi:', err);
      }
    }
  }, [location]);

  const requestGpsLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const coords = await getCurrentPosition();
      
      // Temukan kota terdekat
      let closestCity = INDONESIA_CITIES[0];
      let minDistance = Infinity;

      INDONESIA_CITIES.forEach(city => {
        const dLat = city.lat - coords.latitude;
        const dLon = city.lon - coords.longitude;
        const dist = Math.sqrt(dLat * dLat + dLon * dLon);
        if (dist < minDistance) {
          minDistance = dist;
          closestCity = city;
        }
      });

      const gpsLocation = {
        name: closestCity.name + ' (GPS)',
        province: closestCity.province,
        lat: coords.latitude,
        lon: coords.longitude,
        isGps: true
      };

      setLocation(gpsLocation);
    } catch (err) {
      console.warn('GPS location request failed:', err);
      setError(err.message || 'Gagal mendeteksi lokasi GPS.');
    } finally {
      setLoading(false);
    }
  };

  const selectCity = (city) => {
    const selected = {
      name: city.name,
      province: city.province,
      lat: city.lat,
      lon: city.lon,
      isGps: false
    };
    setLocation(selected);
  };

  return { location, selectCity, requestGpsLocation, loading, error };
}
