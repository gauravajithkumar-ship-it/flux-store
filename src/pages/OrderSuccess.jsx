import { useRef } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Printer, Download, ShoppingBag } from 'lucide-react';
import Invoice from '../components/Invoice';
import { generateInvoicePdf } from '../utils/generateInvoicePdf';

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;
  const invoiceRef = useRef(null);

  if (!order) {
    return <Navigate to="/" replace />;
  }

  const handlePrint = () => {
    window.print();
  };

  // Exact-format PDF download
  const handleDownloadPDF = async () => {
    const element = invoiceRef.current;
    if (!element) return;

    const pdf = await generateInvoicePdf(element);
    pdf.save(`Invoice_${order.orderId}.pdf`);
  };

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-20 px-3 sm:px-6 md:px-12 bg-background flex justify-center">
      <div className="max-w-4xl w-full">
        
        {/* Success Message */}
        <div className="text-center mb-10 print:hidden">
          <div className="w-16 sm:w-20 h-16 sm:h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-emerald-400 w-8 sm:w-10 h-8 sm:h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-400 mb-8 px-2">Thank you for shopping with us. Your order <span className="text-cyan-400 font-semibold">{order.orderId}</span> has been confirmed.</p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 px-2">
            <button onClick={handlePrint} className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
              <Printer size={18} /> Print Invoice
            </button>
            
            {/* Download PDF Button */}
            <button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
              <Download size={18} /> Download PDF
            </button>

            <Link to="/products" className="bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
              <ShoppingBag size={18} /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Invoice Printable Area */}
        <Invoice ref={invoiceRef} order={order} className="shadow-2xl print:shadow-none rounded-xl" />
      </div>

      {/* Styles adjusted to preserve background colors during native printing */}
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          nav, footer {
            display: none !important;
          }
          .bg-background {
            background-color: white !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;