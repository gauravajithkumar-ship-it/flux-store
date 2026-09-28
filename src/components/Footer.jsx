import { Link } from 'react-router-dom';

const footerLinks = {
  Support: [
    { name: 'Help Center', path: '/contact' },
    { name: 'Return Policy', path: '/returns' }
  ],
  Company: [
    { name: 'About Us', path: '/about' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
    { name: 'Admin Panel', path: '/admin/login' } 
  ]
};

const Footer = () => {
  return (
    <footer className="border-t border-goldlux-orange/10 bg-[#0a0a0a] pt-12 sm:pt-20 pb-8 sm:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Responsive Grid System */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 mb-12 sm:mb-16 text-center sm:text-left">
          {Object.entries(footerLinks).map(([category, links]) => {
            const isSupport = category === 'Support';
            return (
              <div key={category} className="space-y-4 sm:space-y-6">
                <h4 className={`text-gray-100 font-semibold tracking-wide ${
                  isSupport ? 'text-xl sm:text-2xl' : 'text-sm sm:text-base'
                }`}>{category}</h4>
                <ul className={`flex flex-col text-gray-400 ${
                  isSupport ? 'gap-4 sm:gap-6 text-base sm:text-xl' : 'gap-3 sm:gap-4 text-xs sm:text-sm'
                }`}>
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        to={link.path} 
                        className={`transition-colors duration-200 ${
                          link.name === 'Admin Panel' 
                            ? 'text-gray-900 hover:text-goldlux-orange font-medium' 
                            : 'hover:text-goldlux-orange'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        
        {/* Responsive Footer Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 sm:pt-8 border-goldlux-orange/10 text-[10px] sm:text-xs text-gray-500 text-center sm:text-left">
          <p>© 2026 Flux Store Inc. All rights reserved.</p>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/privacy" className="hover:text-gray-100 transition-colors duration-200">Privacy</Link>
            <Link to="/terms" className="hover:text-gray-100 transition-colors duration-200">Terms</Link>
          </div>
        </div>

        {/* Large Typographic Logo */}
        <div className="flex justify-center mt-8 sm:mt-10 pt-8 sm:pt-10 border-t border-goldlux-orange/10">
          <span
            aria-hidden="true"
            className="flux-logo select-none"
          >
            Flux
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;