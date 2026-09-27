const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(price);
};

const Invoice = ({ order, ref, className = '' }) => {
  return (
    <div
      ref={ref}
      className={`bg-white text-black font-sans mx-auto max-w-4xl overflow-hidden ${className}`}
      style={{ minHeight: '800px', display: 'flex', flexDirection: 'column' }}
    >
      {/* Header Section */}
      <div className="bg-blue-100/60 p-5 sm:p-8 md:p-14 flex justify-between items-start gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-widest text-gray-800 mb-6 sm:mb-8 uppercase">INVOICE</h1>
          <div className="mb-4 sm:mb-6">
            <p className="text-gray-500 text-xs sm:text-sm mb-1">Invoice Number</p>
            <p className="text-gray-800 text-sm sm:text-base break-words">{order.orderId}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs sm:text-sm mb-1">Date</p>
            <p className="text-gray-800 text-sm sm:text-base">{new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
        <div className="text-right flex flex-col items-end shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-gray-700 flex items-center justify-center mb-4 text-gray-700 relative overflow-hidden">
            <div className="w-5 h-5 sm:w-6 sm:h-6 border-[3px] border-gray-700 rounded-full" />
            <div className="absolute w-full h-full border-[3px] border-transparent border-t-gray-700 rounded-full rotate-45 transform origin-center scale-110" />
          </div>
          <p className="text-gray-600 text-xs sm:text-sm tracking-wide">Flux Store</p>
        </div>
      </div>

      {/* Addresses Section */}
      <div className="px-5 sm:px-8 md:px-14 py-8 sm:py-12 flex flex-col sm:flex-row justify-between bg-white gap-6">
        <div className="w-full sm:w-1/2 sm:pr-4">
          <h3 className="text-gray-800 font-bold uppercase tracking-wider mb-4 text-xs sm:text-sm">PAYABLE TO</h3>
          <p className="text-gray-600 mb-1 text-sm sm:text-base">{order.customer.name}</p>
          <p className="text-gray-600 mb-1 text-sm sm:text-base">{order.customer.address}</p>
          <p className="text-gray-600 mb-1 text-sm sm:text-base">{order.customer.city}, {order.customer.state} - {order.customer.pin}</p>
          <p className="text-gray-600 text-sm sm:text-base">Ph: {order.customer.mobile}</p>
        </div>
        <div className="w-full sm:w-1/2 sm:pl-4">
          <h3 className="text-gray-800 font-bold uppercase tracking-wider mb-4 text-xs sm:text-sm">BILL FROM</h3>
          <p className="text-gray-600 mb-1 text-sm sm:text-base">Flux Store</p>
          <p className="text-gray-600 mb-1 text-sm sm:text-base">123 lilleria peramount</p>
          <p className="text-gray-600 text-sm sm:text-base">Vadodara, Gujarat 390001</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-grow">
        <div className="bg-blue-100/60 px-4 sm:px-8 md:px-14 py-3 flex justify-between items-center text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider">
          <div className="w-1/2">ITEM</div>
          <div className="w-1/6 text-center">QTY</div>
          <div className="w-1/6 text-right">PRICE</div>
          <div className="w-1/6 text-right">TOTAL</div>
        </div>
        <div className="px-4 sm:px-8 md:px-14 py-4 sm:py-6">
          {order.items.map((item, index) => {
            let discountedPrice = item.price;
            if (item.item_type === 'gift_card') {
              discountedPrice = item.custom_amount;
            } else if (item.discount) {
              discountedPrice = item.price * (1 - item.discount / 100);
            }
            const tax = discountedPrice * 0.18;
            const itemTotal = discountedPrice + tax;

            return (
              <div key={index} className="flex justify-between items-center py-4 text-gray-600">
                <div className="w-1/2 pr-2 sm:pr-4 text-xs sm:text-sm">{item.name} {item.item_type === 'gift_card' ? '(e-Gift Card)' : ''}</div>
                <div className="w-1/6 text-center text-xs sm:text-sm">{item.quantity}</div>
                <div className="w-1/6 text-right text-xs sm:text-sm">{formatPrice(itemTotal)}</div>
                <div className="w-1/6 text-right text-xs sm:text-sm">{formatPrice(itemTotal * item.quantity)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Totals & Bank Details Section */}
      <div className="px-5 sm:px-8 md:px-14 flex flex-col sm:flex-row justify-between items-start mb-12 sm:mb-16 gap-8">
        <div className="w-full sm:w-1/2 sm:pr-4">
          <h3 className="text-gray-800 font-bold uppercase tracking-wider mb-4 text-xs sm:text-sm">BANK DETAILS</h3>
          <p className="text-gray-600 mb-1 text-sm sm:text-base">Account title: Flux Store</p>
          <p className="text-gray-600 text-sm sm:text-base">+123-456-7890</p>
        </div>
        <div className="w-full sm:w-1/2 sm:pl-10 sm:border-t sm:border-gray-300 sm:pt-6">
          <div className="flex justify-between mb-4 text-sm sm:text-base">
            <span className="text-gray-600">Sub Total</span>
            <span className="text-gray-800">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between mb-4 text-sm sm:text-base">
            <span className="text-gray-600">Shipping</span>
            <span className="text-gray-800">{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between mb-4 text-sm sm:text-base text-emerald-600">
              <span>Discount</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between mt-2 pt-2 text-base sm:text-lg">
            <span className="text-gray-600">Grand Total</span>
            <span className="text-gray-800">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Footer Contacts */}
      <div className="px-5 sm:px-8 md:px-14 pb-6 sm:pb-8 flex flex-col sm:flex-row justify-between items-start gap-8">
        <div className="w-full sm:w-1/2 space-y-3">
          <div className="flex items-center gap-3 text-gray-500 text-xs sm:text-sm">
            <span className="text-sm sm:text-lg">☎</span> <span>+123-456-7890</span>
          </div>
          <div className="flex items-center gap-3 text-gray-500 text-xs sm:text-sm">
            <span className="text-sm sm:text-lg">✉</span> <span>business@fluxstore.com</span>
          </div>
          <div className="flex items-center gap-3 text-gray-500 text-xs sm:text-sm">
            <span className="text-sm sm:text-lg">📍</span> <span>Vadodara, Gujarat</span>
          </div>
          <div className="flex items-center gap-3 text-gray-500 text-xs sm:text-sm">
            <span className="text-sm sm:text-lg">🌐</span> <span>fluxstore.com</span>
          </div>
        </div>
        <div className="w-full sm:w-1/2">
          <h3 className="text-gray-800 font-bold uppercase tracking-wider mb-2 text-xs sm:text-sm">NOTES</h3>
          <p className="text-gray-500 text-xs sm:text-sm">Thank you for your business! Have a great day.</p>
        </div>
      </div>

      <div className="text-center py-6 mt-auto"></div>
    </div>
  );
};

export default Invoice;