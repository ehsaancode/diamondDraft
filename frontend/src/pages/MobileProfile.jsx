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

const MobileProfile = () => {
  const navigate = useNavigate();
  const { favoritesCount } = useFavorites();

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

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-32">
      {/* Profile Header */}
      <div className="bg-white px-6 pt-16 pb-8 rounded-b-[48px] shadow-sm flex flex-col items-center gap-4 text-center">
        <div className="relative">
          <div className="w-28 h-28 bg-gray-100 rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
             <User size={56} className="text-gray-300" />
             {/* Mock User Image would go here */}
          </div>
          <button className="absolute bottom-0 right-0 w-9 h-9 bg-black text-white rounded-full border-2 border-white flex items-center justify-center shadow-lg">
             <Settings size={16} />
          </button>
        </div>
        
        <div>
          <h2 className="text-2xl font-black text-gray-900">Alex Designer</h2>
          <p className="text-sm text-gray-400 font-medium">alex@gwel.io</p>
        </div>

        <div className="flex gap-3 mt-2">
           <span className="px-4 py-1.5 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full">Pro Member</span>
           <span className="px-4 py-1.5 bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-full">ID: #GW2024</span>
        </div>
      </div>

      <main className="px-4 py-8 flex flex-col gap-8">
        {/* Main Menu */}
        <div className="grid grid-cols-1 gap-3">
           {menuItems.map((item) => (
             <motion.button
               key={item.id}
               whileTap={{ scale: 0.98 }}
               onClick={() => navigate(item.path)}
               className="bg-white p-5 rounded-[24px] flex items-center justify-between shadow-sm border border-gray-50 group"
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
                 className="w-full p-5 flex items-center justify-between group"
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
        <button className="flex items-center justify-center gap-3 py-5 text-red-500 font-bold text-sm bg-white rounded-[24px] shadow-sm border border-gray-50 active:scale-95 transition-transform backdrop-blur-sm">
           <LogOut size={20} />
           Sign Out
        </button>
      </main>
    </div>
  );
};

export default MobileProfile;
