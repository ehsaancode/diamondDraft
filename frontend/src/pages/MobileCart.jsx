import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Trash2, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CheckoutModal from '../components/cart/CheckoutModal';

const MobileCart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, cartTotal, cartCount } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-48 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-100/80 sticky top-0 z-40 px-4 py-4 flex items-center justify-between shadow-xs">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-xs active:scale-95 transition-transform"
        >
          <ChevronLeft size={20} className="text-gray-800" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 tracking-tight">Request Basket</h1>
        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full text-xs font-black text-gray-700">
          {cartCount}
        </div>
      </div>

      <main className="p-4 flex flex-col gap-6 pb-36">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                <ShoppingBag size={44} />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-xs">
                <Plus size={16} className="text-gray-500" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Your basket is empty</h3>
              <p className="text-xs text-gray-500 max-w-[240px] mt-1.5 leading-relaxed font-sans">
                Looks like you haven't added any CAD designs to your request list yet.
              </p>
            </div>
            <button
              onClick={() => navigate('/shop')}
              className="px-8 py-3.5 bg-black text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md active:scale-95 transition-transform"
            >
              Start Exploring
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={`${item.id}-${item.size}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-white rounded-2xl p-4 flex gap-4 shadow-xs border border-gray-200 relative group"
                >
                  <div
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="w-20 h-20 rounded-xl bg-gray-50 overflow-hidden flex items-center justify-center p-2 shrink-0 cursor-pointer border border-gray-100"
                  >
                    <img
                      src={item.image || '/images/jewellery_cad_ring.png'}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div className="flex items-start justify-between">
                      <div onClick={() => navigate(`/product/${item.id}`)} className="cursor-pointer">
                        <h3 className="text-xs font-bold text-gray-900 leading-tight line-clamp-1">{item.name}</h3>
                        <p className="text-[10px] text-gray-400 font-mono font-semibold uppercase mt-1 tracking-wider">
                          {item.size} Format
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-black text-black">₹{Number(item.price || 0).toLocaleString('en-IN')}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md font-mono">
                        Digital CAD
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Price Summary */}
            <div className="mt-4 bg-white rounded-2xl p-5 border border-gray-200 shadow-xs flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs font-medium text-gray-500">
                <span>Estimated CAD Cost</span>
                <span className="text-gray-900 font-bold">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-medium text-gray-500">
                <span>Consultation & Processing</span>
                <span className="text-emerald-600 font-bold">Free</span>
              </div>
              <div className="h-px bg-gray-100 my-1" />
              <div className="flex justify-between items-center text-base font-black text-gray-900">
                <span>Total Estimate</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="mt-2 pb-16">
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full h-14 bg-black text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform group cursor-pointer"
              >
                <span>Submit CAD Request</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </main>

      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </div>
  );
};

export default MobileCart;
