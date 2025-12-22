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
  MdHistory,
  MdNotifications,
  MdHelp
} from 'react-icons/md';
import { useNotifications } from '../context/NotificationsContext';

// Inline styles (all your existing styles included)
const styles = {
  header: {
    backgroundColor: '#FFFFFF',
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
    cursor: 'pointer',
  },
  locationPin: {
    fontSize: '20px',
    color: '#8B4513',
    flexShrink: 0,
  },
  locationModalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
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

// Header Component
const Header = () => {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { zone, address, refreshZone, updateLocation, setAddress } = useZone();
  const { unreadCount } = useNotifications();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  const searchRef = useRef(null);
  const locationModalRef = useRef(null);

  // Load recent searches
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(saved.slice(0, 3));
  }, []);

  // Close dropdowns
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

  // Mock suggestions
  const mockSuggestions = ['Wooden Chair','Wooden Table','Wooden Bed','Wooden Cabinet','Wooden Shelf'];

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      const filtered = mockSuggestions.filter(item => item.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8);
      setSearchSuggestions(filtered);
      setShowSuggestions(true);
    };
    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    const saved = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const updated = [q, ...saved.filter(s => s !== q)].slice(0, 3);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    setRecentSearches(updated);
    navigate(`/?search=${encodeURIComponent(q)}`);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    const saved = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const updated = [suggestion, ...saved.filter(s => s !== suggestion)].slice(0, 3);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    setRecentSearches(updated);
    navigate(`/?search=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
  };

  const handleDetectLocation = async () => {
    setDetectingLocation(true);
    try { await refreshZone(); setShowLocationModal(false); } catch {} finally { setDetectingLocation(false); }
  };

  const handleManualLocation = async () => {
    if (!locationInput.trim()) return;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput)}`);
      const data = await response.json();
      if (data.length) {
        const { lat, lon, display_name } = data[0];
        await updateLocation(parseFloat(lat), parseFloat(lon));
        setAddress(display_name);
        setShowLocationModal(false);
        setLocationInput('');
      }
    } catch {}
  };

  return (
    <header style={styles.header}>
      <style>{`@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}`}</style>

      {/* TOP ROW */}
      <div style={styles.headerTop}>
        <div style={styles.headerContainer}>
          <Link to="/" style={styles.logo}><span style={styles.logoIcon}><img src="/src/logo/logo.jpg" style={styles.logoIconImg} /></span><span>Woodzon</span></Link>
          <div style={styles.searchWrapper} ref={searchRef}>
            <form style={styles.searchBar} onSubmit={handleSearch}>
              <MdSearch style={styles.searchIcon} />
              <input style={styles.searchInput} placeholder="Search..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} onFocus={()=>searchQuery.length>=2&&setShowSuggestions(true)} />
              {searchQuery && <button type="button" style={styles.searchClear} onClick={()=>{setSearchQuery('');setShowSuggestions(false);}}><MdClose /></button>}
              <button type="submit" style={styles.searchButton}>Search</button>
            </form>
            {showSuggestions && <div style={styles.searchSuggestionsPanel}>{searchSuggestions.map((s,i)=><div key={i} style={styles.suggestionItemWithImage} onClick={()=>handleSuggestionClick(s)}>{s}</div>)}</div>}
          </div>

          <nav style={styles.headerNav}>
            <Link to="/sellers" style={styles.navLink}><MdStore style={styles.navIcon} /><span>Sellers</span></Link>
            <Link to="/orders" style={styles.navLink}><MdReceipt style={styles.navIcon} /><span>Orders</span></Link>
            <Link to="/reviews" style={styles.navLink}><MdStar style={styles.navIcon} /><span>Reviews</span></Link>
            <Link to="/wishlist" style={{...styles.navLink,position:'relative'}}><MdFavorite style={styles.navIconLarge} />{wishlistCount>0 && <span style={styles.badge}>{wishlistCount}</span>}</Link>
            <Link to="/cart" style={{...styles.navLink,position:'relative'}}><MdShoppingCart style={styles.navIconLarge} />{cartCount>0 && <span style={styles.badge}>{cartCount}</span>}</Link>
            <Link to="/notifications" style={{...styles.navLink,position:'relative'}}><MdNotifications style={styles.navIconLarge} />{unreadCount>0 && <span style={styles.badge}>{unreadCount}</span>}</Link>
            <Link to="/support" style={styles.navLink}><MdHelp style={styles.navIconLarge} /><span>Help</span></Link>
          </nav>
        </div>
      </div>

      {/* LOCATION BAR */}
      <div style={styles.headerLocationBar}>
        <div style={styles.headerContainer}>
          <div style={styles.locationContent} onClick={()=>setShowLocationModal(true)}>
            <MdLocationOn style={styles.locationPin} />
            <span>{address||'Detecting location...'}</span>
          </div>
        </div>
      </div>

      {/* LOCATION MODAL */}
      {showLocationModal && (
        <div style={styles.locationModalOverlay}>
          <div style={styles.locationModal} ref={locationModalRef}>
            <div style={styles.locationModalHeader}>
              <h2 style={styles.locationModalTitle}><MdLocationOn /> Choose Your Location</h2>
              <button style={styles.closeBtn} onClick={()=>setShowLocationModal(false)}><MdClose /></button>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              <button style={styles.detectBtn} onClick={handleDetectLocation}>{detectingLocation?'Detecting...':'🌐 Detect My Location'}</button>
              <input type="text" placeholder="Enter city or pincode" value={locationInput} onChange={(e)=>setLocationInput(e.target.value)} />
              <button style={styles.submitBtn} onClick={handleManualLocation}>Update Location</button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};

export default Header;
