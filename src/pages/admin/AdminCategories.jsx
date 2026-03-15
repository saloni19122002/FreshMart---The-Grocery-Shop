import React, { useState, useEffect } from 'react';
import { getCategories } from '../../services/adminService';
import { 
  Layers, 
  Plus, 
  ChevronRight, 
  Search, 
  Package, 
  Edit3, 
  MoreVertical,
  Loader2,
  Inbox
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Product Taxonomy</h1>
          <p className="text-slate-500 font-medium mt-1">Organize and manage global product categories</p>
        </div>
        <button className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-100 flex items-center gap-2 group">
          <Plus size={20} className="group-hover:rotate-90 transition-transform" /> New Category
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search categories..." 
            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-32">
           <Loader2 className="animate-spin text-emerald-500" size={48} />
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-32 text-center border border-slate-100">
          <Inbox size={48} className="mx-auto text-slate-200 mb-6" />
          <h3 className="text-xl font-black text-slate-900">No Categories Found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {filteredCategories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 group hover:shadow-2xl hover:-translate-y-1 transition-all">
               <div className="flex items-start justify-between mb-8">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-inner">
                     <Layers size={28} />
                  </div>
                  <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                     <MoreVertical size={20} />
                  </button>
               </div>
               
               <h3 className="text-2xl font-black text-slate-900 mb-2 truncate">{cat.name}</h3>
               <div className="flex items-center gap-3">
                  <Package size={14} className="text-slate-300" />
                  <span className="text-xs font-bold text-slate-400">120+ Products Listed</span>
               </div>

               <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                  <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors">
                     Manage Catalog <ChevronRight size={14} />
                  </button>
                  <div className="flex items-center -space-x-3">
                     {[1,2,3].map(i => (
                       <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white overflow-hidden shadow-sm">
                          <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" />
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
