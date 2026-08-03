import React from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, cartTotal, cartCount } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[998]"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer Overlay */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 right-0 max-w-md w-full bg-white z-[999] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-gray-900" />
                <h2 className="text-lg font-serif font-bold text-gray-900">Design Requests ({cartCount})</h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                title="Close Cart"
                className="p-2.5 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-600 hover:text-black flex items-center justify-center"
              >
                <X size={22} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5 md:p-6 flex flex-col gap-4 bg-[#fafafa]">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 py-16 text-center">
                  <ShoppingBag size={48} className="mb-4 text-gray-300" />
                  <p className="text-sm font-semibold text-gray-800">No design requests yet.</p>
                  <p className="text-xs text-gray-400 mt-1 max-w-[200px]">Add CAD models to your basket to view estimated pricing.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 px-6 py-2.5 bg-black text-white text-xs font-bold rounded-xl shadow-xs hover:bg-gray-800 transition-colors cursor-pointer uppercase tracking-wider"
                  >
                    Browse Portfolio
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-xs">
                    <img
                      src={item.image || '/images/jewellery_cad_ring.png'}
                      alt={item.name}
                      className="w-16 h-16 object-contain bg-gray-50 rounded-lg p-1 border border-gray-100 shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-xs font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-400 font-mono font-semibold uppercase mt-0.5">Format: {item.size}</p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-mono font-bold">Digital CAD</span>
                        <p className="font-black text-gray-900 text-sm">₹{Number(item.price || 0).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-5 md:p-6 border-t border-gray-100 bg-white space-y-4">
                <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                  <span>Base Estimate</span>
                  <span className="font-bold text-gray-900 text-base">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[11px] text-gray-400">Final cost tailored to your specific CAD requirements.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-black text-white py-3.5 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-800 transition-colors cursor-pointer shadow-md"
                >
                  Submit Request
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
