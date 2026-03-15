import React, { useState, useEffect } from 'react';
import { getGlobalSettings, updateGlobalSetting } from '../../services/adminService';
import { 
  Settings, 
  Truck, 
  Percent, 
  Search, 
  Globe, 
  ShieldCheck, 
  Bell, 
  Database,
  Save,
  Loader2,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getGlobalSettings();
      // Ensure we have at least empty objects for our expected keys
      const formattedSettings = {
        general: data.general || { storeName: 'FreshMart', contactEmail: '', supportPhone: '', currency: 'INR' },
        shipping: data.shipping || { flatRate: 50, freeThreshold: 500, estimatedDelivery: '1-3 Days' },
        tax: data.tax || { gstPercentage: 5, enabled: true },
        seo: data.seo || { metaTitle: 'FreshMart - Organic Grocery', metaDesc: '', keywords: '' }
      };
      setSettings(formattedSettings);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (settingId, data) => {
    try {
      setSaving(true);
      await updateGlobalSetting(settingId, data);
      setSettings({ ...settings, [settingId]: data });
      toast.success(`${settingId.charAt(0).toUpperCase() + settingId.slice(1)} settings updated`);
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-vh-[60vh] gap-4">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Accessing Core Configuration...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'shipping', label: 'Logistics', icon: Truck },
    { id: 'tax', label: 'Financials', icon: Percent },
    { id: 'seo', label: 'Indexing', icon: Globe },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Configuration</h1>
          <p className="text-slate-500 font-medium mt-1">Global parameters and business logic controls</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-nowrap">Production Environment</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Tabs */}
        <aside className="lg:w-72 space-y-2 shrink-0">
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-sm transition-all text-left ${
                 activeTab === tab.id 
                 ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                 : 'text-slate-400 hover:bg-white hover:text-slate-900'
               }`}
             >
               <tab.icon size={20} />
               {tab.label}
             </button>
           ))}
        </aside>

        {/* Settings Content */}
        <div className="flex-1">
           <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 space-y-10">
              {activeTab === 'general' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                   <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                         <Settings size={22} />
                      </div>
                      <h3 className="text-xl font-black text-slate-900">General Information</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Store Name</label>
                         <input 
                           type="text" 
                           className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-emerald-500 font-bold"
                           value={settings.general.storeName}
                           onChange={(e) => setSettings({...settings, general: {...settings.general, storeName: e.target.value}})}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Support Email</label>
                         <input 
                           type="email" 
                           className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-emerald-500"
                           value={settings.general.contactEmail}
                           onChange={(e) => setSettings({...settings, general: {...settings.general, contactEmail: e.target.value}})}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Support Phone</label>
                         <input 
                           type="tel" 
                           className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-emerald-500"
                           value={settings.general.supportPhone}
                           onChange={(e) => setSettings({...settings, general: {...settings.general, supportPhone: e.target.value}})}
                         />
                      </div>
                   </div>
                   <button 
                     onClick={() => handleUpdate('general', settings.general)}
                     disabled={saving}
                     className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100 flex items-center gap-2"
                   >
                     {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Update General
                   </button>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                   <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
                         <Truck size={22} />
                      </div>
                      <h3 className="text-xl font-black text-slate-900">Shipping & Logistics</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Flat Delivery Rate (₹)</label>
                         <input 
                           type="number" 
                           className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500 font-bold text-lg"
                           value={settings.shipping.flatRate}
                           onChange={(e) => setSettings({...settings, shipping: {...settings.shipping, flatRate: Number(e.target.value)}})}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Free Delivery Threshold (₹)</label>
                         <input 
                           type="number" 
                           className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500 font-bold text-lg"
                           value={settings.shipping.freeThreshold}
                           onChange={(e) => setSettings({...settings, shipping: {...settings.shipping, freeThreshold: Number(e.target.value)}})}
                         />
                      </div>
                   </div>
                   <button 
                     onClick={() => handleUpdate('shipping', settings.shipping)}
                     disabled={saving}
                     className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center gap-2"
                   >
                     {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Logistics
                   </button>
                </div>
              )}

              {activeTab === 'tax' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                   <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100">
                         <Percent size={22} />
                      </div>
                      <h3 className="text-xl font-black text-slate-900">Tax Settings (GST)</h3>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">GST Percentage (%)</label>
                         <input 
                           type="number" 
                           className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-orange-500 font-bold text-lg"
                           value={settings.tax.gstPercentage}
                           onChange={(e) => setSettings({...settings, tax: {...settings.tax, gstPercentage: Number(e.target.value)}})}
                         />
                      </div>
                   </div>
                   <button 
                     onClick={() => handleUpdate('tax', settings.tax)}
                     disabled={saving}
                     className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 flex items-center gap-2"
                   >
                     {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Taxes
                   </button>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                   <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 bg-purple-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-100">
                         <Globe size={22} />
                      </div>
                      <h3 className="text-xl font-black text-slate-900">SEO & Indexing</h3>
                   </div>
                   
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Meta Title Template</label>
                         <input 
                           type="text" 
                           className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-purple-500"
                           value={settings.seo.metaTitle}
                           onChange={(e) => setSettings({...settings, seo: {...settings.seo, metaTitle: e.target.value}})}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Meta Description</label>
                         <textarea 
                           className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-purple-500 min-h-[100px]"
                           value={settings.seo.metaDesc}
                           onChange={(e) => setSettings({...settings, seo: {...settings.seo, metaDesc: e.target.value}})}
                         />
                      </div>
                   </div>
                   <button 
                     onClick={() => handleUpdate('seo', settings.seo)}
                     disabled={saving}
                     className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-700 transition-all shadow-xl shadow-purple-100 flex items-center gap-2"
                   >
                     {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Update SEO
                   </button>
                </div>
              )}
           </div>
           
           <div className="mt-10 p-8 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-start gap-5">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                 <AlertCircle size={24} />
              </div>
              <div>
                 <h4 className="font-black text-amber-900 text-sm">Critical Warning</h4>
                 <p className="text-xs font-bold text-amber-700/70 mt-1 leading-relaxed">Changes to global settings affect the entire platform experience in real-time. Please verify all technical values (Tax/Shipping) before saving to avoid checkout failures.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
