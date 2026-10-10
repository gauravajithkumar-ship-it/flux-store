import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    appliedCoupon,
    subtotal,
    SHIPPING_COST,
    FREE_SHIPPING_THRESHOLD,
    taxAmount,
    couponDiscount,
    total,
    isLoading,
    getItemPrice,
  } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate estimated delivery (Today + 3 days)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const deliveryOptions = { weekday: 'short', month: 'short', day: 'numeric' };
  const formattedDelivery = deliveryDate.toLocaleDateString('en-IN', deliveryOptions);

  // Calculate Total Savings
  const mrpTotal = cartItems.reduce((sum, item) => sum + (item.price || getItemPrice(item)) * item.quantity, 0);
  const savings = mrpTotal - subtotal + couponDiscount;

  if (isLoading) {
    return (
      <div className="min-h-screen pt-28 sm:pt-32 pb-20 px-4 sm:px-6 md:px-12 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-medium">Loading your cart...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-28 sm:pt-32 pb-20 px-4 sm:px-6 md:px-12 flex flex-col items-center justify-center">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl flex flex-col items-center max-w-md w-full text-center border border-white/5 bg-black/40 backdrop-blur-xl">
          <div className="w-16 sm:w-20 h-16 sm:h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={28} className="text-cyan-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Your Cart is Empty</h2>
          <p className="text-gray-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/products"
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-20 px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <ShoppingBag className="text-cyan-400" />
          Shopping Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items (Left Column) */}
          <div className="w-full lg:w-2/3 space-y-6">
            <div className="glass-panel rounded-3xl p-4 sm:p-6 border border-white/5 bg-black/40 backdrop-blur-xl">
              {cartItems.map((item) => {
                const discountedPrice = getItemPrice(item);
                const isGiftCard = item.item_type === 'gift_card';

                return (
                  <div key={item.id + (item.custom_amount || '')} className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 py-6 border-b border-white/10 last:border-0 first:pt-0 last:pb-0">
                    <div className="w-20 h-20 sm:w-32 sm:h-32 flex-shrink-0 bg-white/5 rounded-2xl overflow-hidden relative group-hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-shadow self-start">
                      <img src={item.img || item.image} alt={item.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                      {item.discount && !isGiftCard && (
                        <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg">
                          {item.discount}% OFF
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between w-full gap-4 min-w-0">
                      <div className="flex-1 flex flex-col sm:flex-row justify-between w-full gap-4">
                        <div className="flex-1 min-w-0">
                          <Link to={isGiftCard ? '/gift-cards' : `/product/${item.id}`} className="text-base sm:text-lg font-semibold text-white hover:text-cyan-400 transition-colors break-words">
                            {item.name}
                          </Link>
                          <p className="text-xs sm:text-sm text-gray-400 mb-2">
                            {isGiftCard ? 'e-Gift Card' : `${item.brand} • ${item.category}`}
                          </p>
                          
                          <div className="flex items-center gap-3 mb-4 flex-wrap">
                            <span className="text-lg sm:text-xl font-bold text-white">{formatPrice(discountedPrice)}</span>
                            {item.discount && !isGiftCard && (
                              <span className="text-xs sm:text-sm text-gray-500 line-through">{formatPrice(item.price)}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-left sm:text-right flex flex-col justify-between items-start sm:items-end">
                          <div className="text-base sm:text-lg font-bold text-cyan-400 mb-2 sm:mb-0">
                            {formatPrice(discountedPrice * item.quantity)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 border-t border-white/5 pt-4">
                        <div className="flex items-center bg-white/5 rounded-xl border border-white/10 p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.item_type, item.custom_amount)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 sm:w-10 text-center text-white font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.item_type, item.custom_amount)}
                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => removeFromCart(item.id, item.item_type, item.custom_amount)}
                            className="text-gray-500 hover:text-rose-500 transition-colors p-2 flex items-center gap-1 text-sm font-medium"
                          >
                            <Trash2 size={18} />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center px-2">
              <Link
                to="/products"
                className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-2 transition-colors"
              >
                <ArrowLeft size={20} />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary (Right Column) */}
          <div className="w-full lg:w-1/3">
            <div className="glass-panel rounded-3xl p-5 sm:p-6 md:p-8 border border-white/5 bg-black/40 backdrop-blur-xl lg:sticky lg:top-32">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-6">Order Summary</h2>

              {/* Cost Breakdown */}
              <div className="space-y-4 text-sm mb-6 border-b border-white/10 pb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium text-white">{formatPrice(subtotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-300">
                  <span>Estimated GST (18%)</span>
                  <span className="font-medium text-white">{formatPrice(taxAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping charges</span>
                  {SHIPPING_COST === 0 ? (
                    <span className="font-medium text-emerald-400">Free</span>
                  ) : (
                    <span className="font-medium text-white">{formatPrice(SHIPPING_COST)}</span>
                  )}
                </div>
                {SHIPPING_COST > 0 && (
                  <div className="text-xs text-cyan-400/80 bg-cyan-900/20 p-2 rounded-lg mt-2">
                    Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
                  </div>
                )}
              </div>

              {/* Total & Checkout */}
              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-lg font-medium text-gray-300">Total Payable</span>
                  <span className="text-3xl font-bold text-white tracking-tight">{formatPrice(total)}</span>
                </div>
                {savings > 0 && (
                  <div className="text-right text-emerald-400 text-sm font-medium">
                    You save {formatPrice(savings)} on this order
                  </div>
                )}
              </div>

              {/* Converted Button into Link to Checkout page */}
              <Link 
                to="/checkout" 
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group mb-4 text-center"
              >
                Proceed to Checkout
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="text-center text-sm text-gray-500 bg-white/5 rounded-xl p-4">
                Estimated Delivery by <span className="font-semibold text-gray-300">{formattedDelivery}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;