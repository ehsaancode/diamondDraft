import { useState, useMemo, useEffect } from 'react';

/**
 * Unified Single Source of Truth Search & Filter Hook for Desktop & Mobile
 */
export const useSearch = (products = [], initialCategory = 'All', initialSubcategory = 'All') => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialSubcategory);
  const [sortOrder, setSortOrder] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  // Debounce search query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim().toLowerCase());
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSubcategory, sortOrder, debouncedQuery]);

  // Categories list
  const categories = useMemo(() => {
    return ['All', ...new Set(products.map((p) => p.category || p.brand).filter(Boolean))];
  }, [products]);

  // Subcategories list based on selected category
  const subcategories = useMemo(() => {
    let list = products;
    if (selectedCategory !== 'All') {
      list = list.filter((p) => (p.category || p.brand) === selectedCategory);
    }
    return ['All', ...new Set(list.map((p) => p.subcategory || p.tag).filter(Boolean))];
  }, [products, selectedCategory]);

  // Filtered & Sorted Product Results (Single Source of Truth)
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => (p.category || p.brand) === selectedCategory);
    }

    // Subcategory filter
    if (selectedSubcategory !== 'All') {
      result = result.filter((p) => (p.subcategory || p.tag) === selectedSubcategory);
    }

    // Unified Search Query filter (matches name, SKU, category, formats, description)
    if (debouncedQuery) {
      result = result.filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(debouncedQuery);
        const catMatch = p.category?.toLowerCase().includes(debouncedQuery);
        const subMatch = p.subcategory?.toLowerCase().includes(debouncedQuery);
        const skuMatch = String(p.sku || p.id || '').toLowerCase().includes(debouncedQuery);
        const formatMatch = Array.isArray(p.formats) && p.formats.some((f) => f.toLowerCase().includes(debouncedQuery));
        const descMatch = p.description?.toLowerCase().includes(debouncedQuery);
        return nameMatch || catMatch || subMatch || skuMatch || formatMatch || descMatch;
      });
    }

    // Sorting
    if (sortOrder === 'price-asc') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOrder === 'price-desc') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortOrder === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [products, selectedCategory, selectedSubcategory, debouncedQuery, sortOrder]);

  const activeFilterCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedSubcategory !== 'All' ? 1 : 0) +
    (sortOrder !== 'default' ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedSubcategory('All');
    setSearchQuery('');
    setSortOrder('default');
    setCurrentPage(1);
  };

  return {
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
  };
};
