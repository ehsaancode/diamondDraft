/* eslint-disable */
import React from 'react';
import { ShoppingBag, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full group"
    >
      <div className="text-2xl font-serif font-semibold tracking-wide">
        Gwel
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-800">
        <a href="#" className="hover:text-black transition-colors">Home</a>
        <a href="#" className="hover:text-black transition-colors">Shop</a>
        <a href="#" className="hover:text-black transition-colors">About Us</a>
        <a href="#" className="hover:text-black transition-colors">News</a>
        <a href="#" className="hover:text-black transition-colors">Contact</a>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
          <ShoppingBag size={20} className="text-gray-800" strokeWidth={1.5} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
          <Search size={20} className="text-gray-800" strokeWidth={1.5} />
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
