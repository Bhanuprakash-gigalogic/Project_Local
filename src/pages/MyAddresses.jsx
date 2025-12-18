import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdEdit, MdAdd, MdHome } from 'react-icons/md';
import { addressAPI } from '../services/api';

const MyAddresses = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
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
        console.log('🧪 Mock: Loaded addresses from localStorage:', addressList);
      } else {
        // Load from real API
        const response = await addressAPI.getAddresses();
        const addressData = response.data.data || response.data;
        addressList = Array.isArray(addressData) ? addressData : addressData.addresses || [];
      }

      setAddresses(addressList);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      // ============================================
      // 🧪 MOCK MODE - Update in localStorage
      // ============================================
      const USE_MOCK_DATA = true; // Set to false to use real API

      if (USE_MOCK_DATA) {
        const mockAddresses = JSON.parse(localStorage.getItem('mockAddresses') || '[]');

        // Unset all defaults
        mockAddresses.forEach(addr => addr.is_default = false);

        // Set the selected one as default
        const targetAddress = mockAddresses.find(addr => addr.address_id === addressId);
        if (targetAddress) {
          targetAddress.is_default = true;
        }

        // Save back to localStorage
        localStorage.setItem('mockAddresses', JSON.stringify(mockAddresses));
        console.log('🧪 Mock: Set default address:', addressId);
      } else {
        // Use real API
        await addressAPI.setDefaultAddress(addressId);
      }

      fetchAddresses(); // Refresh the list
    } catch (error) {
      console.error('Error setting default address:', error);
      alert('Failed to set default address');
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
          <h1 style={styles.headerTitle}>My Addresses</h1>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {loading ? (
            <div style={styles.loading}>Loading addresses...</div>
          ) : addresses.length === 0 ? (
            <div style={styles.emptyState}>
              <MdHome style={{fontSize: '64px', color: '#ccc', marginBottom: '16px'}} />
              <h2 style={styles.emptyTitle}>No addresses saved</h2>
              <p style={styles.emptyText}>Add an address to get started</p>
            </div>
          ) : (
            addresses.map((address) => {
              const addressId = address.address_id || address.id;
              const isDefault = address.is_default;
              
              return (
                <div key={addressId} style={styles.addressCard}>
                  <div style={styles.addressHeader}>
                    <div style={styles.addressLabel}>
                      <h3 style={styles.addressName}>{address.name}</h3>
                      {isDefault && <span style={styles.defaultBadge}>Default</span>}
                    </div>
                    <button 
                      style={styles.editBtn}
                      onClick={() => navigate(`/addresses/edit/${addressId}`)}
                    >
                      <MdEdit />
                    </button>
                  </div>
                  
                  <div style={styles.addressBody}>
                    <p style={styles.addressText}>
                      {address.address_line1}
                      {address.address_line2 && `, ${address.address_line2}`}
                    </p>
                    <p style={styles.addressText}>
                      {address.city}, {address.state} {address.pincode}
                    </p>
                    <p style={styles.addressText}>USA</p>
                    <p style={styles.addressPhone}>{address.phone}</p>
                  </div>

                  {!isDefault && (
                    <button 
                      style={styles.setDefaultBtn}
                      onClick={() => handleSetDefault(addressId)}
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              );
            })
          )}

          {/* Add New Address Button */}
          <button
            style={styles.addBtn}
            onClick={() => navigate('/addresses/new')}
          >
            <MdAdd style={{fontSize: '24px'}} />
            <span>Add New Address</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: '#F5F5F5',
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
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 8px 0',
  },
  emptyText: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 24px 0',
  },
  addressCard: {
    padding: '20px',
    backgroundColor: 'white',
    border: '1px solid #E0E0E0',
    borderRadius: '12px',
    marginBottom: '16px',
  },
  addressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  addressLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  addressName: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#333',
    margin: 0,
  },
  defaultBadge: {
    padding: '4px 12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  editBtn: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    color: '#666',
    cursor: 'pointer',
    padding: '4px',
  },
  addressBody: {
    marginBottom: '16px',
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
    margin: '8px 0 0 0',
  },
  setDefaultBtn: {
    padding: '10px 16px',
    backgroundColor: 'white',
    color: '#FF6B35',
    border: '2px solid #FF6B35',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  addBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    marginTop: '8px',
  },
};

export default MyAddresses;

