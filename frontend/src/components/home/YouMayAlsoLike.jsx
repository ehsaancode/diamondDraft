import React from 'react';
import { products } from '../../data/products';

const YouMayAlsoLike = () => {
  const suggestedProducts = products.slice(-4);
  return (
    <section className="px-8 py-20 bg-[#FAFAFA] w-full mt-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-900 mb-12">
          You May Also Like It
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {suggestedProducts.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-sm shadow-sm flex flex-col items-center group cursor-pointer transition-shadow hover:shadow-md">
              <div className="w-full flex justify-between items-center mb-6 text-xs text-gray-500">
                <span className="font-medium text-black">{product.tag}</span>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span>{product.rating.toFixed(1)} ({product.reviews})</span>
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
                  <span className="text-black">${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</span>
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through">${product.originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD</span>
                  )}
                </div>
                
                {product.colors && (
                  <div className="flex justify-center gap-1">
                    {product.colors.map((color, idx) => (
                      <div 
                        key={idx} 
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default YouMayAlsoLike;
