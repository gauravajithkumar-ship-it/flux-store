import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { Star, ShoppingCart, Filter, ChevronDown } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { CardContainer } from '../components/ui/3d-card';


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
    <div className="clay-canvas pt-28 sm:pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">Our <span className="text-cyan-400">Products.</span></h1>
          <p className="text-gray-400 max-w-2xl">Discover our exclusive range of premium electronics.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-12 h-12 clay-inset rounded-full animate-spin">
              <div className="w-10 h-10 m-1 rounded-full border-4 border-cyan-500 border-t-transparent"></div>
            </div>
          </div>
        ) : (
        
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Mobile Filter Toggle */}
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`lg:hidden w-full flex items-center justify-between px-4 py-3 rounded-2xl text-white font-medium clay-interactive ${isFilterOpen ? 'clay-inset is-active' : 'clay'}`}
          >
            <span className="flex items-center gap-2">
              <Filter size={18} className="text-cyan-400" />
              Filter Categories
            </span>
            <ChevronDown size={18} className={`text-cyan-400 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Sidebar */}
          <div className={`lg:w-1/4 w-full ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="clay p-4 sm:p-6 rounded-3xl lg:sticky lg:top-32">
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className="w-9 h-9 rounded-xl clay-inset flex items-center justify-center shrink-0">
                  <Filter size={16} className="text-cyan-400" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-white">Categories</h2>
              </div>
              <div className="flex flex-col gap-2 sm:gap-3">
                {categories.map(category => {
                  const isChecked = selectedCategories.includes(category);
                  return (
                    <label 
                      key={category} 
                      className="clay-inset clay-interactive flex items-center gap-3 cursor-pointer group rounded-2xl px-3 py-2.5 sm:px-3 sm:py-2"
                    >
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={isChecked}
                        onChange={() => handleCategoryChange(category)}
                      />
                      <span 
                        className={`w-5 h-5 shrink-0 rounded-md flex items-center justify-center transition-all duration-200 clay-interactive ${isChecked ? 'clay-pill' : 'clay-inset'}`}
                      >
                        <svg className={`w-3 h-3 text-cyan-400 transition-opacity ${isChecked ? 'opacity-100' : 'opacity-0'}`} viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span className={`text-sm select-none transition-colors ${isChecked ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                        {category}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Product Grid */}
          <div className="lg:w-3/4 w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
              {filteredProducts.map((product, idx) => {
                const finalPrice = product.discount 
              ? (product.price * (1 - product.discount / 100)).toFixed(2) 
              : product.price;

            return (
              <CardContainer key={product.id} className="h-full" maxTilt={8} lift={1.015}>
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="clay group flex flex-col h-full rounded-2xl sm:rounded-3xl overflow-hidden clay-interactive [transform-style:preserve-3d]"
              >
                <Link to={`/product/${product.id}`} className="block relative h-32 sm:h-48 md:h-56 lg:h-64 clay-inset m-2 sm:m-3 rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 flex items-center justify-center overflow-hidden">
                  <img src={product.img} alt={product.name} className="w-full h-full object-contain mix-blend-screen group-hover:scale-110 transition-transform duration-500" />
                  
                  {/* Tags */}
                  <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-col gap-1 sm:gap-2">
                    <span className="clay-pill px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold text-white w-fit">
                      {product.brand}
                    </span>
                    {product.discount && (
                      <span className="clay-pill px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-cyan-400 w-fit">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                  
                  {/* Stock Status */}
                  <div className={`clay-pill absolute top-2 right-2 sm:top-4 sm:right-4 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-wider
                    ${product.stockStatus === 'In Stock' ? 'text-green-400' : 
                      product.stockStatus === 'Low Stock' ? 'text-orange-400' : 
                      'text-red-400'}`}>
                    {product.stockStatus}
                  </div>
                </Link>
                
                <div className="p-3 pt-4 sm:p-5 sm:pt-5 md:p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-1 sm:mb-3 gap-1 sm:gap-3">
                    <Link to={`/product/${product.id}`} className="min-w-0">
                      <h3 className="text-xs sm:text-base md:text-lg font-semibold text-white line-clamp-2 sm:line-clamp-1 transition-colors group-hover:text-cyan-300">{product.name}</h3>
                    </Link>
                    <div className="clay-inset flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-sm px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full shrink-0">
                      <Star size={11} className="text-cyan-400 fill-cyan-400" />
                      <span className="font-medium text-white">{product.rating}</span>
                    </div>
                  </div>
                  
                  <div className="hidden sm:block text-sm text-gray-400 mb-4 line-clamp-2">
                    {product.specs.join(' • ')}
                  </div>
                  
                  <div className="mt-auto flex items-center justify-between pt-2 sm:pt-4">
                    <div className="min-w-0">
                      {product.discount ? (
                        <div className="flex flex-col">
                          <span className="text-[10px] sm:text-xs text-gray-500 line-through">₹{product.price}</span>
                          <span className="text-sm sm:text-xl font-bold text-cyan-400">₹{finalPrice}</span>
                        </div>
                      ) : (
                        <span className="text-sm sm:text-xl font-bold text-white">₹{product.price}</span>
                      )}
                    </div>
                    <button 
                      onClick={(e) => { e.preventDefault(); if(product.stockStatus !== 'Out of Stock') addToCart(product); }}
                      disabled={product.stockStatus === 'Out of Stock'}
                      aria-label={`Add ${product.name} to cart`}
                      onPointerDown={(e) => e.stopPropagation()}
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 clay-interactive ${product.stockStatus === 'Out of Stock'
                        ? 'clay-inset text-gray-500 cursor-not-allowed'
                        : 'clay-pill text-cyan-400 hover:text-cyan-300'}`}
                    >
                      <ShoppingCart size={15} className="sm:h-[18px] sm:w-[18px]" />
                    </button>
                  </div>
                </div>
              </motion.article>
              </CardContainer>
            );
              })}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="clay text-center py-16 sm:py-20 rounded-3xl">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-300 mb-2">No products found</h3>
                <p className="text-gray-500 text-sm sm:text-base">Try selecting different categories.</p>
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
