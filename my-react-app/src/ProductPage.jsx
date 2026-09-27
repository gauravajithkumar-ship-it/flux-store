import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Menu, X, ArrowLeft, Star, Check, Shield, Truck, RotateCcw,
  MapPin, Phone, Mail
} from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { products } from './data/products';
import ImageZoom from './components/ImageZoom';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImage, setActiveImage] = useState(0);

  const product = products.find(p => p.id === parseInt(id));

  useEffect(() => {
    setActiveImage(0);
  }, [id]);

  if (!product) {
    return (
      <div className="bg-midnight text-white min-h-screen flex flex-col items-center justify-center">
        <ShoppingBag className="h-16 w-16 text-chrysocolla mb-6" />
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-white/70 mb-8">The product you are looking for does not exist or has been removed.</p>
        <Link to="/" className="bg-chrysocolla text-midnight px-6 py-3 rounded-xl font-bold">
          Return to Home
        </Link>
      </div>
    );
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Contact', path: '#' }
  ];

  return (
    <div className="bg-midnight text-white min-h-screen font-sans">
      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-midnight/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-chrysocolla" />
              <span className="text-white font-bold text-xl tracking-tight">TechStore Pro</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} className="text-white/70 hover:text-chrysocolla transition-colors duration-300">
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button className="bg-chrysocolla text-midnight font-semibold px-6 py-2 rounded-2xl hover:brightness-110 transition-all duration-300 shadow-[0_0_15px_rgba(35,169,189,0.15)]">
                My Account
              </button>
            </div>

            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/5">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link key={link.name} to={link.path} className="text-white/70 hover:text-chrysocolla px-4 py-2">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center flex-wrap gap-2 text-sm text-white/50 mb-8">
          <button onClick={() => navigate(-1)} className="hover:text-chrysocolla flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </button>
          <span>/</span>
          <Link to="/" className="hover:text-chrysocolla">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-chrysocolla">Products</Link>
          <span>/</span>
          <span className="text-white/90 truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Image Section with Zoom */}
          <div className="space-y-6">
            <div className="bg-[#0a0d1c] border border-white/10 rounded-3xl p-4 sm:p-8 flex items-center justify-center relative">
              <div className="absolute top-4 left-4 z-10 bg-chrysocolla/20 text-chrysocolla backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-chrysocolla/30">
                Best Seller
              </div>
              <div className="w-full aspect-square">
                <ImageZoom src={product.images?.[activeImage] || product.image} alt={product.name} />
              </div>
            </div>
          
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                      activeImage === idx ? 'border-chrysocolla opacity-100' : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} - view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col space-y-8">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">{product.name}</h1>
             
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                  ))}
                  <span className="text-white/70 text-sm ml-2">({product.reviews} reviews)</span>
                </div>
                <span className="text-white/30">|</span>
                <span className={`text-sm font-medium flex items-center ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
                  {product.inStock ? <><Check className="w-4 h-4 mr-1" /> In Stock</> : 'Out of Stock'}
                </span>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0a0d1c] to-midnight border border-chrysocolla/20 shadow-[0_0_30px_rgba(35,169,189,0.05)]">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-white/50 text-sm sm:text-base font-medium mb-1">Deal Price</p>
                    <p className="text-4xl sm:text-5xl font-bold text-chrysocolla">₹{product.b2bPrice.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/50 text-sm font-medium mb-1">MRP</p>
                    <p className="text-xl sm:text-2xl text-white/70 line-through decoration-white/30">₹{product.retailPrice.toLocaleString()}</p>
                    <p className="text-green-400 text-sm font-bold mt-1 bg-green-400/10 inline-block px-2 py-1 rounded-md">
                      Save ₹{(product.retailPrice - product.b2bPrice).toLocaleString()}
                    </p>
                  </div>
                </div>
               
                <div className="border-t border-white/10 pt-5 flex justify-between items-center text-sm sm:text-base">
                  <span className="text-white/70 font-medium">Delivery:</span>
                  <span className="font-bold text-white bg-white/10 px-4 py-2 rounded-xl">Free & Fast Shipping</span>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <button className="bg-chrysocolla text-midnight font-bold text-lg py-4 rounded-2xl hover:brightness-110 transition-all duration-300 shadow-[0_0_15px_rgba(35,169,189,0.2)]">
                Add to Cart
              </button>
              <button className="border-2 border-chrysocolla text-chrysocolla font-bold text-lg py-4 rounded-2xl hover:bg-chrysocolla hover:text-midnight transition-all duration-300">
                Buy Now
              </button>
            </div>

            <div className="bg-[#0a0d1c] border border-white/10 rounded-2xl p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-white/80">
                <div className="flex items-start"> <Shield className="h-5 w-5 mr-3 text-chrysocolla shrink-0 mt-0.5" /> <span><strong>1 Year Warranty</strong><br/>Full coverage included</span> </div>
                <div className="flex items-start"> <Truck className="h-5 w-5 mr-3 text-chrysocolla shrink-0 mt-0.5" /> <span><strong>Fast Free Shipping</strong><br/>Delivered in 2-3 days</span> </div>
                <div className="flex items-start"> <RotateCcw className="h-5 w-5 mr-3 text-chrysocolla shrink-0 mt-0.5" /> <span><strong>7-Day Returns</strong><br/>Hassle-free return policy</span> </div>
                <div className="flex items-start"> <Check className="h-5 w-5 mr-3 text-chrysocolla shrink-0 mt-0.5" /> <span><strong>100% Authentic</strong><br/>Direct from brands</span> </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for extra details */}
        <div className="mt-20 border-t border-white/10 pt-10">
          <div className="flex space-x-6 sm:space-x-12 mb-8 border-b border-white/10 overflow-x-auto scrollbar-hide pb-1">
            {['description', 'specifications'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 capitalize font-bold text-lg sm:text-xl transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? 'text-chrysocolla border-b-2 border-chrysocolla' 
                    : 'text-white/40 hover:text-white/80'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="min-h-[250px]">
            {activeTab === 'description' ? (
              <div className="animate-in fade-in duration-500">
                <p className="text-white/80 text-lg leading-relaxed max-w-4xl font-light">
                  {product.description}
                </p>
                <div className="mt-8 grid sm:grid-cols-2 gap-8 max-w-4xl">
                   <div className="bg-[#0a0d1c] p-6 rounded-2xl border border-white/5">
                     <h3 className="text-chrysocolla font-bold mb-2">Premium Quality</h3>
                     <p className="text-white/60 text-sm">Crafted with top-tier materials and cutting-edge technology to ensure durability and a premium user experience.</p>
                   </div>
                   <div className="bg-[#0a0d1c] p-6 rounded-2xl border border-white/5">
                     <h3 className="text-chrysocolla font-bold mb-2">Box Contents</h3>
                     <p className="text-white/60 text-sm">Includes the main device, fast-charging adapter, premium cable, and quick start guide.</p>
                   </div>
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-x-12 gap-y-4 max-w-5xl animate-in fade-in duration-500">
                {product.specs && Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex flex-col sm:flex-row sm:justify-between py-4 border-b border-white/5">
                    <span className="text-white/50 mb-1 sm:mb-0 font-medium">{key}</span>
                    <span className="text-white font-medium sm:text-right">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Minimal */}
      <footer className="bg-[#0a0d1c] border-t border-white/5 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <ShoppingBag className="h-6 w-6 text-chrysocolla" />
            <span className="text-white/50 text-sm">© 2026 TechStore Pro. Your Ultimate Electronics Store.</span>
          </div>
          <div className="flex space-x-4">
             <a href="#" className="text-white/50 hover:text-chrysocolla"><FaFacebook className="h-5 w-5" /></a>
             <a href="#" className="text-white/50 hover:text-chrysocolla"><FaTwitter className="h-5 w-5" /></a>
             <a href="#" className="text-white/50 hover:text-chrysocolla"><FaInstagram className="h-5 w-5" /></a>
             <a href="#" className="text-white/50 hover:text-chrysocolla"><FaYoutube className="h-5 w-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductPage;