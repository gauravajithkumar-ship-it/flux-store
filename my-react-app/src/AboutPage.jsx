import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, Menu, X, Users, Package, HeadphonesIcon, Truck,
  Award, Shield, Zap, Heart, Target, Eye, CheckCircle, Phone, Mail, MapPin
} from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const AboutPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const stats = [
    { number: '100K+', label: 'Happy Customers', icon: Users },
    { number: '10K+', label: 'Products Available', icon: Package },
    { number: '50+', label: 'Premium Brands', icon: Award },
    { number: '24/7', label: 'Customer Support', icon: HeadphonesIcon }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Every decision we make starts with our customers. Your satisfaction is our top priority.'
    },
    {
      icon: Shield,
      title: 'Authentic Products',
      description: 'We guarantee 100% genuine products sourced directly from authorized manufacturers.'
    },
    {
      icon: Zap,
      title: 'Fast Delivery',
      description: 'Lightning-fast shipping with real-time tracking to get your tech to you quickly.'
    },
    {
      icon: Award,
      title: 'Best Prices',
      description: 'Competitive pricing with exclusive deals and offers you won\'t find anywhere else.'
    }
  ];

  const team = [
    { name: 'Rajesh Kumar', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400' },
    { name: 'Priya Sharma', role: 'Head of Operations', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400' },
    { name: 'Amit Patel', role: 'Chief Technology Officer', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400' },
    { name: 'Sneha Reddy', role: 'Customer Success Lead', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400' }
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
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-white/70 hover:text-chrysocolla transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/products" className="text-white/70 hover:text-chrysocolla transition-colors duration-300">
                My Account
              </Link>
              <button className="bg-chrysocolla text-midnight font-semibold px-6 py-2 rounded-2xl hover:brightness-110 transition-all duration-300 shadow-[0_0_15px_rgba(35,169,189,0.15)]">
                Shop Now
              </button>
            </div>

            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/5">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-white/70 hover:text-chrysocolla transition-colors duration-300 px-4 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 bg-midnight overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-chrysocolla/5 via-transparent to-transparent"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-chrysocolla/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-chrysocolla/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-chrysocolla/10 text-chrysocolla text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-chrysocolla/20">
            About TechStore Pro
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
            Your Trusted Partner in
            <span className="block text-chrysocolla mt-2">Modern Electronics</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make premium technology accessible to everyone. 
            From smartphones to smart home devices, we bring you the best brands at unbeatable prices.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-10 w-10 text-chrysocolla mx-auto mb-4" />
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-midnight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-chrysocolla/10 text-chrysocolla text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-chrysocolla/20">
                Our Story
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6">
                Revolutionizing Electronics Shopping Since 2020
              </h2>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>
                  TechStore Pro was founded with a simple vision: to create a one-stop destination 
                  where technology enthusiasts can find the latest gadgets from trusted brands without 
                  compromising on quality or price.
                </p>
                <p>
                  What started as a small online store has grown into a leading electronics marketplace, 
                  serving over 100,000 happy customers across the country. We partner directly with 
                  manufacturers like Samsung, Sony, LG, boAt, and more to bring you authentic products 
                  at the best prices.
                </p>
                <p>
                  Our commitment to customer satisfaction, fast delivery, and genuine products has made 
                  us the preferred choice for tech-savvy shoppers looking for reliability and value.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800"
                  alt="Our Store"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-chrysocolla text-midnight p-6 rounded-2xl shadow-2xl">
                <div className="text-4xl font-bold">5+</div>
                <div className="text-sm font-semibold">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-[#0a0d1c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              What Drives Us
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Our core principles guide every decision we make and every interaction we have with our customers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-midnight border border-white/10 rounded-2xl p-8 hover:border-chrysocolla/50 transition-all duration-300 group">
              <div className="bg-chrysocolla/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-chrysocolla/20 transition-colors">
                <Target className="h-7 w-7 text-chrysocolla" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-white/70 leading-relaxed">
                To democratize access to premium technology by offering authentic products at competitive 
                prices, backed by exceptional customer service and fast, reliable delivery.
              </p>
            </div>

            <div className="bg-midnight border border-white/10 rounded-2xl p-8 hover:border-chrysocolla/50 transition-all duration-300 group">
              <div className="bg-chrysocolla/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-chrysocolla/20 transition-colors">
                <Eye className="h-7 w-7 text-chrysocolla" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-white/70 leading-relaxed">
                To become the most trusted and customer-centric electronics marketplace, setting new 
                standards for quality, authenticity, and shopping experience in the digital age.
              </p>
            </div>

            <div className="bg-midnight border border-white/10 rounded-2xl p-8 hover:border-chrysocolla/50 transition-all duration-300 group">
              <div className="bg-chrysocolla/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-chrysocolla/20 transition-colors">
                <Heart className="h-7 w-7 text-chrysocolla" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Our Values</h3>
              <p className="text-white/70 leading-relaxed">
                Integrity, innovation, and customer obsession. We believe in transparency, continuous 
                improvement, and building lasting relationships with our customers and partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-midnight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Why Choose TechStore Pro?
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              We go above and beyond to ensure you have the best shopping experience possible.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-[#0a0d1c] border border-white/10 rounded-2xl p-6 hover:border-chrysocolla/50 hover:scale-[1.02] transition-all duration-300 group"
              >
                <div className="bg-chrysocolla/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-chrysocolla/20 transition-colors">
                  <value.icon className="h-6 w-6 text-chrysocolla" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands We Partner With */}
      <section className="py-20 bg-[#0a0d1c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Trusted Brands We Carry
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              We partner with the world's leading electronics brands to bring you authentic products.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {['Samsung', 'Sony', 'LG', 'TCL', 'boAt', 'Noise', 'OnePlus', 'Realme', 'Godrej', 'Whirlpool', 'Haier', 'Apple'].map((brand) => (
              <div
                key={brand}
                className="bg-midnight border border-white/10 rounded-xl p-6 flex items-center justify-center hover:border-chrysocolla/50 transition-all duration-300 group"
              >
                <span className="text-white/60 font-bold text-lg group-hover:text-chrysocolla transition-colors">
                  {brand}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-midnight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              The passionate people behind TechStore Pro who make it all happen.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-[#0a0d1c] border border-white/10 rounded-2xl overflow-hidden hover:border-chrysocolla/50 hover:scale-[1.02] transition-all duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight to-transparent opacity-60"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-chrysocolla text-sm font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-chrysocolla/10 via-midnight to-midnight border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6">
            Ready to Experience the Difference?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust TechStore Pro for their electronics needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="bg-chrysocolla text-midnight font-semibold px-8 py-3 rounded-2xl hover:brightness-110 transition-all duration-300 shadow-[0_0_15px_rgba(35,169,189,0.3)]"
            >
              Shop Now
            </Link>
            <Link
              to="/contact"
              className="border-2 border-chrysocolla text-chrysocolla px-8 py-3 rounded-2xl hover:bg-chrysocolla hover:text-midnight transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-midnight border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ShoppingBag className="h-8 w-8 text-chrysocolla" />
                <span className="text-white font-bold text-xl tracking-tight">TechStore Pro</span>
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

            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-white/70">
                <li><Link to="/" className="hover:text-chrysocolla transition-colors duration-300">Home</Link></li>
                <li><Link to="/products" className="hover:text-chrysocolla transition-colors duration-300">Products</Link></li>
                <li><Link to="/about" className="hover:text-chrysocolla transition-colors duration-300">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-chrysocolla transition-colors duration-300">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-chrysocolla transition-colors duration-300">Help Center</a></li>
                <li><a href="#" className="hover:text-chrysocolla transition-colors duration-300">Contact Support</a></li>
                <li><a href="#" className="hover:text-chrysocolla transition-colors duration-300">Returns Policy</a></li>
                <li><a href="#" className="hover:text-chrysocolla transition-colors duration-300">Order Tracking</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-chrysocolla transition-colors duration-300">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-chrysocolla transition-colors duration-300">Terms of Service</a></li>
                <li><a href="#" className="hover:text-chrysocolla transition-colors duration-300">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-chrysocolla transition-colors duration-300">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-white/70 text-sm">
              &copy; 2026 TechStore Pro. All rights reserved.
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

export default AboutPage;