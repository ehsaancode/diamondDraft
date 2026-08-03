import React from 'react';
import { Heart, ShoppingBag, Layers, Star, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoriteContext';

const ProductCard = ({ product, index }) => {
  const navigate = useNavigate();
  const addToCartStore = useCartStore((state) => state.addToCart);
  const cartContext = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const productId = product.id || product._id || 'MD-3001';
  const isFav = isFavorite(productId);
  const formats = product.formats || [];

  const productImage =
    product.image ||
    (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null) ||
    product.thumbnail ||
    null;

  const rating = product.rating !== undefined && product.rating !== null ? Number(product.rating) : 5.0;
  const reviews = product.reviews !== undefined && product.reviews !== null ? Number(product.reviews) : 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (addToCartStore) addToCartStore(product);
    if (cartContext && cartContext.addToCart) {
      cartContext.addToCart(product, formats[0] || 'STL');
      if (cartContext.setIsCartOpen) cartContext.setIsCartOpen(true);
    }
  };

  return (
    <motion.div
      className="group relative bg-white border border-gray-200 hover:border-gray-400 rounded-sm overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer flex flex-col justify-between"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index || 0) * 0.05 }}
      onClick={() => navigate(`/product/${productId}`, { state: product })}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden flex items-center justify-center p-3 border-b border-gray-100">
        {productImage ? (
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center p-4 text-center text-gray-400 rounded-xs">
            <ImageIcon className="w-8 h-8 mb-1.5 text-gray-300" />
            <span className="text-[11px] font-semibold text-gray-500">No Image Uploaded</span>
          </div>
        )}

        {/* Wishlist Icon Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product);
          }}
          title={isFav ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-sm backdrop-blur-md border transition-all z-10 ${
            isFav
              ? 'bg-red-50 border-red-200 text-red-500'
              : 'bg-white/90 border-gray-200 text-gray-500 hover:text-black hover:border-gray-300 shadow-xs'
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
                className="px-2 py-0.5 rounded-sm bg-white/90 border border-gray-200 text-[10px] font-mono text-gray-800 font-semibold shadow-xs"
              >
                {fmt}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="p-4 md:p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
        <div>
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            {product.polyCount > 0 ? (
              <span className="flex items-center gap-1 text-gray-500">
                <Layers className="w-3.5 h-3.5 text-gray-400" />
                {product.polyCount.toLocaleString()} Polys
              </span>
            ) : (
              <span className="text-gray-400">Standard Product</span>
            )}
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-[11px] font-bold text-gray-700">
                {rating.toFixed(1)} {reviews > 0 ? `(${reviews})` : ''}
              </span>
            </div>
          </div>

          <h3 className="text-xs md:text-sm font-bold text-gray-900 group-hover:text-black transition-colors line-clamp-2">
            {product.name}
          </h3>
        </div>

        {/* Footer Actions & Price */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-[10px] text-gray-400 block font-mono">Price</span>
            <span className="text-sm md:text-base font-black text-gray-900">
              ₹{Number(product.price || 0).toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            title="Add to Cart"
            className="px-3 py-2 rounded-sm bg-black hover:bg-gray-800 text-white transition-all shadow-xs flex items-center gap-1.5 font-bold text-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
