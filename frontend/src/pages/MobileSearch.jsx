import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Search, Mic, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MobileBottomNav from '../components/mobile/MobileBottomNav';

const searchCategories = [
  { name: 'Ring Settings', count: 124 },
  { name: 'Engagement Rims', count: 85 },
  { name: 'Pendant CADs', count: 210 },
  { name: 'Diamond Studs', count: 64 },
  { name: 'Eternity Bands', count: 42 },
  { name: 'Bracelet Links', count: 18 },
];

const MobileSearch = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen pb-32">
      <div className="p-4 flex flex-col gap-6 sticky top-0 bg-white z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 border border-gray-100 rounded-full">
            <ChevronLeft size={22} />
          </button>
          <h1 className="text-xl font-bold">Search</h1>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            autoFocus
            type="text" 
            placeholder="Search CAD models..." 
            className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-green-500/20"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Mic size={20} />
          </button>
        </div>
      </div>

      <main className="p-4">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Popular Categories</h2>
        <div className="flex flex-col gap-1">
          {searchCategories.map((cat, idx) => (
            <motion.div 
              key={idx}
              whileTap={{ x: 5 }}
              onClick={() => navigate('/shop')}
              className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="font-semibold text-gray-700">{cat.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">{cat.count} files</span>
                <ArrowRight size={16} className="text-gray-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <div className="p-4">
         <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Recent Searches</h2>
         <div className="flex flex-wrap gap-2">
            {['Solitaire', 'Halo Ring', 'Wedding Band', 'Vintage'].map((tag) => (
              <span key={tag} className="px-4 py-2 bg-gray-100 rounded-full text-xs font-semibold text-gray-600">
                {tag}
              </span>
            ))}
         </div>
      </div>
    </div>
  );
};

export default MobileSearch;
