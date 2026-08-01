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
    <section className="py-16 px-4 max-w-7xl mx-auto w-full text-slate-100">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
            <Sparkles className="w-4 h-4 text-slate-300" /> Featured Asset Collection
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Explore 3D Models</h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Browse production-ready CAD and 3D models with downloadable file formats.
          </p>
        </div>

        {/* View All Products Button */}
        <Link
          to="/shop?category=3D+Models"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-200 hover:bg-white text-slate-950 font-bold text-xs transition-all shadow-lg shadow-black/30 shrink-0"
        >
          <span>View All Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 10 3D Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-72 bg-slate-900 animate-pulse rounded-3xl border border-slate-800" />
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
                className="group relative bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/40 cursor-pointer flex flex-col justify-between"
              >
                {/* Product Image & Badges */}
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
                    className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md border transition-all z-10 ${
                      isFav
                        ? 'bg-red-500/20 border-red-500/50 text-red-400'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
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
                          className="px-1.5 py-0.5 rounded-md bg-slate-950/90 border border-slate-800 text-[9px] font-mono text-slate-300 font-medium"
                        >
                          {fmt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                      {product.polyCount > 0 ? (
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3 text-slate-500" />
                          {product.polyCount.toLocaleString()} Polys
                        </span>
                      ) : (
                        <span className="text-slate-500">Standard Product</span>
                      )}
                      <span className="text-slate-300 font-medium">{product.category || 'Jewelry'}</span>
                    </div>

                    <h3 className="text-xs font-bold text-white group-hover:text-slate-200 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </div>

                  {/* Price & Action Icons */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono">Price</span>
                      <span className="text-sm font-black text-white">${product.price || 49}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        title="Add to Cart"
                        className="p-2 rounded-xl bg-slate-200 hover:bg-white text-slate-950 transition-colors shadow-sm"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>

                      <div
                        title="View Details"
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-300" />
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
