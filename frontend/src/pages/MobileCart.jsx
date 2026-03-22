import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const MobileCart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-40">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 px-4 py-4 flex items-center justify-between border-b border-gray-50">
        <button onClick={() => navigate(-1)} className="w-11 h-11 flex items-center justify-center bg-white border border-gray-100 rounded-full shadow-sm active:scale-95 transition-transform">
          <ChevronLeft size={22} className="text-gray-800" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">Your Cart</h1>
        <div className="flex items-center justify-center w-11 h-11 bg-gray-50 rounded-full text-xs font-black text-gray-400">
           {cartCount}
        </div>
      </div>

      <main className="p-4 flex flex-col gap-6">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                <ShoppingBag size={48} />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                 <Plus size={16} className="text-gray-400" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Your cart is empty</h3>
              <p className="text-sm text-gray-400 max-w-[240px] mt-2 leading-relaxed">Looks like you haven't added any CAD designs to your library yet.</p>
            </div>
            <button 
              onClick={() => navigate('/shop')}
              className="px-10 py-4 bg-black text-white rounded-2xl font-bold text-sm shadow-xl shadow-black/10 active:scale-95 transition-transform"
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
                  className="bg-white rounded-[32px] p-4 flex gap-4 shadow-sm border border-gray-50 relative group"
                >
                  <div 
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="w-24 h-24 rounded-[24px] bg-[#f0f2f5] overflow-hidden flex items-center justify-center p-2 shrink-0 cursor-pointer"
                  >
                    <img 
                      src={item.image || '/images/jewellery_cad_ring.png'} 
                      alt={item.name} 
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex items-start justify-between">
                      <div onClick={() => navigate(`/product/${item.id}`)} className="cursor-pointer">
                        <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-1">{item.name}</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">{item.size} Format</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-black text-black">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1 border border-gray-100">
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, -1)}
                          className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-400 active:scale-90"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-bold text-gray-900 min-w-[20px] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, 1)}
                          className="w-8 h-8 rounded-lg bg-[#1b4332] flex items-center justify-center text-white shadow-sm active:scale-90"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Price Summary */}
            <div className="mt-6 bg-white rounded-[32px] p-6 border border-gray-50 shadow-sm flex flex-col gap-4">
               <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                  <span>Subtotal</span>
                  <span className="text-gray-900">₹{cartTotal.toLocaleString('en-IN')}</span>
               </div>
               <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                  <span>Platform Fee</span>
                  <span className="text-green-600">Free</span>
               </div>
               <div className="h-px bg-gray-100 my-1" />
               <div className="flex justify-between items-center text-lg font-black text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
               </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Checkout Button */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-50 z-50 rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
           <button 
             className="w-full h-16 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-2xl shadow-black/20 active:scale-95 transition-transform group"
           >
             <span>Proceed to Checkout</span>
             <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      )}
    </div>
  );
};

export default MobileCart;
