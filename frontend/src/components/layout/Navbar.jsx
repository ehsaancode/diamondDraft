import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchClick = () => {
    setIsMobileMenuOpen(false);
    navigate('/shop', { state: { focusSearch: true } });
  };

  return (
    <>
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 w-full bg-[#fafafa]/80 backdrop-blur-md transition-all"
      >
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full group">
      
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden p-2 -ml-2 text-gray-800 focus:outline-none"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu size={24} />
      </button>

      <Link to="/" className="text-2xl font-serif font-semibold tracking-wide cursor-pointer hover:opacity-80 transition-opacity">
        Gwel
      </Link>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
        <NavLink to="/" className={({ isActive }) => `transition-colors pb-1 border-b-2 ${isActive ? 'text-black border-black' : 'text-gray-500 border-transparent hover:text-black'}`}>Home</NavLink>
        <NavLink to="/shop" className={({ isActive }) => `transition-colors pb-1 border-b-2 ${isActive ? 'text-black border-black' : 'text-gray-500 border-transparent hover:text-black'}`}>CAD Library</NavLink>
        <NavLink to="/about" className={({ isActive }) => `transition-colors pb-1 border-b-2 ${isActive ? 'text-black border-black' : 'text-gray-500 border-transparent hover:text-black'}`}>About</NavLink>
        <NavLink to="/contact" className={({ isActive }) => `transition-colors pb-1 border-b-2 ${isActive ? 'text-black border-black' : 'text-gray-500 border-transparent hover:text-black'}`}>Contact</NavLink>
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
        <button 
          onClick={handleSearchClick}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <Search size={20} className="text-gray-800" strokeWidth={1.5} />
        </button>
        
        {/* User profile dropdown */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer flex items-center justify-center"
            >
              <User size={20} className="text-gray-800" strokeWidth={1.5} />
            </button>
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
                >
                  <div className="px-4 py-2 border-b border-gray-50">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link
            to="/login"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer flex items-center justify-center"
          >
            <User size={20} className="text-gray-800" strokeWidth={1.5} />
          </Link>
        )}
      </div>
      </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60] md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-[70] shadow-2xl flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <span className="text-xl font-serif font-bold">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} className="text-gray-900" />
                </button>
              </div>
              <div className="flex flex-col p-6 gap-6 text-lg font-medium">
                <NavLink to="/" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `pb-2 border-b ${isActive ? 'text-black border-black' : 'text-gray-500 border-gray-100'}`}>Home</NavLink>
                <NavLink to="/shop" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `pb-2 border-b ${isActive ? 'text-black border-black' : 'text-gray-500 border-gray-100'}`}>CAD Library</NavLink>
                <NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `pb-2 border-b ${isActive ? 'text-black border-black' : 'text-gray-500 border-gray-100'}`}>About</NavLink>
                <NavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `pb-2 border-b ${isActive ? 'text-black border-black' : 'text-gray-500 border-gray-100'}`}>Contact</NavLink>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
