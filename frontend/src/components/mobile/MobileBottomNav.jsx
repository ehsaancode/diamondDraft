import React from 'react';
import { Home, ShoppingBag, Heart, User, Search } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const MobileBottomNav = () => {
  const { setIsCartOpen, cartCount } = useCart();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl shadow-gray-200/50 rounded-[40px] px-6 py-4 flex items-center justify-between z-50">
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
    </div>
  );
};

export default MobileBottomNav;
