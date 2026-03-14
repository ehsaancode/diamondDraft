import React from 'react';
import { ArrowUpRight, Instagram, Facebook } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <footer className={`bg-[#030b1a] text-white py-16 px-8 justify-center w-full ${isHome ? 'flex' : 'hidden md:flex'}`}>
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1.5fr] border border-white/10 overflow-hidden">
          
          {/* Left Column */}
          <div className="border-b md:border-b-0 md:border-r border-white/10 flex flex-col">
            <div className="p-8 py-10 border-b border-white/10 flex items-center justify-between md:justify-start">
              <span className="text-2xl font-serif tracking-wide">Gwel</span>
              {/* Mobile Socials */}
              <div className="flex gap-4 md:hidden">
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  <Instagram size={18} strokeWidth={1.5} />
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  <Facebook size={18} strokeWidth={1.5} />
                </a>
              </div>
            </div>
            <div className="p-8 py-12 flex-1 hidden md:block">
              <h2 className="text-4xl lg:text-5xl font-serif leading-[1.2] text-white/90">
                Crafting Your<br/>Vision Into<br/>Precision<br/>CAD Models
              </h2>
            </div>
          </div>

          {/* Middle Column - Hidden on Mobile */}
          <div className="hidden md:flex border-r border-white/10 flex-col">
            <div className="p-8 py-12 border-b border-white/10 flex-1">
              <nav className="flex flex-col gap-5 text-[11px] font-bold tracking-widest uppercase">
                <Link to="/" className="hover:text-gray-300 transition-colors">Home</Link>
                <Link to="/shop" className="hover:text-gray-300 transition-colors">CAD Library</Link>
                <Link to="/about" className="hover:text-gray-300 transition-colors">About Us</Link>
                <a href="#" className="hover:text-gray-300 transition-colors">News</a>
                <a href="#" className="hover:text-gray-300 transition-colors">Contact</a>
              </nav>
            </div>
            <div className="p-8 py-10">
              <nav className="flex flex-col gap-5 text-[11px] font-bold tracking-widest uppercase">
                <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-gray-300 transition-colors">Agreement (Offer)</a>
                <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-gray-300 transition-colors">FAQ</a>
              </nav>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col">
            <div className="p-8 py-12 border-b border-white/10 flex-1 flex flex-col justify-center">
              <h3 className="text-base md:text-[17px] font-medium mb-3 tracking-wide leading-snug uppercase">
                Stay updated with Gwel
              </h3>
              <p className="text-[10px] md:text-xs text-white/40 mb-8 tracking-wide uppercase">Join our premium mailing list</p>
              
              <div className="flex bg-white items-center p-1.5 pl-4 mb-4">
                <input 
                  type="email" 
                  placeholder="E-mail" 
                  className="flex-1 outline-none text-black text-sm placeholder-gray-400 bg-transparent font-medium"
                />
                <button className="p-1 px-3 hover:bg-gray-100 transition-colors cursor-pointer text-black">
                  <ArrowUpRight size={18} className="text-black" strokeWidth={1.5} />
                </button>
              </div>
              
              <label className="flex items-start gap-3 cursor-pointer group mt-2">
                <div className="w-3 h-3 border border-white/30 mt-[2px] group-hover:bg-white transition-colors" />
                <span className="text-[9px] uppercase tracking-wider text-white/40 leading-relaxed font-medium">
                  I accept the Privacy Policy for marketing communications
                </span>
              </label>
            </div>
            <div className="hidden md:grid grid-cols-2 h-[80px] md:h-[90px]">
              <a href="#" className="border-r border-white/10 hover:bg-white/5 transition-colors flex items-center justify-center group" aria-label="Instagram">
                <Instagram size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="hover:bg-white/5 transition-colors flex items-center justify-center group" aria-label="Facebook">
                <Facebook size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
