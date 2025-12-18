import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import { ZoneProvider } from './context/ZoneContext';
import { initializeMockAddresses } from './utils/mockData';
import Header from './components/Header';

// Initialize mock data for testing
initializeMockAddresses();
import Home from './pages/Home';
import Categories from './pages/Categories';
import Subcategories from './pages/Subcategories';
import SubcategorySellers from './pages/SubcategorySellers';
import LivingCategory from './pages/LivingRoomCategory';
import BedroomCategory from './pages/BedroomCategory';
import MattressCategory from './pages/MattressCategory';
import DiningCategory from './pages/DiningCategory';
import StorageCategory from './pages/StorageCategory';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import DeliveryAddress from './pages/DeliveryAddress';
import PaymentPage from './pages/PaymentPage';
import ReviewOrder from './pages/ReviewOrder';
import OrderConfirmed from './pages/OrderConfirmed';
import ManagePayments from './pages/ManagePayments';
import MyAddresses from './pages/MyAddresses';
import AddAddress from './pages/AddAddress';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import OrderTracking from './pages/OrderTracking';
import Sellers from './pages/Sellers';
import SellerStore from './pages/SellerStore';
import Reviews from './pages/Reviews';
import WriteReview from './pages/WriteReview';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ZoneProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="App">
                <Header />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/categories/living" element={<LivingCategory />} />
                  <Route path="/categories/bedroom" element={<BedroomCategory />} />
                  <Route path="/categories/mattress" element={<MattressCategory />} />
                  <Route path="/categories/dining" element={<DiningCategory />} />
                  <Route path="/categories/storage" element={<StorageCategory />} />
                  <Route path="/category/:categoryId/subcategories" element={<Subcategories />} />
                  <Route path="/category/:categoryId/subcategory/:subcategoryId/sellers" element={<SubcategorySellers />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/checkout/address" element={<DeliveryAddress />} />
                  <Route path="/checkout/payment" element={<PaymentPage />} />
                  <Route path="/checkout/review" element={<ReviewOrder />} />
                  <Route path="/order-confirmed" element={<OrderConfirmed />} />
                  <Route path="/manage-payments" element={<ManagePayments />} />
                  <Route path="/my-addresses" element={<MyAddresses />} />
                  <Route path="/addresses/new" element={<AddAddress />} />
                  <Route path="/addresses/edit/:id" element={<AddAddress />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/orders/:id" element={<OrderDetails />} />
                  <Route path="/orders/:id/track" element={<OrderTracking />} />
                  <Route path="/sellers" element={<Sellers />} />
                  <Route path="/seller/:id" element={<SellerStore />} />
                  <Route path="/reviews" element={<Reviews />} />
                  <Route path="/write-review" element={<WriteReview />} />
                </Routes>
              </div>
            </WishlistProvider>
          </CartProvider>
        </ZoneProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

