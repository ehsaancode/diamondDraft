import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Trash2, Heart, ShoppingBag, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoriteContext';
import { useCart } from '../context/CartContext';

const MobileFavorites = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-32">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 px-4 py-4 flex items-center justify-between border-b border-gray-50">
        <button onClick={() => navigate(-1)} className="w-11 h-11 flex items-center justify-center bg-white border border-gray-100 rounded-full shadow-sm">
          <ChevronLeft size={22} className="text-gray-800" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">Favorites</h1>
        <div className="w-11" /> {/* Spacer */}
      </div>

      <main className="p-4 flex flex-col gap-6">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
               <Heart size={40} />
            </div>
            <div>
               <h3 className="text-lg font-bold text-gray-900">No favorites yet</h3>
               <p className="text-sm text-gray-400 max-w-[200px] mt-1">Start hearting the designs you love to see them here.</p>
            </div>
            <button 
              onClick={() => navigate('/shop')}
              className="mt-4 px-8 py-3 bg-black text-white rounded-2xl font-bold text-sm"
            >
              Browse Gallery
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence>
              {favorites.map((product) => (
                <motion.div 
                  key={product.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[32px] p-3 flex gap-4 shadow-sm border border-gray-50 group relative"
                >
                  <div 
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="w-24 h-24 rounded-[24px] bg-[#f0f2f5] overflow-hidden flex items-center justify-center p-2 cursor-pointer"
                  >
                    <img 
                      src={product.image || '/images/jewellery_cad_ring.png'} 
                      alt={product.name} 
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col py-1">
                    <div className="flex items-start justify-between">
                      <div onClick={() => navigate(`/product/${product.id}`)} className="cursor-pointer">
                        <h3 className="text-sm font-bold text-gray-900 leading-tight">{product.name}</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">{product.brand}</p>
                      </div>
                      <button 
                        onClick={() => toggleFavorite(product)}
                        className="text-red-500 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-base font-black text-black">₹{product.price.toLocaleString('en-IN')}</span>
                      <button 
                        onClick={() => addToCart(product, 'STL')}
                        className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-[11px] font-black flex items-center gap-2 active:scale-95 transition-transform"
                      >
                        <Plus size={14} strokeWidth={3} /> Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};

export default MobileFavorites;
