import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import MainLayout from '../components/layouts/MainLayout';
import AuthLayout from '../components/layouts/AuthLayout';
import FarmerLayout from '../components/layouts/FarmerLayout';
import AdminLayout from '../components/layouts/AdminLayout';

// Protected Routes
import { 
  CustomerRoute, 
  FarmerRoute, 
  AdminRoute 
} from '../components/ProtectedRoute';

// Public Pages
import Home from '../pages/public/Home';
import Shop from '../pages/public/Shop';
import ProductDetails from '../pages/public/ProductDetails';
import Categories from '../pages/public/Categories';
import CategoryDetails from '../pages/public/CategoryDetails';
import Offers from '../pages/public/Offers';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import NotFound from '../pages/public/NotFound';
import Unauthorized from '../pages/public/Unauthorized';

// Auth Pages
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Customer Pages
import Account from '../pages/customer/Account';
import Orders from '../pages/customer/Orders';
import Wishlist from '../pages/customer/Wishlist';
import Addresses from '../pages/customer/Addresses';
import Cart from '../pages/customer/Cart';
import Checkout from '../pages/customer/Checkout';
import OrderSuccess from '../pages/customer/OrderSuccess';
import OrderDetail from '../pages/customer/OrderDetail';

// Farmer Pages
import FarmerDashboard from '../pages/farmer/FarmerDashboard';
import FarmerProducts from '../pages/farmer/FarmerProducts';
import FarmerAddProduct from '../pages/farmer/FarmerAddProduct';
import FarmerEditProduct from '../pages/farmer/FarmerEditProduct';
import FarmerInventory from '../pages/farmer/FarmerInventory';
import FarmerOrders from '../pages/farmer/FarmerOrders';
import FarmerCoupons from '../pages/farmer/FarmerCoupons';
import FarmerEarnings from '../pages/farmer/FarmerEarnings';
import FarmerProfile from '../pages/farmer/FarmerProfile';
import FarmerSettings from '../pages/farmer/FarmerSettings';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminFarmers from '../pages/admin/AdminFarmers';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminCategories from '../pages/admin/AdminCategories';
import AdminOrders from '../pages/admin/AdminOrders';
import AdminBanners from '../pages/admin/AdminBanners';
import AdminCoupons from '../pages/admin/AdminCoupons';
import AdminSettings from '../pages/admin/AdminSettings';

const AppRoutes = () => {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public Routes with Main Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:slug" element={<CategoryDetails />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          <Route path="/cart" element={<Cart />} />
          
          {/* Customer Routes */}
          <Route path="/account" element={<CustomerRoute><Account /></CustomerRoute>} />
          <Route path="/account/orders" element={<CustomerRoute><Orders /></CustomerRoute>} />
          <Route path="/account/wishlist" element={<CustomerRoute><Wishlist /></CustomerRoute>} />
          <Route path="/account/addresses" element={<CustomerRoute><Addresses /></CustomerRoute>} />
          <Route path="/checkout" element={<CustomerRoute><Checkout /></CustomerRoute>} />
          <Route path="/order-success/:orderId" element={<CustomerRoute><OrderSuccess /></CustomerRoute>} />
          <Route path="/account/orders/:orderId" element={<CustomerRoute><OrderDetail /></CustomerRoute>} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Farmer Routes */}
        <Route path="/farmer" element={<FarmerRoute><FarmerLayout /></FarmerRoute>}>
          <Route index element={<FarmerDashboard />} />
          <Route path="products" element={<FarmerProducts />} />
          <Route path="products/new" element={<FarmerAddProduct />} />
          <Route path="products/edit/:id" element={<FarmerEditProduct />} />
          <Route path="inventory" element={<FarmerInventory />} />
          <Route path="orders" element={<FarmerOrders />} />
          <Route path="coupons" element={<FarmerCoupons />} />
          <Route path="earnings" element={<FarmerEarnings />} />
          <Route path="profile" element={<FarmerProfile />} />
          <Route path="settings" element={<FarmerSettings />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="farmers" element={<AdminFarmers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Fallback Routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;
