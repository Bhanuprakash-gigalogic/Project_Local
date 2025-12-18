import { createContext, useContext, useState, useEffect } from 'react';
import { wishlistAPI } from '../services/api';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Fetch wishlist from API
  const fetchWishlist = async () => {
    try {
      const response = await wishlistAPI.getWishlist({ page: 1, limit: 100 });
      const wishlistData = response.data.data || response.data;
      const items = wishlistData.items || [];

      setWishlist(items);
      setWishlistCount(wishlistData.total || items.length);
      localStorage.setItem('wishlist', JSON.stringify(items));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      // Load from local storage as fallback
      const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlist(storedWishlist);
      setWishlistCount(storedWishlist.length);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const addToWishlist = async (product, variation = null) => {
    try {
      // Use product_id from product object
      const productId = product.product_id || product.id;

      // Add to wishlist with variation support
      const response = await wishlistAPI.addToWishlist(productId, variation);
      const responseData = response.data.data || response.data;

      console.log('✅ Added to wishlist:', { productId, variation });
      console.log('Total wishlist items:', responseData.total_wishlist_items);

      // Refresh wishlist
      await fetchWishlist();
      return true;
    } catch (error) {
      console.error('❌ Error adding to wishlist:', error);

      // Fallback to local storage
      const productId = product.product_id || product.id;
      const isAlreadyInWishlist = wishlist.some(item =>
        (item.product_id || item.id) === productId
      );

      if (!isAlreadyInWishlist) {
        const updatedWishlist = [...wishlist, { ...product, variation }];
        setWishlist(updatedWishlist);
        setWishlistCount(updatedWishlist.length);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      }
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await wishlistAPI.removeFromWishlist(productId);
      console.log('✅ Removed from wishlist:', productId);

      // Refresh wishlist
      await fetchWishlist();
      return true;
    } catch (error) {
      console.error('❌ Error removing from wishlist:', error);

      // Fallback to local storage
      const updatedWishlist = wishlist.filter(item =>
        (item.product_id || item.id) !== productId
      );
      setWishlist(updatedWishlist);
      setWishlistCount(updatedWishlist.length);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => (item.product_id || item.id) === productId);
  };

  const value = {
    wishlist,
    wishlistCount,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

