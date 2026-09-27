import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Star, ShoppingCart, Filter, ChevronDown } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { CardContainer, CardBody, CardItem } from '../components/ui/3d-card';


const Products = () => {
  const { products, isLoading } = useProducts();
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    } else {
      setSelectedCategories([]);
    }
  }, [categoryParam]);

  // Extract unique categories from products
  const categories = useMemo(() => {
    return [...new Set(products.map(p => p.category))];
  }, [products]);

  // Filter products based on selected categories
  const filteredProducts = useMemo(() => {
    if (selectedCategories.length === 0) return products;
    return products.filter(p => selectedCategories.includes(p.category));
  }, [selectedCategories, products]);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => {
      const newSelection = prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category];
      
      // Update URL to match current selections
      if (newSelection.length === 1) {
        setSearchParams({ category: newSelection[0] });
      } else {
        setSearchParams({});
      }
      
      return newSelection;
    });
  };

  return (
    <div className="pt-28 sm:pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">Our <span className="text-cyan-400">Products.</span></h1>
          <p className="text-gray-400 max-w-2xl">Discover our exclusive range of premium electronics.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden w-full flex items-center justify-between px-4 py-3 rounded-xl glass border border-white/10 text-white font-medium"
          >
            <span className="flex items-center gap-2">
              <Filter size={18} className="text-cyan-400" />
              Filter Categories
            </span>
            <ChevronDown size={18} className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Sidebar */}
          <div className={`lg:w-1/4 w-full ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="glass p-6 rounded-3xl border border-white/10 lg:sticky lg:top-32">
              <div className="flex items-center gap-2 mb-6">
                <Filter size={20} className="text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">Categories</h2>
              </div>
              <div className="flex flex-col gap-4">
                {categories.map(category => (
                  <label key={category} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        className="peer appearance-none w-5 h-5 border border-white/20 rounded-md bg-black/20 checked:bg-cyan-500 checked:border-cyan-500 transition-all duration-200 cursor-pointer"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                      />
                      <svg className="absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors select-none">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          {/* Product Grid */}
          <div className="lg:w-3/4 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product, idx) => {
                const finalPrice = product.discount 
              ? (product.price * (1 - product.discount / 100)).toFixed(2) 
              : product.price;

            return (
              <CardContainer key={product.id} className="h-full">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="glass rounded-3xl group flex flex-col h-full overflow-hidden border border-white/10 hover:border-cyan-500/50 transition-colors"
              >
                <Link to={`/product/${product.id}`} className="block relative h-64 bg-black/40 p-6 flex items-center justify-center overflow-hidden">
                  <img src={product.img} alt={product.name} className="w-full h-full object-contain mix-blend-screen group-hover:scale-110 transition-transform duration-500" />
                  
                  {/* Tags */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-white/10 backdrop-blur-md px-2 py-1 rounded-md text-xs font-semibold text-white w-fit">
                      {product.brand}
                    </span>
                    {product.discount && (
                      <span className="bg-cyan-500 text-black px-2 py-1 rounded-md text-xs font-bold w-fit">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                  
                  {/* Stock Status */}
                  <div className={`absolute top-4 right-4 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                    ${product.stockStatus === 'In Stock' ? 'bg-green-500/20 text-green-400' : 
                      product.stockStatus === 'Low Stock' ? 'bg-orange-500/20 text-orange-400' : 
                      'bg-red-500/20 text-red-400'}`}>
                    {product.stockStatus}
                  </div>
                </Link>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <Link to={`/product/${product.id}`} className="hover:text-cyan-400 transition-colors">
                      <h3 className="text-lg font-semibold text-white line-clamp-1">{product.name}</h3>
                    </Link>
                    <div className="flex items-center gap-1 text-sm bg-white/5 px-2 py-1 rounded-lg">
                      <Star size={12} className="text-cyan-400 fill-cyan-400" />
                      <span className="font-medium">{product.rating}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {product.specs.join(' • ')}
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                      {product.discount ? (
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 line-through">₹{product.price}</span>
                          <span className="text-xl font-bold text-cyan-400">₹{finalPrice}</span>
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-white">₹{product.price}</span>
                      )}
                    </div>
                    <button 
                      onClick={(e) => { e.preventDefault(); if(product.stockStatus !== 'Out of Stock') addToCart(product); }}
                      disabled={product.stockStatus === 'Out of Stock'}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors 
                        ${product.stockStatus === 'Out of Stock'
                          ? 'bg-gray-500/50 text-gray-400 cursor-not-allowed'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]'}`}
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
              </CardContainer>
            );
              })}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-2xl font-semibold text-gray-400 mb-2">No products found</h3>
                <p className="text-gray-500">Try selecting different categories.</p>
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};


export default Products;
