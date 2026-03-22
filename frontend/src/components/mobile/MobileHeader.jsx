import React from 'react';
import { MapPin, Search, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MobileHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 p-4 pb-0 bg-white sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-red-50 p-1.5 rounded-full">
            <MapPin size={18} className="text-red-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Delivery to</span>
            <span className="text-sm font-semibold flex items-center">
              New York City <span className="ml-1 text-[10px] transform rotate-90">›</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/favorites')}
            className="p-2 border border-gray-100 rounded-full bg-white shadow-sm"
          >
            <Heart size={20} className="text-gray-600" />
          </button>
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
