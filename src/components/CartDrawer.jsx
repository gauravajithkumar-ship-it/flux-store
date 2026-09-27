import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, total } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-black border-l border-white/10 z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <ShoppingBag className="text-cyan-400" />
                Your Cart
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ShoppingBag size={48} className="mb-4 opacity-20" />
                  <p className="text-lg">Your cart is empty.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 text-cyan-400 hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={`${item.id}-${item.custom_amount || ''}`} className="flex gap-4 p-4 glass rounded-2xl relative group">
                    <div className="w-20 h-20 bg-white/5 rounded-xl flex items-center justify-center p-2 flex-shrink-0">
                      <img src={item.img} alt={item.name} className="w-full h-full object-contain mix-blend-screen" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <h3 className="font-semibold text-sm line-clamp-2">{item.name}</h3>
                      <p className="text-cyan-400 font-bold mt-1">₹{item.price}</p>
                      
                      <div className="flex items-center gap-3 mt-auto pt-2">
                        <div className="flex items-center bg-white/5 rounded-lg border border-white/10">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.item_type, item.custom_amount)}
                            className="px-3 py-1 hover:text-cyan-400 transition-colors"
                          >
                            -
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.item_type, item.custom_amount)}
                            className="px-3 py-1 hover:text-cyan-400 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id, item.item_type, item.custom_amount)}
                          className="text-gray-500 hover:text-red-400 p-2 transition-colors ml-auto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black/50 backdrop-blur-md">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-gray-400">Total</span>
                  <span className="text-2xl font-bold">₹{total}</span>
                </div>
                <div className="flex flex-col gap-3">
                  <Link
                    to="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full py-3 px-4 glass rounded-xl font-semibold text-center hover:bg-white/5 transition-colors"
                  >
                    View Cart
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl font-bold flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                  >
                    Checkout <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
