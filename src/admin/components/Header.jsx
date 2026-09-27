import { Search, Bell, Menu } from 'lucide-react';

const Header = ({ onMenuClick }) => {
  return (
    <header className="h-16 bg-black border-b border-white/10 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40 w-full">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Sidebar Hamburger Toggle Target Trigger */}
        <button 
          onClick={onMenuClick}
          className="md:hidden text-gray-400 hover:text-white transition-colors p-1"
          aria-label="Toggle Menu"
        >
          <Menu size={20} />
        </button>
        
        {/* Global Search Bar */}
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search products, orders, or customers..."
            className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-colors"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Small Screen Mobile Search Button Fallback Icon */}
        <button className="sm:hidden text-gray-400 hover:text-white transition-colors p-1" aria-label="Search">
          <Search size={20} />
        </button>
        
        <button className="relative text-gray-400 hover:text-white transition-colors p-1" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full" />
        </button>
      </div>
    </header>
  );
};

export default Header;