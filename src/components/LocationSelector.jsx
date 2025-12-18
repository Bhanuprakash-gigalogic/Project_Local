import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useZone } from '../context/ZoneContext';
import { zoneAPI } from '../services/api';

// Fix Leaflet default marker icon
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationSelector = () => {
  const { setSelectedZone } = useZone();
  const [selectedCoords, setSelectedCoords] = useState({ lat: 17.385, lng: 78.4867 });
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoDetected, setAutoDetected] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [showManualSelection, setShowManualSelection] = useState(false);

  // Auto detect current location with enhanced error handling
  useEffect(() => {
    if (navigator.geolocation) {
      console.log('🔍 Attempting to detect location...');

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          console.log('✅ Location detected:', { latitude, longitude, accuracy });

          setSelectedCoords({ lat: latitude, lng: longitude });
          setAutoDetected(true);
          setLocationError(null);
          reverseGeocode(latitude, longitude);

          // Automatically detect zone
          detectZone(latitude, longitude);
        },
        (err) => {
          console.error('❌ Location detection failed:', err);

          // Handle different error types
          let errorMessage = '';
          switch(err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location permissions in your browser.';
              console.error('🚫 PERMISSION_DENIED - User blocked location access');
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable. Please select manually on the map.';
              console.error('📍 POSITION_UNAVAILABLE - GPS/WiFi location not available');
              break;
            case err.TIMEOUT:
              errorMessage = 'Location request timed out. Please try again or select manually.';
              console.error('⏱️ TIMEOUT - Location request took too long');
              break;
            default:
              errorMessage = 'Unable to detect location. Please select manually on the map.';
              console.error('❓ UNKNOWN ERROR:', err);
          }

          setLocationError(errorMessage);
          setShowManualSelection(true);
        },
        {
          enableHighAccuracy: true,  // ⭐ High accuracy mode (uses GPS if available)
          timeout: 10000,            // 10 second timeout
          maximumAge: 0              // Don't use cached location
        }
      );
    } else {
      console.error('❌ Geolocation not supported by this browser');
      setLocationError('Your browser does not support location detection. Please select manually on the map.');
      setShowManualSelection(true);
    }
  }, []);

  // Reverse Geocoding
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const data = await res.json();
      if (data?.display_name) {
        setAddress(data.display_name);
        console.log('📍 Address:', data.display_name);
      }
    } catch (e) {
      console.error('❌ Reverse geocode failed:', e);
    }
  };

  // Detect zone using backend API
  const detectZone = async (lat, lng) => {
    try {
      setLoading(true);
      console.log('🌍 Detecting zone for coordinates:', { lat, lng });

      const response = await zoneAPI.detectZone(lat, lng, 15); // 15m accuracy
      const zoneData = response.data?.data || response.data;

      console.log('✅ Zone detected:', zoneData);

      // Store zone data
      localStorage.setItem('userZone', JSON.stringify(zoneData));
      localStorage.setItem('userLocation', JSON.stringify({
        lat,
        lng,
        accuracy_meters: 15,
        timestamp: new Date().toISOString()
      }));

      setSelectedZone(zoneData);
      alert(`✅ Zone detected: ${zoneData.zone_name || zoneData.name}\nCity: ${zoneData.city || 'N/A'}`);

    } catch (err) {
      console.error('❌ Zone detection failed:', err);
      alert('❌ Unable to detect zone for this location. Please try a different location.');
    } finally {
      setLoading(false);
    }
  };

  // Map Click Handler
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        console.log('🗺️ Map clicked:', { lat, lng });
        setSelectedCoords({ lat, lng });
        setAutoDetected(false);
        reverseGeocode(lat, lng);
      }
    });
    return <Marker position={[selectedCoords.lat, selectedCoords.lng]} />;
  };

  // Confirm location and detect zone
  const confirmLocation = async () => {
    await detectZone(selectedCoords.lat, selectedCoords.lng);
  };

  // Retry location detection
  const retryLocationDetection = () => {
    setLocationError(null);
    setShowManualSelection(false);
    window.location.reload(); // Reload to trigger useEffect again
  };

  return (
    <div className="location-container">
      <h3>🗺️ Select Your Location</h3>

      {/* Success message */}
      {autoDetected && !locationError && (
        <div className="success-message">
          ✅ Auto-detected your current location
        </div>
      )}

      {/* Error message with retry option */}
      {locationError && (
        <div className="error-message">
          <p>⚠️ {locationError}</p>
          <div className="error-actions">
            <button className="retry-btn" onClick={retryLocationDetection}>
              🔄 Retry Auto-Detection
            </button>
            <button className="manual-btn" onClick={() => setShowManualSelection(true)}>
              🗺️ Select Manually
            </button>
          </div>

          <div className="help-box">
            <strong>💡 Troubleshooting Tips:</strong>
            <ul>
              <li>Make sure you're accessing via <code>http://localhost</code> (not IP address)</li>
              <li>Click the 🔒 icon in address bar → Site Settings → Location → Allow</li>
              <li>Press <code>Ctrl + F5</code> to refresh permissions</li>
              <li>Enable WiFi for better location accuracy on desktop</li>
            </ul>
          </div>
        </div>
      )}

      {/* Map for manual selection */}
      {(showManualSelection || !locationError) && (
        <>
          <div className="map-wrapper">
            <MapContainer
              center={[selectedCoords.lat, selectedCoords.lng]}
              zoom={15}
              style={{ height: '350px', width: '100%', borderRadius: '8px' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <LocationMarker />
            </MapContainer>
          </div>

          {/* Address display */}
          <div className="address-box">
            <strong>📍 Selected Location:</strong>
            <p>{address || 'Click on the map to select a location'}</p>
            <p className="coordinates">
              Lat: {selectedCoords.lat.toFixed(6)}, Lng: {selectedCoords.lng.toFixed(6)}
            </p>
          </div>

          {/* Confirm button */}
          <button
            className="confirm-btn"
            onClick={confirmLocation}
            disabled={loading}
          >
            {loading ? '🔄 Detecting Zone...' : '✅ Confirm Location & Detect Zone'}
          </button>
        </>
      )}

      {/* Browser compatibility check */}
      {!navigator.geolocation && (
        <div className="warning-message">
          ⚠️ Your browser does not support geolocation. Please use a modern browser like Chrome, Firefox, or Edge.
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
