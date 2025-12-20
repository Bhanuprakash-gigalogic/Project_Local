import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useZone } from '../context/ZoneContext';
import {
  MdLocationOn,
  MdSearch,
  MdShoppingCart,
  MdFavorite,
  MdStore,
  MdReceipt,
  MdStar,
  MdClose,
  MdHistory
} from 'react-icons/md';
import { productsAPI } from '../services/api';

// Inline Styles
const styles = {
  header: {
    backgroundColor: '#F5F5DC',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  headerTop: {
    borderBottom: '1px solid #E0E0E0',
  },
  headerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    color: '#8B4513',
    fontWeight: '700',
    fontSize: '24px',
    flexShrink: 0,
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIconImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  searchWrapper: {
    flex: 1,
    position: 'relative',
    maxWidth: '600px',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: '24px',
    padding: '8px 16px',
    gap: '8px',
    border: '2px solid transparent',
    transition: 'all 0.3s',
  },
  searchBarFocused: {
    backgroundColor: 'white',
    borderColor: '#8B4513',
    boxShadow: '0 2px 8px rgba(139, 69, 19, 0.15)',
  },
  searchIcon: {
    fontSize: '20px',
    color: '#666',
    flexShrink: 0,
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '14px',
    color: '#333',
  },
  searchClear: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    color: '#999',
    fontSize: '18px',
  },
  searchButton: {
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    padding: '8px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  searchSuggestions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    marginTop: '8px',
    maxHeight: '400px',
    overflowY: 'auto',
    zIndex: 1000,
  },
  suggestionItem: {
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    borderBottom: '1px solid #F0F0F0',
  },
  suggestionIcon: {
    fontSize: '18px',
    color: '#999',
  },
  // Enhanced search suggestions panel
  searchSuggestionsPanel: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
    marginTop: '8px',
    maxHeight: '500px',
    overflowY: 'auto',
    zIndex: 1000,
  },
  searchSection: {
    padding: '12px 0',
    borderBottom: '1px solid #F0F0F0',
  },
  searchSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 16px 8px 16px',
  },
  searchSectionTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#666',
    padding: '0 16px 8px 16px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  suggestionItemWithImage: {
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  suggestionImageWrapper: {
    width: '50px',
    height: '50px',
    borderRadius: '8px',
    overflow: 'hidden',
    flexShrink: 0,
    backgroundColor: '#F5F5F5',
  },
  suggestionImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  suggestionText: {
    fontSize: '14px',
    color: '#333',
    flex: 1,
  },
  keywordsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    padding: '0 16px',
  },
  keywordChip: {
    padding: '6px 12px',
    backgroundColor: '#F0F8F0',
    borderRadius: '16px',
    fontSize: '13px',
    color: '#2E7D32',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontWeight: '500',
  },
  recentSearchItem: {
    padding: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  recentSearchText: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  recentSearchIcon: {
    fontSize: '18px',
    color: '#999',
  },
  removeSearchBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    color: '#999',
    fontSize: '16px',
  },
  clearAllBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#007185',
    fontSize: '12px',
    fontWeight: '500',
  },
  searchLoading: {
    position: 'absolute',
    right: '80px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  spinnerSmall: {
    width: '16px',
    height: '16px',
    border: '2px solid #E0E0E0',
    borderTopColor: '#8B4513',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  headerNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    textDecoration: 'none',
    color: '#333',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'color 0.3s',
    position: 'relative',
  },
  navIcon: {
    fontSize: '20px',
  },
  navIconLarge: {
    fontSize: '24px',
  },
  badge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: '#DC2626',
    color: 'white',
    borderRadius: '10px',
    padding: '2px 6px',
    fontSize: '11px',
    fontWeight: '600',
    minWidth: '18px',
    textAlign: 'center',
  },
  headerLocationBar: {
    backgroundColor: '#F5F5DC',
    borderBottom: '1px solid #E0E0E0',
  },
  locationContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    position: 'relative',
  },
  locationPin: {
    fontSize: '20px',
    color: '#8B4513',
    flexShrink: 0,
  },
  locationTextInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '14px',
    color: '#333',
    padding: '8px 0',
  },
  locationDropdownToggle: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 8px',
    color: '#666',
    fontSize: '12px',
  },
  locationDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    marginTop: '8px',
    padding: '16px',
    zIndex: 1000,
  },
  detectLocationBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    marginBottom: '16px',
  },
  btnIcon: {
    fontSize: '18px',
  },
  zoneInfo: {
    backgroundColor: '#F0FDF4',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid #86EFAC',
  },
  zoneHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#166534',
  },
  zoneCheckIcon: {
    fontSize: '20px',
    color: '#22C55E',
  },
  zoneDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  zoneDetailItem: {
    fontSize: '14px',
    color: '#166534',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  detailIcon: {
    fontSize: '16px',
  },
  zoneLoading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '20px',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid #E0E0E0',
    borderTopColor: '#8B4513',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  locationModalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
  },
  locationModal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  },
  locationModalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  locationModalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#0F1111',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#565959',
    padding: '4px',
  },
  locationModalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  detectBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: '#FFD814',
    border: '1px solid #FCD200',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  orDivider: {
    textAlign: 'center',
    color: '#565959',
    fontSize: '14px',
    position: 'relative',
    margin: '8px 0',
  },
  locationInputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  locationInput: {
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #D5D9D9',
    borderRadius: '8px',
    outline: 'none',
  },
  submitBtn: {
    padding: '12px 20px',
    backgroundColor: '#FF9900',
    border: 'none',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  currentLocation: {
    backgroundColor: '#F0F8FF',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #B3D9FF',
    fontSize: '13px',
    color: '#0F1111',
  },
};

const Header = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { zone, address, refreshZone, updateLocation, setAddress } = useZone();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const searchRef = useRef(null);
  const locationModalRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(saved.slice(0, 3)); // Keep only last 3
  }, []);

  // Auto-detect location on component mount
  useEffect(() => {
    const autoDetectLocation = async () => {
      // Check if location was already detected
      const cachedLocation = localStorage.getItem('userLocation');
      if (cachedLocation) {
        console.log('📍 Using cached location');
        return;
      }

      // Auto-detect location using network/GPS
      console.log('🌐 Auto-detecting location...');
      try {
        await refreshZone();
        console.log('✅ Location auto-detected successfully');
      } catch (error) {
        console.warn('⚠️ Auto-detection failed, using default location');
      }
    };

    autoDetectLocation();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (locationModalRef.current && !locationModalRef.current.contains(event.target)) {
        setShowLocationModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mock search suggestions data (for frontend testing)
  const mockSuggestions = [
    'Wooden Chair',
    'Wooden Table',
    'Wooden Bed',
    'Wooden Cabinet',
    'Wooden Shelf',
    'Wooden Desk',
    'Wooden Stool',
    'Wooden Bench',
    'Wooden Wardrobe',
    'Wooden Dining Table',
    'Wooden Coffee Table',
    'Wooden Bookshelf',
    'Wooden TV Stand',
    'Wooden Sofa',
    'Wooden Door',
    'Wooden Frame',
    'Wooden Box',
    'Wooden Tray',
    'Wooden Bowl',
    'Wooden Spoon'
  ];

  // Fetch search suggestions with debouncing
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsSearching(true);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      try {
        // TRY API FIRST
        const response = await productsAPI.getSearchSuggestions(searchQuery);
        const apiSuggestions = response.data?.suggestions || [];

        if (apiSuggestions.length > 0) {
          console.log('✅ Using API suggestions:', apiSuggestions);
          setSearchSuggestions(apiSuggestions);
        } else {
          // FALLBACK TO MOCK DATA
          const filtered = mockSuggestions.filter(item =>
            item.toLowerCase().includes(searchQuery.toLowerCase())
          ).slice(0, 8);

          console.log('📦 Using mock suggestions:', filtered);
          setSearchSuggestions(filtered);
        }

        setShowSuggestions(true);
      } catch (error) {
        console.error('❌ API Error, using mock suggestions:', error.message);

        // FALLBACK TO MOCK DATA ON ERROR
        const filtered = mockSuggestions.filter(item =>
          item.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 8);

        console.log('📦 Using mock suggestions (error fallback):', filtered);
        setSearchSuggestions(filtered);
        setShowSuggestions(true);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      // Save to recent searches
      const saved = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      const updated = [q, ...saved.filter(s => s !== q)].slice(0, 3);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      setRecentSearches(updated);

      navigate(`/?search=${encodeURIComponent(q)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);

    // Save to recent searches
    const saved = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const updated = [suggestion, ...saved.filter(s => s !== suggestion)].slice(0, 3);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    setRecentSearches(updated);

    navigate(`/?search=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
  };

  const removeRecentSearch = (searchTerm) => {
    const updated = recentSearches.filter(s => s !== searchTerm);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    setRecentSearches(updated);
  };

  const clearAllRecentSearches = () => {
    localStorage.removeItem('recentSearches');
    setRecentSearches([]);
  };

  // Handle location detection
  const handleDetectLocation = async () => {
    setDetectingLocation(true);
    try {
      await refreshZone();
      setShowLocationModal(false);
      alert('✅ Location detected successfully!');
    } catch (error) {
      alert('❌ Failed to detect location. Please enter manually or check location permissions.');
    } finally {
      setDetectingLocation(false);
    }
  };

  // Handle manual location input
  const handleManualLocation = async () => {
    if (!locationInput.trim()) {
      alert('Please enter a location');
      return;
    }

    try {
      // Use geocoding to convert address to coordinates
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        await updateLocation(parseFloat(lat), parseFloat(lon));
        setAddress(display_name);
        setShowLocationModal(false);
        setLocationInput('');
        alert('✅ Location updated successfully!');
      } else {
        alert('❌ Location not found. Please try a different address.');
      }
    } catch (error) {
      console.error('Error updating location:', error);
      alert('❌ Failed to update location. Please try again.');
    }
  };

  return (
    <header style={styles.header}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* TOP ROW: LOGO, SEARCH, NAV */}
      <div style={styles.headerTop}>
        <div style={styles.headerContainer}>

          {/* LOGO */}
          <Link to="/" style={styles.logo}>
            <span style={styles.logoIcon}>
              <img src="/src/logo/logo.jpg" alt="Woodzon" style={styles.logoIconImg} />
            </span>
            <span>Woodzon</span>
          </Link>

          {/* SEARCH BAR WITH AUTOCOMPLETE */}
          <div style={styles.searchWrapper} ref={searchRef}>
            <form style={styles.searchBar} onSubmit={handleSearch}>
              <MdSearch style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search for wood products, furniture, decor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                style={styles.searchInput}
              />
              {searchQuery && (
                <button
                  type="button"
                  style={styles.searchClear}
                  onClick={() => {
                    setSearchQuery('');
                    setSearchSuggestions([]);
                    setShowSuggestions(false);
                  }}
                  aria-label="Clear search"
                >
                  <MdClose />
                </button>
              )}
              <button
                type="submit"
                style={styles.searchButton}
                aria-label="Search"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A0522D'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8B4513'}
              >
                Search
              </button>
            </form>

            {/* ENHANCED SEARCH SUGGESTIONS DROPDOWN */}
            {showSuggestions && (
              <div style={styles.searchSuggestionsPanel}>
                {/* Search Results with Images */}
                {searchSuggestions.length > 0 && (
                  <div style={styles.searchSection}>
                    <div style={styles.searchSectionTitle}>Search Results</div>
                    {searchSuggestions.slice(0, 5).map((suggestion, index) => (
                      <div
                        key={index}
                        style={styles.suggestionItemWithImage}
                        onClick={() => handleSuggestionClick(suggestion)}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F5F5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        <div style={styles.suggestionImageWrapper}>
                          <img
                            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100"
                            alt={suggestion}
                            style={styles.suggestionImage}
                          />
                        </div>
                        <span style={styles.suggestionText}>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Popular Keywords */}
                {searchQuery.length < 2 && (
                  <div style={styles.searchSection}>
                    <div style={styles.searchSectionTitle}>Popular Keywords</div>
                    <div style={styles.keywordsGrid}>
                      {['Minimalist Sofa', 'Kitchen Island', 'Ergonomic Chair', 'Outdoor Patio Set'].map((keyword, index) => (
                        <div
                          key={index}
                          style={styles.keywordChip}
                          onClick={() => handleSuggestionClick(keyword)}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E8F5E9'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F0F8F0'}
                        >
                          {keyword}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Searches */}
                {searchQuery.length < 2 && recentSearches.length > 0 && (
                  <div style={styles.searchSection}>
                    <div style={styles.searchSectionHeader}>
                      <div style={styles.searchSectionTitle}>Recent Searches</div>
                      <button
                        style={styles.clearAllBtn}
                        onClick={clearAllRecentSearches}
                      >
                        Clear All
                      </button>
                    </div>
                    {recentSearches.map((search, index) => (
                      <div
                        key={index}
                        style={styles.recentSearchItem}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F5F5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                      >
                        <div
                          style={styles.recentSearchText}
                          onClick={() => handleSuggestionClick(search)}
                        >
                          <MdHistory style={styles.recentSearchIcon} />
                          <span>{search}</span>
                        </div>
                        <button
                          style={styles.removeSearchBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeRecentSearch(search);
                          }}
                        >
                          <MdClose />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SEARCH LOADING */}
            {isSearching && (
              <div style={styles.searchLoading}>
                <div style={styles.spinnerSmall}></div>
              </div>
            )}
          </div>

          {/* NAVIGATION */}
          <nav style={styles.headerNav}>
            <Link
              to="/sellers"
              style={styles.navLink}
              onMouseEnter={(e) => e.currentTarget.style.color = '#8B4513'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#333'}
            >
              <MdStore style={styles.navIcon} />
              <span>Sellers</span>
            </Link>
            <Link
              to="/orders"
              style={styles.navLink}
              onMouseEnter={(e) => e.currentTarget.style.color = '#8B4513'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#333'}
            >
              <MdReceipt style={styles.navIcon} />
              <span>Orders</span>
            </Link>
            <Link
              to="/reviews"
              style={styles.navLink}
              onMouseEnter={(e) => e.currentTarget.style.color = '#8B4513'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#333'}
            >
              <MdStar style={styles.navIcon} />
              <span>Reviews</span>
            </Link>

            <Link
              to="/wishlist"
              style={{...styles.navLink, position: 'relative'}}
              aria-label="Wishlist"
              onMouseEnter={(e) => e.currentTarget.style.color = '#8B4513'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#333'}
            >
              <MdFavorite style={styles.navIconLarge} />
              {wishlistCount > 0 && (
                <span style={styles.badge}>{wishlistCount}</span>
              )}
            </Link>

            <Link
              to="/cart"
              style={{...styles.navLink, position: 'relative'}}
              aria-label="Cart"
              onMouseEnter={(e) => e.currentTarget.style.color = '#8B4513'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#333'}
            >
              <MdShoppingCart style={styles.navIconLarge} />
              {cartCount > 0 && (
                <span style={styles.badge}>{cartCount}</span>
              )}
            </Link>
          </nav>

        </div>
      </div>

      {/* BOTTOM ROW: LOCATION BAR */}
      <div style={styles.headerLocationBar}>
        <div style={styles.headerContainer}>
          <div
            style={{
              ...styles.locationContent,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onClick={() => setShowLocationModal(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F0F2F2';
              e.currentTarget.style.borderRadius = '8px';
              e.currentTarget.style.padding = '8px 12px';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.padding = '0';
            }}
          >
            <MdLocationOn style={styles.locationPin} />
            <span style={{fontSize: '14px', color: '#333'}}>
              {address || 'Detecting location...'}
            </span>
            <span style={{fontSize: '12px', color: '#007185', marginLeft: '8px', fontWeight: '500'}}>
              Change
            </span>
          </div>
        </div>
      </div>

      {/* LOCATION SELECTOR MODAL */}
      {showLocationModal && (
        <div style={styles.locationModalOverlay}>
          <div style={styles.locationModal} ref={locationModalRef}>
            <div style={styles.locationModalHeader}>
              <h2 style={styles.locationModalTitle}>
                <MdLocationOn style={{fontSize: '24px', color: '#FF9900'}} />
                Choose Your Location
              </h2>
              <button
                style={styles.closeBtn}
                onClick={() => setShowLocationModal(false)}
              >
                <MdClose />
              </button>
            </div>

            <div style={styles.locationModalBody}>
              {/* Current Location */}
              {address && address !== 'Detecting location...' && address !== 'Location not detected' && (
                <div style={styles.currentLocation}>
                  <strong>📍 Current Location:</strong>
                  <div style={{marginTop: '4px'}}>{address}</div>
                </div>
              )}

              {/* Auto-Detect Button */}
              <button
                style={styles.detectBtn}
                onClick={handleDetectLocation}
                disabled={detectingLocation}
                onMouseEnter={(e) => !detectingLocation && (e.currentTarget.style.backgroundColor = '#F7CA00')}
                onMouseLeave={(e) => !detectingLocation && (e.currentTarget.style.backgroundColor = '#FFD814')}
              >
                <MdLocationOn style={{fontSize: '20px'}} />
                {detectingLocation ? 'Detecting...' : '🌐 Detect My Location (GPS/Network)'}
              </button>

              <div style={styles.orDivider}>
                <span style={{backgroundColor: 'white', padding: '0 12px'}}>OR</span>
              </div>

              {/* Manual Input */}
              <div style={styles.locationInputWrapper}>
                <input
                  type="text"
                  placeholder="Enter city, area, or pincode (e.g., Bangalore, Koramangala, 560034)"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  style={styles.locationInput}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#FF9900'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#D5D9D9'}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleManualLocation();
                    }
                  }}
                />
                <button
                  style={styles.submitBtn}
                  onClick={handleManualLocation}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FA8900'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF9900'}
                >
                  Update Location
                </button>
              </div>

              {/* Popular Cities */}
              <div style={{marginTop: '16px'}}>
                <p style={{fontSize: '13px', color: '#565959', marginBottom: '8px'}}>
                  Popular Cities:
                </p>
                <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                  {['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune'].map(city => (
                    <button
                      key={city}
                      style={{
                        padding: '6px 12px',
                        border: '1px solid #D5D9D9',
                        borderRadius: '16px',
                        backgroundColor: 'white',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onClick={() => {
                        setLocationInput(city);
                        handleManualLocation();
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#F0F2F2';
                        e.currentTarget.style.borderColor = '#888C8C';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.borderColor = '#D5D9D9';
                      }}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};

export default Header;
