import React from 'react';
import { Heart, ShoppingBag, Eye, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { useFavorites } from '../../context/FavoriteContext';

const ProductCard = ({ product, index }) => {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const { isFavorite, toggleFavorite } = useFavorites();

  const productId = product.id || product._id || 'MD-3001';
  const isFav = isFavorite(productId);
  const formats = product.formats || [];

  const productImage =
    product.image ||
    (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null) ||
    product.thumbnail ||
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=60';

  return (
    <motion.div
      className="group relative bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/40 cursor-pointer flex flex-col justify-between"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index || 0) * 0.05 }}
      onClick={() => navigate(`/product/${productId}`, { state: product })}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-slate-950 overflow-hidden flex items-center justify-center p-3">
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Wishlist Icon Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product);
          }}
          title={isFav ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border transition-all z-10 ${
            isFav
              ? 'bg-red-500/20 border-red-500/50 text-red-400'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
          }`}
        >
          <Heart className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
        </button>

        {/* Format Badges (if 3D asset) */}
        {formats.length > 0 && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1 overflow-x-auto">
            {formats.slice(0, 3).map((fmt) => (
              <span
                key={fmt}
                className="px-2 py-0.5 rounded-md bg-slate-950/90 border border-slate-800 text-[10px] font-mono text-slate-300 font-medium"
              >
                {fmt}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
            {product.polyCount > 0 ? (
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                {product.polyCount.toLocaleString()} Polys
              </span>
            ) : (
              <span className="text-slate-500">Standard Product</span>
            )}
            <span className="text-slate-300 font-medium">{product.category || 'Jewelry'}</span>
          </div>

          <h3 className="text-sm font-bold text-white group-hover:text-slate-200 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </div>

        {/* Footer Actions & Price */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">Price</span>
            <span className="text-base font-black text-white">${product.price || 49}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              title="Add to Cart"
              className="p-2.5 rounded-xl bg-slate-200 hover:bg-white text-slate-950 transition-colors shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>

            <div
              title="View Product Details"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <Eye className="w-4 h-4 text-slate-300" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
