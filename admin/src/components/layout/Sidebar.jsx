import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", to: "/" },
    { icon: <Package size={20} />, label: "Products", to: "/products" },
    { icon: <PlusCircle size={20} />, label: "Add Product", to: "/add-product" },
    { icon: <Settings size={20} />, label: "Settings", to: "/settings" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside 
        className={`fixed left-0 top-0 h-screen w-64 bg-surface border-r border-border z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-500 to-accent flex items-center justify-center shadow-neon">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <h1 className="text-xl font-bold font-grotesk tracking-tight">
              Gwel<span className="text-primary-500">Admin</span>
            </h1>
          </div>
          <button className="lg:hidden text-zinc-400 hover:text-white" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
            return (
              <Link key={item.to} to={item.to} onClick={() => setIsOpen(false)}>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20' 
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-surfaceHover border border-transparent'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-zinc-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent rounded-xl transition-all duration-300 group">
            <LogOut size={20} className="group-hover:text-red-500 transition-colors" />
            <span className="font-medium group-hover:text-red-500 transition-colors">Logout</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};
