import React from 'react';
import { useProducts } from '../../hooks/useProducts';

const YouMayAlsoLike = () => {
  const { products, loading } = useProducts();
  const suggestedProducts = products.slice(0, 8);
  return (
    <section className="px-8 py-20 bg-[#FAFAFA] w-full mt-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-900 mb-12">
          Related Base Designs
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
            suggestedProducts.map((product) => (
              <div key={product.id} className="bg-white p-4 md:p-6 rounded-sm shadow-sm flex flex-col items-center group cursor-pointer transition-shadow hover:shadow-md">
                <div className="w-full flex justify-between items-center mb-6 text-xs text-gray-500">
                  <span className="font-bold text-black text-[10px] uppercase truncate">{product.tag || 'Design'}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span>{parseFloat(product.rating || 5).toFixed(1)} ({product.reviews || 0})</span>
                  </div>
                </div>
                
                <div className="w-full aspect-square mb-6 overflow-hidden flex justify-center items-center">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="text-center mt-auto w-full">
                  <h3 className="text-xs md:text-sm font-medium text-gray-900 mb-2 line-clamp-2 leading-relaxed">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-4 text-xs font-semibold">
                    <span className="text-black">₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
                    {product.originalPrice && (
                      <span className="text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
                    )}
                  </div>
                  
                  <div className="flex justify-center gap-1.5 mt-2">
                    <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono font-black">STL</span>
                    <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono font-black">3DM</span>
                    <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono font-black">OBJ</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default YouMayAlsoLike;
