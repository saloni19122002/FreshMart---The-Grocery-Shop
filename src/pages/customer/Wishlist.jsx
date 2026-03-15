import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useCartStore } from '../../store/useCartStore';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';

const Wishlist = () => {
  const { items, clearWishlist } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-300">
          <Heart size={48} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Save your favorite fresh products to your wishlist. They will be here waiting for you!
        </p>
        <Link to="/shop" className="btn-primary inline-flex items-center">
          <ArrowLeft size={18} className="mr-2" /> Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-500 mt-1">You have {items.length} items saved for later</p>
        </div>
        <button 
          onClick={clearWishlist}
          className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((product) => (
          <div key={product.id} className="relative group">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
        <Link to="/shop" className="inline-flex items-center text-emerald-600 font-bold hover:text-emerald-700">
          <ArrowLeft size={18} className="mr-2" /> Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Wishlist;
