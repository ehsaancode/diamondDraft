import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Package, 
  Settings, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  CreditCard,
  User,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoriteContext';
import { useAuth } from '../context/AuthContext';

const MobileProfile = () => {
  const navigate = useNavigate();
  const { favoritesCount } = useFavorites();
  const { user, loading, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { 
      id: 'favorites', 
      label: 'My Favorites', 
      icon: <Heart size={20} className="text-red-500" />, 
      count: favoritesCount,
      path: '/favorites',
      color: 'bg-red-50'
    },
    { 
      id: 'orders', 
      label: 'Order History', 
      icon: <Package size={20} className="text-blue-500" />, 
      path: '/orders',
      color: 'bg-blue-50'
    },
    { 
      id: 'payments', 
      label: 'Payments', 
      icon: <CreditCard size={20} className="text-emerald-500" />, 
      path: '/payments',
      color: 'bg-emerald-50'
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: <Bell size={20} className="text-yellow-500" />, 
      path: '/notifications',
      color: 'bg-yellow-50'
    },
  ];

  const supportItems = [
    { id: 'settings', label: 'Account Settings', icon: <Settings size={20} className="text-gray-500" />, path: '/settings' },
    { id: 'privacy', label: 'Privacy & Security', icon: <ShieldCheck size={20} className="text-gray-500" />, path: '/privacy' },
    { id: 'help', label: 'Help & Support', icon: <HelpCircle size={20} className="text-gray-500" />, path: '/help' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[#f8f9fa] min-h-[80vh] flex flex-col items-center justify-center px-6 py-12">
        <div className="bg-white p-8 rounded-[32px] shadow-md border border-gray-100/50 w-full max-w-sm text-center flex flex-col items-center gap-6">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
            <User size={40} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 font-serif">Sign in to your account</h2>
            <p className="text-sm text-gray-500 mt-2">Access your favorites, orders, and manage your account settings.</p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-black text-white hover:bg-gray-900 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 active:scale-[0.98] cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-32">
      {/* Profile Header */}
      <div className="bg-white px-6 pt-16 pb-8 rounded-b-[48px] shadow-sm flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <div className="w-28 h-28 bg-gray-100 rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
             <User size={56} className="text-gray-300" />
          </div>
          <button className="absolute bottom-0 right-0 w-9 h-9 bg-black text-white rounded-full border-2 border-white flex items-center justify-center shadow-lg">
             <Settings size={16} />
          </button>
        </div>
        
        <div>
          <h2 className="text-2xl font-black text-gray-900">{user.name}</h2>
          <p className="text-sm text-gray-400 font-medium">{user.email}</p>
        </div>

        <div className="flex gap-3 mt-2">
           <span className="px-4 py-1.5 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full">Pro Member</span>
           <span className="px-4 py-1.5 bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-full">
             ID: #{user.id ? user.id.substring(0, 6).toUpperCase() : 'USER'}
           </span>
        </div>
      </div>

      <main className="px-4 py-8 flex flex-col gap-8 max-w-lg mx-auto">
        {/* Main Menu */}
        <div className="grid grid-cols-1 gap-3">
           {menuItems.map((item) => (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(item.path)}
                className="bg-white p-5 rounded-[24px] flex items-center justify-between shadow-sm border border-gray-50 group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                     {item.label === 'My Favorites' ? <Heart size={22} className="text-red-500" fill={favoritesCount > 0 ? "currentColor" : "none"} /> : item.icon}
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-gray-900">{item.label}</h3>
                    {item.count !== undefined && (
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{item.count} items</p>
                    )}
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300" />
              </motion.button>
           ))}
        </div>

        {/* Support & Settings */}
        <div className="bg-white rounded-[32px] p-2 shadow-sm border border-gray-50">
           {supportItems.map((item, idx) => (
              <React.Fragment key={item.id}>
                <button 
                  onClick={() => navigate(item.path)}
                  className="w-full p-5 flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-4 text-gray-600">
                     {item.icon}
                     <span className="text-sm font-semibold">{item.label}</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
                </button>
                {idx < supportItems.length - 1 && <div className="h-px bg-gray-50 mx-4" />}
              </React.Fragment>
           ))}
        </div>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 py-5 text-red-500 font-bold text-sm bg-white rounded-[24px] shadow-sm border border-gray-50 active:scale-95 transition-transform backdrop-blur-sm cursor-pointer"
        >
           <LogOut size={20} />
           Sign Out
        </button>
      </main>
    </div>
  );
};

export default MobileProfile;
