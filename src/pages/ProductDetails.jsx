import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, ShieldCheck, Truck, ArrowLeft, ArrowRightLeft, X, CheckCircle2 } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const ProductDetails = () => {
  const { products, isLoading } = useProducts();
  const { addToCart } = useCart();
  const { id } = useParams();
  const product = products.find(p => p.id === id);

  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareProduct, setCompareProduct] = useState(null);

  const similarProducts = products.filter(p => p.category === product?.category && p.id !== product?.id);

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <Link 
          to="/products" 
          className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all duration-300 shadow-lg shadow-cyan-500/20 font-semibold mt-4"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Products
        </Link>
      </div>
    );
  }

  const finalPrice = product.discount 
    ? (product.price * (1 - product.discount / 100)).toFixed(2) 
    : product.price;

  return (
    <div className="pt-28 sm:pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        
        <Link 
          to="/products" 
          className="group flex items-center gap-2 w-fit mb-8 px-4 sm:px-5 py-2.5 rounded-xl glass border border-white/10 text-gray-300 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300 shadow-lg shadow-black/20"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-semibold tracking-wide">Back to Products</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-3xl overflow-hidden bg-black/40 p-6 sm:p-8 md:p-16 flex items-center justify-center relative aspect-square"
          >
            <img src={product.img} alt={product.name} className="w-full h-full object-contain mix-blend-screen" />
            
            {/* Tags */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 flex flex-col gap-2">
              <span className="bg-white/10 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-white">
                {product.brand}
              </span>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col py-4"
          >
            <div className="mb-2 text-cyan-400 font-medium tracking-wide uppercase text-xs sm:text-sm">
              {product.category}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-3 sm:gap-4 mb-6 flex-wrap">
              <div className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-lg">
                <Star size={16} className="text-cyan-400 fill-cyan-400" />
                <span className="font-semibold text-white">{product.rating}</span>
              </div>
              <div className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider
                ${product.stockStatus === 'In Stock' ? 'bg-green-500/20 text-green-400' : 
                  product.stockStatus === 'Low Stock' ? 'bg-orange-500/20 text-orange-400' : 
                  'bg-red-500/20 text-red-400'}`}>
                {product.stockStatus}
              </div>
            </div>

            <div className="mb-8 flex items-end gap-3 sm:gap-4 flex-wrap">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">₹{finalPrice}</span>
              {product.discount && (
                <>
                  <span className="text-xl sm:text-2xl text-gray-500 line-through mb-1">₹{product.price}</span>
                  <span className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded text-sm font-bold mb-2">
                    Save {product.discount}%
                  </span>
                </>
              )}
            </div>

            <div className="glass-dark border border-white/5 p-5 sm:p-6 rounded-2xl mb-8">
              <h3 className="text-lg font-semibold mb-4">Key Specifications</h3>
              <ul className="grid sm:grid-cols-2 gap-y-3 gap-x-6">
                {product.specs.map((spec, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-300 text-sm sm:text-base">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 md:gap-4 mb-8 items-stretch">
              <button 
                onClick={() => addToCart(product)}
                disabled={product.stockStatus === 'Out of Stock'}
                style={{
                  position: 'relative',
                  borderRadius: '45px',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0px 10px 10px rgb(147, 197, 253) inset, 0px 5px 10px rgba(5, 5, 5, 0.212), 0px -10px 10px rgb(37, 99, 235) inset',
                  background: product.stockStatus === 'Out of Stock' ? 'rgb(107 114 128 / 0.9)' : 'rgb(59, 130, 246)',
                  ...(product.stockStatus === 'Out of Stock' ? { cursor: 'not-allowed' } : {}),
                }}
                className="spring-button flex-1 font-semibold py-4 px-3 sm:px-6 gap-2 text-sm whitespace-nowrap"
              >
                <ShoppingCart size={20} className="shrink-0" />
                <span className="hidden xs:inline sm:inline">{product.stockStatus === 'Out of Stock' ? 'Out of Stock' : 'Add to Cart'}</span>
                <span className="inline xs:hidden sm:hidden">{product.stockStatus === 'Out of Stock' ? 'Sold Out' : 'Add'}</span>
                <style>{`
                  .spring-button {
                    transition: all 0.3s ease;
                    min-width: 0;
                  }
                  .spring-button::before {
                    width: 70%;
                    height: 2px;
                    position: absolute;
                    background-color: rgba(250, 250, 250, 0.678);
                    content: "";
                    filter: blur(1px);
                    top: 7px;
                    border-radius: 50%;
                  }
                  .spring-button::after {
                    width: 70%;
                    height: 2px;
                    position: absolute;
                    background-color: rgba(250, 250, 250, 0.137);
                    content: "";
                    filter: blur(1px);
                    bottom: 7px;
                    border-radius: 50%;
                  }
                  .spring-button:hover:not(:disabled) {
                    animation: jello-horizontal 1.2s both ease-in-out;
                  }
                  @keyframes jello-horizontal {
                    0% { transform: scale3d(1, 1, 1); }
                    20% { transform: scale3d(1.15, 0.85, 1); }
                    30% { transform: scale3d(0.9, 1.1, 1); }
                    40% { transform: scale3d(1.08, 0.92, 1); }
                    50% { transform: scale3d(0.95, 1.05, 1); }
                    60% { transform: scale3d(1.03, 0.97, 1); }
                    70% { transform: scale3d(0.98, 1.02, 1); }
                    80% { transform: scale3d(1.01, 0.99, 1); }
                    90% { transform: scale3d(0.99, 1.01, 1); }
                    100% { transform: scale3d(1, 1, 1); }
                  }
                `}</style>
              </button>
              <button 
                onClick={() => setIsCompareModalOpen(true)}
                title="Compare with similar products"
                className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 glass rounded-xl flex items-center justify-center text-white hover:text-cyan-400 hover:bg-white/10 transition-all hover:scale-[1.02]"
              >
                <ArrowRightLeft size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-white/10">
              <div className="flex items-center gap-3 text-gray-400">
                <Truck size={24} className="text-cyan-400 shrink-0" />
                <span className="text-sm font-medium">Free Fast Delivery</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <ShieldCheck size={24} className="text-cyan-400 shrink-0" />
                <span className="text-sm font-medium">1 Year Warranty</span>
              </div>
            </div>

          </motion.div>
        </div>
      </div>

      {/* Compare Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setIsCompareModalOpen(false); setCompareProduct(null); }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto glass border border-white/10 rounded-3xl p-4 sm:p-6 md:p-8 flex flex-col z-10"
          >
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Compare Products</h2>
              <button 
                onClick={() => { setIsCompareModalOpen(false); setCompareProduct(null); }}
                className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {!compareProduct ? (
              <div className="flex flex-col gap-6">
                <p className="text-gray-400 text-base sm:text-lg">Select a similar product to compare with <span className="text-white font-semibold">{product.name}</span>:</p>
                {similarProducts.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No similar products found in the same category.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {similarProducts.map(p => (
                      <button 
                        key={p.id}
                        onClick={() => setCompareProduct(p)}
                        className="glass p-3 sm:p-4 rounded-2xl flex flex-col items-center gap-2 sm:gap-4 hover:border-cyan-500/50 transition-colors text-left"
                      >
                        <div className="w-full aspect-square bg-black/40 rounded-xl p-3 sm:p-4 flex items-center justify-center">
                          <img src={p.img} alt={p.name} className="w-full h-full object-contain mix-blend-screen" />
                        </div>
                        <div className="w-full">
                          <h4 className="text-sm sm:text-base font-semibold truncate w-full">{p.name}</h4>
                          <p className="text-cyan-400 font-bold mt-0.5 sm:mt-1 text-sm sm:text-base">₹{p.price}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between mb-2">
                  <button 
                    onClick={() => setCompareProduct(null)}
                    className="text-cyan-400 hover:underline flex items-center gap-2 text-sm"
                  >
                    <ArrowLeft size={16} /> Choose a different product
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3 md:gap-8">
                  
                  {/* Current Product Column */}
                  <div className="flex flex-col gap-5 md:gap-6">
                    <div className="glass bg-black/40 p-3 md:p-8 rounded-2xl aspect-square flex items-center justify-center relative">
                      <div className="absolute top-2 left-2 bg-cyan-500/20 text-cyan-400 text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded">Current</div>
                      <img src={product.img} alt={product.name} className="w-full h-full object-contain mix-blend-screen" />
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-base md:text-2xl font-bold mb-2 leading-tight">{product.name}</h3>
                      <p className="text-cyan-400 text-lg md:text-xl font-bold">₹{product.discount ? (product.price * (1 - product.discount / 100)).toFixed(2) : product.price}</p>
                      {product.discount && <p className="text-gray-500 text-xs md:text-sm line-through">₹{product.price}</p>}
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <div>
                        <span className="text-gray-500 text-[10px] md:text-xs uppercase tracking-wider block mb-1">Brand</span>
                        <span className="font-medium text-sm md:text-base">{product.brand}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-[10px] md:text-xs uppercase tracking-wider block mb-1">Rating</span>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-cyan-400 fill-cyan-400" />
                          <span className="font-medium text-sm md:text-base">{product.rating}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500 text-[10px] md:text-xs uppercase tracking-wider block mb-1">Stock</span>
                        <span className={`text-sm ${product.stockStatus === 'In Stock' ? 'text-green-400' : 'text-orange-400'}`}>{product.stockStatus}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-[10px] md:text-xs uppercase tracking-wider block mb-2">Key Specs</span>
                        <ul className="space-y-2 text-sm text-gray-300">
                          {product.specs.map((spec, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 size={14} className="text-cyan-400 mt-0.5 shrink-0" />
                              <span className="leading-tight">{spec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <button 
                      onClick={() => { addToCart(product); setIsCompareModalOpen(false); }}
                      disabled={product.stockStatus === 'Out of Stock'}
                      className={`mt-auto w-full font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2
                        ${product.stockStatus === 'Out of Stock'
                          ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                          : 'bg-cyan-500/10 hover:bg-cyan-500 hover:text-black text-cyan-400'}`}
                    >
                      <ShoppingCart size={18} /> {product.stockStatus === 'Out of Stock' ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>

                  {/* Compare Product Column */}
                  <div className="flex flex-col gap-5 md:gap-6">
                    <div className="glass bg-black/40 p-3 md:p-8 rounded-2xl aspect-square flex items-center justify-center relative">
                      <div className="absolute top-2 right-2 bg-white/10 text-white text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded">Compare</div>
                      <img src={compareProduct.img} alt={compareProduct.name} className="w-full h-full object-contain mix-blend-screen" />
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-base md:text-2xl font-bold mb-2 leading-tight">{compareProduct.name}</h3>
                      <p className="text-cyan-400 text-lg md:text-xl font-bold">₹{compareProduct.discount ? (compareProduct.price * (1 - compareProduct.discount / 100)).toFixed(2) : compareProduct.price}</p>
                      {compareProduct.discount && <p className="text-gray-500 text-xs md:text-sm line-through">₹{compareProduct.price}</p>}
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <div>
                        <span className="text-gray-500 text-[10px] md:text-xs uppercase tracking-wider block mb-1">Brand</span>
                        <span className="font-medium text-sm md:text-base">{compareProduct.brand}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-[10px] md:text-xs uppercase tracking-wider block mb-1">Rating</span>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-cyan-400 fill-cyan-400" />
                          <span className="font-medium text-sm md:text-base">{compareProduct.rating}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500 text-[10px] md:text-xs uppercase tracking-wider block mb-1">Stock</span>
                        <span className={`text-sm ${compareProduct.stockStatus === 'In Stock' ? 'text-green-400' : 'text-orange-400'}`}>{compareProduct.stockStatus}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 text-[10px] md:text-xs uppercase tracking-wider block mb-2">Key Specs</span>
                        <ul className="space-y-2 text-sm text-gray-300">
                          {compareProduct.specs.map((spec, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 size={14} className="text-cyan-400 mt-0.5 shrink-0" />
                              <span className="leading-tight">{spec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <button 
                      onClick={() => { addToCart(compareProduct); setIsCompareModalOpen(false); }}
                      disabled={compareProduct.stockStatus === 'Out of Stock'}
                      className={`mt-auto w-full font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2
                        ${compareProduct.stockStatus === 'Out of Stock'
                          ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                          : 'bg-white/5 hover:bg-white/10 text-white'}`}
                    >
                      <ShoppingCart size={18} /> {compareProduct.stockStatus === 'Out of Stock' ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>

                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
