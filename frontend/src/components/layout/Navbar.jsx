import React from 'react';
import { ShoppingBag, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { cartCount, setIsCartOpen } = useCart();
  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 w-full bg-[#fafafa]/80 backdrop-blur-md transition-all"
    >
      <nav className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto w-full group">
      <div className="text-2xl font-serif font-semibold tracking-wide">
        Gwel
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-800">
        <a href="#" className="hover:text-black transition-colors">Home</a>
        <a href="#" className="hover:text-black transition-colors">Shop</a>
        <a href="#" className="hover:text-black transition-colors">About</a>
        <a href="#" className="hover:text-black transition-colors">Contact</a>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <ShoppingBag size={20} className="text-gray-800" strokeWidth={1.5} />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
          <Search size={20} className="text-gray-800" strokeWidth={1.5} />
        </button>
      </div>
      </nav>
    </motion.header>
  );
};

export default Navbar;
