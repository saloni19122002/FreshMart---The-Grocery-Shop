import React, { useState, useEffect } from 'react';
import { getCoupons, addCoupon } from '../../services/adminService';
import { 
  Tag, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  MoreVertical,
  Loader2,
  Ticket,
  Calendar,
  Percent
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ code: '', discount: '', expiry: '', description: '', isActive: true });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await getCoupons();
      setCoupons(data);
    } catch (error) {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCoupon(formData);
      toast.success('Coupon created successfully');
      setShowModal(false);
      fetchCoupons();
    } catch (error) {
      toast.error('Failed to create coupon');
    }
  };

  return (
    <div className="p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Promotional Codes</h1>
          <p className="text-slate-500 font-medium mt-1">Manage platform-wide discount strategies</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center gap-2 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Create New Coupon
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-32">
           <Loader2 className="animate-spin text-emerald-500" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="relative bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-2xl transition-all">
               {/* Ticket design cutouts */}
               <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-8 rounded-full bg-[#f8fafc] border border-slate-100 shadow-inner" />
               <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-8 h-8 rounded-full bg-[#f8fafc] border border-slate-100 shadow-inner" />
               
               <div className="p-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                     <Percent size={32} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">{coupon.code}</h3>
                  <p className="text-emerald-600 font-black text-base uppercase tracking-widest leading-none mb-3">{coupon.discount}% FLAT OFF</p>
                  {coupon.description && (
                    <p className="text-[10px] text-slate-400 font-bold max-w-[200px] line-clamp-2">{coupon.description}</p>
                  )}
                  
                  <div className="mt-8 pt-8 border-t border-slate-50 w-full space-y-4">
                     <div className="flex items-center justify-center gap-2 text-slate-400 font-bold text-xs">
                        <Calendar size={14} />
                        Expires: {coupon.expiry || 'No Expiry'}
                     </div>
                     <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                       coupon.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                     }`}>
                       {coupon.isActive ? 'Active & Live' : 'Disabled'}
                     </span>
                  </div>
               </div>
               
               <div className="px-8 py-4 bg-slate-50 flex justify-center gap-4">
                  <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors">Delete</button>
                  <div className="w-[1px] h-4 bg-slate-200" />
                  <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">Duplicate</button>
               </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-slate-900">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
           <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-200">
              <h2 className="text-2xl font-black">Generate Coupon</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coupon Code</label>
                    <input 
                      type="text" required placeholder="e.g. FRESH50"
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-emerald-500 font-black uppercase"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Discount Percentage</label>
                    <input 
                      type="number" required max="100"
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-emerald-500"
                      value={formData.discount}
                      onChange={(e) => setFormData({...formData, discount: e.target.value})}
                    />
                 </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coupon Description (Optional)</label>
                     <input 
                       type="text" placeholder="e.g. For whole platform"
                       className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-emerald-500"
                       value={formData.description}
                       onChange={(e) => setFormData({...formData, description: e.target.value})}
                     />
                  </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiry Date</label>
                    <input 
                      type="date"
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-emerald-500"
                      value={formData.expiry}
                      onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                    />
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 font-black text-xs uppercase text-slate-400 hover:text-slate-900 transition-colors">Discard</button>
                    <button type="submit" className="flex-[2] bg-emerald-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-100">Activate Code</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
