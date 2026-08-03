import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../ui/ProductCard';

export default function Explore3DModels() {
  const { products, loading } = useProducts();

  // Take top 10 products
  const displayProducts = Array.isArray(products) ? products.slice(0, 10) : [];

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto w-full text-gray-900 bg-[#fafafa]">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            <Sparkles className="w-4 h-4 text-gray-700" /> Featured Asset Collection
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-extrabold text-gray-900">Explore 3D Models</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-xl">
            Browse production-ready CAD and 3D models with downloadable file formats.
          </p>
        </div>

        {/* View All Products Button */}
        <Link
          to="/shop?category=3D+Models"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-sm bg-black hover:bg-gray-800 text-white font-bold text-xs transition-all shadow-md shrink-0 uppercase tracking-wider"
        >
          <span>View All Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 10 3D Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-72 rounded-sm border border-gray-200 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"
            />
          ))}
        </div>
      ) : displayProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {displayProducts.map((product, index) => (
            <ProductCard key={product.id || product._id || index} product={product} index={index} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center bg-white border border-gray-200 rounded-sm p-6 shadow-xs">
          <p className="text-gray-500 text-xs font-mono">No 3D Models available in the catalog yet.</p>
        </div>
      )}
    </section>
  );
}
