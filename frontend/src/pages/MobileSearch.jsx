import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Search, Mic, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import SearchSuggestionsDropdown from '../components/search/SearchSuggestionsDropdown';

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
  const { products } = useProducts();
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate('/shop', { state: { query: query.trim() } });
    }
  };

  return (
    <div className="bg-white min-h-screen pb-32 font-sans">
      <div className="p-4 flex flex-col gap-4 sticky top-0 bg-white/95 backdrop-blur-md z-30 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-800" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Search CAD Catalog</h1>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            autoFocus
            type="text" 
            placeholder="Search rings, pendants, CAD formats..." 
            value={query}
            onFocus={() => setShowSuggestions(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium text-gray-900 focus:outline-none focus:border-black focus:bg-white transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-black px-1"
            >
              ✕
            </button>
          )}

          {showSuggestions && query && (
            <SearchSuggestionsDropdown
              query={query}
              products={products}
              onSelectSuggestion={(selected) => {
                setQuery(selected);
                navigate('/shop', { state: { query: selected } });
              }}
              onClose={() => setShowSuggestions(false)}
            />
          )}
        </form>
      </div>

      <main className="p-4 space-y-6">
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Popular CAD Categories</h2>
          <div className="flex flex-col gap-1">
            {searchCategories.map((cat, idx) => (
              <motion.div 
                key={idx}
                whileTap={{ x: 4 }}
                onClick={() => navigate('/shop', { state: { category: cat.name } })}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span className="text-xs font-bold text-gray-800">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 font-mono">{cat.count} models</span>
                  <ArrowRight size={14} className="text-gray-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Popular Search Tags</h2>
          <div className="flex flex-wrap gap-2">
            {['Solitaire Ring', 'Halo Setting', 'Wedding Band', 'Vintage CAD', 'Diamond Studs', 'Pendant'].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate('/shop', { state: { query: tag } })}
                className="px-4 py-2 bg-gray-100 hover:bg-black hover:text-white rounded-full text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MobileSearch;
