// Mock data utilities for testing without backend

// Initialize sample addresses
export const initializeMockAddresses = () => {
  const sampleAddresses = [
    {
      address_id: 1,
      name: 'John Doe',
      phone: '1234567890',
      alternate_phone: '9876543210',
      address_line1: '123 Main Street',
      address_line2: 'KPHB Colony',
      landmark: 'Near Apollo Hospital',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500032',
      country: 'USA',
      address_type: 'home',
      is_default: true,
      created_at: '2024-01-15T10:30:00Z',
    },
    {
      address_id: 2,
      name: 'John Doe',
      phone: '1234567890',
      address_line1: '456 Tech Park',
      address_line2: 'Madhapur',
      landmark: 'Near Cyber Towers',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
      country: 'USA',
      address_type: 'work',
      is_default: false,
      created_at: '2024-01-20T14:20:00Z',
    },
  ];

  // Only initialize if no addresses exist
  const existing = localStorage.getItem('mockAddresses');
  if (!existing) {
    localStorage.setItem('mockAddresses', JSON.stringify(sampleAddresses));
    console.log('🧪 Mock: Initialized sample addresses');
  }
};

// Clear all mock data
export const clearMockData = () => {
  localStorage.removeItem('mockAddresses');
  console.log('🧪 Mock: Cleared all mock addresses');
};

// Get mock addresses
export const getMockAddresses = () => {
  const addresses = JSON.parse(localStorage.getItem('mockAddresses') || '[]');
  return addresses;
};

// Add mock address
export const addMockAddress = (addressData) => {
  const addresses = getMockAddresses();
  const newAddress = {
    ...addressData,
    address_id: Date.now(),
    created_at: new Date().toISOString(),
  };
  
  // If this is set as default, unset all other defaults
  if (newAddress.is_default) {
    addresses.forEach(addr => addr.is_default = false);
  }
  
  addresses.push(newAddress);
  localStorage.setItem('mockAddresses', JSON.stringify(addresses));
  return newAddress;
};

// Update mock address
export const updateMockAddress = (addressId, addressData) => {
  const addresses = getMockAddresses();
  const index = addresses.findIndex(addr => addr.address_id === addressId);
  
  if (index !== -1) {
    addresses[index] = {
      ...addresses[index],
      ...addressData,
    };
    
    // If this is set as default, unset all other defaults
    if (addresses[index].is_default) {
      addresses.forEach((addr, i) => {
        if (i !== index) addr.is_default = false;
      });
    }
    
    localStorage.setItem('mockAddresses', JSON.stringify(addresses));
    return addresses[index];
  }
  return null;
};

// Delete mock address
export const deleteMockAddress = (addressId) => {
  const addresses = getMockAddresses();
  const filtered = addresses.filter(addr => addr.address_id !== addressId);
  localStorage.setItem('mockAddresses', JSON.stringify(filtered));
  return true;
};

// Set default address
export const setMockDefaultAddress = (addressId) => {
  const addresses = getMockAddresses();
  
  addresses.forEach(addr => {
    addr.is_default = addr.address_id === addressId;
  });
  
  localStorage.setItem('mockAddresses', JSON.stringify(addresses));
  return true;
};

// Console helper to manage mock data
if (typeof window !== 'undefined') {
  window.mockData = {
    init: initializeMockAddresses,
    clear: clearMockData,
    get: getMockAddresses,
    add: addMockAddress,
    update: updateMockAddress,
    delete: deleteMockAddress,
    setDefault: setMockDefaultAddress,
  };
  
  console.log('🧪 Mock Data Helper loaded. Use window.mockData in console:');
  console.log('  - mockData.init()     : Initialize sample addresses');
  console.log('  - mockData.get()      : Get all addresses');
  console.log('  - mockData.clear()    : Clear all addresses');
}

