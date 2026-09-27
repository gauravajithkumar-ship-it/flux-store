import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, CheckCircle2, ShieldCheck, CreditCard, Landmark, Wallet, Truck, AlertCircle, LogIn, LogOut, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Invoice from '../components/Invoice';
import { generateInvoicePdf } from '../utils/generateInvoicePdf';

const Checkout = () => {
  const navigate = useNavigate();
  const invoiceRef = useRef(null);
  const {
    cartItems,
    subtotal,
    SHIPPING_COST,
    taxAmount,
    couponDiscount,
    total,
    clearCart,
    appliedCoupon,
    getItemPrice
  } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pin: '',
  });

  const { user, isAuthenticated, signIn, signOut } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('processing');
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.username || user.full_name || '',
      }));
    }
  }, [user]);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    const { error: loginErr } = await signIn(loginForm.username.trim(), loginForm.password);
    if (loginErr) {
      setLoginError(loginErr.message || 'Invalid username or password.');
    } else {
      setLoginForm({ username: '', password: '' });
    }
    setIsLoggingIn(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setLoginError('Login Required: please sign in before checkout.');
      return;
    }
    if (paymentMethod !== 'COD') {
      setShowPayment(true);
      setPaymentStatus('processing');
      setTimeout(() => {
        setPaymentStatus('success');
        setTimeout(() => {
          setShowPayment(false);
          processOrder();
        }, 1500);
      }, 2000);
    } else {
      processOrder();
    }
  };

  const processOrder = async () => {
    setIsProcessing(true);
    setError(null);
    
    const orderDetails = {
      orderId: 'FLX' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString(),
      customer: formData,
      items: cartItems,
      paymentMethod,
      subtotal,
      shipping: SHIPPING_COST,
      gst: taxAmount,
      discount: couponDiscount,
      total,
      appliedCoupon: appliedCoupon?.code
    };

    try {
      // 1. Insert into adminOrders
      const { error: orderError } = await supabase.from('adminOrders').insert({
        id: orderDetails.orderId,
        customer_name: orderDetails.customer.name,
        customer_email: orderDetails.customer.email,
        customer_mobile: orderDetails.customer.mobile,
        shipping_address: orderDetails.customer,
        items: orderDetails.items,
        payment_method: orderDetails.paymentMethod,
        subtotal: orderDetails.subtotal,
        shipping_cost: orderDetails.shipping,
        gst_amount: orderDetails.gst,
        discount: orderDetails.discount,
        total: orderDetails.total,
        user_id: user?.id || null,
        status: 'Pending'
      });

      if (orderError) throw new Error(`Order insertion failed: ${orderError.message}`);

      // 2. Insert into adminInvoices
      const invoiceId = 'INV-' + Math.floor(100000 + Math.random() * 900000);
      const { error: invoiceError } = await supabase.from('adminInvoices').insert({
        id: invoiceId,
        order_id: orderDetails.orderId,
        customer_name: orderDetails.customer.name,
        invoice_type: 'B2C',
        total_amount: orderDetails.total,
        gst_amount: orderDetails.gst,
        status: 'Generated'
      });

      if (invoiceError) throw new Error(`Invoice insertion failed: ${invoiceError.message}`);

      // 3. Generate PDF client-side and send invoice email (if email is provided)
      if (orderDetails.customer.email) {
        try {
          const emailOrder = { ...orderDetails, invoiceId };
          let pdfBase64 = null;
          if (emailOrder.customer.email) {
            setInvoiceOrder(emailOrder);
            await new Promise((resolve) => setTimeout(resolve, 300));
            if (invoiceRef.current) {
              const pdf = await generateInvoicePdf(invoiceRef.current);
              pdfBase64 = pdf.output('datauristring');
            }
          }

          const res = await fetch('http://localhost:5000/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: orderDetails.customer.email,
              orderDetails: emailOrder,
              pdfBase64,
              pdfFilename: `Invoice-${orderDetails.orderId}.pdf`,
            }),
          });

          if (!res.ok) {
            console.error('Email send failed:', await res.text());
          }
        } catch (emailErr) {
          console.error('Failed to send invoice email:', emailErr);
        }
      }

      // Success
      clearCart();
      navigate('/order-success', { state: { order: { ...orderDetails, invoiceId } } });

    } catch (err) {
      console.error('Checkout failed:', err);
      setError(err.message || 'An error occurred while processing your order.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-28 sm:pt-32 pb-20 px-4 sm:px-6 md:px-12 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-white mb-4">Your Cart is Empty</h2>
        <Link
          to="/products"
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          <ArrowLeft size={20} />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-20 px-4 sm:px-6 md:px-12 bg-background">
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-gray-900 border border-white/10 p-8 rounded-3xl max-w-sm w-full flex flex-col items-center">
            {paymentStatus === 'processing' ? (
              <>
                <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-bold text-white mb-2">Processing Payment</h3>
                <p className="text-gray-400 text-center">Please don't close this window or press back.</p>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">Payment Successful!</h3>
                <p className="text-gray-400 text-center">Redirecting to order confirmation...</p>
              </>
            )}
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <ShieldCheck className="text-cyan-400" />
          Secure Checkout
        </h1>

        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Forms */}
          <div className="w-full lg:w-2/3 space-y-8">
            
            {/* Delivery Address */}
            <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/5 bg-black/40 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-6">Delivery Address</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Full Name *</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Mobile Number *</label>
                  <input required type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="+91 98765 43210" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-400">Email Address (Optional)</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="john@example.com" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-400">Address Line *</label>
                  <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="House/Flat No., Building Name, Street" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">City *</label>
                  <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="Mumbai" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">State *</label>
                  <input required type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="Maharashtra" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">PIN Code *</label>
                  <input required type="text" name="pin" value={formData.pin} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="400001" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="glass-panel rounded-3xl p-6 md:p-8 border border-white/5 bg-black/40 backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-6">Payment Method</h2>
              <div className="space-y-4">
                {[
                  { id: 'UPI', label: 'UPI (GPay, PhonePe, Paytm)', icon: Wallet },
                  { id: 'CARD', label: 'Credit / Debit Card', icon: CreditCard },
                  { id: 'NETBANKING', label: 'Net Banking', icon: Landmark },
                  { id: 'COD', label: 'Cash on Delivery (COD)', icon: Truck },
                ].map((method) => (
                  <label key={method.id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === method.id ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-cyan-500 bg-gray-700 border-gray-600 focus:ring-cyan-500 focus:ring-2"
                    />
                    <method.icon size={20} className={paymentMethod === method.id ? 'text-cyan-400' : 'text-gray-400'} />
                    <span className={`font-medium ${paymentMethod === method.id ? 'text-white' : 'text-gray-300'}`}>{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Link to="/cart" className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-2 transition-colors w-fit">
              <ArrowLeft size={20} />
              Back to Cart
            </Link>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="glass-panel rounded-3xl p-5 sm:p-6 md:p-8 border border-white/5 bg-black/40 backdrop-blur-xl lg:sticky lg:top-32">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map(item => {
                  const discountedPrice = getItemPrice(item);
                  return (
                    <div key={item.id + (item.custom_amount || '')} className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white/5 p-1 shrink-0">
                          <img src={item.img || item.image} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-gray-300 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-white shrink-0">{formatPrice(discountedPrice * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4 text-sm mb-6 border-y border-white/10 py-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400">
                  <span>GST (18%)</span>
                  <span className="text-white">{formatPrice(taxAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className={SHIPPING_COST === 0 ? "text-emerald-400" : "text-white"}>
                    {SHIPPING_COST === 0 ? 'Free' : formatPrice(SHIPPING_COST)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-6">
                <span className="text-lg font-medium text-gray-300">Total</span>
                <span className="text-3xl font-bold text-white">{formatPrice(total)}</span>
              </div>

              {/* Login Required — directly under Order Summary, before checkout */}
              <div className="mb-6 border-t border-white/10 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <LogIn size={16} className="text-cyan-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                    {isAuthenticated ? 'Logged In' : 'Login Required'}
                  </h3>
                </div>

                {isAuthenticated ? (
                  <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-2 min-w-0">
                      <User size={16} className="text-emerald-400 shrink-0" />
                      <p className="text-sm text-emerald-300 truncate">
                        {user?.username || user?.full_name || 'Customer'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={signOut}
                      className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1 shrink-0"
                    >
                      <LogOut size={12} /> Sign out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      required
                      autoComplete="username"
                      placeholder="Username"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && !isLoggingIn && handleLogin(e)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    <input
                      type="password"
                      required
                      autoComplete="current-password"
                      placeholder="Password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && !isLoggingIn && handleLogin(e)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    {loginError && (
                      <p className="text-xs text-rose-400 flex items-center gap-1">
                        <AlertCircle size={12} className="shrink-0" /> {loginError}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => handleLogin()}
                      disabled={isLoggingIn}
                      className="w-full bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoggingIn ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <LogIn size={16} />
                      )}
                      {isLoggingIn ? 'Signing in...' : 'Sign In to Continue'}
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing || !isAuthenticated}
                className={`w-full font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                  !isAuthenticated
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed opacity-70'
                    : isProcessing
                      ? 'bg-cyan-600 text-black opacity-70 cursor-not-allowed'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.3)] transform hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <CheckCircle2 size={20} />
                )}
                {isProcessing
                  ? 'Processing Order...'
                  : !isAuthenticated
                    ? 'Login Required'
                    : 'Place Order'}
              </button>
              
              <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center gap-1">
                <ShieldCheck size={14} /> Safe and secure payments
              </p>
            </div>
          </div>
        </form>
      </div>

      {/* Hidden invoice used to generate the PDF for email */}
      {invoiceOrder && (
        <div className="fixed -left-[99999px] top-0" aria-hidden="true">
          <Invoice ref={invoiceRef} order={invoiceOrder} className="w-[794px]" />
        </div>
      )}
    </div>
  );
};

export default Checkout;
