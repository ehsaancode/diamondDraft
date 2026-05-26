import React from 'react';
import MobileHeader from '../components/mobile/MobileHeader';
import MobileBottomNav from '../components/mobile/MobileBottomNav';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoriteContext';
import { useProducts } from '../hooks/useProducts';

const categories = [
  { name: 'Rings', icon: '/images/jewellery_cad_ring.png', color: 'bg-green-100', targetCategory: 'Rings' },
  { name: 'Necklaces', icon: '/images/jewellery_cad_neckless.png', color: 'bg-orange-100', targetCategory: 'Necklaces' },
  { name: 'Earrings', icon: '/images/jewellery_cad_earring.png', color: 'bg-red-100', targetCategory: 'Earrings' },
  { name: 'Bracelets', icon: '/images/jewellery_cad_bracelet.png', color: 'bg-yellow-100', targetCategory: 'Bracelets' },
  { name: 'Pendants', icon: '/images/jewellery_cad_neckless.png', color: 'bg-blue-100', targetCategory: 'Necklaces', targetSubcategory: 'Pendants' },
];

const MobileHome = () => {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const featuredProducts = products.slice(0, 4);
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      <MobileHeader />

      <main className="px-4 py-6 flex flex-col gap-8">
        {/* Banner Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">Custom Studio</h2>
          </div>
          <div className="relative h-48 rounded-[32px] overflow-hidden group shadow-lg shadow-zinc-100">
            <img 
              src="/images/jewellery_cad_banner.png" 
              alt="Custom Studio Banner" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/55 to-transparent flex flex-col justify-center px-8 text-white">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-1">Tailored Jewellery CADs</span>
              <p className="text-base font-extrabold max-w-[200px] leading-tight mb-3">Custom designs built to your factory specifications.</p>
              <button 
                onClick={() => navigate('/contact')}
                className="bg-white text-black px-6 py-2.5 rounded-full text-xs font-bold w-fit shadow-md active:scale-95 transition-transform uppercase tracking-wider"
              >
                Inquire Now
              </button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">Shop By Categories</h2>
            <button 
              onClick={() => navigate('/shop')}
              className="text-black text-sm font-semibold"
            >
              See All
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {categories.map((cat, idx) => (
              <motion.div 
                key={idx}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/shop', { 
                  state: { 
                    category: cat.targetCategory,
                    subcategory: cat.targetSubcategory || 'All'
                  } 
                })}
                className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-full ${cat.color} flex items-center justify-center p-2.5 shadow-sm border border-white`}>
                  <img src={cat.icon} alt={cat.name} className="w-full h-full object-contain" />
                </div>
                <span className="text-[11px] font-bold text-gray-700">{cat.name}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured CADs */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">Featured CADs</h2>
            <button 
              onClick={() => navigate('/shop')}
              className="text-black text-sm font-semibold"
            >
              See All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-[32px] p-4 flex flex-col gap-3 shadow-md border border-gray-50/50">
                  <div className="w-full bg-zinc-150 animate-pulse rounded-[24px] aspect-square border border-gray-50" />
                  <div className="space-y-2 px-1">
                    <div className="h-3.5 bg-zinc-200 animate-pulse rounded w-4/5" />
                    <div className="h-2.5 bg-zinc-150 animate-pulse rounded w-1/4" />
                    <div className="h-3.5 bg-zinc-200 animate-pulse rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : (
              featuredProducts.map((product) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => navigate(`/product/${product.id}`, { state: product })}
                  className="bg-white rounded-[32px] p-4 flex flex-col gap-3 shadow-md shadow-gray-100/50 border border-gray-50/50 relative group cursor-pointer"
                >
                  <div className="relative aspect-square rounded-[24px] overflow-hidden bg-gray-50 flex items-center justify-center p-2">
                    <img 
                      src={product.image || '/images/jewellery_cad_ring.png'} 
                      alt={product.name} 
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 flex gap-1">
                      <span className="bg-black/5 text-black/60 text-[8px] px-1.5 py-0.5 rounded font-mono font-bold">STL</span>
                      <span className="bg-black/5 text-black/60 text-[8px] px-1.5 py-0.5 rounded font-mono font-bold">3DM</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product);
                      }}
                      className={`absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-colors hover:bg-white z-10 ${isFavorite(product.id) ? 'text-red-500' : 'text-gray-400'}`}
                    >
                      <Heart size={14} fill={isFavorite(product.id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-800 line-clamp-2 leading-tight h-8">
                      {product.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{product.brand}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-sm font-extrabold text-black">₹{product.price.toLocaleString('en-IN')}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, 'STL');
                        navigate('/cart');
                      }}
                      className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white shadow-lg shadow-black/10 active:scale-95 transition-transform"
                    >
                      <Plus size={18} strokeWidth={3} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MobileHome;
