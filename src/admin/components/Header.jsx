import { Bell, Menu } from 'lucide-react';

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
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative text-gray-400 hover:text-white transition-colors p-1" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full" />
        </button>
      </div>
    </header>
  );
};

export default Header;