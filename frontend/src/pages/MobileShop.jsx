import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Search, Filter, X, Check, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCartStore } from '../store/useCartStore';
import { useFavorites } from '../context/FavoriteContext';
import ProductCard from '../components/ui/ProductCard';

const MobileShop = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { products, loading } = useProducts();
  const addToCart = useCartStore((state) => state.addToCart);
  const { isFavorite } = useFavorites();

  const [selectedBrand, setSelectedBrand] = useState(location.state?.category || 'All');
  const [selectedTag, setSelectedTag] = useState(location.state?.subcategory || 'All');
  const [sortOrder, setSortOrder] = useState('default');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Handle state category changes when navigating from homepage
  useEffect(() => {
    if (location.state?.category) {
      setSelectedBrand(location.state.category);
    }
    if (location.state?.subcategory) {
      setSelectedTag(location.state.subcategory);
    }
  }, [location.state]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBrand, selectedTag, sortOrder]);

  // Reset subcategory filter when category changes
  useEffect(() => {
    setSelectedTag('All');
  }, [selectedBrand]);

  const brands = ['All', ...new Set(products.map((p) => p.brand || p.category))];

  // Filter subcategories list based on selected category
  const tags = useMemo(() => {
    let list = products;
    if (selectedBrand !== 'All') {
      list = list.filter((p) => (p.brand || p.category) === selectedBrand);
    }
    return ['All', ...new Set(list.map((p) => p.tag || p.subcategory).filter(Boolean))];
  }, [products, selectedBrand]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedBrand !== 'All') {
      result = result.filter((p) => (p.brand || p.category) === selectedBrand);
    }

    if (selectedTag !== 'All') {
      result = result.filter((p) => (p.tag || p.subcategory) === selectedTag);
    }

    if (sortOrder === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, selectedBrand, selectedTag, sortOrder]);

  const activeFilterCount =
    (selectedBrand !== 'All' ? 1 : 0) + (selectedTag !== 'All' ? 1 : 0) + (sortOrder !== 'default' ? 1 : 0);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-32 font-sans overflow-x-hidden">
      {/* Header */}
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
            onClick={() => navigate('/shop', { state: { focusSearch: true } })}
            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-xs active:scale-95 transition-transform"
          >
            <Search size={18} className="text-gray-800" />
          </button>
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

          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                selectedBrand === brand
                  ? 'bg-black text-white border-black shadow-xs'
                  : 'bg-white text-gray-700 border-gray-200 shadow-xs'
              }`}
            >
              {brand === 'All' ? 'All Items' : brand}
            </button>
          ))}
        </div>
      </div>

      {/* Subcategory Pills */}
      {tags.length > 1 && (
        <div className="px-4 py-3 bg-white/60 border-b border-gray-100 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider shrink-0 font-mono">
            Subcategory:
          </span>
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                selectedTag === t ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-black'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {/* Main Product Grid */}
      <div className="p-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200/60 animate-pulse rounded-sm border border-gray-200" />
            ))}
          </div>
        ) : paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {paginatedProducts.map((product, index) => (
              <ProductCard key={product.id || product._id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
            <p className="text-gray-500 mb-4 text-xs font-mono">No CAD models found in this category.</p>
            <button
              onClick={() => {
                setSelectedBrand('All');
                setSelectedTag('All');
              }}
              className="text-xs font-bold text-black underline"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 bg-white rounded-full px-5 py-2.5 w-fit mx-auto border border-gray-200 shadow-xs">
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

              {/* Sort Order */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sort Order</h4>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 font-medium"
                >
                  <option value="default font-medium">Featured</option>
                  <option value="price-asc font-medium">Price: Low to High</option>
                  <option value="price-desc font-medium">Price: High to Low</option>
                </select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</h4>
                <div className="flex flex-wrap gap-2">
                  {brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBrand(b)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border ${
                        selectedBrand === b ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-700 border-gray-200'
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
