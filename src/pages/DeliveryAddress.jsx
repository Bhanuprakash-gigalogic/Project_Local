import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdEdit, MdAdd, MdRadioButtonUnchecked, MdRadioButtonChecked } from 'react-icons/md';
import { addressAPI } from '../services/api';

const DeliveryAddress = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState('standard');

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      // ============================================
      // 🧪 MOCK MODE - Load from localStorage
      // ============================================
      const USE_MOCK_DATA = true; // Set to false to use real API

      let addressList = [];

      if (USE_MOCK_DATA) {
        // Load mock addresses from localStorage
        const mockAddresses = JSON.parse(localStorage.getItem('mockAddresses') || '[]');
        addressList = mockAddresses;
        console.log('🧪 Mock: Loaded addresses from localStorage:', addressList);
      } else {
        // Load from real API
        const response = await addressAPI.getAddresses();
        const addressData = response.data.data || response.data;
        addressList = Array.isArray(addressData) ? addressData : addressData.addresses || [];
      }

      setAddresses(addressList);

      // Auto-select default address
      const defaultAddr = addressList.find(addr => addr.is_default);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.address_id || defaultAddr.id);
      } else if (addressList.length > 0) {
        setSelectedAddressId(addressList[0].address_id || addressList[0].id);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleContinue = () => {
    if (!selectedAddressId) {
      alert('Please select a delivery address');
      return;
    }

    // Find and save the complete selected address object
    const selectedAddress = addresses.find(addr =>
      (addr.address_id || addr.id) === selectedAddressId
    );

    // Save selected address ID, full address object, and delivery method to localStorage
    localStorage.setItem('selectedAddressId', selectedAddressId);
    if (selectedAddress) {
      localStorage.setItem('selectedAddress', JSON.stringify(selectedAddress));
    }
    localStorage.setItem('deliveryMethod', deliveryMethod);

    console.log('✅ Selected address saved:', selectedAddress);
    navigate('/checkout/payment');
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate('/cart')}>
            <MdArrowBack />
          </button>
          <h1 style={styles.headerTitle}>Delivery Address</h1>
        </div>

        {/* Progress Indicator */}
        <div style={styles.progressContainer}>
          <div style={{...styles.progressStep, ...styles.progressStepActive}}>
            <div style={{...styles.progressDot, ...styles.progressDotActive}}>1</div>
            <span style={{...styles.progressLabel, ...styles.progressLabelActive}}>Address</span>
          </div>
          <div style={styles.progressLine}></div>
          <div style={styles.progressStep}>
            <div style={styles.progressDot}>2</div>
            <span style={styles.progressLabel}>Payment</span>
          </div>
          <div style={styles.progressLine}></div>
          <div style={styles.progressStep}>
            <div style={styles.progressDot}>3</div>
            <span style={styles.progressLabel}>Confirm</span>
          </div>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Select Address Section */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Select a Delivery Address</h2>
              {addresses.length > 0 && (
                <button
                  style={styles.viewAllBtn}
                  onClick={() => navigate('/my-addresses')}
                >
                  View All
                </button>
              )}
            </div>

            {addresses.length === 0 ? (
              <div style={styles.emptyAddresses}>
                <p style={styles.emptyText}>No saved addresses found</p>
                <p style={styles.emptySubtext}>Add a new address to continue</p>
              </div>
            ) : (
              addresses.map((address) => {
              const addressId = address.address_id || address.id;
              const isSelected = selectedAddressId === addressId;
              
              return (
                <div
                  key={addressId}
                  style={{
                    ...styles.addressCard,
                    ...(isSelected ? styles.addressCardSelected : {})
                  }}
                  onClick={() => setSelectedAddressId(addressId)}
                >
                  <div style={styles.addressRadio}>
                    {isSelected ? (
                      <MdRadioButtonChecked style={{fontSize: '24px', color: '#FF6B35'}} />
                    ) : (
                      <MdRadioButtonUnchecked style={{fontSize: '24px', color: '#999'}} />
                    )}
                  </div>
                  <div style={styles.addressInfo}>
                    <h3 style={styles.addressName}>{address.name}</h3>
                    <p style={styles.addressText}>
                      {address.address_line1}
                      {address.address_line2 && `, ${address.address_line2}`}
                    </p>
                    <p style={styles.addressText}>
                      {address.city}, {address.state} {address.pincode}
                    </p>
                    <p style={styles.addressPhone}>{address.phone}</p>
                  </div>
                  <button style={styles.editBtn}>
                    <MdEdit />
                  </button>
                </div>
              );
            })
            )}

            {/* Add New Address Button */}
            <button
              style={styles.addAddressBtn}
              onClick={() => navigate('/addresses/new')}
            >
              <MdAdd style={{fontSize: '20px'}} />
              <span>Add a New Address</span>
            </button>
          </div>

          {/* Delivery Method Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Choose a Delivery Method</h2>
            
            <div
              style={{
                ...styles.deliveryCard,
                ...(deliveryMethod === 'standard' ? styles.deliveryCardSelected : {})
              }}
              onClick={() => setDeliveryMethod('standard')}
            >
              <div style={styles.deliveryRadio}>
                {deliveryMethod === 'standard' ? (
                  <MdRadioButtonChecked style={{fontSize: '24px', color: '#FF6B35'}} />
                ) : (
                  <MdRadioButtonUnchecked style={{fontSize: '24px', color: '#999'}} />
                )}
              </div>
              <div style={styles.deliveryInfo}>
                <h3 style={styles.deliveryTitle}>Standard Shipping</h3>
                <p style={styles.deliveryTime}>Est. delivery: 5-7 business days</p>
              </div>
              <div style={styles.deliveryPrice}>$5.00</div>
            </div>

            <div
              style={{
                ...styles.deliveryCard,
                ...(deliveryMethod === 'express' ? styles.deliveryCardSelected : {})
              }}
              onClick={() => setDeliveryMethod('express')}
            >
              <div style={styles.deliveryRadio}>
                {deliveryMethod === 'express' ? (
                  <MdRadioButtonChecked style={{fontSize: '24px', color: '#FF6B35'}} />
                ) : (
                  <MdRadioButtonUnchecked style={{fontSize: '24px', color: '#999'}} />
                )}
              </div>
              <div style={styles.deliveryInfo}>
                <h3 style={styles.deliveryTitle}>Express Shipping</h3>
                <p style={styles.deliveryTime}>Est. delivery: 1-2 business days</p>
              </div>
              <div style={styles.deliveryPrice}>$15.00</div>
            </div>
          </div>

          {/* Continue Button */}
          <button style={styles.continueBtn} onClick={handleContinue}>
            Continue to Payment
          </button>
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
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 20px',
    backgroundColor: 'white',
  },
  progressStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  progressStepActive: {},
  progressDot: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#E0E0E0',
    color: '#999',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
  },
  progressDotActive: {
    backgroundColor: '#FF6B35',
    color: 'white',
  },
  progressLabel: {
    fontSize: '12px',
    color: '#999',
    fontWeight: '500',
  },
  progressLabelActive: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  progressLine: {
    width: '60px',
    height: '2px',
    backgroundColor: '#E0E0E0',
    margin: '0 8px',
    marginBottom: '24px',
  },
  content: {
    padding: '20px',
  },
  section: {
    marginBottom: '32px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#333',
    margin: 0,
  },
  viewAllBtn: {
    background: 'none',
    border: 'none',
    color: '#FF6B35',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '4px 8px',
  },
  emptyAddresses: {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#F9F9F9',
    borderRadius: '12px',
    marginBottom: '16px',
  },
  emptyText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 8px 0',
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  addressCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    border: '2px solid #E0E0E0',
    borderRadius: '12px',
    marginBottom: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: 'white',
  },
  addressCardSelected: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF5F0',
  },
  addressRadio: {
    flexShrink: 0,
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#333',
    margin: '0 0 8px 0',
  },
  addressText: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 4px 0',
    lineHeight: '1.5',
  },
  addressPhone: {
    fontSize: '14px',
    color: '#666',
    margin: '4px 0 0 0',
  },
  editBtn: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    color: '#666',
    cursor: 'pointer',
    padding: '4px',
  },
  addAddressBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#FFF5F0',
    border: '2px dashed #FF6B35',
    borderRadius: '12px',
    color: '#FF6B35',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },
  deliveryCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    border: '2px solid #E0E0E0',
    borderRadius: '12px',
    marginBottom: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: 'white',
  },
  deliveryCardSelected: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF5F0',
  },
  deliveryRadio: {
    flexShrink: 0,
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 4px 0',
  },
  deliveryTime: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  deliveryPrice: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#333',
  },
  continueBtn: {
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
    marginTop: '24px',
  },
};

export default DeliveryAddress;

