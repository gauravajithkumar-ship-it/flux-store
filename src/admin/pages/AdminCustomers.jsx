import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Mail, Phone, Calendar, Clock, RotateCcw, Truck, CheckCircle2, XCircle, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';

const statusConfig = {
  Pending: { color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: Clock },
  Processing: { color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20', icon: RotateCcw },
  Shipped: { color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: Truck },
  Delivered: { color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle2 },
  Cancelled: { color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: XCircle },
};

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState({});
  const [ordersLoading, setOrdersLoading] = useState({});

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerOrders = async (customerId) => {
    if (customerOrders[customerId]) return; // Already fetched

    setOrdersLoading(prev => ({ ...prev, [customerId]: true }));
    try {
      const { data, error } = await supabase
        .from('adminOrders')
        .select('*')
        .eq('user_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomerOrders(prev => ({ ...prev, [customerId]: data || [] }));
    } catch (err) {
      console.error('Error fetching customer orders:', err);
    } finally {
      setOrdersLoading(prev => ({ ...prev, [customerId]: false }));
    }
  };

  const toggleCustomer = (customerId) => {
    if (expandedCustomer === customerId) {
      setExpandedCustomer(null);
    } else {
      setExpandedCustomer(customerId);
      fetchCustomerOrders(customerId);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const filteredCustomers = customers.filter(customer =>
    customer.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Customers</h1>
          <p className="text-gray-400">Manage registered users and view their order history</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-white/5 text-sm font-medium text-gray-400">
            <div className="col-span-4">Customer</div>
            <div className="col-span-3">Contact</div>
            <div className="col-span-2">Joined</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Details</div>
          </div>

          <div className="divide-y divide-white/5">
            {filteredCustomers.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No customers found.</div>
            ) : (
              filteredCustomers.map(customer => {
                const isExpanded = expandedCustomer === customer.id;
                const orders = customerOrders[customer.id];
                const isLoadingOrders = ordersLoading[customer.id];

                return (
                  <div key={customer.id} className="transition-colors hover:bg-white/[0.02]">
                    <div 
                      className="grid grid-cols-12 gap-4 p-4 items-center cursor-pointer"
                      onClick={() => toggleCustomer(customer.id)}
                    >
                      {/* Customer Info */}
                      <div className="col-span-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                          {customer.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium">{customer.username}</p>
                          <p className="text-gray-500 text-xs">ID: {customer.id.split('-')[0]}</p>
                        </div>
                      </div>

                      {/* Contact Removed */}
                      <div className="col-span-3 space-y-1 text-gray-500 text-sm">
                        No contact info
                      </div>

                      {/* Joined Date */}
                      <div className="col-span-2 flex items-center gap-2 text-gray-300 text-sm">
                        <Calendar size={14} className="text-gray-500" />
                        {formatDate(customer.created_at)}
                      </div>

                      {/* Status */}
                      <div className="col-span-2">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                          customer.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          customer.status === 'Inactive' ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20' :
                          'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {customer.status}
                        </span>
                      </div>

                      {/* Toggle */}
                      <div className="col-span-1 flex justify-end">
                        {isExpanded ? <ChevronUp className="text-cyan-400" size={20} /> : <ChevronDown className="text-gray-500" size={20} />}
                      </div>
                    </div>

                    {/* Expanded Section - Order History */}
                    {isExpanded && (
                      <div className="border-t border-white/5 bg-black/40 p-6 animate-fade-in-up">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <ShoppingBag size={18} className="text-cyan-400" /> 
                          Order History
                        </h3>

                        {isLoadingOrders ? (
                          <div className="flex items-center justify-center h-20">
                            <div className="w-6 h-6 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                          </div>
                        ) : !orders || orders.length === 0 ? (
                          <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10 text-gray-400">
                            This customer hasn't placed any orders yet.
                          </div>
                        ) : (
                          <div className="grid gap-3">
                            {orders.map(order => {
                              const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                              const status = order.status || 'Pending';
                              const config = statusConfig[status] || statusConfig.Pending;
                              const StatusIcon = config.icon;

                              return (
                                <div key={order.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className="bg-black/50 border border-white/10 p-2 rounded-lg text-gray-400">
                                      <ShoppingBag size={24} />
                                    </div>
                                    <div>
                                      <p className="text-white font-medium mb-1">
                                        Order #{order.id.slice(-6)}
                                      </p>
                                      <p className="text-gray-400 text-xs">
                                        {formatDate(order.created_at)} · {items.length} item(s)
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex flex-col items-end gap-2">
                                    <span className="text-white font-bold">{formatPrice(order.total)}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${config.color} flex items-center gap-1`}>
                                      <StatusIcon size={10} /> {status}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
