import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ui/ProductCard';
import { products } from '../data/products';

const Shop = () => {
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  
  const location = useLocation();
  const searchInputRef = useRef(null);

  // Focus search input if coming from Navbar Search icon
  useEffect(() => {
    if (location.state?.focusSearch && searchInputRef.current) {
      // Small timeout to ensure rendering is complete
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

  const brands = ['All', ...new Set(products.map(p => p.brand))];
  const tags = ['All', ...new Set(products.map(p => p.tag).filter(Boolean))];

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by Brand
    if (selectedBrand !== 'All') {
      result = result.filter(p => p.brand === selectedBrand);
    }

    // Filter by Tag
    if (selectedTag !== 'All') {
      result = result.filter(p => p.tag === selectedTag);
    }

    // Filter by Search Query
    if (debouncedSearchQuery.trim() !== '') {
      const lowerQuery = debouncedSearchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.brand.toLowerCase().includes(lowerQuery) ||
        (p.tag && p.tag.toLowerCase().includes(lowerQuery))
      );
    }

    // Sort
    if (sortOrder === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } // 'default' keeps original order

    return result;
  }, [selectedBrand, selectedTag, sortOrder, debouncedSearchQuery]);

  return (
    <div className="px-8 py-12 max-w-7xl mx-auto w-full">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-serif text-black mb-4">CAD Design Library</h1>
        <p className="text-gray-500 max-w-2xl">
          Discover our exquisite collection of 3D jewelry models. Request custom modifications to any of these base designs to create your perfect piece.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex flex-col gap-8 shrink-0 sticky top-24">
          {/* Search */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Search</h3>
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search models..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-black transition-colors bg-white"
            />
          </div>

          {/* Brand Filter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Brands</h3>
            <ul className="flex flex-col gap-2">
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

          {/* Collection/Tag Filter */}
          {tags.length > 1 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Collections</h3>
              <ul className="flex flex-col gap-2">
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

          {/* Sorting */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">Sort By</h3>
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
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-10 md:gap-y-12">
              {filteredAndSortedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
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
