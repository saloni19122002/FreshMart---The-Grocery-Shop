import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCategoryBySlug } from '../../services/categoryService';
import { getActiveProducts } from '../../services/productService';
import { Loader2, ArrowLeft, Search } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';

const CategoryDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoryData, productsData] = await Promise.all([
          getCategoryBySlug(slug),
          getActiveProducts({ categorySlug: slug })
        ]);
        
        if (categoryData) {
          setCategory(categoryData);
        } else {
          // Fallback UI logic for dev
          setCategory({ name: slug.replace('-', ' ').toUpperCase(), slug, description: `Explore all products in the ${slug.replace('-', ' ')} category.` });
        }
        
        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching category details:", err);
        setError("Failed to load category products");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-500" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 mb-6">
          <p className="text-lg font-medium">{error}</p>
        </div>
        <button onClick={() => navigate('/categories')} className="btn-primary">
          Back to Categories
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate('/categories')}
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary-600 mb-8 transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Categories
      </button>

      <div className="bg-primary-50 rounded-3xl p-8 mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 capitalize">
            {category?.name || slug.replace('-', ' ')}
          </h1>
          <p className="text-gray-600 max-w-xl">
            {category?.description || `Showing all fresh products from the ${category?.name || slug} category.`}
          </p>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 card shadow-none bg-gray-50 border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 shadow-sm border border-gray-200">
            <Search size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            We don't have any active products in the {category?.name || slug} category right now. 
            Check back later!
          </p>
          <Link to="/shop" className="btn-primary inline-flex">
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryDetails;
