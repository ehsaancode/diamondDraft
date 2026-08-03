import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Search, Filter, X, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useSearch } from '../hooks/useSearch';
import ProductCard from '../components/ui/ProductCard';

const MobileShop = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { products, loading } = useProducts();

  const queryCategory = location.state?.category || 'All';
  const querySubcategory = location.state?.subcategory || 'All';
  const initialQuery = location.state?.query || '';

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    totalPages,
    categories,
    subcategories,
    filteredProducts,
    paginatedProducts,
    activeFilterCount,
    clearFilters
  } = useSearch(products, queryCategory, querySubcategory);

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery, setSearchQuery]);

  useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
    }
    if (location.state?.subcategory) {
      setSelectedSubcategory(location.state.subcategory);
    }
  }, [location.state, setSelectedCategory, setSelectedSubcategory]);

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-36 font-sans overflow-x-hidden">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-100/80 sticky top-0 z-40 px-4 py-4 flex flex-col gap-4 shadow-xs">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-xs active:scale-95 transition-transform"
          >
            <ChevronLeft size={20} className="text-gray-800" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">CAD Gallery</h1>
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-xs active:scale-95 transition-transform"
          >
            <Search size={18} className="text-gray-800" />
          </button>
        </div>

        {/* Global Search Input Field */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, SKU, format (.stl, .3dm)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-gray-900 focus:outline-none focus:border-black focus:bg-white transition-all font-medium"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Global Category Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setIsFilterDrawerOpen(true)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 border transition-all ${
              activeFilterCount > 0
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-700 border-gray-200 shadow-xs'
            }`}
          >
            <Filter size={14} />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-black text-[10px] font-black flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setSelectedSubcategory('All');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                selectedCategory === category
                  ? 'bg-black text-white border-black shadow-xs'
                  : 'bg-white text-gray-700 border-gray-200 shadow-xs'
              }`}
            >
              {category === 'All' ? 'All Items' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Subcategory Pills */}
      {subcategories.length > 1 && (
        <div className="px-4 py-3 bg-white/60 border-b border-gray-100 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0 font-mono">
            Subcategory:
          </span>
          {subcategories.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedSubcategory(t)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                selectedSubcategory === t ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {/* Status Bar */}
      <div className="px-4 pt-3 flex justify-between items-center text-xs text-gray-500 font-mono">
        {loading ? (
          <span className="flex items-center gap-2 text-gray-700 font-semibold">
            <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            Loading CAD Catalog...
          </span>
        ) : (
          <span>Showing {filteredProducts.length} Items</span>
        )}
      </div>

      {/* Main Product Grid */}
      <div className="p-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200/60 animate-pulse rounded-sm border border-gray-200" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {paginatedProducts.map((product, index) => (
              <ProductCard key={product.id || product._id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
            <p className="text-gray-500 mb-4 text-xs font-mono">No CAD models found matching your search.</p>
            <button
              onClick={clearFilters}
              className="text-xs font-bold text-black underline"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 bg-white rounded-full px-5 py-2.5 w-fit mx-auto border border-gray-200 shadow-xs mb-8">
            <button
              onClick={() => {
                setCurrentPage((prev) => Math.max(prev - 1, 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className={`p-1.5 rounded-full ${
                currentPage === 1 ? 'text-gray-300' : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs font-bold text-gray-900 font-mono px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => {
                setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className={`p-1.5 rounded-full ${
                currentPage === totalPages ? 'text-gray-300' : 'text-gray-800 hover:bg-gray-100'
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Filter Modal Drawer */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterDrawerOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 inset-x-0 z-50 bg-white rounded-t-3xl p-6 space-y-6 max-h-[85vh] overflow-y-auto text-gray-900"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold">Filter & Sort CADs</h3>
                <button onClick={() => setIsFilterDrawerOpen(false)} className="p-2 text-gray-400">
                  <X size={20} />
                </button>
              </div>

              {/* Search input in modal */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Search Keyword</h4>
                <input
                  type="text"
                  placeholder="Search name, SKU, format..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 font-medium"
                />
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sort Order</h4>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 font-medium"
                >
                  <option value="default">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((b) => (
                    <button
                      key={b}
                      onClick={() => {
                        setSelectedCategory(b);
                        setSelectedSubcategory('All');
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border ${
                        selectedCategory === b ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-full py-3 bg-black text-white font-bold text-xs rounded-xl uppercase tracking-wider shadow-md"
              >
                Apply Filters ({filteredProducts.length} items)
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileShop;
