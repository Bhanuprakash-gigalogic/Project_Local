import { createContext, useContext, useState, useEffect } from 'react';
import { zoneAPI } from '../services/api';

const ZoneContext = createContext();

export const useZone = () => {
  const context = useContext(ZoneContext);
  if (!context) {
    throw new Error('useZone must be used within a ZoneProvider');
  }
  return context;
};

export const ZoneProvider = ({ children }) => {
  const [zone, setZone] = useState(null);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('Detecting location...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Auto-detect location on mount
    autoDetectLocation();
  }, []);

  const autoDetectLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🌐 Auto-detecting location based on network/GPS...');

      // Check if geolocation is supported
      if (!navigator.geolocation) {
        console.warn('❌ Geolocation is not supported by this browser');
        setAddress('Location not available');
        setError('Geolocation not supported');
        setLoading(false);
        return;
      }

      // Get user's current position with high accuracy
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;

          console.log('✅ Location Detected:', {
            latitude,
            longitude,
            accuracy: `${accuracy}m`,
            timestamp: new Date().toISOString()
          });

          const detectedLocation = {
            lat: latitude,
            lng: longitude,
            accuracy: accuracy
          };

          setLocation(detectedLocation);

          // Reverse geocode to get address
          await reverseGeocode(latitude, longitude);

          // Detect zone from backend
          try {
            console.log('🌐 Detecting zone from backend...');
            const response = await zoneAPI.detectZone(latitude, longitude, accuracy);
            const zoneData = response.data.data || response.data;

            console.log('✅ Zone Detected:', zoneData);
            setZone(zoneData);

            // Store in localStorage
            localStorage.setItem('userZone', JSON.stringify(zoneData));
            localStorage.setItem('userLocation', JSON.stringify({
              ...detectedLocation,
              timestamp: new Date().toISOString()
            }));

          } catch (apiError) {
            console.warn('⚠️ Could not detect zone:', apiError.message);
            setError('Zone detection failed');
          }

          setLoading(false);
        },
        (geoError) => {
          console.error('❌ Geolocation error:', geoError);

          let errorMessage = 'Failed to detect location';
          switch (geoError.code) {
            case 1: // PERMISSION_DENIED
              errorMessage = 'Location permission denied';
              console.error('❌ User denied location permission');
              break;
            case 2: // POSITION_UNAVAILABLE
              errorMessage = 'Location unavailable';
              console.error('❌ Location information is unavailable');
              break;
            case 3: // TIMEOUT
              errorMessage = 'Location request timed out';
              console.error('❌ Location request timed out');
              break;
            default:
              console.error('❌ Unknown geolocation error');
          }

          setAddress('Location not detected');
          setError(errorMessage);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,  // Use GPS for high accuracy
          timeout: 15000,            // 15 second timeout
          maximumAge: 0              // Don't use cached location
        }
      );

    } catch (err) {
      console.error('❌ Error in autoDetectLocation:', err);
      setAddress('Location detection failed');
      setError('Failed to detect location');
      setLoading(false);
    }
  };

  const detectUserZone = async () => {
    return new Promise((resolve, reject) => {
      try {
        setLoading(true);
        setError(null);

        // Check if geolocation is supported
        if (!navigator.geolocation) {
          console.warn('❌ Geolocation is not supported by this browser');
          setError('Geolocation not supported');
          setLoading(false);
          reject(new Error('Geolocation not supported'));
          return;
        }

        console.log('🔍 Requesting location permission...');

        // Get user's current position
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude, accuracy } = position.coords;

            console.log('✅ User Location Detected:', {
              latitude,
              longitude,
              accuracy: `${accuracy}m`
            });

            setLocation({
              lat: latitude,
              lng: longitude,
              accuracy: accuracy
            });

            // Reverse geocode to get address
            await reverseGeocode(latitude, longitude);

            try {
              console.log('🌐 Sending location to backend...');

              // Send location to backend to detect zone (use 15m accuracy)
              const response = await zoneAPI.detectZone(latitude, longitude, 15);

              console.log('✅ Zone Detected from Backend:', response.data);

              // Extract zone data (handle both {data: {...}} and direct {...} formats)
              const zoneData = response.data.data || response.data;

              setZone(zoneData);
              setError(null);

              // Store zone in localStorage for future use
              localStorage.setItem('userZone', JSON.stringify(zoneData));
              localStorage.setItem('userLocation', JSON.stringify({
                lat: latitude,
                lng: longitude,
                accuracy: 15,
                timestamp: new Date().toISOString()
              }));

              setLoading(false);
              resolve(zoneData);

            } catch (apiError) {
              console.error('❌ Error detecting zone from backend:', apiError);
              console.error('API Error Details:', {
                message: apiError.message,
                response: apiError.response?.data,
                status: apiError.response?.status
              });

              setError('Failed to detect zone');

              // Try to load cached zone
              const cachedZone = localStorage.getItem('userZone');
              if (cachedZone) {
                console.log('📦 Using cached zone data');
                const parsedZone = JSON.parse(cachedZone);
                setZone(parsedZone);
                setLoading(false);
                resolve(parsedZone);
              } else {
                console.warn('⚠️ No cached zone data available');
                setLoading(false);
                reject(apiError);
              }
            }
          },
          (geoError) => {
            console.error('❌ Geolocation error:', geoError);

            let errorMessage = 'Failed to get location';
            switch (geoError.code) {
              case 1: // PERMISSION_DENIED
                errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
                console.error('❌ User denied location permission');
                break;
              case 2: // POSITION_UNAVAILABLE
                errorMessage = 'Location information unavailable. Please check your internet connection or enable WiFi.';
                console.error('❌ Location information is unavailable');
                break;
              case 3: // TIMEOUT
                errorMessage = 'Location request timed out. Please try again.';
                console.error('❌ Location request timed out');
                break;
              default:
                console.error('❌ Unknown geolocation error');
            }

            setError(errorMessage);

            // Try to load cached data
            const cachedZone = localStorage.getItem('userZone');
            const cachedLocation = localStorage.getItem('userLocation');

            if (cachedZone && cachedLocation) {
              console.log('📦 Using cached location and zone data');
              const parsedZone = JSON.parse(cachedZone);
              setZone(parsedZone);
              setLocation(JSON.parse(cachedLocation));
              setLoading(false);
              resolve(parsedZone);
            } else {
              console.warn('⚠️ No cached data available');
              setLoading(false);
              reject(new Error(errorMessage));
            }
          },
          {
            enableHighAccuracy: true,  // ⭐ Enable high accuracy for GPS precision
            timeout: 10000,            // 10 second timeout
            maximumAge: 0              // Don't use cached location
          }
        );
      } catch (err) {
        console.error('❌ Error in detectUserZone:', err);
        setError('Failed to detect zone');
        setLoading(false);
        reject(err);
      }
    });
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      // Using a free geocoding service (Nominatim - OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();

      if (data && data.display_name) {
        const formattedAddress = data.display_name;
        setAddress(formattedAddress);
        localStorage.setItem('userAddress', formattedAddress);
        console.log('📍 Address:', formattedAddress);
      }
    } catch (error) {
      console.warn('⚠️ Could not reverse geocode:', error);
    }
  };

  const updateLocation = async (lat, lng) => {
    setLoading(true);

    setLocation({ lat, lng, accuracy: 1000 });
    await reverseGeocode(lat, lng);

    try {
      const response = await zoneAPI.detectZone(lat, lng, 1000);
      const zoneData = response.data.data || response.data;
      setZone(zoneData);

      localStorage.setItem('userZone', JSON.stringify(zoneData));
      localStorage.setItem('userLocation', JSON.stringify({
        lat, lng, accuracy: 1000, timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('❌ Error updating zone:', error);
    }

    setLoading(false);
  };

  const refreshZone = async () => {
    return await detectUserZone();
  };

  const setSelectedZone = (zoneData) => {
    setZone(zoneData);
    localStorage.setItem('userZone', JSON.stringify(zoneData));
  };

  const value = {
    zone,
    location,
    address,
    loading,
    error,
    refreshZone,
    updateLocation,
    setAddress,
    setSelectedZone,
  };

  return <ZoneContext.Provider value={value}>{children}</ZoneContext.Provider>;
};

