import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { products } from '../data/products';
import { useMobile } from '../hooks/useMobile';
import MobileShop from './MobileShop';

const Shop = () => {
  const isMobile = useMobile();
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;
  
  const location = useLocation();
  const searchInputRef = useRef(null);

  // Focus search input if coming from Navbar Search icon
  useEffect(() => {
    if (location.state?.focusSearch && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [location.state]);

  // Debounce effect for search
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

  const brands = ['All', ...new Set(products.map(p => p.brand))];
  const tags = ['All', ...new Set(products.map(p => p.tag).filter(Boolean))];

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (selectedBrand !== 'All') {
      result = result.filter(p => p.brand === selectedBrand);
    }

    if (selectedTag !== 'All') {
      result = result.filter(p => p.tag === selectedTag);
    }

    if (debouncedSearchQuery.trim() !== '') {
      const lowerQuery = debouncedSearchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.brand.toLowerCase().includes(lowerQuery) ||
        (p.tag && p.tag.toLowerCase().includes(lowerQuery))
      );
    }

    if (sortOrder === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [selectedBrand, selectedTag, sortOrder, debouncedSearchQuery]);

  if (isMobile) {
    return <MobileShop />;
  }

  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="px-8 py-12 max-w-7xl mx-auto w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 md:mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-serif text-black mb-4">CAD Design Library</h1>
        <p className="text-gray-500 max-w-2xl">
          Discover our exquisite collection of 3D jewelry models.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:flex w-64 flex-col gap-8 shrink-0 sticky top-24">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Search</h3>
            <input 
              type="text" 
              placeholder="Search models..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-black transition-colors bg-white"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 md:mb-4 border-b pb-2">Brands</h3>
            <ul className="flex flex-row flex-wrap md:flex-col gap-x-4 gap-y-2 md:gap-y-2">
              {brands.map(brand => (
                <li key={brand}>
                  <button 
                    onClick={() => setSelectedBrand(brand)}
                    className={`text-sm text-left w-full hover:text-black transition-colors ${selectedBrand === brand ? 'font-semibold text-black' : 'text-gray-500'}`}
                  >
                    {brand}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {tags.length > 1 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 md:mb-4 border-b pb-2">Collections</h3>
              <ul className="flex flex-row flex-wrap md:flex-col gap-x-4 gap-y-2 md:gap-y-2">
                {tags.map(tag => (
                  <li key={tag}>
                    <button 
                      onClick={() => setSelectedTag(tag)}
                      className={`text-sm text-left w-full hover:text-black transition-colors ${selectedTag === tag ? 'font-semibold text-black' : 'text-gray-500'}`}
                    >
                      {tag}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3 md:mb-4 border-b pb-2">Sort By</h3>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full text-sm border-gray-300 rounded-sm bg-transparent appearance-none py-2 border-b cursor-pointer focus:outline-none focus:border-black"
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 w-full">
          <div className="mb-6 flex justify-between items-center">
            <span className="text-sm text-gray-500">{filteredAndSortedProducts.length} Products</span>
          </div>

          {filteredAndSortedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-12">
                {paginatedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12 bg-white rounded-full px-6 py-3 w-fit mx-auto border border-gray-100 shadow-sm">
                  <button 
                    onClick={() => {
                      setCurrentPage(prev => Math.max(prev - 1, 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-full transition-colors ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <div className="flex gap-1 overflow-x-auto max-w-[200px] scrollbar-hide px-2">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      // Logic to show a limited number of pages could go here, but for now we show all
                      // or just standard dots if there are too many. Assuming < 10 pages for now.
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            setCurrentPage(i + 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`min-w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all px-3 shrink-0 ${currentPage === i + 1 ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>

                  <button 
                    onClick={() => {
                      setCurrentPage(prev => Math.min(prev + 1, totalPages));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-full transition-colors ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-500 mb-4">No products found matching your search or filters.</p>
              <button 
                onClick={() => {
                  setSelectedBrand('All');
                  setSelectedTag('All');
                  setSearchQuery('');
                }}
                className="text-sm font-medium underline hover:text-gray-700"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
