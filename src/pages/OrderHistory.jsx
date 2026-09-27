import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, LogIn, Truck, ShieldCheck, MapPin, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const STATUS_STYLES = {
  Pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Processing: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Shipped: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

const OrderHistory = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState(null);

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
              const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.Pending;

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
                        {order.status || 'Pending'}
                      </span>
                      {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                    </div>
                  </button>

                  {/* Order Details */}
                  {isExpanded && (
                    <div className="border-t border-white/10 p-4 sm:p-6 space-y-6">
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