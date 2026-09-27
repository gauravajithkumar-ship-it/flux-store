import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Briefcase, 
  FileText, 
  Ticket, 
  BarChart2, 
  Settings,
  LogOut,
  X,
  MessageSquare,
  Megaphone,
  Gift
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Gift Cards', path: '/admin/gift-cards', icon: Gift },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Invoices', path: '/admin/invoices', icon: FileText },
    { name: 'Coupons', path: '/admin/coupons', icon: Ticket },
    { name: 'Reports', path: '/admin/reports', icon: BarChart2 },
    { name: 'Enquiries', path: '/admin/contacts', icon: MessageSquare },
    { name: 'B2B Enquiries', path: '/admin/b2b-enquiries', icon: Briefcase },
    { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    navigate('/admin/login');
  };

  return (
    <aside 
      className={`w-64 bg-black border-r border-white/10 h-screen fixed left-0 top-0 flex flex-col z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Branding and Close Icon Wrapper */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <Link to="/admin" className="text-xl font-bold tracking-tight text-white" onClick={() => setIsOpen(false)}>
          <span className="text-cyan-400">Flux</span> Admin
        </Link>
        <button 
          onClick={() => setIsOpen(false)} 
          className="md:hidden text-gray-400 hover:text-white transition-colors p-1"
          aria-label="Close Sidebar"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Navigation Items Link List Container */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-cyan-500/10 text-cyan-400' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-cyan-400' : 'text-gray-400'} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      {/* Profile Info & Logout Footer */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5">
          <div className="w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center border border-cyan-500/30 shrink-0">
            <span className="text-cyan-400 font-bold text-sm">FA</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">Flux Admin</p>
            <p className="text-xs text-gray-500 truncate">Super Admin</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all text-left"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;