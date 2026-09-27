import React, { useState } from 'react';
import {
  ShoppingBag,
  Menu,
  X,
  Users,
  Package,
  HeadphonesIcon,
  Truck,
  ArrowRight,
  Smartphone,
  Phone,
  Mail,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { products } from './data/products';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    interests: '',
    email: '',
    budget: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter subscribed:', formData);
  };

  // Product categories with models
  const productCategories = [
    {
      name: 'Samsung',
      items: ['Galaxy A55', 'Galaxy A57', 'Galaxy A36', 'Crystal TV', 'EcoBubble Washer']
    },
    {
      name: 'Sony',
      items: ['BRAVIA 6 44"', 'BRAVIA 6 55"', 'BRAVIA 6 65"', 'BRAVIA 6 77"', 'WF-C500 Earbuds']
    },
    {
      name: 'LG',
      items: ['55" Smart TV', '8kg Front Load Washer', 'OLED TV', 'Soundbar']
    },
    {
      name: 'TCL',
      items: ['55" Google TV', '65" 4K TV', 'Soundbar 200']
    },
    {
      name: 'Audio',
      items: ['boAt Earbuds', 'Noise Buds', 'OnePlus Buds', 'Realme Buds', 'Soundbars', 'Neckbands']
    },
    {
      name: 'Appliances',
      items: ['Washing Machines', 'Refrigerators', 'Haier Fridge', 'Godrej Washer', 'Whirlpool Washer']
    }
  ];

  const footerLinks = {
    company: ['About Us', 'Careers', 'Blog', 'Press Kit'],
    quickLinks: ['Products', 'Offers', 'My Orders', 'Affiliate Program'],
    support: ['Help Center', 'Contact Support', 'Returns Policy', 'Order Tracking'],
    legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security']
  };

  const stats = [
    { icon: Users, label: '100,000+ Happy Customers' },
    { icon: Package, label: '10,000+ Products' },
    { icon: HeadphonesIcon, label: '24/7 Customer Support' },
    { icon: Truck, label: 'Free & Fast Shipping' }
  ];

  return (
    <div className="bg-midnight text-white min-h-screen font-sans">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
          
          @keyframes float { 
            0%, 100% { transform: translateY(0px); } 
            50% { transform: translateY(-20px); } 
          } 
          .animate-float { animation: float 4s ease-in-out infinite; } 
          html { scroll-behavior: smooth; } 
          .dropdown-menu { 
            opacity: 0; 
            visibility: hidden; 
            transform: translateY(-10px); 
            transition: all 0.3s ease; 
          } 
          .dropdown-menu.active { 
            opacity: 1; 
            visibility: visible; 
            transform: translateY(0); 
          }
          .font-elegant-serif {
            font-family: 'Playfair Display', 'Cormorant Garamond', serif;
            font-weight: 500;
            letter-spacing: 0.02em;
          }
        `}
      </style>

      {/* Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-midnight/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-chrysocolla" />
              <span className="text-white font-bold text-xl tracking-tight">Flux Store</span>
            </div>

            {/* Desktop Navigation with Dropdowns */}
            <div className="hidden lg:flex items-center space-x-1">
              {productCategories.map((category) => (
                <div 
                  key={category.name}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(category.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button 
                    className="flex items-center space-x-1 text-white/70 hover:text-chrysocolla transition-colors duration-300 px-3 py-2 rounded-lg"
                  >
                    <span>{category.name}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === category.name ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className={`dropdown-menu absolute top-full left-0 mt-1 w-56 bg-[#0a0d1c] border border-white/10 rounded-xl shadow-2xl overflow-hidden ${activeDropdown === category.name ? 'active' : ''}`}>
                    <div className="py-2">
                      {category.items.map((item, index) => (
                        <Link
                          key={index}
                          to="/products"
                          className="block px-4 py-2.5 text-sm text-white/70 hover:text-chrysocolla hover:bg-white/5 transition-colors duration-200"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <a href="#" className="text-white/70 hover:text-chrysocolla transition-colors duration-300">
                My Account
              </a>
              <button className="bg-chrysocolla text-midnight font-semibold px-6 py-2 rounded-2xl hover:brightness-110 transition-all duration-300 shadow-[0_0_15px_rgba(35,169,189,0.15)]">
                Shop Now
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/5">
              <div className="flex flex-col space-y-2">
                {productCategories.map((category) => (
                  <div key={category.name} className="border-b border-white/5 pb-2">
                    <button 
                      className="w-full text-left text-white/70 hover:text-chrysocolla transition-colors duration-300 px-4 py-2 font-semibold"
                    >
                      {category.name}
                    </button>
                    <div className="pl-4 space-y-1">
                      {category.items.map((item, index) => (
                        <Link
                          key={index}
                          to="/products"
                          className="block px-4 py-1.5 text-sm text-white/50 hover:text-chrysocolla transition-colors duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex flex-col space-y-2 px-4 pt-2">
                  <a href="#" className="text-white/70 hover:text-chrysocolla transition-colors duration-300">
                    My Account
                  </a>
                  <button className="bg-chrysocolla text-midnight font-semibold px-6 py-3 rounded-2xl hover:brightness-110 transition-all duration-300 shadow-[0_0_15px_rgba(35,169,189,0.15)]">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center bg-midnight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-elegant-serif tracking-tight text-white leading-tight">
                Great electronics at prices that actually make sense
              </h1>
              <p className="text-lg text-white/70 max-w-lg">
                Because smart shopping feels just as good as smart tech.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-chrysocolla text-midnight font-semibold px-8 py-3 rounded-2xl hover:brightness-110 transition-all duration-300 shadow-[0_0_15px_rgba(35,169,189,0.15)]">
                  Shop Now
                </button>
                <button className="border-2 border-chrysocolla text-chrysocolla px-8 py-3 rounded-2xl hover:bg-chrysocolla hover:text-midnight transition-all duration-300">
                  View Deals
                </button>
              </div>
            </div>

            <div className="relative flex justify-center items-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 animate-float">
                <div className="absolute inset-0 bg-chrysocolla/10 rounded-full blur-3xl"></div>
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="w-full h-full rounded-3xl bg-gradient-to-br from-chrysocolla/20 to-transparent p-1">
                    <div className="w-full h-full rounded-3xl bg-midnight flex items-center justify-center border border-chrysocolla/20">
                      <Smartphone className="w-24 h-24 sm:w-32 sm:h-32 text-chrysocolla" />
                    </div>
                  </div>
                </div>
                <div className="absolute -inset-4 bg-chrysocolla/5 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Arch Carousel Section */}
      <section className="py-20 bg-midnight overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Featured Products Showcase
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Explore our premium electronics collection in an immersive 3D experience
            </p>
          </div>

          {/* 3D Carousel Container */}
          <div className="carousel-container relative w-full h-[500px] flex items-center justify-center">
            <div className="carousel-rotator">
              {/* Carousel Item 1 */}
              <div className="carousel-item" style={{ transform: 'rotateY(0deg) translateZ(400px)' }}>
                <div className="carousel-item-inner">
                  <div className="carousel-placeholder">
                    <div>
                      <img src="https://suprememobiles.in/cdn/shop/files/1_4e6d13c2-fa67-4eb5-a7a4-7735fdaf1e16.png?v=1701498274&width=1100" alt="Smartphone" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Carousel Item 2 */}
              <div className="carousel-item" style={{ transform: 'rotateY(45deg) translateZ(400px)' }}>
                <div className="carousel-item-inner">
                  <div className="carousel-placeholder">
                    <div>
                      <img src="https://aws-obg-image-lb-3.tcl.com/content/dam/brandsite/region/uk/products/tv/s-series/sf560k/image/01-40-sf560uk.jpg?t=1760089717455&w=800&webp=undefined&dpr=2.625&rendition=1068" alt="TV" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Carousel Item 3 */}
              <div className="carousel-item" style={{ transform: 'rotateY(90deg) translateZ(400px)' }}>
                <div className="carousel-item-inner">
                  <div className="carousel-placeholder">
                    <div>
                      <img src="https://media.tatacroma.com/Croma%20Assets/Entertainment/Television/Images/273157_0_dqyjpj.png" alt="TV" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Carousel Item 4 */}
              <div className="carousel-item" style={{ transform: 'rotateY(135deg) translateZ(400px)' }}>
                <div className="carousel-item-inner">
                  <div className="carousel-placeholder">
                    <div>
                      <img src="https://mahajanelectronics.com/cdn/shop/files/71mIymLQf0L._SL1500.jpg?v=1767840605&width=1132" alt="washing machine" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Carousel Item 5 */}
              <div className="carousel-item" style={{ transform: 'rotateY(180deg) translateZ(400px)' }}>
                <div className="carousel-item-inner">
                  <div className="carousel-placeholder">
                    <div>
                      <img src="https://cdn.jiostore.online/v2/jmd-asp/jdprod/wrkr/products/pictures/item/free/resize-w:450/haier/494510499/0/WSjziAweC2-33e3f0c6-e265-49b9-ad30-627cfed321f4.jpeg" alt="single door fridge" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Carousel Item 6 */}
              <div className="carousel-item" style={{ transform: 'rotateY(225deg) translateZ(400px)' }}>
                <div className="carousel-item-inner">
                  <div className="carousel-placeholder">
                    <div>
                      <img src="https://rukminim2.flixcart.com/image/480/640/xif0q/headphone/s/b/v/black-earbuds-true-wireless-stereo-noise-cancelling-shristraders-original-imahgg4amsxwxa7t.jpeg?q=90" alt="earbuds" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Carousel Item 7 */}
              <div className="carousel-item" style={{ transform: 'rotateY(270deg) translateZ(400px)' }}>
                <div className="carousel-item-inner">
                  <div className="carousel-placeholder">
                    <div>
                      <img src="https://tiimg.tistatic.com/fp/1/009/554/hd-sbw150-soundbar-with-subwoofer-685.jpg" alt="soundbar" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Carousel Item 8 */}
              <div className="carousel-item" style={{ transform: 'rotateY(315deg) translateZ(400px)' }}>
                <div className="carousel-item-inner">
                  <div className="carousel-placeholder">
                    <div>
                      <img src="https://m.media-amazon.com/images/I/61Z6seRdkuL._AC_UF1000,1000_QL80_.jpg" alt="neckband" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <p className="text-white/50 text-sm">
              Hover over the carousel to pause rotation
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Stats Bar */}
      <section className="bg-white/5 border-y border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-2">
                <stat.icon className="h-8 w-8 text-chrysocolla" />
                <span className="text-white font-semibold">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Product Catalog */}
      <section className="py-20 bg-midnight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white">Trending Electronics</h2>
            <Link to="/products" className="text-chrysocolla hover:underline flex items-center">
              View All Products <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="bg-[#0a0d1c] border border-white/10 rounded-2xl p-4 hover:scale-[1.02] hover:border-chrysocolla/50 transition-all duration-300 group relative overflow-hidden block"
              >
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <span className="absolute top-2 left-2 bg-chrysocolla/10 text-chrysocolla text-xs font-semibold px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                <h3 className="text-white font-semibold mb-2">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-white/70 text-sm line-through">MRP: ${product.retailPrice}</span>
                    <span className="text-chrysocolla font-bold block">Deal: ${product.b2bPrice}</span>
                  </div>
                  <button className="bg-chrysocolla text-midnight px-4 py-2 rounded-xl text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-20 bg-midnight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-12">Exclusive Online Offers</h2>
        
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-midnight to-[#0a0d1c] border border-white/10 rounded-2xl p-8 shadow-[0_0_15px_rgba(35,169,189,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-chrysocolla/5 rounded-full blur-3xl"></div>
              <div className="relative">
                <span className="bg-chrysocolla/10 text-chrysocolla text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                  Limited Time
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">Smartphone Mega Sale</h3>
                <p className="text-white/70 mb-4">Get 15% off on premium smartphones and accessories</p>
                <div className="flex items-center space-x-2 mb-6">
                  <span className="text-3xl font-bold text-chrysocolla">15%</span>
                  <span className="text-white/70">OFF</span>
                </div>
                <button className="bg-chrysocolla text-midnight font-semibold px-6 py-3 rounded-2xl hover:brightness-110 transition-all duration-300">
                  Claim Offer
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-midnight to-[#0a0d1c] border border-white/10 rounded-2xl p-8 shadow-[0_0_15px_rgba(35,169,189,0.15)] relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-chrysocolla/5 rounded-full blur-3xl"></div>
              <div className="relative">
                <span className="bg-chrysocolla/10 text-chrysocolla text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4">
                  Flash Sale
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">Appliance Clearance</h3>
                <p className="text-white/70 mb-4">Up to 30% off on premium home appliances</p>
                <div className="flex items-center space-x-2 mb-6">
                  <span className="text-3xl font-bold text-chrysocolla">30%</span>
                  <span className="text-white/70">OFF</span>
                </div>
                <button className="bg-chrysocolla text-midnight font-semibold px-6 py-3 rounded-2xl hover:brightness-110 transition-all duration-300">
                  Claim Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-[#0a0d1c] border-y border-white/5 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-4">Ready to Upgrade Your Tech?</h2>
            <p className="text-white/70">
              Subscribe to our newsletter to unlock exclusive discounts and early access to new arrivals.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="bg-midnight border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/50 focus:border-chrysocolla focus:outline-none transition-colors duration-300"
                required
              />
              <select
                name="interests"
                value={formData.interests}
                onChange={handleInputChange}
                className="bg-midnight border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/50 focus:border-chrysocolla focus:outline-none transition-colors duration-300 appearance-none"
                required
              >
                <option value="">Shopping Preferences</option>
                <option value="smartphones">Smartphones</option>
                <option value="laptops">Laptops & PCs</option>
                <option value="appliances">Home Appliances</option>
                <option value="gadgets">Audio & Gadgets</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-midnight border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/50 focus:border-chrysocolla focus:outline-none transition-colors duration-300"
                required
              />
              <select
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="bg-midnight border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/50 focus:border-chrysocolla focus:outline-none transition-colors duration-300 appearance-none"
                required
              >
                <option value="">Budget Range</option>
                <option value="under-500">Under $500</option>
                <option value="500-1000">$500 - $1,000</option>
                <option value="1000-2000">$1,000 - $2,000</option>
                <option value="2000-plus">$2,000+</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-chrysocolla text-midnight font-semibold py-4 rounded-2xl hover:brightness-110 transition-all duration-300 shadow-[0_0_15px_rgba(35,169,189,0.15)]"
            >
              Get Exclusive Deals
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-midnight border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ShoppingBag className="h-8 w-8 text-chrysocolla" />
                <span className="text-white font-bold text-xl tracking-tight">Flux Store</span>
              </div>
              <p className="text-white/70 text-sm mb-4">
                Your trusted online destination for premium electronics and smart appliances.
              </p>
              <div className="space-y-2 text-sm text-white/70">
                <p className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-chrysocolla" />
                  123 Tech Park, Silicon Valley
                </p>
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-chrysocolla" />
                  +1 (555) 123-4567
                </p>
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-chrysocolla" />
                  support@techstorepro.com
                </p>
              </div>
            </div>

            {/* Navigation Links - Moved from navbar */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-white/70">
                <li><Link to="/" className="hover:text-chrysocolla transition-colors duration-300">Home</Link></li>
                <li><Link to="/products" className="hover:text-chrysocolla transition-colors duration-300">Products</Link></li>
                <li><Link to="/about" className="hover:text-chrysocolla transition-colors duration-300">About Us</Link></li>
                <li><a href="#contact" className="hover:text-chrysocolla transition-colors duration-300">Contact</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-white/70">
                {footerLinks.company.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-chrysocolla transition-colors duration-300">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-white/70">
                {footerLinks.support.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-chrysocolla transition-colors duration-300">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-white/70">
                {footerLinks.legal.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-chrysocolla transition-colors duration-300">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-white/70 text-sm">
              &copy; 2026 Flux Store. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <a href="#" className="text-white/70 hover:text-chrysocolla transition-colors duration-300">
                <FaFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-chrysocolla transition-colors duration-300">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-chrysocolla transition-colors duration-300">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-chrysocolla transition-colors duration-300">
                <FaYoutube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;