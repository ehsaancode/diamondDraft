import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Eye, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useCartStore } from '../../store/useCartStore';
import { useFavorites } from '../../context/FavoriteContext';

export default function Explore3DModels() {
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const addToCart = useCartStore((state) => state.addToCart);
  const { isFavorite, toggleFavorite } = useFavorites();

  // Take top 10 products
  const displayProducts = products.slice(0, 10);

  if (!loading && displayProducts.length === 0) {
    return null;
  }

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
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs transition-all shadow-md shrink-0 uppercase tracking-wider"
        >
          <span>View All Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 10 3D Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-72 bg-gray-100 animate-pulse rounded-2xl border border-gray-200" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {displayProducts.map((product) => {
            const productId = product.id || product._id || 'MD-3001';
            const isFav = isFavorite(productId);
            const formats = product.formats || [];
            const productImage =
              product.image ||
              (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null) ||
              product.thumbnail ||
              'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=60';

            return (
              <div
                key={productId}
                onClick={() => navigate(`/product/${productId}`, { state: product })}
                className="group relative bg-white border border-gray-200 hover:border-gray-400 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 cursor-pointer flex flex-col justify-between"
              >
                {/* Product Image & Badges */}
                <div className="relative aspect-square bg-gray-50 overflow-hidden flex items-center justify-center p-3 border-b border-gray-100">
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
                    className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md border transition-all z-10 ${
                      isFav
                        ? 'bg-red-50 border-red-200 text-red-500'
                        : 'bg-white/90 border-gray-200 text-gray-500 hover:text-black hover:border-gray-300 shadow-xs'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5" fill={isFav ? 'currentColor' : 'none'} />
                  </button>

                  {/* Format Badges */}
                  {formats.length > 0 && (
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-1 overflow-x-auto">
                      {formats.slice(0, 3).map((fmt) => (
                        <span
                          key={fmt}
                          className="px-1.5 py-0.5 rounded-md bg-white/90 border border-gray-200 text-[9px] font-mono text-gray-800 font-semibold"
                        >
                          {fmt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      {product.polyCount > 0 ? (
                        <span className="flex items-center gap-1 text-gray-500">
                          <Layers className="w-3 h-3 text-gray-400" />
                          {product.polyCount.toLocaleString()} Polys
                        </span>
                      ) : (
                        <span className="text-gray-400">Standard Product</span>
                      )}
                      <span className="text-gray-900 font-semibold">{product.category || 'Jewelry'}</span>
                    </div>

                    <h3 className="text-xs font-bold text-gray-900 group-hover:text-black transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </div>

                  {/* Price & Action Icons */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-mono">Price</span>
                      <span className="text-sm font-black text-gray-900">${product.price || 49}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        title="Add to Cart"
                        className="p-2 rounded-xl bg-black hover:bg-gray-800 text-white transition-colors shadow-xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>

                      <div
                        title="View Details"
                        className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
