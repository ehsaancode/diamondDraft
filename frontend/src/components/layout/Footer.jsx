import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#030b1a] text-white py-16 px-8 flex justify-center w-full">
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1.5fr] border border-white/10">
          
          {/* Left Column */}
          <div className="border-r border-white/10 flex flex-col">
            <div className="p-8 py-10 border-b border-white/10 flex items-center">
              <span className="text-2xl font-serif tracking-wide">Gwel</span>
            </div>
            <div className="p-8 py-12 flex-1">
              <h2 className="text-4xl lg:text-5xl font-serif leading-[1.2] text-white/90">
                Unveil Your<br/>New<br/>Everyday<br/>Jewelry<br/>Collection
              </h2>
            </div>
          </div>

          {/* Middle Column */}
          <div className="border-r border-white/10 flex flex-col">
            <div className="p-8 py-12 border-b border-white/10 flex-1">
              <nav className="flex flex-col gap-5 text-[11px] font-bold tracking-widest uppercase">
                <a href="#" className="hover:text-gray-300 transition-colors">Home</a>
                <a href="#" className="hover:text-gray-300 transition-colors">Shop</a>
                <a href="#" className="hover:text-gray-300 transition-colors">About Us</a>
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
              <h3 className="text-[17px] font-medium mb-3 tracking-wide leading-snug">
                GET THE LATEST NEWS AND<br/>UPDATES ABOUT CHICOLLE
              </h3>
              <p className="text-xs text-white/60 mb-8 tracking-wide">Join the mailing list</p>
              
              <div className="flex bg-white items-center p-2 pl-4 mb-4">
                <input 
                  type="email" 
                  placeholder="E-mail" 
                  className="flex-1 outline-none text-black text-sm placeholder-gray-400 bg-transparent font-medium"
                />
                <button className="p-1 px-3 hover:bg-gray-100 transition-colors cursor-pointer text-black">
                  <ArrowUpRight size={20} className="text-black" strokeWidth={1.5} />
                </button>
              </div>
              
              <label className="flex items-start gap-3 cursor-pointer group mt-2">
                <div className="w-3.5 h-3.5 border border-white/50 mt-[3px] group-hover:bg-white transition-colors" />
                <span className="text-[10px] uppercase tracking-wider text-white/60 leading-relaxed font-medium">
                  I've read the Privacy Policy to sent me marketing e-mail
                </span>
              </label>
            </div>
            <div className="grid grid-cols-2 h-[90px]">
              <a href="#" className="border-r border-white/10 text-[11px] font-bold tracking-widest uppercase hover:bg-white/5 transition-colors flex items-center justify-center">
                Instagram
              </a>
              <a href="#" className="text-[11px] font-bold tracking-widest uppercase hover:bg-white/5 transition-colors flex items-center justify-center">
                Facebook
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
