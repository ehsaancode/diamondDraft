import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';

export const Header = ({ setIsOpen }) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 glass-panel rounded-none border-t-0 border-l-0 border-r-0 lg:px-10">
      <div className="flex items-center gap-4">
        <button className="lg:hidden text-zinc-400 hover:text-white transition-colors" onClick={() => setIsOpen(true)}>
          <Menu size={24} />
        </button>
        <div className="hidden md:flex items-center bg-surfaceHover border border-border rounded-lg px-3 py-2 w-64 focus-within:ring-2 focus-within:ring-primary-500/50 transition-all">
          <Search size={18} className="text-zinc-500" />
          <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm ml-2 w-full text-zinc-100 placeholder-zinc-500" />
        </div>
      </div>

      <div className="flex items-center gap-4 border-l border-border pl-4 ml-4">
        <button className="p-2 relative text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-surfaceHover">
          <Bell size={20} />
          <span className="absolute top-1 right-2 w-2 h-2 bg-primary-500 rounded-full shadow-[0_0_8px_#10b981]"></span>
        </button>
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-surfaceHover border border-border overflow-hidden">
            <img src="https://ui-avatars.com/api/?name=Admin+User&background=10b981&color=fff" alt="Admin" className="w-full h-full object-cover" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-zinc-100 group-hover:text-primary-400 transition-colors">Admin User</p>
            <p className="text-xs text-zinc-500">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};
