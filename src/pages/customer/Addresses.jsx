import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUserAddresses, addAddress, deleteAddress } from '../../services/addressService';
import { MapPin, Plus, Trash2, Home, Briefcase, PlusCircle, Loader2, MapPinOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Addresses = () => {
  const { currentUser } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    type: 'Home'
  });

  useEffect(() => {
    if (currentUser) {
      fetchAddresses();
    }
  }, [currentUser]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await getUserAddresses(currentUser.uid);
      setAddresses(data);
    } catch (error) {
      toast.error('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const added = await addAddress(currentUser.uid, newAddress);
      setAddresses([...addresses, added]);
      setShowForm(false);
      setNewAddress({ name: '', phone: '', street: '', city: '', state: '', pincode: '', type: 'Home' });
      toast.success('Address saved!');
    } catch (error) {
      toast.error('Failed to save address');
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await deleteAddress(id);
      setAddresses(addresses.filter(a => a.id !== id));
      toast.success('Address deleted');
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">My Addresses</h1>
          <p className="text-gray-500 font-medium">Manage your delivery locations</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <PlusCircle size={20} /> Add New
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-3xl border-2 border-emerald-100 p-8 shadow-sm mb-10 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-black text-gray-900 mb-6 font-display">New Shipping Address</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input 
              type="text" required placeholder="Full Name"
              className="input-field col-span-2"
              value={newAddress.name}
              onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
            />
            <input 
              type="text" required placeholder="Phone Number"
              className="input-field"
              value={newAddress.phone}
              onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
            />
            <select 
              className="input-field"
              value={newAddress.type}
              onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
            <input 
              type="text" required placeholder="Flat / House / Street"
              className="input-field col-span-2"
              value={newAddress.street}
              onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
            />
            <input 
              type="text" required placeholder="City"
              className="input-field"
              value={newAddress.city}
              onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
            />
            <input 
              type="text" required placeholder="State"
              className="input-field"
              value={newAddress.state}
              onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
            />
            <input 
              type="text" required placeholder="Pincode"
              className="input-field"
              value={newAddress.pincode}
              onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
            />
            <div className="col-span-2 flex gap-3 mt-4">
              <button type="submit" disabled={btnLoading} className="btn-primary flex-1 py-4 text-base">
                {btnLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Save Address'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="btn-secondary !bg-gray-50 flex-1 py-4 text-base"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="bg-gray-50 rounded-[2rem] p-16 text-center border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 shadow-sm">
            <MapPinOff size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No addresses saved</h2>
          <p className="text-gray-500 mb-8 max-w-xs mx-auto">Please add a shipping address to speed up your checkout process.</p>
          <button 
            onClick={() => setShowForm(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={18} /> Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <div 
              key={addr.id}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-emerald-100 hover:shadow-md transition-all relative group"
            >
              <button 
                onClick={() => handleDelete(addr.id)}
                className="absolute top-6 right-6 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>

              <div className="flex items-center gap-2 text-emerald-600 mb-4">
                {addr.type === 'Home' ? <Home size={18} /> : addr.type === 'Work' ? <Briefcase size={18} /> : <MapPin size={18} />}
                <span className="text-[10px] font-black uppercase tracking-widest">{addr.type}</span>
              </div>
              
              <h3 className="font-bold text-gray-900 text-lg mb-1">{addr.name}</h3>
              <p className="text-sm text-gray-500 leading-relaxed min-h-[40px]">
                {addr.street}<br/>
                {addr.city}, {addr.state} - {addr.pincode}
              </p>
              
              <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">{addr.phone}</span>
                <span className="text-[10px] font-bold text-gray-400">#SAVED</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Addresses;
