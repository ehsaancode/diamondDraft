import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useMobile } from '../hooks/useMobile';
import MobileShop from './MobileShop';

const Shop = () => {
  const isMobile = useMobile();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { products, loading } = useProducts();

  const queryCategory = searchParams.get('category') || location.state?.category || 'All';
  const querySubcategory = searchParams.get('subcategory') || location.state?.subcategory || 'All';

  const [selectedBrand, setSelectedBrand] = useState(queryCategory);
  const [selectedTag, setSelectedTag] = useState(querySubcategory);
  const [sortOrder, setSortOrder] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const searchInputRef = useRef(null);

  // Sync category changes from navigation state or URL query
  useEffect(() => {
    const cat = searchParams.get('category') || location.state?.category || 'All';
    const sub = searchParams.get('subcategory') || location.state?.subcategory || 'All';
    setSelectedBrand(cat);
    setSelectedTag(sub);
  }, [location.state, searchParams]);

  // Focus search input if coming from search icon
  useEffect(() => {
    if (location.state?.focusSearch && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [location.state]);

  // Debounce effect for search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedBrand, selectedTag, sortOrder, debouncedSearchQuery]);

  const brands = ['All', ...new Set(products.map((p) => p.brand || p.category))];

  // Filter subcategories list based on selected category
  const tags = useMemo(() => {
    let list = products;
    if (selectedBrand !== 'All') {
      list = list.filter((p) => (p.brand || p.category) === selectedBrand);
    }
    return ['All', ...new Set(list.map((p) => p.tag || p.subcategory).filter(Boolean))];
  }, [products, selectedBrand]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (selectedBrand !== 'All') {
      result = result.filter((p) => (p.brand || p.category) === selectedBrand);
    }

    if (selectedTag !== 'All') {
      result = result.filter((p) => (p.tag || p.subcategory) === selectedTag);
    }

    if (debouncedSearchQuery.trim() !== '') {
      const lowerQuery = debouncedSearchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          (p.brand && p.brand.toLowerCase().includes(lowerQuery)) ||
          (p.category && p.category.toLowerCase().includes(lowerQuery)) ||
          (p.id && String(p.id).toLowerCase().includes(lowerQuery))
      );
    }

    if (sortOrder === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, selectedBrand, selectedTag, sortOrder, debouncedSearchQuery]);

  if (isMobile) {
    return <MobileShop />;
  }

  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="px-8 py-12 max-w-7xl mx-auto w-full text-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 md:mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">CAD & Product Catalog</h1>
        <p className="text-slate-400 max-w-2xl text-sm">
          Browse fine jewelry designs, CAD models, and 3D assets.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:flex w-64 flex-col gap-8 shrink-0 sticky top-24 bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pb-2 border-b border-slate-800">
              Search Products
            </h3>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by name, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none focus:border-slate-600 transition-colors"
            />
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pb-2 border-b border-slate-800">
              Categories
            </h3>
            <ul className="flex flex-col gap-1.5">
              {brands.map((brand) => (
                <li key={brand}>
                  <button
                    onClick={() => {
                      setSelectedBrand(brand);
                      setSelectedTag('All');
                    }}
                    className={`text-xs text-left w-full px-3 py-2 rounded-xl transition-all ${
                      selectedBrand === brand
                        ? 'bg-slate-800 border border-slate-700 text-white font-bold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                    }`}
                  >
                    {brand === 'All' ? 'All Categories' : brand}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {tags.length > 1 && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pb-2 border-b border-slate-800">
                Subcategories
              </h3>
              <ul className="flex flex-col gap-1.5">
                {tags.map((tag) => (
                  <li key={tag}>
                    <button
                      onClick={() => setSelectedTag(tag)}
                      className={`text-xs text-left w-full px-3 py-2 rounded-xl transition-all ${
                        selectedTag === tag
                          ? 'bg-slate-800 border border-slate-700 text-white font-bold shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
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
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pb-2 border-b border-slate-800">
              Sort By
            </h3>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 cursor-pointer focus:outline-none focus:border-slate-600"
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 w-full space-y-6">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>Showing {filteredAndSortedProducts.length} Products</span>
            {(selectedBrand !== 'All' || selectedTag !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedBrand('All');
                  setSelectedTag('All');
                  setSearchQuery('');
                }}
                className="text-slate-300 underline font-semibold hover:text-white"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 bg-slate-900 animate-pulse rounded-3xl border border-slate-800" />
              ))}
            </div>
          ) : filteredAndSortedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product, index) => (
                  <ProductCard key={product.id || product._id} product={product} index={index} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12 bg-slate-900 rounded-full px-6 py-3 w-fit mx-auto border border-slate-800 shadow-sm">
                  <button
                    onClick={() => {
                      setCurrentPage((prev) => Math.max(prev - 1, 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-full transition-colors ${
                      currentPage === 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-800'
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
                          currentPage === i + 1 ? 'bg-slate-200 text-slate-950 font-extrabold' : 'text-slate-400 hover:bg-slate-800'
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
                      currentPage === totalPages ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center bg-slate-900 border border-slate-800 rounded-3xl p-8">
              <p className="text-slate-400 mb-4 text-xs font-mono">No products found matching your search.</p>
              <button
                onClick={() => {
                  setSelectedBrand('All');
                  setSelectedTag('All');
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-slate-200 underline"
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
