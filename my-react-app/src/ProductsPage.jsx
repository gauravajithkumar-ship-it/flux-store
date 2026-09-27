import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, Filter } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { products } from './data/products';

const ProductsPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [zoomedProduct, setZoomedProduct] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
   
    { name: 'Contact', path: '#' }
  ];

  const categories = ['All', 'Smartphones', 'Televisions', 'Home Appliances', 'Audio'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleMouseMove = (e, productId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
    setZoomedProduct(productId);
  };

  const handleMouseLeave = () => {
    setZoomedProduct(null);
  };

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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">All Electronics</h1>
        <p className="text-white/70 mb-8 max-w-3xl">Browse our complete inventory of {products.length} items. All items are in stock and ready for fast delivery.</p>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0d1c] border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white placeholder:text-white/50 focus:border-chrysocolla focus:outline-none transition-colors duration-300"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-chrysocolla text-midnight font-semibold'
                    : 'bg-[#0a0d1c] text-white/70 border border-white/10 hover:border-chrysocolla/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <p className="text-white/50 text-sm mb-6">Showing {filteredProducts.length} products</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="bg-[#0a0d1c] border border-white/10 rounded-2xl p-4 hover:scale-[1.02] hover:border-chrysocolla/50 transition-all duration-300 group relative overflow-hidden block flex flex-col h-full"
              onMouseMove={(e) => handleMouseMove(e, product.id)}
              onMouseLeave={handleMouseLeave}
            >
              <div 
                className="relative overflow-hidden rounded-xl mb-4 aspect-square cursor-zoom-in"
                style={{
                  backgroundImage: zoomedProduct === product.id ? `url(${product.image})` : 'none',
                  backgroundPosition: zoomedProduct === product.id ? `${mousePosition.x}% ${mousePosition.y}%` : 'center',
                  backgroundSize: zoomedProduct === product.id ? '200%' : 'cover',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-full object-cover rounded-xl transition-opacity duration-200 ${
                    zoomedProduct === product.id ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span className="absolute top-2 left-2 bg-chrysocolla/10 text-chrysocolla text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md">
                  {product.category}
                </span>
                {zoomedProduct === product.id && (
                  <div className="absolute bottom-2 right-2 bg-chrysocolla/20 text-chrysocolla backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold border border-chrysocolla/30">
                    🔍 Zoom
                  </div>
                )}
              </div>
              <h3 className="text-white font-semibold mb-2 flex-grow text-sm">{product.name}</h3>
              <div className="flex justify-between items-end mt-auto">
                <div>
                  <span className="text-white/70 text-xs line-through block">MRP: ₹{product.retailPrice.toLocaleString()}</span>
                  <span className="text-chrysocolla font-bold block">Deal: ₹{product.b2bPrice.toLocaleString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/50 text-lg">No products found matching your criteria.</p>
          </div>
        )}
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

export default ProductsPage;