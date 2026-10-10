import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Package, LogIn, Truck, ShieldCheck, MapPin, Phone, Mail, ChevronDown, ChevronUp,
  ClipboardList, BadgeCheck, PackageCheck, CheckCircle2, Download, Loader2, Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { normalizeStatus, getStepIndex } from '../utils/orderStatus';

const STATUS_STYLES = {
  'Order Received': 'bg-gray-500/10 text-gray-300 border-gray-500/30',
  'Payment Verified': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  'Packing & Quality Check': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  'Successfully Delivered': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  Cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
};

const TRACKER_STEPS = [
  { label: 'Order Received', color: 'gray', icon: ClipboardList },
  { label: 'Payment Verified', color: 'blue', icon: BadgeCheck },
  { label: 'Packing & Quality Check', color: 'orange', icon: PackageCheck },
  { label: 'Successfully Delivered', color: 'green', icon: CheckCircle2 },
];

const STEP_COLORS = {
  gray: { dot: 'bg-gray-500 text-white', line: 'bg-gray-500', text: 'text-gray-200', ring: 'ring-gray-500/30' },
  blue: { dot: 'bg-blue-500 text-white', line: 'bg-blue-500', text: 'text-blue-400', ring: 'ring-blue-500/30' },
  orange: { dot: 'bg-orange-500 text-white', line: 'bg-orange-500', text: 'text-orange-400', ring: 'ring-orange-500/30' },
  green: { dot: 'bg-emerald-500 text-white', line: 'bg-emerald-500', text: 'text-emerald-400', ring: 'ring-emerald-500/30' },
};

const OrderHistory = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      try {
        const { data, error: err } = await supabase
          .from('adminOrders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (err) throw err;
        setOrders(data || []);
      } catch (err) {
        console.error('Error fetching order history:', err);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  // Live-sync status changes made by the admin
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`order-status-${user.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'adminOrders' },
        (payload) => {
          setOrders((prev) => {
            const isUserOrder = prev.some((o) => o.id === payload.new.id);
            if (isUserOrder) {
              return prev.map((o) => (o.id === payload.new.id ? { ...o, ...payload.new } : o));
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handleDownloadInvoice = async (order) => {
    try {
      setDownloadingId(order.id);

      let invoiceId = null;
      const { data: invoice } = await supabase
        .from('adminInvoices')
        .select('id')
        .eq('order_id', order.id)
        .maybeSingle();
      if (invoice) invoiceId = invoice.id;

      const mappedOrder = {
        orderId: order.id,
        invoiceId,
        date: order.created_at,
        paymentMethod: order.payment_method,
        customer: order.shipping_address,
        items: order.items,
        subtotal: order.subtotal,
        shipping: order.shipping_cost,
        gst: order.gst_amount,
        discount: order.discount,
        total: order.total,
      };

      navigate('/order-success', { state: { order: mappedOrder } });
    } catch (err) {
      console.error('Failed to open invoice:', err);
      alert('Failed to open invoice. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-28 sm:pt-32 pb-20 px-4 sm:px-6 md:px-12 bg-background flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <LogIn className="text-goldlux-orange w-8 sm:w-10 h-8 sm:h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Sign In Required</h1>
        <p className="text-gray-400 max-w-md mb-8 px-2">
          Please sign in to view your order history. You can sign in at checkout or use the profile menu above.
        </p>
        <Link
          to="/products"
          className="bg-goldlux-orange hover:bg-goldlux-teal text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-20 px-3 sm:px-6 md:px-12 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Package className="text-goldlux-orange w-6 sm:w-7 h-6 sm:h-7" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white">My Order History</h1>
        </div>
        <p className="text-gray-400 mb-10 pl-1">
          Track and review all of your past orders with Flux Store.
        </p>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-goldlux-orange/20 border-t-goldlux-orange rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 text-sm">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 text-rose-400 text-sm text-center">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-4">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Truck className="text-gray-600 w-10 h-10" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3">No Orders Yet</h2>
            <p className="text-gray-400 max-w-md mb-8">
              When you place an order, it will show up here so you can track its status and review the details.
            </p>
            <Link
              to="/products"
              className="bg-goldlux-orange hover:bg-goldlux-teal text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedId === order.id;
              const statusStyle = STATUS_STYLES[normalizeStatus(order.status)] || STATUS_STYLES['Order Received'];
              const currentStep = getStepIndex(order.status);

              return (
                <div
                  key={order.id}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-goldlux-orange/20 transition-colors"
                >
                  {/* Order Header */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    className="w-full flex items-center justify-between gap-4 p-4 sm:p-6 text-left"
                  >
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 min-w-0">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Order ID</p>
                        <p className="font-semibold text-white text-sm sm:text-base">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Placed On</p>
                        <p className="text-sm text-gray-300">{formatDate(order.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total</p>
                        <p className="text-sm font-semibold text-white">{formatPrice(order.total)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyle}`}>
                        {normalizeStatus(order.status)}
                      </span>
                      {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                    </div>
                  </button>

                  {/* Order Details */}
                  {isExpanded && (
                    <div className="border-t border-white/10 p-4 sm:p-6 space-y-6">
                      {/* Visual Status Tracker */}
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                          <Truck size={16} className="text-goldlux-orange" /> Order Status
                        </h3>
                        <div className="flex flex-col sm:flex-row">
                          {TRACKER_STEPS.map((step, i) => {
                            const isActive = i <= currentStep;
                            const isCurrent = i === currentStep;
                            const isCompleted = i < currentStep;
                            const isLast = i === TRACKER_STEPS.length - 1;
                            const colors = isActive ? STEP_COLORS[step.color] : null;
                            const StepIcon = step.icon;

                            return (
                              <div
                                key={step.label}
                                className="relative flex sm:flex-col items-start sm:items-center flex-1 min-w-0"
                              >
                                {/* Connector line: vertical (mobile), horizontal (desktop) */}
                                {!isLast && (
                                  <>
                                    <div
                                      className={`hidden sm:block absolute top-5 left-1/2 w-full h-0.5 ${
                                        isCompleted ? colors.line : 'bg-white/10'
                                      }`}
                                    />
                                    <div
                                      className={`sm:hidden absolute top-10 bottom-0 left-[19px] w-0.5 ${
                                        isCompleted ? STEP_COLORS[step.color].line : 'bg-white/10'
                                      }`}
                                    />
                                  </>
                                )}

                                {/* Step circle: check for completed, icon for current/future */}
                                <div
                                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                    isActive
                                      ? `${colors.dot} ${isCurrent ? `ring-4 ring-offset-2 ring-offset-background ${colors.ring}` : ''}`
                                      : 'bg-white/10 text-gray-500 border border-white/10'
                                  }`}
                                >
                                  {isCompleted ? <Check size={18} strokeWidth={3} /> : <StepIcon size={18} />}
                                </div>

                                {/* Step label: active is bold/bright, completed keeps color, future is gray */}
                                <div className="ml-4 sm:ml-0 sm:mt-3 sm:text-center min-w-0 sm:max-w-[9rem]">
                                  <p
                                    className={`leading-tight ${
                                      isCurrent
                                        ? `text-sm sm:text-base font-bold ${colors.text}`
                                        : isActive
                                          ? 'text-xs sm:text-sm font-medium text-gray-300'
                                          : 'text-xs sm:text-sm font-medium text-gray-500'
                                    }`}
                                  >
                                    {step.label}
                                  </p>
                                  {isCurrent && (
                                    <p className="text-[10px] uppercase tracking-wide text-gray-500 mt-1">
                                      {currentStep === 3 ? 'Completed' : 'Current step'}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Download Invoice (always available) */}
                        <button
                          onClick={() => handleDownloadInvoice(order)}
                          disabled={downloadingId === order.id}
                          className="mt-6 w-full sm:w-auto bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium px-6 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {downloadingId === order.id ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <Download size={18} />
                            )}
                            Download Invoice
                          </button>
                      </div>

                      {/* Items */}
                      <div>
                        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <Package size={16} className="text-goldlux-orange" /> Items
                        </h3>
                        <div className="space-y-3">
                          {(order.items || []).map((item, idx) => {
                            const unitPrice = item.item_type === 'gift_card'
                              ? item.custom_amount
                              : item.price * (1 - (item.discount || 0) / 100);
                            return (
                              <div key={idx} className="flex justify-between items-center gap-4 text-sm">
                                <div className="flex items-center gap-3 min-w-0">
                                  {item.img || item.image ? (
                                    <div className="w-10 h-10 rounded-lg bg-white/5 p-1 shrink-0">
                                      <img src={item.img || item.image} alt={item.name} className="w-full h-full object-contain" />
                                    </div>
                                  ) : (
                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                      <Package size={16} className="text-gray-500" />
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <p className="text-gray-200 truncate">{item.name}</p>
                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                                <span className="text-gray-300 shrink-0">{formatPrice(unitPrice * item.quantity)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Totals */}
                      <div className="space-y-1.5 text-sm border-t border-white/10 pt-4">
                        <div className="flex justify-between text-gray-400">
                          <span>Subtotal</span>
                          <span className="text-white">{formatPrice(order.subtotal)}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-emerald-400">
                            <span>Discount</span>
                            <span>-{formatPrice(order.discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-gray-400">
                          <span>GST (18%)</span>
                          <span className="text-white">{formatPrice(order.gst_amount)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400">
                          <span>Shipping</span>
                          <span className={order.shipping_cost === 0 ? 'text-emerald-400' : 'text-white'}>
                            {order.shipping_cost === 0 ? 'Free' : formatPrice(order.shipping_cost)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-white/10">
                          <span className="font-semibold text-gray-200">Grand Total</span>
                          <span className="font-bold text-goldlux-orange text-lg">{formatPrice(order.total)}</span>
                        </div>
                      </div>

                      {/* Payment & Address */}
                      <div className="grid sm:grid-cols-2 gap-4 text-sm border-t border-white/10 pt-4">
                        <div>
                          <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                            <ShieldCheck size={16} className="text-goldlux-orange" /> Payment
                          </h3>
                          <p className="text-gray-400">{order.payment_method || 'COD'}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                            <MapPin size={16} className="text-goldlux-orange" /> Delivery Address
                          </h3>
                          {order.shipping_address ? (
                            <div className="text-gray-400 space-y-0.5">
                              <p>{order.shipping_address.name}</p>
                              <p>{order.shipping_address.address}, {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pin}</p>
                              <p className="flex items-center gap-1.5"><Phone size={12} /> {order.shipping_address.mobile}</p>
                              {order.shipping_address.email && (
                                <p className="flex items-center gap-1.5"><Mail size={12} /> {order.shipping_address.email}</p>
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-500">{order.customer_name || 'N/A'} {order.customer_mobile ? `| ${order.customer_mobile}` : ''}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;