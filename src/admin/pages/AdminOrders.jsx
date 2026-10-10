import { useState, useEffect } from 'react';
import { Search, Eye, Download, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { ORDER_STATUSES, normalizeStatus } from '../../utils/orderStatus';

const STATUS_BUTTON_STYLES = {
  'Order Received': { active: 'bg-gray-500/20 text-gray-200 border-gray-400/50', hover: 'hover:text-gray-300 hover:border-gray-400/30' },
  'Payment Verified': { active: 'bg-blue-500/20 text-blue-300 border-blue-400/50', hover: 'hover:text-blue-300 hover:border-blue-400/30' },
  'Packing & Quality Check': { active: 'bg-orange-500/20 text-orange-300 border-orange-400/50', hover: 'hover:text-orange-300 hover:border-orange-400/30' },
  'Successfully Delivered': { active: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50', hover: 'hover:text-emerald-300 hover:border-emerald-400/30' },
};

const AdminOrders = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, invoicesRes] = await Promise.all([
          supabase.from('adminOrders').select('*').order('created_at', { ascending: false }),
          supabase.from('adminInvoices').select('*').order('created_at', { ascending: false }),
        ]);

        if (ordersRes.error) throw ordersRes.error;
        if (invoicesRes.error) throw invoicesRes.error;

        setOrders(ordersRes.data || []);
        setInvoices(invoicesRes.data || []);
      } catch (error) {
        console.error('Error fetching orders and invoices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleStatusChange = async (order, newStatus) => {
    const prevStatus = order.status;

    setUpdatingId(order.id);
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
    );

    try {
      const { data, error } = await supabase
        .from('adminOrders')
        .update({ status: newStatus })
        .eq('id', order.id)
        .select('id');

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('No rows updated. Check the adminOrders UPDATE policy in Supabase.');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status');
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, status: prevStatus } : o))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'All Status' || normalizeStatus(order.status) === statusFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      String(order.id).toLowerCase().includes(q) ||
      (order.customer_name || '').toLowerCase().includes(q) ||
      (order.customer_email || '').toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const handleDownload = async (invoice) => {
    try {
      setDownloadingId(invoice.id);

      const { data: orderData, error } = await supabase
        .from('adminOrders')
        .select('*')
        .eq('id', invoice.order_id)
        .single();

      if (error) throw error;

      const mappedOrder = {
        orderId: orderData.id,
        invoiceId: invoice.id,
        date: orderData.created_at,
        paymentMethod: orderData.payment_method,
        customer: orderData.shipping_address,
        items: orderData.items,
        subtotal: orderData.subtotal,
        shipping: orderData.shipping_cost,
        gst: orderData.gst_amount,
        discount: orderData.discount,
        total: orderData.total,
      };

      navigate('/order-success', { state: { order: mappedOrder } });
    } catch (err) {
      console.error("Failed to fetch order details for invoice:", err);
      alert("Failed to open invoice. Could not fetch order details.");
    } finally {
      setDownloadingId(null);
    }
  };

  const tabs = [
    { key: 'orders', label: 'Orders', count: orders.length },
    { key: 'invoices', label: 'GST Invoices', count: invoices.length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Order Management & GST Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">Manage orders and billing/GST compliance in one place.</p>
        </div>
        <button className="bg-white/5 hover:bg-white/10 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-white/10">
          <Download size={18} />
          {activeTab === 'orders' ? 'Export CSV' : 'Export GSTR-1 Report'}
        </button>
      </div>

      <div className="flex gap-2 border-b border-white/10 pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg flex items-center gap-2 transition-colors -mb-px border-b-2 ${
              activeTab === tab.key
                ? 'text-cyan-400 border-cyan-400 bg-cyan-500/5'
                : 'text-gray-400 border-transparent hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.key === 'invoices' && <FileText size={16} />}
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === tab.key ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/10 text-gray-400'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {activeTab === 'orders' ? (
        <>
          <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search orders by ID, customer, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50"
              >
                <option>All Status</option>
                {ORDER_STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-[#0f0f0f] border border-white/5 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-black/50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 font-medium">Order ID</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Customer</th>
                    <th className="px-6 py-4 font-medium">Total Amount</th>
                    <th className="px-6 py-4 font-medium">Payment</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        <div className="w-6 h-6 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto mb-2"></div>
                        Loading orders...
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const currentStatus = normalizeStatus(order.status);
                      return (
                      <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4 font-medium text-white">{order.id}</td>
                        <td className="px-6 py-4">{formatDate(order.created_at)}</td>
                        <td className="px-6 py-4">
                          <p className="text-white font-medium">{order.customer_name}</p>
                          <p className="text-xs text-gray-500">{order.customer_email || order.customer_mobile}</p>
                        </td>
                        <td className="px-6 py-4 text-white font-medium">{formatPrice(order.total)}</td>
                        <td className="px-6 py-4 text-xs">{order.payment_method}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1.5 min-w-[280px]">
                            {ORDER_STATUSES.map((status) => {
                              const isActive = currentStatus === status;
                              const styles = STATUS_BUTTON_STYLES[status];
                              return (
                                <button
                                  key={status}
                                  type="button"
                                  disabled={updatingId === order.id}
                                  onClick={() => handleStatusChange(order, status)}
                                  className={`px-2 py-1 rounded-md border text-[11px] font-medium whitespace-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isActive
                                      ? styles.active
                                      : `bg-white/[0.03] text-gray-500 border-white/10 ${styles.hover}`
                                  }`}
                                >
                                  {status}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-1.5 text-gray-400 hover:text-cyan-400 transition-colors opacity-0 group-hover:opacity-100">
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="bg-[#0f0f0f] border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search invoices by ID, Order ID, or Customer..."
                className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div className="flex gap-2">
              <select className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50">
                <option>All Types</option>
                <option>B2B (With GSTIN)</option>
                <option>B2C (Without GSTIN)</option>
              </select>
            </div>
          </div>

          <div className="bg-[#0f0f0f] border border-white/5 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-black/50 text-gray-500 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 font-medium">Invoice No.</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Order ID</th>
                    <th className="px-6 py-4 font-medium">Customer / Company</th>
                    <th className="px-6 py-4 font-medium">Type</th>
                    <th className="px-6 py-4 font-medium text-right">Total Amount</th>
                    <th className="px-6 py-4 font-medium text-right">GST Included</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                        <div className="w-6 h-6 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mx-auto mb-2"></div>
                        Loading invoices...
                      </td>
                    </tr>
                  ) : invoices.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                        No invoices found.
                      </td>
                    </tr>
                  ) : (
                    invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                          <FileText size={16} className="text-cyan-400" />
                          {invoice.id}
                        </td>
                        <td className="px-6 py-4">{formatDate(invoice.created_at)}</td>
                        <td className="px-6 py-4 text-cyan-400/80 hover:text-cyan-400 cursor-pointer">{invoice.order_id}</td>
                        <td className="px-6 py-4 text-white">{invoice.customer_name}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            invoice.invoice_type === 'B2B' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                          }`}>
                            {invoice.invoice_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-white font-medium">{formatPrice(invoice.total_amount)}</td>
                        <td className="px-6 py-4 text-right text-xs">{formatPrice(invoice.gst_amount)}</td>
                        <td className="px-6 py-4 text-right">
                          {invoice.status === 'Generated' ? (
                            <button
                              onClick={() => handleDownload(invoice)}
                              disabled={downloadingId === invoice.id}
                              className={`text-cyan-400 hover:text-cyan-300 text-xs font-medium flex items-center gap-1 justify-end ml-auto ${downloadingId === invoice.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {downloadingId === invoice.id ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                              {downloadingId === invoice.id ? 'Loading...' : 'Download'}
                            </button>
                          ) : (
                            <button className="text-emerald-400 hover:text-emerald-300 text-xs font-medium flex items-center gap-1 justify-end ml-auto">
                              <CheckCircle2 size={14} />
                              Generate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrders;
