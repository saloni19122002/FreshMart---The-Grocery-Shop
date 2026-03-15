import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getOrderDetails } from '../../services/orderService';
import { CheckCircle2, Package, Truck, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderDetails(orderId);
        if (data) {
          setOrder(data);
          // Trigger confetti on success
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#059669', '#34d399']
          });
        }
      } catch (error) {
        console.error("Error fetching success order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Order details not found</h2>
        <Link to="/shop" className="btn-primary mt-6 inline-block">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <div className="mb-8 flex justify-center">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 border-8 border-emerald-50">
          <CheckCircle2 size={48} />
        </div>
      </div>

      <h1 className="text-4xl font-black text-gray-900 mb-4">Woot! Order Placed!</h1>
      <p className="text-xl text-gray-500 mb-10">
        Your order <span className="text-emerald-600 font-bold">#{orderId.slice(-6).toUpperCase()}</span> has been placed successfully. 
        We'll send you a confirmation as soon as it's shipped.
      </p>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 mb-10 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Delivery Estimate</h3>
            <div className="flex items-center gap-4 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
              <Truck className="text-emerald-600" />
              <div>
                <p className="font-bold text-gray-900 text-sm">Tomorrow, by 10:00 PM</p>
                <p className="text-[10px] text-emerald-700 font-bold uppercase">Standard Delivery</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Shipping Address</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              <span className="font-bold text-gray-900">{order.shippingAddress.name}</span><br/>
              {order.shippingAddress.street}, {order.shippingAddress.city}<br/>
              {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-50">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.quantity} x ₹{item.price}</p>
                </div>
                <p className="text-sm font-black text-gray-900">₹{item.price * item.quantity}</p>
              </div>
            ))}
            <div className="pt-4 flex justify-between items-center text-lg">
              <span className="font-bold text-gray-900">Total Paid</span>
              <span className="font-black text-emerald-600">₹{order.total}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button 
          onClick={() => navigate(`/account/orders/${orderId}`)}
          className="btn-secondary w-full sm:w-auto px-8 py-3 flex items-center justify-center gap-2 border-emerald-100 text-emerald-700 bg-emerald-50/50"
        >
          <Truck size={18} /> Track Your Order
        </button>
        <Link 
          to="/shop" 
          className="btn-primary w-full sm:w-auto px-8 py-3 flex items-center justify-center gap-2"
        >
          <ShoppingBag size={18} /> Continue Shopping <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
