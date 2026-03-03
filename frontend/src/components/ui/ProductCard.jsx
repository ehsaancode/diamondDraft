import React, { useState } from 'react';
import { Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';

// A reusable Product Card Component
const ProductCard = ({ product, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(product.isLiked || false);

  return (
    <motion.div 
      className="flex flex-col group cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-white pt-4 pb-8 px-4 rounded-sm shadow-sm overflow-hidden mb-4 h-[320px] flex items-center justify-center transition-all duration-300 hover:shadow-md">
        {/* Top bar with rating and heart */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
            <Star size={12} className="text-gray-400" fill="currentColor" />
            <span>{product.rating}</span>
            <span className="text-gray-400">({product.reviews})</span>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }} 
            className="p-1.5 bg-white/50 hover:bg-white rounded-full transition-colors"
          >
            <Heart size={16} className={isLiked ? "text-red-500" : "text-gray-400"} fill={isLiked ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Product Image */}
        <motion.img 
          initial={false}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
          src={product.image} 
          alt={product.name} 
          className="max-h-[200px] object-contain drop-shadow-lg" 
        />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-gray-900">{product.name}</h3>
        <p className="text-xs text-gray-500 italic">by {product.brand}</p>
        <p className="text-sm font-semibold mt-1">${product.price.toFixed(2)}</p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
