import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFarmerProducts } from '../../services/productService';
import { getFarmerOrders } from '../../services/orderService';
import { 
  Plus, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  Clock, 
  ArrowUpRight,
  Loader2 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FarmerDashboard = () => {
  const { currentUser, userData } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    earnings: 0,
    customers: 12
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (userData?.status === 'pending') {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const prods = await getFarmerProducts(currentUser.uid);
        const farmerOrders = await getFarmerOrders(currentUser.uid);
        const totalEarnings = farmerOrders.reduce((acc, curr) => acc + (curr.myTotal || 0), 0);

        setStats({
          products: prods.length,
          orders: farmerOrders.length,
          earnings: totalEarnings,
          customers: 5
        });
        setRecentOrders(farmerOrders.slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchStats();
    }
  }, [currentUser, userData]);

  if (loading) {
    return (
      <div className="flex justify-center p-32">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
      </div>
    );
  }

  if (userData?.status === 'pending') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 mb-8 shadow-inner">
          <Clock className="animate-pulse" size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Application Under Review</h2>
        <p className="text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
          Thanks for joining FreshMart! Our administrators are currently verifying your farm credentials. 
          You'll get full access to sell products and manage orders once approved.
        </p>
        <div className="mt-10 flex gap-4">
          <Link to="/" className="btn-secondary px-8">Return Home</Link>
          <Link to="/account" className="btn-primary px-8">View My Account</Link>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Products', value: stats.products, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Orders', value: stats.orders, icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Earnings', value: `₹${stats.earnings}`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Happy Customers', value: stats.customers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="bg-white rounded-[2rem] p-10 flex flex-col md:flex-row items-center justify-between border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-3xl font-black text-gray-900 mb-2">
            Welcome back, <span className="text-emerald-600">{currentUser?.displayName?.split(' ')[0] || 'Farmer'}!</span>
          </h2>
          <p className="text-gray-500 font-medium max-w-md">
            Your farm is doing great today. You have <span className="text-gray-900 font-bold">{stats.orders} new orders</span> waiting to be processed.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/farmer/products/new" className="btn-primary flex items-center gap-2 px-6">
              <Plus size={20} /> Add New Product
            </Link>
            <Link to="/farmer/orders" className="btn-secondary px-6">
              Manage Orders
            </Link>
          </div>
        </div>
        <div className="w-56 h-56 bg-emerald-50 rounded-full flex items-center justify-center border-8 border-white shadow-xl">
           <div className="text-center">
             <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Target</p>
             <p className="text-4xl font-black text-gray-900">85%</p>
             <p className="text-[10px] text-gray-400 font-bold mt-1">Growth this month</p>
           </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 rounded-full -mr-16 -mt-16"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-50 shadow-sm hover:shadow-md transition-all group">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
              <stat.icon size={28} />
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-xl font-black text-gray-900">Recent Orders</h3>
              <Link to="/farmer/orders" className="text-sm font-bold text-emerald-600 hover:underline flex items-center gap-1">
                View All <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {recentOrders.length > 0 ? recentOrders.map((order) => (
                <div key={order.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 border border-gray-100 font-bold text-xs">
                      #{order.id.slice(-4).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{order.userName || 'Customer'}</p>
                      <p className="text-xs text-gray-400 font-medium flex items-center gap-1">
                        <Clock size={12} /> {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recent'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900">₹{order.myTotal || order.total}</p>
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full">
                      {order.status}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="p-20 text-center">
                  <p className="text-gray-400 font-medium">No orders yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
           <div className="bg-gray-900 rounded-[2rem] p-8 text-white h-full flex flex-col justify-between overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="text-xl font-black mb-4 font-display">Farm Insights</h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8">
                  Organic tomatoes are trending this week! Highlight them in your store for <span className="text-emerald-400 font-bold">20% more visibility</span>.
                </p>
                <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-gray-400">Inventory Health</span>
                      <span className="text-xs font-bold text-emerald-400">92%</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="relative z-10 w-full bg-white text-gray-900 py-4 rounded-2xl font-black mt-8 text-sm hover:bg-emerald-50 transition-colors">
                Download Sales Report
              </button>
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-[80px] -mr-20 -mt-20"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
