import React from 'react';
import ProductCard from '../ui/ProductCard';
import { useProducts } from '../../hooks/useProducts';

const YouMayAlsoLike = () => {
  const { products, loading } = useProducts();
  const suggestedProducts = products.slice(0, 8);
  return (
    <section className="px-8 py-16 bg-[#FAFAFA] w-full">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-900 mb-12">
          Related Base Designs
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white p-4 md:p-6 rounded-sm shadow-sm flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-6">
                  <div className="h-3 bg-zinc-150 animate-pulse rounded w-1/3" />
                  <div className="h-3 bg-zinc-150 animate-pulse rounded w-1/4" />
                </div>
                <div className="w-full aspect-square mb-6 bg-zinc-100 animate-pulse rounded-sm" />
                <div className="text-center mt-auto w-full space-y-2">
                  <div className="h-4 bg-zinc-200 animate-pulse rounded w-3/4 mx-auto" />
                  <div className="h-3 bg-zinc-150 animate-pulse rounded w-1/2 mx-auto" />
                </div>
              </div>
            ))
          ) : (
            suggestedProducts.map((product, index) => (
              <ProductCard key={product.id || product._id} product={product} index={index} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default YouMayAlsoLike;
