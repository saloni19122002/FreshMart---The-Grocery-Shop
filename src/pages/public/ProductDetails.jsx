import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, getActiveProducts } from '../../services/productService';
import { Loader2, ArrowLeft, Minus, Plus, ShoppingCart, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(id));

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0); // Scroll to top on new product
        
        const data = await getProductById(id);
        if (!data) {
          setError("Product not found or is no longer available.");
          setLoading(false);
          return;
        }
        
        setProduct(data);
        
        // Fetch related products (same category)
        if (data.categorySlug) {
          const related = await getActiveProducts({ categorySlug: data.categorySlug, limitCount: 5 });
          // Filter out the current product and take only 4
          setRelatedProducts(related.filter(p => p.id !== data.id).slice(0, 4));
        }

      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleQuantity = (type) => {
    if (type === 'dec' && quantity > 1) {
      setQuantity(q => q - 1);
    } else if (type === 'inc' && product && quantity < (product.stock || 10)) {
      setQuantity(q => q + 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  const handleToggleWishlist = () => {
    if (product) {
      toggleWishlist(product);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-500" size={40} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 mb-6 max-w-lg mx-auto">
          <p className="text-lg font-medium">{error || "Product not found"}</p>
        </div>
        <button onClick={() => navigate('/shop')} className="btn-primary">
          Back to Shop
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  
  // Calculate discount percentage
  let discountBadge = product.discount;
  if (!discountBadge && product.mrp > product.price) {
    const percent = Math.round(((product.mrp - product.price) / product.mrp) * 100);
    discountBadge = `${percent}% OFF`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2">/</span>
              <Link to="/shop" className="hover:text-primary-600 transition-colors">Shop</Link>
            </div>
          </li>
          {product.categorySlug && (
            <li>
              <div className="flex items-center">
                <span className="mx-2">/</span>
                <Link to={`/category/${product.categorySlug}`} className="hover:text-primary-600 capitalize transition-colors">
                  {product.categorySlug.replace('-', ' ')}
                </Link>
              </div>
            </li>
          )}
          <li aria-current="page">
            <div className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium truncate max-w-[150px] sm:max-w-xs">{product.name}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="fixed sm:hidden bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-40 flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={handleAddToCart}
          className="flex-1 btn-primary !py-3 flex items-center justify-center text-lg" 
          disabled={isOutOfStock}
        >
          <ShoppingCart size={20} className="mr-2" /> Add to Cart
        </button>
      </div>

      <div className="bg-white rounded-[2rem] p-6 lg:p-10 shadow-sm border border-gray-100 mb-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Image Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="relative aspect-square rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className={`w-full h-full object-cover ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
                />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discountBadge && !isOutOfStock && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    {discountBadge}
                  </span>
                )}
                {isOutOfStock && (
                  <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    Out of Stock
                  </span>
                )}
              </div>
              
              <button 
                onClick={handleToggleWishlist}
                className={`absolute top-4 right-4 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-colors ${isInWishlist ? 'bg-red-500 text-white' : 'bg-white text-gray-500 hover:text-red-500'}`}
              >
                <Heart size={24} fill={isInWishlist ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          {/* Product Details Info */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold text-primary-600 uppercase tracking-wider bg-primary-50 px-3 py-1 rounded-full">
                {product.category || product.categorySlug || 'Fresh'}
              </span>
              {/* Simple rating placeholder */}
              <div className="flex items-center text-yellow-500 text-sm font-medium">
                ★ 4.8 <span className="text-gray-400 ml-1 font-normal">(120 reviews)</span>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex flex-col gap-1 mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-gray-900">₹{product.price}</span>
                {product.mrp > product.price && (
                  <span className="text-xl text-gray-400 line-through mb-1">₹{product.mrp}</span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Inclusive of all taxes {product.unit ? `• Per ${product.unit}` : ''}
              </p>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              {product.description || "Experience the authentic taste of farm-fresh produce, grown locally and delivered straight from the farm to your door. 100% natural, chemical-free, and full of essential nutrients."}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mb-8">
              {/* Quantity Selector */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-700">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-xl h-14 w-36 bg-gray-50">
                  <button 
                    onClick={() => handleQuantity('dec')}
                    className="flex-1 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors h-full rounded-l-xl"
                    disabled={isOutOfStock}
                  >
                    <Minus size={20} />
                  </button>
                  <span className="flex-1 text-center font-bold text-lg text-gray-900">{isOutOfStock ? 0 : quantity}</span>
                  <button 
                    onClick={() => handleQuantity('inc')}
                    className="flex-1 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors h-full rounded-r-xl"
                    disabled={isOutOfStock}
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex-1 flex flex-col gap-2 hidden sm:flex">
                <span className="text-sm font-medium text-transparent select-none">Action</span>
                <button 
                  onClick={handleAddToCart}
                  className={`h-14 rounded-xl flex items-center justify-center text-lg font-bold transition-all shadow-lg ${isOutOfStock ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none' : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-600/30 active:scale-[0.98]'}`}
                  disabled={isOutOfStock}
                >
                  <ShoppingCart size={22} className="mr-3" />
                  {isOutOfStock ? 'Currently Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>

            {/* Value Propositions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-auto pt-6 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-sm font-medium text-gray-700">100% Quality<br/>Assurance</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Truck size={20} />
                </div>
                <span className="text-sm font-medium text-gray-700">Fast Local<br/>Delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                  <RefreshCw size={20} />
                </div>
                <span className="text-sm font-medium text-gray-700">Easy Returns<br/>Policy</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 sm:mt-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Similar Products</h2>
            <Link to={`/category/${product.categorySlug}`} className="text-primary-600 font-medium hover:text-primary-700 flex items-center">
              View All <ArrowLeft size={16} className="ml-1 rotate-180" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(rel => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
