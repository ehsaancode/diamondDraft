import React from 'react';
import { Search, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MobileHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 p-4 pb-0 bg-white sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <h1 className="text-2xl font-serif italic font-black text-black tracking-widest">GWEL</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">CAD Library</span>
            <span className="text-xs font-black text-gray-900 flex items-center gap-1.5">
              Instant Access
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </span>
          </div>
        </div>
      </div>
      
      <div 
        className="relative group cursor-pointer"
        onClick={() => navigate('/search')}
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          readOnly
          placeholder="Search for jewellery CAD models..." 
          className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-0 cursor-pointer transition-all"
        />
      </div>
    </div>
  );
};

export default MobileHeader;
