import React, { useState, useEffect } from 'react';
import { Home, ShoppingBag, Heart, User, Search, Check } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const MobileBottomNav = () => {
  const { setIsCartOpen, cartCount, activeProduct, addToCart, cartItems } = useCart();
  const navigate = useNavigate();

  const isAlreadyInCart = activeProduct && cartItems.some(item =>
    item.id === activeProduct.product.id && item.size === activeProduct.selectedFormat
  );

  return (
    <motion.div
      layout
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white border border-gray-100/80 shadow-[0_16px_36px_rgba(0,0,0,0.12)] rounded-[40px] z-50 flex items-center transition-all ${activeProduct ? 'p-2' : 'px-6 py-4 justify-between'
        }`}
    >
      <AnimatePresence mode="wait">
        {activeProduct ? (
          <motion.div
            key="product-actions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2 w-full"
          >
            <motion.button
              layout
              onClick={isAlreadyInCart ? undefined : () => addToCart(activeProduct.product, activeProduct.selectedFormat)}
              className={`flex-1 h-12 font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 rounded-[30px] border transition-all duration-300 ${isAlreadyInCart
                  ? 'border-emerald-100 bg-emerald-50 text-emerald-600 shadow-sm shadow-emerald-100/50'
                  : 'border-black/10 hover:border-black text-black active:scale-95 transition-transform cursor-pointer'
                }`}
            >
              {isAlreadyInCart ? (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1.5"
                >
                  <Check size={14} strokeWidth={3} />
                  <span>Added into basket</span>
                </motion.div>
              ) : (
                <span>Add to Requests</span>
              )}
            </motion.button>
            <button
              onClick={() => {
                addToCart(activeProduct.product, activeProduct.selectedFormat);
                navigate('/cart');
              }}
              className="flex-1 h-12 bg-black text-white rounded-[30px] font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 active:scale-95 transition-transform shadow-md cursor-pointer"
            >
              Request Now
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="navigation-links"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-between w-full"
          >
            <NavLink to="/" className={({ isActive }) => `p-2 rounded-full transition-all duration-300 ${isActive ? 'bg-black text-white' : 'text-gray-400'}`}>
              {({ isActive }) => <Home size={22} strokeWidth={isActive ? 2.5 : 2} />}
            </NavLink>
            <NavLink to="/search" className={({ isActive }) => `p-2 rounded-full transition-all duration-300 ${isActive ? 'bg-black text-white' : 'text-gray-400'}`}>
              {({ isActive }) => <Search size={22} strokeWidth={isActive ? 2.5 : 2} />}
            </NavLink>

            <NavLink to="/cart" className={({ isActive }) => `p-2 rounded-full transition-all duration-300 relative ${isActive ? 'bg-black text-white' : 'text-gray-400'}`}>
              {({ isActive }) => (
                <>
                  <ShoppingBag size={22} strokeWidth={isActive ? 2.5 : 2} />
                  {cartCount > 0 && (
                    <span className={`absolute top-1 right-1 text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center border shadow-sm ${isActive ? 'bg-white text-black border-black' : 'bg-red-500 text-white border-white'}`}>
                      {cartCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>

            <NavLink to="/profile" className={({ isActive }) => `p-2 rounded-full transition-all duration-300 ${isActive ? 'bg-black text-white' : 'text-gray-400'}`}>
              {({ isActive }) => <User size={22} strokeWidth={isActive ? 2.5 : 2} />}
            </NavLink>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MobileBottomNav;
