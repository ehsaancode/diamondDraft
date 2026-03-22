import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Search, Plus, Heart, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoriteContext';

const filters = [
  { name: 'Price', icon: <ChevronDown size={14} className="ml-1 opacity-60" /> },
  { name: 'Brand', icon: <ChevronDown size={14} className="ml-1 opacity-60" /> },
  { name: 'Popularity', icon: <ChevronDown size={14} className="ml-1 opacity-60" /> },
];

const MobileShop = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-32 font-sans">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-40 px-4 py-4 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="w-11 h-11 flex items-center justify-center bg-white border border-gray-50 rounded-full shadow-sm active:scale-95 transition-transform">
            <ChevronLeft size={22} className="text-gray-800" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">CAD Designs</h1>
          <button 
            onClick={() => navigate('/search')}
            className="w-11 h-11 flex items-center justify-center bg-white border border-gray-00 rounded-full shadow-sm active:scale-95 transition-transform"
          >
            <Search size={20} className="text-gray-800" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
          {filters.map((filter, idx) => (
            <button 
              key={idx} 
              className="flex items-center px-5 py-2.5 bg-white border border-transparent rounded-full text-sm font-semibold text-gray-700 whitespace-nowrap shadow-sm hover:shadow-md active:scale-95 transition-all"
            >
              {filter.name} {filter.icon}
            </button>
          ))}
        </div>
      </div>

      <main className="p-4 pt-6">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          {products.map((product) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              onClick={() => navigate(`/product/${product.id}`)}
              className="bg-white rounded-[40px] p-2.5 flex flex-col gap-3 shadow-sm border border-gray-50/50 group relative cursor-pointer"
            >
              <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden bg-[#f0f2f5] flex items-center justify-center p-3">
                <img 
                  src={product.image || '/images/jewellery_cad_ring.png'} 
                  alt={product.name} 
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product);
                  }}
                  className={`absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:bg-white active:scale-90 transition-all z-10 ${isFavorite(product.id) ? 'text-red-500' : 'text-gray-400'}`}
                >
                  <Heart size={18} fill={isFavorite(product.id) ? "currentColor" : "none"} strokeWidth={2} />
                </button>
                {product.id % 4 === 0 && (
                  <div className="absolute top-4 left-0 bg-red-500 text-white text-[10px] px-3 py-1 rounded-r-full font-bold shadow-sm">
                    10% off
                  </div>
                )}
              </div>
              
              <div className="px-2 pb-1 flex-1 flex flex-col">
                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight h-9 mb-1">
                  {product.name}
                </h3>
                <p className="text-[11px] text-gray-500 font-medium mb-2">{product.brand}, Diamond Group</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-red-400 line-through font-medium opacity-60">₹{(product.price * 1.2).toLocaleString('en-IN')}</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, 'CAD');
                      navigate('/cart');
                    }}
                    className="w-9 h-9 rounded-full bg-[#1b4332] flex items-center justify-center text-white shadow-lg active:scale-90 transition-all hover:bg-[#2d6a4f]"
                  >
                    <Plus size={20} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MobileShop;
