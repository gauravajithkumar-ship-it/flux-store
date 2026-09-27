import { useState, useEffect } from 'react';
import { Search, Download, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data, error } = await supabase
          .from('adminInvoices')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setInvoices(data || []);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
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

  const handleDownload = async (invoice) => {
    try {
      setDownloadingId(invoice.id);
      
      // Fetch the full order details required to render the invoice
      const { data: orderData, error } = await supabase
        .from('adminOrders')
        .select('*')
        .eq('id', invoice.order_id)
        .single();
        
      if (error) throw error;

      // Map Supabase schema back to the frontend format expected by OrderSuccess.jsx
      const mappedOrder = {
        orderId: orderData.id,
        invoiceId: invoice.id,
        date: orderData.created_at,
        paymentMethod: orderData.payment_method,
        customer: orderData.shipping_address, // Stored as JSONB containing address details
        items: orderData.items, // Stored as JSONB array
        subtotal: orderData.subtotal,
        shipping: orderData.shipping_cost,
        gst: orderData.gst_amount,
        discount: orderData.discount,
        total: orderData.total,
      };

      // Navigate to the success page which acts as our printable invoice view
      navigate('/order-success', { state: { order: mappedOrder } });
      
    } catch (err) {
      console.error("Failed to fetch order details for invoice:", err);
      alert("Failed to open invoice. Could not fetch order details.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">GST Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">Manage billing and GST compliance for B2B and B2C orders.</p>
        </div>
        <button className="bg-white/5 hover:bg-white/10 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-white/10">
          <Download size={18} />
          Export GSTR-1 Report
        </button>
      </div>

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
    </div>
  );
};

export default AdminInvoices;
