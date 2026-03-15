import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserStatus } from '../../services/adminService';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar,
  Shield,
  UserCheck,
  UserX,
  Loader2,
  Trash2,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers('customer');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
    try {
      await updateUserStatus(userId, newStatus);
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      toast.success(`User set to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Customer Database</h1>
          <p className="text-slate-500 font-medium mt-1">Manage and monitor registered platform users</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span className="text-xs font-black text-slate-900">{users.length} Total Customers</span>
           </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, email or ID..." 
            className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center gap-2">
          <Filter size={18} /> Apply Filters
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-32 gap-6 text-slate-300">
            <Loader2 className="animate-spin" size={48} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Querying Global Registry...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-32 text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8 text-slate-200">
              <Users size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No users found</h3>
            <p className="text-slate-400 font-medium max-w-xs mx-auto">Try adjusting your search terms or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Platform Identity</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact & Info</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Role / Access</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-xl font-black border-4 border-white shadow-lg overflow-hidden shrink-0">
                          {user.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : user.displayName?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{user.displayName || 'Anonymous User'}</p>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-0.5">UID: {user.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 space-y-2">
                       <div className="flex items-center gap-2 text-slate-500 font-medium text-xs">
                          <Mail size={14} className="text-slate-300" /> {user.email}
                       </div>
                       <div className="flex items-center gap-2 text-slate-500 font-medium text-xs">
                          <Calendar size={14} className="text-slate-300" /> Joined {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 'Recently'}
                       </div>
                    </td>
                    <td className="px-10 py-6">
                       <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                          <Shield size={12} className="text-emerald-400" /> {user.role || 'customer'}
                       </div>
                    </td>
                    <td className="px-10 py-6">
                       <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border ${
                         user.status === 'blocked' 
                         ? 'bg-red-50 text-red-600 border-red-100' 
                         : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                       }`}>
                         {user.status || 'Active'}
                       </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleStatusToggle(user.id, user.status)}
                            className={`p-3 rounded-2xl transition-all ${
                              user.status === 'blocked'
                              ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                            }`}
                            title={user.status === 'blocked' ? 'Unblock User' : 'Block User'}
                          >
                             {user.status === 'blocked' ? <UserCheck size={20} /> : <UserX size={20} />}
                          </button>
                          <button className="p-3 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-2xl transition-all group/btn">
                             <ChevronRight size={20} className="group-hover/btn:translate-x-0.5 transition-transform" />
                          </button>
                       </div>
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

export default AdminUsers;
