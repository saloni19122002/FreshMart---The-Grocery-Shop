import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, getActiveProducts } from '../../services/productService';
import { getUserProfile } from '../../services/userService';
import { 
  Loader2, 
  ArrowLeft, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RefreshCw,
  User,
  Phone,
  MessageCircle
} from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [farmer, setFarmer] = useState(null);
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
        
        // Fetch farmer profile
        if (data.farmerId) {
          try {
            const profile = await getUserProfile(data.farmerId);
            setFarmer(profile);
          } catch (err) {
            console.error("Error fetching farmer profile:", err);
          }
        }
        
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

// ... previous helper functions ...

  if (loading) {
// ... existing loading block
  }

  if (error || !product) {
// ... existing error block
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

      {/* Product Main Section */}
      <div className="bg-white rounded-[2rem] p-6 lg:p-10 shadow-sm border border-gray-100 mb-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product Image Gallery */}
// ... existing gallery code ...

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

            {/* Seller Quick Info */}
            {farmer && (
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  <User size={14} className="text-primary-600" />
                  <span className="font-semibold text-gray-700">Sold by {farmer.displayName}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-300 mx-1" />
                <span className="text-emerald-600 font-bold">Verified Farmer</span>
              </div>
            )}
            
            <div className="flex flex-col gap-1 mb-6 pb-6 border-b border-gray-100">
// ... existing price code ...
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              {product.description || "Experience the authentic taste of farm-fresh produce..."}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mb-8">
// ... existing quantity/cart code ...
            </div>
            
            {/* Farmer/Seller Card */}
            {farmer && (
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
                      {farmer.photoURL ? (
                        <img src={farmer.photoURL} alt={farmer.displayName} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <User size={28} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 leading-tight mb-1">{farmer.displayName}</h4>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 line-clamp-1 truncate max-w-[120px]">Top Rated Seller</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {farmer.phoneNumber && (
                      <a href={`tel:${farmer.phoneNumber}`} className="flex-1 sm:flex-none btn-outline !bg-white !py-2 !px-4 text-xs font-black flex items-center justify-center gap-2 border-gray-200">
                        <Phone size={14} /> Call Farmer
                      </a>
                    )}
                    <button className="flex-1 sm:flex-none btn-outline !bg-white !py-2 !px-4 text-xs font-black flex items-center justify-center gap-2 border-gray-200">
                      <MessageCircle size={14} /> Message
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Value Propositions */}
// ... existing propositions ...
          </div>
        </div>
      </div>

      {/* Related Products */}
// ... existing related products ...
    </div>
  );
};

export default ProductDetails;
