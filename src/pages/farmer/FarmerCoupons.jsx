import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  Search, 
  Ticket, 
  Trash2, 
  Tag, 
  Calendar, 
  Users, 
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  TrendingUp,
  Percent
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../firebase/config';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc,
  serverTimestamp 
} from 'firebase/firestore';
import toast from 'react-hot-toast';

const FarmerCoupons = () => {
  const { currentUser } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount: '',
    minPurchase: '',
    expiryDate: '',
    description: ''
  });

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'coupons'), 
          where('farmerId', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCoupons(data);
      } catch (error) {
        console.error("Error fetching coupons:", error);
        toast.error("Cloud synchronization failed");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchCoupons();
    }
  }, [currentUser]);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discount) return;

    try {
      const couponData = {
        ...newCoupon,
        code: newCoupon.code.toUpperCase(),
        discount: Number(newCoupon.discount),
        minPurchase: Number(newCoupon.minPurchase || 0),
        farmerId: currentUser.uid,
        farmerName: currentUser.displayName || 'Farmer',
        createdAt: serverTimestamp(),
        usageCount: 0,
        isActive: true
      };

      const docRef = await addDoc(collection(db, 'coupons'), couponData);
      setCoupons([{ id: docRef.id, ...couponData }, ...coupons]);
      setShowAddModal(false);
      setNewCoupon({ code: '', discount: '', minPurchase: '', expiryDate: '', description: '' });
      toast.success("Coupon broadcasted successfully");
    } catch (error) {
      toast.error("Failed to deploy coupon");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this discount campaign?')) return;
    try {
      await deleteDoc(doc(db, 'coupons', id));
      setCoupons(coupons.filter(c => c.id !== id));
      toast.success("Campaign terminated");
    } catch (error) {
      toast.error("Failed to remove campaign");
    }
  };

  return (
    <div className="p-4 lg:p-10 space-y-12 animate-in fade-in duration-700 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Campaign Manager</h1>
          <p className="text-slate-500 font-medium mt-1">Design and broadcast promotional discount strategies</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
        >
          <Plus size={18} /> Deploy New Campaign
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6">
          <Loader2 className="animate-spin text-emerald-500" size={48} />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Synchronizing Discount Network...</p>
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-100 shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-slate-200 border border-slate-100 shadow-inner">
            <Ticket size={48} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">No active campaigns</h3>
          <p className="text-slate-500 font-medium max-w-xs mx-auto mb-10">Broadcast your first discount to drive harvest sales.</p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
          >
            Start First Campaign
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all">
              <div className="p-8 pb-4">
                 <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                       <Percent size={28} />
                    </div>
                    <span className="px-4 py-1.5 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-100 italic">
                       {coupon.isActive ? 'Network Active' : 'Deactivated'}
                    </span>
                 </div>

                 <div className="mb-8">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Discount Code</p>
                    <div className="flex items-center gap-4">
                       <h3 className="text-3xl font-black text-slate-900 tracking-tighter group-hover:text-emerald-600 transition-colors uppercase">{coupon.code}</h3>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Benefit</p>
                       <p className="text-xl font-black text-slate-900">{coupon.discount}% <span className="text-[10px] text-slate-400">OFF</span></p>
                    </div>
                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Requirement</p>
                       <p className="text-xl font-black text-slate-900">₹{coupon.minPurchase}</p>
                    </div>
                 </div>
              </div>

              <div className="px-8 pb-8 pt-4 space-y-4 border-t border-slate-50">
                 <div className="flex items-center gap-3 text-slate-500 font-bold text-xs bg-slate-50 p-3 rounded-xl">
                    <Calendar size={14} className="text-emerald-500" />
                    Expires: <span className="text-slate-900 font-black">{coupon.expiryDate || 'Permanent'}</span>
                 </div>
                 <div className="flex items-center gap-4 pt-4">
                    <button 
                       onClick={() => handleDelete(coupon.id)}
                       className="flex-1 py-4 bg-white border border-slate-200 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 hover:border-red-100 transition-all flex items-center justify-center gap-2"
                    >
                       <Trash2 size={16} /> Terminate
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Coupon Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[3rem] p-12 max-w-xl w-full relative z-10 shadow-2xl border border-slate-100 overflow-hidden"
            >
              <button 
                 onClick={() => setShowAddModal(false)}
                 className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"
              >
                 <X size={24} />
              </button>

              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner">
                <Ticket size={40} />
              </div>

              <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Campaign Setup</h3>
              <p className="text-slate-500 font-medium mb-10">Configure discount parameters for your customers.</p>

              <form onSubmit={handleCreateCoupon} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Campaign Code</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. FRESH20"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                      className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-black text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all uppercase"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Percent Off (%)</label>
                    <input 
                      type="number"
                      required
                      placeholder="20"
                      value={newCoupon.discount}
                      onChange={(e) => setNewCoupon({...newCoupon, discount: e.target.value})}
                      className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-black text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Min. Entry Value</label>
                    <input 
                      type="number"
                      placeholder="₹500"
                      value={newCoupon.minPurchase}
                      onChange={(e) => setNewCoupon({...newCoupon, minPurchase: e.target.value})}
                      className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-black text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Deadline Date</label>
                    <input 
                      type="date"
                      value={newCoupon.expiryDate}
                      onChange={(e) => setNewCoupon({...newCoupon, expiryDate: e.target.value})}
                      className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-6 font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-slate-900 text-emerald-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all mt-6"
                >
                  Broadcast Campaign
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FarmerCoupons;
