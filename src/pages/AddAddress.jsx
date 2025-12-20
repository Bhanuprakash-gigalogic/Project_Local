import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack, MdMyLocation, MdHome, MdWork, MdLocationOn } from 'react-icons/md';
import { addressAPI } from '../services/api';

const AddAddress = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [addressType, setAddressType] = useState('home');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    alternatePhone: '',
    pincode: '',
    address_line1: '',
    address_line2: '',
    landmark: '',
    city: '',
    state: '',
    country: 'USA',
    is_default: false,
  });

  const [errors, setErrors] = useState({});

  // Fetch address data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchAddressData();
    }
  }, [isEditMode, id]);

  const fetchAddressData = async () => {
    try {
      setLoading(true);

      // ============================================
      // 🧪 MOCK MODE - Load from localStorage
      // ============================================
      const USE_MOCK_DATA = true; // Set to false to use real API

      let addressList = [];

      if (USE_MOCK_DATA) {
        // Load mock addresses from localStorage
        const mockAddresses = JSON.parse(localStorage.getItem('mockAddresses') || '[]');
        addressList = mockAddresses;
        console.log('🧪 Mock: Loading address for edit:', id);
      } else {
        // Load from real API
        const response = await addressAPI.getAddresses();
        const addressData = response.data.data || response.data;
        addressList = Array.isArray(addressData) ? addressData : addressData.addresses || [];
      }

      const address = addressList.find(addr =>
        (addr.address_id || addr.id) === parseInt(id)
      );

      if (address) {
        setFormData({
          name: address.name || '',
          phone: address.phone || '',
          alternatePhone: address.alternate_phone || '',
          pincode: address.pincode || '',
          address_line1: address.address_line1 || '',
          address_line2: address.address_line2 || '',
          landmark: address.landmark || '',
          city: address.city || '',
          state: address.state || '',
          country: address.country || 'USA',
          is_default: address.is_default || false,
        });
        setAddressType(address.address_type || 'home');
        console.log('🧪 Mock: Loaded address data:', address);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      alert('Failed to load address data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleDetectLocation = () => {
    setDetectingLocation(true);

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('📍 Location detected:', latitude, longitude);

        try {
          // Use reverse geocoding API with proper headers
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            {
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'Woodzon-App'
              }
            }
          );

          if (!response.ok) {
            throw new Error('Failed to fetch location data');
          }

          const data = await response.json();
          console.log('🗺️ Geocoding response:', data);

          if (data && data.address) {
            const address = data.address;

            // Extract address components
            const houseNumber = address.house_number || '';
            const road = address.road || address.street || '';
            const suburb = address.suburb || address.neighbourhood || '';
            const city = address.city || address.town || address.village || address.county || '';
            const state = address.state || address.region || '';
            const postcode = address.postcode || '';
            const country = address.country || 'USA';

            // Build address line 1
            let addressLine1 = '';
            if (houseNumber) addressLine1 += houseNumber + ' ';
            if (road) addressLine1 += road;

            // Build address line 2
            let addressLine2 = suburb;

            setFormData({
              ...formData,
              address_line1: addressLine1.trim() || data.display_name?.split(',')[0] || '',
              address_line2: addressLine2.trim(),
              city: city,
              state: state,
              pincode: postcode,
              country: country,
            });

            alert('✅ Location detected successfully!');
          } else {
            throw new Error('No address data found');
          }
        } catch (error) {
          console.error('❌ Error detecting location:', error);
          alert('Failed to detect location details. Please enter manually.\n\nError: ' + error.message);
        } finally {
          setDetectingLocation(false);
        }
      },
      (error) => {
        console.error('❌ Geolocation error:', error);
        let errorMessage = 'Unable to detect location. ';

        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
        }

        alert(errorMessage + '\n\nPlease enter your address manually.');
        setDetectingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/[-()\s]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (formData.alternatePhone && !/^\d{10}$/.test(formData.alternatePhone.replace(/[-()\s]/g, ''))) {
      newErrors.alternatePhone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.pincode.trim()) newErrors.pincode = 'PIN code is required';
    else if (!/^\d{5,6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid PIN code';
    }
    
    if (!formData.address_line1.trim()) newErrors.address_line1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare address data with correct field names
      const addressData = {
        name: formData.name,
        phone: formData.phone,
        address_line1: formData.address_line1,
        address_line2: formData.address_line2 || '',
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country || 'USA',
        address_type: addressType,
        is_default: formData.is_default,
      };

      // Add optional fields only if they have values
      if (formData.alternatePhone) {
        addressData.alternate_phone = formData.alternatePhone;
      }
      if (formData.landmark) {
        addressData.landmark = formData.landmark;
      }

      console.log('📤 Sending address data:', addressData);

      // ============================================
      // 🧪 MOCK MODE - Save to localStorage
      // ============================================
      const USE_MOCK_DATA = true; // Set to false to use real API

      if (USE_MOCK_DATA) {
        // Get existing addresses from localStorage
        const existingAddresses = JSON.parse(localStorage.getItem('mockAddresses') || '[]');

        if (isEditMode) {
          // Update existing address
          const index = existingAddresses.findIndex(addr => addr.address_id === parseInt(id));
          if (index !== -1) {
            existingAddresses[index] = {
              ...existingAddresses[index],
              ...addressData,
              address_id: parseInt(id),
            };
          }
          console.log('✅ Mock: Address updated');
          alert('✅ Address updated successfully!');
        } else {
          // Add new address
          const newAddress = {
            ...addressData,
            address_id: Date.now(), // Generate unique ID
            created_at: new Date().toISOString(),
          };

          // If this is set as default, unset all other defaults
          if (newAddress.is_default) {
            existingAddresses.forEach(addr => addr.is_default = false);
          }

          existingAddresses.push(newAddress);
          console.log('✅ Mock: Address added:', newAddress);
          alert('✅ Address added successfully!');
        }

        // Save back to localStorage
        localStorage.setItem('mockAddresses', JSON.stringify(existingAddresses));

        // Navigate back
        setTimeout(() => {
          navigate(-1);
        }, 500);

      } else {
        // ============================================
        // 🌐 REAL API MODE
        // ============================================
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please login to add an address');
          navigate('/');
          return;
        }

        console.log('🔑 Auth token present:', !!token);

        let response;
        if (isEditMode) {
          response = await addressAPI.updateAddress(id, addressData);
          console.log('✅ Address updated:', response.data);
          alert('Address updated successfully!');
        } else {
          response = await addressAPI.addAddress(addressData);
          console.log('✅ Address added:', response.data);
          alert('Address added successfully!');
        }

        navigate(-1);
      }

    } catch (error) {
      console.error(`❌ Error ${isEditMode ? 'updating' : 'adding'} address:`, error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);

      // Show detailed error message
      let errorMessage = `Failed to ${isEditMode ? 'update' : 'add'} address. Please try again.`;

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            <MdArrowBack />
          </button>
          <h1 style={styles.headerTitle}>{isEditMode ? 'Edit Address' : 'Add New Address'}</h1>
        </div>

        {/* Content */}
        <div style={styles.content}>
          <form onSubmit={handleSubmit}>
            {/* Info Message */}
            {!isEditMode && (
              <div style={styles.infoBox}>
                <p style={styles.infoText}>
                  💡 Click the button below to auto-detect your location, or scroll down to enter manually.
                </p>
              </div>
            )}

            {/* Detect Location Button */}
            <button
              type="button"
              style={{
                ...styles.detectBtn,
                ...(detectingLocation ? styles.detectBtnLoading : {})
              }}
              onClick={handleDetectLocation}
              disabled={detectingLocation}
            >
              <MdMyLocation style={{
                fontSize: '20px',
                animation: detectingLocation ? 'spin 1s linear infinite' : 'none'
              }} />
              <span>{detectingLocation ? 'Detecting Location...' : 'Use My Current Location'}</span>
            </button>

            {detectingLocation && (
              <div style={styles.detectingMessage}>
                <p style={styles.detectingText}>
                  📍 Please allow location access when prompted by your browser...
                </p>
              </div>
            )}

            {/* Add CSS animation for spinning icon */}
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>

            <div style={styles.dividerContainer}>
              <div style={styles.dividerLine}></div>
              <span style={styles.dividerText}>OR ENTER MANUALLY</span>
              <div style={styles.dividerLine}></div>
            </div>

            {/* Contact Information */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Contact Information</h2>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Full Name <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={{...styles.input, ...(errors.name ? styles.inputError : {})}}
                  placeholder="Enter your full name"
                />
                {errors.name && <span style={styles.errorText}>{errors.name}</span>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Phone Number <span style={styles.required}>*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={{...styles.input, ...(errors.phone ? styles.inputError : {})}}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                />
                {errors.phone && <span style={styles.errorText}>{errors.phone}</span>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Alternate Phone Number <span style={styles.optional}>(Optional)</span>
                </label>
                <input
                  type="tel"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={handleInputChange}
                  style={{...styles.input, ...(errors.alternatePhone ? styles.inputError : {})}}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                />
                {errors.alternatePhone && <span style={styles.errorText}>{errors.alternatePhone}</span>}
              </div>
            </div>

            {/* Address Details */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Address Details</h2>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  PIN Code <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  style={{...styles.input, ...(errors.pincode ? styles.inputError : {})}}
                  placeholder="Enter PIN code"
                  maxLength="6"
                />
                {errors.pincode && <span style={styles.errorText}>{errors.pincode}</span>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Address (House No, Building, Street) <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="address_line1"
                  value={formData.address_line1}
                  onChange={handleInputChange}
                  style={{...styles.input, ...(errors.address_line1 ? styles.inputError : {})}}
                  placeholder="Enter your address"
                />
                {errors.address_line1 && <span style={styles.errorText}>{errors.address_line1}</span>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Area, Colony, Sector <span style={styles.optional}>(Optional)</span>
                </label>
                <input
                  type="text"
                  name="address_line2"
                  value={formData.address_line2}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Enter area/colony"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Landmark <span style={styles.optional}>(Optional)</span>
                </label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="E.g. Near Apollo Hospital"
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    City <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    style={{...styles.input, ...(errors.city ? styles.inputError : {})}}
                    placeholder="City"
                  />
                  {errors.city && <span style={styles.errorText}>{errors.city}</span>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    State <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    style={{...styles.input, ...(errors.state ? styles.inputError : {})}}
                    placeholder="State"
                  />
                  {errors.state && <span style={styles.errorText}>{errors.state}</span>}
                </div>
              </div>
            </div>

            {/* Address Type */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Address Type</h2>
              <div style={styles.addressTypeContainer}>
                <button
                  type="button"
                  style={{
                    ...styles.addressTypeBtn,
                    ...(addressType === 'home' ? styles.addressTypeBtnActive : {})
                  }}
                  onClick={() => setAddressType('home')}
                >
                  <MdHome style={{fontSize: '20px'}} />
                  <span>Home</span>
                </button>
                <button
                  type="button"
                  style={{
                    ...styles.addressTypeBtn,
                    ...(addressType === 'work' ? styles.addressTypeBtnActive : {})
                  }}
                  onClick={() => setAddressType('work')}
                >
                  <MdWork style={{fontSize: '20px'}} />
                  <span>Work</span>
                </button>
                <button
                  type="button"
                  style={{
                    ...styles.addressTypeBtn,
                    ...(addressType === 'other' ? styles.addressTypeBtnActive : {})
                  }}
                  onClick={() => setAddressType('other')}
                >
                  <MdLocationOn style={{fontSize: '20px'}} />
                  <span>Other</span>
                </button>
              </div>
            </div>

            {/* Set as Default */}
            <div style={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="is_default"
                name="is_default"
                checked={formData.is_default}
                onChange={handleInputChange}
                style={styles.checkbox}
              />
              <label htmlFor="is_default" style={styles.checkboxLabel}>
                Make this my default address
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={styles.submitBtn}
              disabled={loading}
            >
              {loading ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Address' : 'Save Address')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: '#F5F5DC',
    minHeight: '100vh',
    paddingBottom: '40px',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'white',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #E0E0E0',
    backgroundColor: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  backBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '8px',
    marginRight: '12px',
    display: 'flex',
    alignItems: 'center',
    color: '#333',
  },
  headerTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  content: {
    padding: '20px',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    border: '1px solid #90CAF9',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '16px',
  },
  infoText: {
    fontSize: '14px',
    color: '#1976D2',
    margin: 0,
    lineHeight: '1.5',
  },
  detectingMessage: {
    backgroundColor: '#FFF3E0',
    border: '1px solid #FFB74D',
    borderRadius: '8px',
    padding: '12px 16px',
    marginTop: '12px',
    marginBottom: '12px',
  },
  detectingText: {
    fontSize: '13px',
    color: '#F57C00',
    margin: 0,
    textAlign: 'center',
  },
  detectBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '24px',
    transition: 'all 0.2s ease',
  },
  detectBtnLoading: {
    backgroundColor: '#45a049',
    cursor: 'not-allowed',
    opacity: 0.8,
  },
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: '24px 0',
    gap: '12px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    fontSize: '12px',
    color: '#999',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '16px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formRow: {
    display: 'flex',
    gap: '12px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  required: {
    color: '#FF6B35',
  },
  optional: {
    color: '#999',
    fontWeight: '400',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    border: '2px solid #E0E0E0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
  },
  inputError: {
    borderColor: '#FF6B35',
  },
  errorText: {
    display: 'block',
    fontSize: '12px',
    color: '#FF6B35',
    marginTop: '4px',
  },
  addressTypeContainer: {
    display: 'flex',
    gap: '12px',
  },
  addressTypeBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: 'white',
    border: '2px solid #E0E0E0',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#666',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s ease',
  },
  addressTypeBtnActive: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF5F0',
    color: '#FF6B35',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '24px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  checkboxLabel: {
    fontSize: '14px',
    color: '#333',
    cursor: 'pointer',
  },
  submitBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#FF6B35',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

export default AddAddress;

