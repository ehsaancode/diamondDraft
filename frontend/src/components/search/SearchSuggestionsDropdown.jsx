import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Tag, Package, ArrowUpRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const POPULAR_TAGS = [
  'Solitaire Ring',
  'Engagement Ring',
  'Diamond Pendant',
  'Halo Setting',
  'Eternity Band',
  'Bracelet Link',
  'Stud Earrings',
  'Vintage CAD'
];

export default function SearchSuggestionsDropdown({
  query = '',
  products = [],
  onSelectSuggestion,
  onClose,
  className = ''
}) {
  const navigate = useNavigate();
  const cleanQuery = query.trim().toLowerCase();

  const { matchedProducts, matchedCategories, matchedTags } = useMemo(() => {
    if (!cleanQuery) {
      return {
        matchedProducts: [],
        matchedCategories: [],
        matchedTags: POPULAR_TAGS.slice(0, 4)
      };
    }

    const prods = (products || []).filter((p) => {
      const name = String(p.name || '').toLowerCase();
      const cat = String(p.category || p.brand || '').toLowerCase();
      const sku = String(p.sku || p.id || '').toLowerCase();
      const formats = Array.isArray(p.formats) ? p.formats.join(' ').toLowerCase() : '';
      return name.includes(cleanQuery) || cat.includes(cleanQuery) || sku.includes(cleanQuery) || formats.includes(cleanQuery);
    }).slice(0, 5);

    const cats = [...new Set((products || []).map((p) => p.category || p.brand).filter(Boolean))]
      .filter((c) => String(c).toLowerCase().includes(cleanQuery))
      .slice(0, 3);

    const tags = POPULAR_TAGS.filter((t) => t.toLowerCase().includes(cleanQuery)).slice(0, 4);

    return { matchedProducts: prods, matchedCategories: cats, matchedTags: tags };
  }, [cleanQuery, products]);

  if (!cleanQuery && matchedTags.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      className={`absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden text-gray-900 ${className}`}
    >
      <div className="p-3 space-y-3 max-h-[380px] overflow-y-auto scrollbar-thin">
        {/* Product Suggestions */}
        {matchedProducts.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
              <Package size={12} className="text-cyan-500" />
              <span>Matching CAD Models ({matchedProducts.length})</span>
            </div>
            <div className="space-y-1">
              {matchedProducts.map((prod) => (
                <button
                  key={prod.id || prod._id}
                  onClick={() => {
                    if (onSelectSuggestion) onSelectSuggestion(prod.name);
                    navigate(`/product/${prod.id || prod._id}`, { state: prod });
                    if (onClose) onClose();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-100/80 transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={prod.image || '/images/jewellery_cad_ring.png'}
                      alt={prod.name}
                      className="w-10 h-10 object-contain rounded-lg bg-gray-50 border border-gray-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-cyan-600 transition-colors">
                        {prod.name}
                      </h4>
                      <p className="text-[10px] text-gray-500 font-mono flex items-center gap-2">
                        <span>{prod.category || 'Jewelry'}</span>
                        <span>•</span>
                        <span className="text-gray-900 font-bold">₹{Number(prod.price || 0).toLocaleString('en-IN')}</span>
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight size={14} className="text-gray-300 group-hover:text-black shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Suggestions */}
        {matchedCategories.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
              <Tag size={12} className="text-purple-500" />
              <span>Categories</span>
            </div>
            <div className="flex flex-wrap gap-1.5 px-2">
              {matchedCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    if (onSelectSuggestion) onSelectSuggestion(cat);
                    navigate('/shop', { state: { category: cat } });
                    if (onClose) onClose();
                  }}
                  className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Keyword Suggestions */}
        {matchedTags.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
              <Sparkles size={12} className="text-amber-500" />
              <span>Suggested Searches</span>
            </div>
            <div className="flex flex-wrap gap-1.5 px-2">
              {matchedTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    if (onSelectSuggestion) onSelectSuggestion(tag);
                    navigate('/shop', { state: { query: tag } });
                    if (onClose) onClose();
                  }}
                  className="px-3 py-1 bg-gray-100 hover:bg-black hover:text-white text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Search size={10} />
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No suggestions state */}
        {cleanQuery && matchedProducts.length === 0 && matchedCategories.length === 0 && matchedTags.length === 0 && (
          <div className="py-6 text-center text-xs text-gray-400 font-mono">
            No matching suggestions found for "{query}"
          </div>
        )}
      </div>
    </motion.div>
  );
}
