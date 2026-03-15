import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Store,
  ChevronRight,
  TrendingUp,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';

const FarmerLayout = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/farmer', icon: LayoutDashboard },
    { name: 'Products', path: '/farmer/products', icon: Package },
    { name: 'Orders', path: '/farmer/orders', icon: ShoppingBag },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden lg:flex w-72 flex-col bg-white border-r">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl p-2 group-hover:rotate-6 transition-transform duration-300 shadow-sm border border-emerald-100/50">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-black text-emerald-600">FreshMart</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link key={item.name} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${isActive(item.path) ? 'bg-emerald-50 text-emerald-700' : 'text-gray-500'}`}>
              <item.icon size={20} /> {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <main className="p-10"><Outlet /></main>
      </div>
    </div>
  );
};

export default FarmerLayout;
