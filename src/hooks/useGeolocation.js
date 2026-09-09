import { useState, useEffect } from 'react';
import { getCurrentPosition } from '../utils/geo';
import { INDONESIA_CITIES } from '../utils/cities';

export function useGeolocation() {
  const [location, setLocation] = useState({
    name: 'DKI Jakarta',
    province: 'DKI Jakarta',
    lat: -6.2088,
    lon: 106.8456,
    isGps: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

      setLocation({
        name: `${closestCity.name} (GPS)`,
        province: closestCity.province,
        lat: coords.latitude,
        lon: coords.longitude,
        isGps: true
      });
    } catch (err) {
      console.warn('GPS location request failed:', err);
      setError(err.message || 'Gagal mendeteksi lokasi GPS.');
    } finally {
      setLoading(false);
    }
  };

  const selectCity = (city) => {
    setLocation({
      name: city.name,
      province: city.province,
      lat: city.lat,
      lon: city.lon,
      isGps: false
    });
  };

  return { location, selectCity, requestGpsLocation, loading, error };
}
