import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import ClientLayout from './layouts/ClientLayout';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderHistory from './pages/OrderHistory';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ContactUs from './pages/ContactUs';
import ReturnPolicy from './pages/ReturnPolicy';
import GiftCards from './pages/GiftCards';
import B2BEnquiry from './pages/B2BEnquiry';

// Admin Imports
import AdminLayout from './admin/layouts/AdminLayout';
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminProducts from './admin/pages/AdminProducts';
import AdminOrders from './admin/pages/AdminOrders';
import AdminCustomers from './admin/pages/AdminCustomers';
import AdminInvoices from './admin/pages/AdminInvoices';
import AdminGiftCards from './admin/pages/AdminGiftCards';
import AdminCoupons from './admin/pages/AdminCoupons';
import AdminReports from './admin/pages/AdminReports';
import AdminContacts from './admin/pages/AdminContacts';
import AdminB2BEnquiries from './admin/pages/AdminB2BEnquiries';
import AdminAnnouncements from './admin/pages/AdminAnnouncements';
import AdminSettings from './admin/pages/AdminSettings';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Client Routes */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/gift-cards" element={<GiftCards />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/b2b-enquiry" element={<B2BEnquiry />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/returns" element={<ReturnPolicy />} />
        </Route>

        {/* Admin Login Route (No Layout) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="gift-cards" element={<AdminGiftCards />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="invoices" element={<AdminInvoices />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="b2b-enquiries" element={<AdminB2BEnquiries />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

