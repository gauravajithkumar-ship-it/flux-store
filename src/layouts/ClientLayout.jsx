import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';

const ClientLayout = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-x-clip selection:bg-cyan-500/30">
      {/* Background glowing blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-900/20 blur-[120px] animate-blob pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] animate-blob animation-delay-2000 pointer-events-none" />
      
      <Navbar />
      <CartDrawer />
      
      <main>
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default ClientLayout;
