import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/adminService';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Package,
  ArrowUpRight,
  MoreVertical,
  Loader2,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Order marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update order');
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         o.userName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Audit</h1>
          <p className="text-slate-500 font-medium mt-1">Global transaction tracking and fulfillment pipeline</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
           {['All', 'Pending', 'Shipped', 'Delivered'].map(s => (
             <button
               key={s}
               onClick={() => setStatusFilter(s)}
               className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                 statusFilter === s ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'
               }`}
             >
               {s}
             </button>
           ))}
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
         <div className="p-8 border-b border-slate-50 bg-slate-50/30">
            <div className="relative group max-w-md">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
               <input 
                 type="text" 
                 placeholder="Search by ID or Customer..." 
                 className="w-full bg-white border-none rounded-xl py-3 pl-11 pr-4 shadow-sm focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>

         {loading ? (
            <div className="p-32 flex justify-center">
               <Loader2 className="animate-spin text-emerald-500" size={48} />
            </div>
         ) : (
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                       <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Order Logistics</th>
                       <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customer Context</th>
                       <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Flow State</th>
                       <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                       <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Volume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {filteredOrders.map((order) => (
                       <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-10 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:border-emerald-200 group-hover:text-emerald-500 transition-all">
                                   ID-{order.id.slice(-4).toUpperCase()}
                                </div>
                                <div>
                                   <p className="font-bold text-slate-900 text-sm">Standard Fulfillment</p>
                                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{order.paymentMethod || 'Online'}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-10 py-6">
                             <p className="font-bold text-slate-900 text-sm">{order.userName}</p>
                             <p className="text-xs text-slate-400 font-medium">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                          </td>
                          <td className="px-10 py-6">
                             <select 
                               value={order.status}
                               onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                               className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border focus:ring-0 cursor-pointer ${
                                 order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                 order.status === 'Shipped' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                 'bg-orange-50 text-orange-600 border-orange-100'
                               }`}
                             >
                                <option value="Pending">Pending</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                             </select>
                          </td>
                          <td className="px-10 py-6">
                             <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                                <Calendar size={14} />
                                {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Today'}
                             </div>
                          </td>
                          <td className="px-10 py-6 text-right">
                             <p className="font-black text-slate-900 text-lg">₹{order.total}</p>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </div>
    </div>
  );
};

export default AdminOrders;
