import React, { useState } from 'react';
import { ShoppingBag, Search, User, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoriteContext';

const Navbar = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const { favorites } = useFavorites();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const favoriteCount = Array.isArray(favorites) ? favorites.length : 0;

  const handleSearchClick = () => {
    navigate('/shop', { state: { focusSearch: true } });
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 w-full bg-[#fafafa]/90 backdrop-blur-md border-b border-gray-200/60 transition-all"
    >
      <nav className="flex items-center justify-between px-4 md:px-8 py-3.5 max-w-7xl mx-auto w-full">
        {/* Brand Name Logo */}
        <Link
          to="/"
          className="text-2xl font-serif font-extrabold tracking-wide text-gray-900 cursor-pointer hover:opacity-80 transition-opacity"
        >
          Gwel
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition-colors pb-1 border-b-2 ${
                isActive ? 'text-black border-black font-semibold' : 'text-gray-500 border-transparent hover:text-black'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/shop"
            className={({ isActive }) =>
              `transition-colors pb-1 border-b-2 ${
                isActive ? 'text-black border-black font-semibold' : 'text-gray-500 border-transparent hover:text-black'
              }`
            }
          >
            CAD Library
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `transition-colors pb-1 border-b-2 ${
                isActive ? 'text-black border-black font-semibold' : 'text-gray-500 border-transparent hover:text-black'
              }`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `transition-colors pb-1 border-b-2 ${
                isActive ? 'text-black border-black font-semibold' : 'text-gray-500 border-transparent hover:text-black'
              }`
            }
          >
            Contact
          </NavLink>
        </div>

        {/* Right Actions Container */}
        <div className="flex items-center gap-3">
          {/* Mobile View ONLY: Functioning Cart ShoppingBag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            title="Shopping Cart"
            className="md:hidden relative p-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <ShoppingBag size={22} className="text-gray-800" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Desktop View ONLY: Full Cart, Search, Wishlist & Profile Header Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Wishlist Icon */}
            <button
              onClick={() => navigate('/favorites')}
              title="Wishlist"
              className="relative p-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <Heart size={20} className={favoriteCount > 0 ? 'text-red-500 fill-red-500' : 'text-gray-800'} strokeWidth={1.5} />
              {favoriteCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              title="Shopping Cart"
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <ShoppingBag size={20} className="text-gray-800" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Search Icon */}
            <button
              onClick={handleSearchClick}
              title="Search"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <Search size={20} className="text-gray-800" strokeWidth={1.5} />
            </button>

            {/* User Profile */}
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
                      className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
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
                title="Account Login"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer flex items-center justify-center"
              >
                <User size={20} className="text-gray-800" strokeWidth={1.5} />
              </Link>
            )}
          </div>
        </div>
      </nav>
    </motion.header>
  );
};

export default Navbar;
