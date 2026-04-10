import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Search, Plus, Heart, ChevronDown, Filter, X, Check, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoriteContext';

const MobileShop = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBrand, selectedTag, sortOrder]);

  const brands = ['All', ...new Set(products.map(p => p.brand))];
  const tags = ['All', ...new Set(products.map(p => p.tag).filter(Boolean))];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedBrand !== 'All') {
      result = result.filter(p => p.brand === selectedBrand);
    }

    if (selectedTag !== 'All') {
      result = result.filter(p => p.tag === selectedTag);
    }

    if (sortOrder === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [selectedBrand, selectedTag, sortOrder]);

  const activeFilterCount = (selectedBrand !== 'All' ? 1 : 0) + (selectedTag !== 'All' ? 1 : 0) + (sortOrder !== 'default' ? 1 : 0);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-32 font-sans overflow-x-hidden">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 py-4 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="w-11 h-11 flex items-center justify-center bg-white border border-gray-50 rounded-full shadow-sm active:scale-95 transition-transform">
            <ChevronLeft size={22} className="text-gray-800" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">CAD Gallery</h1>
          <button 
            onClick={() => navigate('/search')}
            className="w-11 h-11 flex items-center justify-center bg-white border border-gray-100 rounded-full shadow-sm active:scale-95 transition-transform"
          >
            <Search size={20} className="text-gray-800" />
          </button>
        </div>

        {/* Global Filters Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
          <button 
            onClick={() => setIsFilterDrawerOpen(true)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all border ${activeFilterCount > 0 ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-100'}`}
          >
            <Filter size={16} /> 
            Filters
            {activeFilterCount > 0 && <span className="bg-white text-black w-4 h-4 rounded-full text-[10px] flex items-center justify-center">{activeFilterCount}</span>}
          </button>

          <div className="h-6 w-px bg-gray-200 shrink-0" />

          {['All', 'Wedding', 'New Design', 'Classic'].map((tag) => (
            <button 
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap shadow-sm transition-all border ${selectedTag === tag ? 'bg-green-900 text-white border-green-900' : 'bg-white text-gray-500 border-gray-100'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <main className="p-4 pt-6">
        <div className="flex justify-between items-center mb-6 px-2">
           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{filteredProducts.length} Designs Found</p>
           {activeFilterCount > 0 && (
             <button 
               onClick={() => {
                 setSelectedBrand('All');
                 setSelectedTag('All');
                 setSortOrder('default');
               }}
               className="text-xs font-bold text-red-500 underline"
             >
               Clear All
             </button>
           )}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          <AnimatePresence mode='popLayout'>
            {paginatedProducts.map((product) => (
              <motion.div 
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => navigate(`/product/${product.id}`, { state: product })}
                className="bg-white rounded-[40px] p-2.5 flex flex-col gap-3 shadow-sm border border-gray-50/50 group relative cursor-pointer"
              >
                <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden bg-[#f0f2f5] flex items-center justify-center p-3">
                  <img 
                    src={product.image || '/images/jewellery_cad_ring.png'} 
                    alt={product.name} 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                  />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product);
                    }}
                    className={`absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:bg-white active:scale-90 transition-all z-10 ${isFavorite(product.id) ? 'text-red-500' : 'text-gray-400'}`}
                  >
                    <Heart size={18} fill={isFavorite(product.id) ? "currentColor" : "none"} strokeWidth={2} />
                  </button>
                </div>
                
                <div className="px-2 pb-1 flex-1 flex flex-col">
                  <h3 className="text-[13px] font-bold text-gray-900 line-clamp-2 leading-tight h-8 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">{product.brand}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-red-400 line-through font-bold opacity-60">₹{(product.price * 1.2).toLocaleString('en-IN')}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, 'CAD');
                        navigate('/cart');
                      }}
                      className="w-10 h-10 rounded-2xl bg-black flex items-center justify-center text-white shadow-lg active:scale-90 transition-all"
                    >
                      <Plus size={20} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-1.5 mt-8 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2.5 w-fit mx-auto border border-gray-100 shadow-sm">
            <button 
              onClick={() => {
                setCurrentPage(prev => Math.max(prev - 1, 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className={`p-1.5 rounded-full transition-colors ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex gap-1 overflow-x-auto max-w-[150px] scrollbar-hide px-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentPage(i + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`min-w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all px-2 shrink-0 ${currentPage === i + 1 ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button 
              onClick={() => {
                setCurrentPage(prev => Math.min(prev + 1, totalPages));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className={`p-1.5 rounded-full transition-colors ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
               <Search size={40} />
            </div>
            <div>
               <h3 className="text-lg font-bold text-gray-900">No designs found</h3>
               <p className="text-sm text-gray-400 max-w-[200px] mt-1">Try adjusting your filters to find what you're looking for.</p>
            </div>
            <button 
              onClick={() => {
                setSelectedBrand('All');
                setSelectedTag('All');
              }}
              className="mt-4 px-8 py-3 bg-black text-white rounded-2xl font-bold text-sm"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Filter Drawer */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 px-4 flex items-end justify-center"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 inset-x-0 bg-white z-[60] rounded-t-[48px] max-h-[85vh] overflow-y-auto pb-10 shadow-2xl"
            >
              <div className="p-6 flex flex-col gap-8">
                <div className="flex items-center justify-between">
                   <h2 className="text-2xl font-black text-gray-900">Filter & Sort</h2>
                   <button onClick={() => setIsFilterDrawerOpen(false)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 active:scale-90">
                      <X size={20} />
                   </button>
                </div>

                {/* Sort Section */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2">Sort By</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'default', label: 'Featured (Default)' },
                      { id: 'price-asc', label: 'Price: Low to High' },
                      { id: 'price-desc', label: 'Price: High to Low' },
                    ].map((opt) => (
                      <button 
                        key={opt.id}
                        onClick={() => setSortOrder(opt.id)}
                        className={`flex items-center justify-between p-5 rounded-3xl transition-all ${sortOrder === opt.id ? 'bg-green-50 text-green-700 border-2 border-green-200' : 'bg-gray-50 text-gray-600 border-2 border-transparent'}`}
                      >
                        <span className="font-bold text-sm">{opt.label}</span>
                        {sortOrder === opt.id && <Check size={18} strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Brand Section */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2">Brand</h3>
                  <div className="flex flex-wrap gap-2">
                    {brands.map((brand) => (
                      <button 
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${selectedBrand === brand ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'}`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags Section */}
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2">Collection</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button 
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${selectedTag === tag ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="w-full py-5 bg-black text-white rounded-[24px] font-black text-lg shadow-xl shadow-black/20 mt-4 active:scale-95 transition-transform"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileShop;
