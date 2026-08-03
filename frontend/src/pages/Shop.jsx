import React, { useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useSearch } from '../hooks/useSearch';
import { useMobile } from '../hooks/useMobile';
import MobileShop from './MobileShop';

const Shop = () => {
  const isMobile = useMobile();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { products, loading } = useProducts();

  const queryCategory = searchParams.get('category') || location.state?.category || 'All';
  const querySubcategory = searchParams.get('subcategory') || location.state?.subcategory || 'All';
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
    clearFilters
  } = useSearch(products, queryCategory, querySubcategory);

  const searchInputRef = useRef(null);

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

  // Focus search input if coming from search icon
  useEffect(() => {
    if (location.state?.focusSearch && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [location.state]);

  if (isMobile) {
    return <MobileShop />;
  }

  return (
    <div className="px-8 py-12 pb-32 md:pb-24 max-w-7xl mx-auto w-full text-gray-900 bg-[#fafafa]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 md:mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-gray-900 mb-2">CAD & Product Catalog</h1>
        <p className="text-gray-500 max-w-2xl text-sm font-sans">
          Browse fine jewelry designs, CAD models, and 3D assets with downloadable formats.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Desktop Sidebar Filters Panel */}
        <aside className="hidden md:flex w-64 flex-col gap-8 shrink-0 sticky top-24 bg-white border border-gray-200 p-6 rounded-3xl shadow-xs">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">
              Search Products
            </h3>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by name, SKU, format..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-900 focus:outline-none focus:border-black focus:bg-white transition-colors font-medium"
            />
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">
              Categories
            </h3>
            <ul className="flex flex-col gap-1.5">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      setSelectedSubcategory('All');
                    }}
                    className={`text-xs text-left w-full px-3 py-2 rounded-xl transition-all ${
                      selectedCategory === category
                        ? 'bg-black text-white font-bold shadow-sm'
                        : 'text-gray-600 hover:text-black hover:bg-gray-100'
                    }`}
                  >
                    {category === 'All' ? 'All Categories' : category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {subcategories.length > 1 && (
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">
                Subcategories
              </h3>
              <ul className="flex flex-col gap-1.5">
                {subcategories.map((tag) => (
                  <li key={tag}>
                    <button
                      onClick={() => setSelectedSubcategory(tag)}
                      className={`text-xs text-left w-full px-3 py-2 rounded-xl transition-all ${
                        selectedSubcategory === tag
                          ? 'bg-black text-white font-bold shadow-sm'
                          : 'text-gray-600 hover:text-black hover:bg-gray-100'
                      }`}
                    >
                      {tag}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">
              Sort By
            </h3>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 cursor-pointer focus:outline-none focus:border-black font-medium"
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 w-full space-y-6">
          <div className="flex justify-between items-center text-xs text-gray-500 font-mono">
            <span>Showing {filteredProducts.length} Products</span>
            {(selectedCategory !== 'All' || selectedSubcategory !== 'All' || searchQuery) && (
              <button
                onClick={clearFilters}
                className="text-black underline font-semibold hover:text-gray-700 cursor-pointer"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-2xl border border-gray-200" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product, index) => (
                  <ProductCard key={product.id || product._id} product={product} index={index} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12 bg-white rounded-full px-6 py-3 w-fit mx-auto border border-gray-200 shadow-xs">
                  <button
                    onClick={() => {
                      setCurrentPage((prev) => Math.max(prev - 1, 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-full transition-colors ${
                      currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex gap-1 overflow-x-auto max-w-[200px] scrollbar-hide px-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentPage(i + 1);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`min-w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all px-3 shrink-0 ${
                          currentPage === i + 1 ? 'bg-black text-white font-extrabold shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-full transition-colors ${
                      currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center bg-white border border-gray-200 rounded-3xl p-8 shadow-xs">
              <p className="text-gray-500 mb-4 text-xs font-mono">No products found matching your search.</p>
              <button
                onClick={clearFilters}
                className="text-xs font-bold text-black underline cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
