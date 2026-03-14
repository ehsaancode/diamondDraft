import React from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 max-w-md w-full bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-gray-900" />
                <h2 className="text-lg font-serif font-semibold text-gray-900">Design Requests ({cartCount})</h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} className="text-gray-500 hover:text-gray-900" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <ShoppingBag size={48} className="mb-4 opacity-20" />
                  <p>No design requests yet.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 text-sm underline hover:text-black cursor-pointer"
                  >
                    Browse Portfolio
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4 p-4 bg-gray-50 rounded-sm">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 object-contain mix-blend-multiply bg-white rounded-sm p-2"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Format: {item.size}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 border border-gray-200 bg-white rounded-sm px-2 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.size, -1)}
                            className="text-gray-500 hover:text-black cursor-pointer"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.size, 1)}
                            className="text-gray-500 hover:text-black cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Base Estimate</span>
                  <span className="font-semibold text-gray-900">₹{cartTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
                <p className="text-xs text-gray-500 mb-6">Final cost tailored to your specific CAD requirements.</p>
                <button className="w-full bg-black text-white py-4 font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors cursor-pointer">
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
