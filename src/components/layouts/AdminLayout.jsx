import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus,
  Package, 
  Layers,
  ShoppingBag, 
  Image as ImageIcon,
  Tag,
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck,
  ChevronRight,
  Bell,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLayout = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Customers', path: '/admin/users', icon: Users },
    { name: 'Farmers', path: '/admin/farmers', icon: UserPlus },
    { name: 'Global Catalog', path: '/admin/products', icon: Package },
    { name: 'All Categories', path: '/admin/categories', icon: Layers },
    { name: 'All Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Home Banners', path: '/admin/banners', icon: ImageIcon },
    { name: 'Coupons', path: '/admin/coupons', icon: Tag },
    { name: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Admin logout successful');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const isActive = (path) => {
    if (path === '/admin' && location.pathname !== '/admin') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <aside className="hidden lg:flex w-72 flex-col bg-slate-900 text-slate-300 flex-shrink-0">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-white rounded-2xl p-2 group-hover:rotate-6 transition-transform duration-300 shadow-lg">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-black text-white">
              FM <span className="text-emerald-500">Admin</span>
            </span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-1 mt-4">
          {menuItems.map((item) => (
            <Link key={item.name} to={item.path} className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${isActive(item.path) ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <div className="flex items-center gap-3">
                <item.icon size={20} className={isActive(item.path) ? 'text-emerald-400' : 'text-slate-500'} />
                {item.name}
              </div>
            </Link>
          ))}
        </nav>
        <div className="p-4 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <main className="p-10"><Outlet /></main>
      </div>
    </div>
  );
};

export default AdminLayout;
