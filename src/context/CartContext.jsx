import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart from API (multi-seller cart)
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      const cartData = response.data.data || response.data;

      // Extract all items from all sellers
      let allItems = [];
      if (cartData.sellers && Array.isArray(cartData.sellers)) {
        cartData.sellers.forEach(seller => {
          if (seller.items && Array.isArray(seller.items)) {
            allItems = [...allItems, ...seller.items];
          }
        });
      }

      // Always set cart as an array of items
      setCart(allItems);
      setCartCount(cartData.total_items || allItems.length || 0);

      // Save to localStorage for fallback
      localStorage.setItem('cart', JSON.stringify(allItems));
      console.log('✅ Cart fetched from API:', allItems.length, 'items');
    } catch (error) {
      console.error('❌ Error fetching cart from API:', error.message);
      // Use local storage as fallback
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      console.log('📦 Loading cart from localStorage:', localCart.length, 'items');
      setCart(localCart);
      setCartCount(localCart.length || 0);
    } finally {
      setLoading(false);
    }
  };

  // Load cart from localStorage on mount
  useEffect(() => {
    // First, load from localStorage immediately
    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (localCart.length > 0) {
      console.log('🚀 Initial cart load from localStorage:', localCart.length, 'items');
      setCart(localCart);
      setCartCount(localCart.length);
    }

    // Then try to fetch from API
    fetchCart();
  }, []);

  const addToCart = async (product, quantity = 1, sellerId = null, variation = null) => {
    try {
      // Use product_id from product object
      const productId = product.product_id || product.id;

      // Use seller_id from product.seller if not provided
      const finalSellerId = sellerId || product.seller?.seller_id;

      console.log('🛒 Adding to cart:', {
        productId,
        productName: product.name,
        quantity,
        sellerId: finalSellerId,
        variation
      });

      // Add to cart with variation support
      await cartAPI.addToCart(productId, quantity, variation);
      await fetchCart();

      console.log('✅ Successfully added to cart via API');
      return true;
    } catch (error) {
      console.error('❌ API Error, using localStorage fallback:', error.message);

      // Fallback to local storage
      const updatedCart = Array.isArray(cart) ? [...cart] : [];
      const existingIndex = updatedCart.findIndex(item =>
        (item.product?.product_id || item.product?.id) === (product.product_id || product.id)
      );

      if (existingIndex > -1) {
        console.log('📝 Updating quantity for existing item');
        updatedCart[existingIndex].quantity += quantity;
      } else {
        console.log('➕ Adding new item to cart');
        updatedCart.push({ product, quantity, seller_id: sellerId, variation });
      }

      setCart(updatedCart);
      setCartCount(updatedCart.length);
      localStorage.setItem('cart', JSON.stringify(updatedCart));

      console.log('💾 Cart saved to localStorage:', updatedCart.length, 'items');
      console.log('Cart contents:', updatedCart);

      return true;
    }
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => {
      const product = item.product || item;
      const id = product.product_id || product.id;
      return id !== productId;
    });
    setCart(updatedCart);
    setCartCount(updatedCart.length);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    console.log('🗑️ Removed item from cart:', productId);
    console.log('📦 Updated cart:', updatedCart.length, 'items');
  };

  const updateQuantity = (productId, quantity) => {
    // If quantity is 0 or less, remove the item
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cart.map(item => {
      const product = item.product || item;
      const id = product.product_id || product.id;
      return id === productId ? { ...item, quantity } : item;
    });
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    console.log('📝 Updated quantity for product:', productId, 'to', quantity);
  };

  const clearCart = () => {
    setCart([]);
    setCartCount(0);
    localStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((total, item) => {
      const product = item.product || item;
      const price = product.price || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
  };

  const value = {
    cart,
    cartCount,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

