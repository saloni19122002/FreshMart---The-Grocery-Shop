import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFarmerOrders, FARMER_ORDERS_INDEX_LINK, updateOrderStatus } from '../../services/orderService';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle, 
  ChevronRight, 
  Search,
  Loader2,
  Calendar,
  User,
  MapPin,
  Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FarmerOrders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [printingOrder, setPrintingOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getFarmerOrders(currentUser.uid);
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching farmer orders:", err);
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Placed': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Shipped': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'Delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Order marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handlePrint = (order) => {
    setPrintingOrder(order);
    // Give state a moment to update and render the invoice
    setTimeout(() => {
      window.print();
      setPrintingOrder(null);
    }, 100);
  };

  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* PRINT STYLES */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media screen {
          .printable-only { display: none !important; }
        }
        @media print {
          .no-print { display: none !important; }
          .printable-only { display: block !important; }
          body { background: white !important; }
          .printable-invoice { 
            width: 100%;
            color: black !important;
            padding: 20px;
          }
        }
      `}} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Manage Orders</h2>
          <p className="text-gray-500 font-medium text-sm">Process your incoming farm orders</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm self-start sm:self-auto">
          {['All', 'Placed', 'Shipped', 'Delivered'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                filter === tab 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' 
                : 'text-gray-400 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="no-print">

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
          <Loader2 className="animate-spin text-emerald-600" size={40} />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Fetching Orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-20 text-center border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
            <ShoppingBag size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No orders to show</h3>
          <p className="text-gray-500 font-medium max-w-xs mx-auto">When customers buy your products, they will appear here.</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 rounded-[2rem] p-12 text-center border border-red-100 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-black text-gray-900">Database Setup Required</h3>
          <p className="text-gray-600 max-w-md mx-auto font-medium">
            To view your orders, you need to enable a Firestore index. Please click the button below and then click <strong>"Create Index"</strong> in your Firebase Console.
          </p>
          <a 
            href={FARMER_ORDERS_INDEX_LINK} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary inline-flex bg-red-600 hover:bg-red-700 shadow-red-100"
          >
            Fix Developer Error (Create Index)
          </a>
          <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">It takes ~3 minutes for the index to build.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => {
             const formattedDate = order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString('en-IN', {
               day: 'numeric',
               month: 'short',
               year: 'numeric'
             }) : 'Recently';

             return (
               <div key={order.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                 {/* Order Header */}
                 <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center gap-8 border-b border-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Calendar size={12} /> {formattedDate}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-gray-900 mb-4">Order #{order.id.slice(-6).toUpperCase()}</h3>
                      
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 font-medium">
                         <div className="flex items-center gap-2">
                           <User size={16} className="text-emerald-600" />
                           <span className="font-bold text-gray-900">{order.userName}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <Phone size={16} className="text-emerald-600" />
                           {order.shippingAddress?.phone}
                         </div>
                         <div className="flex items-center gap-2 w-full lg:w-auto">
                           <MapPin size={16} className="text-emerald-600" />
                           {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                         </div>
                      </div>
                    </div>

                    <div className="lg:text-right flex lg:flex-col items-center lg:items-end justify-between lg:justify-center border-t lg:border-t-0 lg:border-l border-gray-50 pt-6 lg:pt-0 lg:pl-12">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Your Earnings</p>
                      <p className="text-3xl font-black text-emerald-600">₹{order.myTotal}</p>
                    </div>
                 </div>

                 {/* Order Items */}
                 <div className="p-6 sm:p-8 bg-gray-50/30">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Items Ordered</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {order.myItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100">
                          <img src={item.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>
                            <p className="text-xs text-gray-400">{item.quantity} x ₹{item.price}</p>
                          </div>
                          <p className="font-black text-gray-900">₹{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 flex gap-4">
                      <div className="flex-1 relative group">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className="w-full btn-primary bg-emerald-600 hover:bg-emerald-700 py-4 text-sm appearance-none cursor-pointer text-center"
                        >
                          <option value="Placed">Mark as Placed</option>
                          <option value="Shipped">Mark as Shipped</option>
                          <option value="Delivered">Mark as Delivered</option>
                          <option value="Cancelled">Mark as Cancelled</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50 group-hover:text-white">
                          <ChevronRight size={18} className="rotate-90" />
                        </div>
                      </div>
                      <button 
                        onClick={() => handlePrint(order)} 
                        className="btn-secondary flex-1 py-4 text-sm bg-white border-2 border-gray-100 hover:border-emerald-600 hover:text-emerald-600"
                      >
                        Print Invoice
                      </button>
                    </div>
                 </div>
               </div>
             );
          })}
        </div>
      )}
      </div>

      {/* HIDDEN INVOICE (RENDERED ONLY FOR PRINTING) */}
      {printingOrder && (
        <div className="printable-only">
          <div className="printable-invoice font-sans border-2 border-gray-100 p-12 rounded-[2rem] bg-white">
             <div className="flex justify-between items-start mb-12">
                <div>
                   <h1 className="text-4xl font-black text-emerald-600 mb-1">FRESHMART</h1>
                   <p className="text-gray-400 text-xs font-black uppercase tracking-[0.2em]">Official Marketplace Invoice</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order # Reference</p>
                   <p className="text-xl font-black text-gray-900">{printingOrder.id.toUpperCase()}</p>
                   <p className="text-xs font-bold text-gray-500 mt-2">Placed: {printingOrder.createdAt?.toDate ? printingOrder.createdAt.toDate().toLocaleDateString('en-IN') : 'Recently'}</p>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-16 mb-16">
                <div>
                   <h4 className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest mb-4 w-fit">Delivery Address</h4>
                   <p className="font-black text-xl text-gray-900 mb-2">{printingOrder.userName}</p>
                   <p className="text-sm text-gray-600 leading-relaxed font-medium">
                      {printingOrder.shippingAddress?.street}<br/>
                      {printingOrder.shippingAddress?.city}, {printingOrder.shippingAddress?.state}<br/>
                      <span className="font-black text-gray-900">{printingOrder.shippingAddress?.pincode}</span>
                   </p>
                   <div className="mt-4 flex items-center gap-2 text-sm font-black text-gray-900 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 w-fit">
                      <span className="text-gray-400">TEL:</span> {printingOrder.shippingAddress?.phone}
                   </div>
                </div>
                <div className="text-right flex flex-col items-end">
                   <h4 className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest mb-4 w-fit">Order Summary</h4>
                   <div className="space-y-2">
                      <p className="text-sm text-gray-500 font-bold">Status: <span className="text-emerald-600 uppercase italic">Paid ({printingOrder.paymentMethod})</span></p>
                      <p className="text-sm text-gray-500 font-bold">Items: <span className="text-gray-900 border-b border-gray-100">{printingOrder.myItems?.length} items</span></p>
                   </div>
                </div>
             </div>

             <table className="w-full text-left border-collapse mb-16">
                <thead>
                   <tr className="border-b-4 border-gray-900">
                      <th className="py-6 text-[10px] font-black text-gray-900 uppercase tracking-widest">Product Description</th>
                      <th className="py-6 text-center text-[10px] font-black text-gray-900 uppercase tracking-widest">Quantity</th>
                      <th className="py-6 text-right text-[10px] font-black text-gray-900 uppercase tracking-widest">Unit Price</th>
                      <th className="py-6 text-right text-[10px] font-black text-gray-900 uppercase tracking-widest">Subtotal</th>
                   </tr>
                </thead>
                <tbody className="divide-y-2 divide-gray-50">
                   {printingOrder.myItems?.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                         <td className="py-6">
                            <p className="font-black text-gray-900 text-base">{item.name}</p>
                            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-tighter">Farmer Direct Freshness</p>
                         </td>
                         <td className="py-6 text-center text-sm text-gray-900 font-black">{item.quantity}</td>
                         <td className="py-6 text-right text-sm text-gray-500 font-bold italic">₹{item.price}</td>
                         <td className="py-6 text-right text-lg font-black text-gray-900">₹{item.price * item.quantity}</td>
                      </tr>
                   ))}
                </tbody>
             </table>

             <div className="flex justify-between items-end bg-gray-900 text-white rounded-[2rem] p-10 shadow-2xl">
                <div>
                   <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Notice</p>
                   <p className="text-xs text-gray-400 max-w-xs font-medium italic">
                      This is a computer-generated invoice. No signature required. 
                      Freshness guaranteed by the FreshMart community.
                   </p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Payable</p>
                   <p className="text-5xl font-black text-emerald-400">₹{printingOrder.myTotal}</p>
                </div>
             </div>

             <div className="mt-16 text-center">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8"></div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.3em]">Thank you for farming with us</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerOrders;
