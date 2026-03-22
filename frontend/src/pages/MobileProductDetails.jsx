import React, { useState } from 'react';
import { ChevronLeft, Share2, Heart, Star, ShoppingBag, Plus, Minus, Info, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const MobileProductDetails = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedFormat, setSelectedFormat] = useState('STL');
  const formats = ['STL', '3DM', 'OBJ', 'STEP'];

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-40">
      {/* Header */}
      <div className="fixed top-0 inset-x-0 z-40 p-4 flex items-center justify-between bg-white/80 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="w-11 h-11 flex items-center justify-center bg-white border border-gray-50 rounded-full shadow-sm">
          <ChevronLeft size={22} className="text-gray-800" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Product Details</h1>
        <button className="w-11 h-11 flex items-center justify-center bg-white border border-gray-50 rounded-full shadow-sm">
          <Share2 size={20} className="text-gray-800" />
        </button>
      </div>

      <main className="pt-24 px-4 flex flex-col gap-8">
        {/* Product Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-square rounded-[48px] bg-white shadow-xl shadow-gray-200/50 overflow-hidden flex items-center justify-center p-8"
        >
          <img 
            src={product.image || '/images/jewellery_cad_ring.png'} 
            alt={product.name} 
            className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-2xl"
          />
          <button className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-red-500 active:scale-90 transition-transform">
             <Heart size={20} fill={product.isLiked ? "currentColor" : "none"} />
          </button>
        </motion.div>

        {/* Info */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{product.brand}</span>
            <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-full">
              <Star size={12} fill="#fbbf24" className="text-yellow-400" />
              <span className="text-[10px] font-bold text-yellow-700">{product.rating}</span>
            </div>
          </div>
          <h2 className="text-2xl font-black text-gray-900 leading-tight">{product.name}</h2>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-black text-black">${product.price}</span>
            <span className="text-sm font-medium text-red-400 line-through opacity-50">${product.price * 1.2}</span>
          </div>
        </div>

        {/* Formats Selection */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Select File Format</h3>
            <button className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
               <Info size={14} /> Guide
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {formats.map((f) => (
              <button 
                key={f}
                onClick={() => setSelectedFormat(f)}
                className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all border-2 ${selectedFormat === f ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-gray-900">Description</h3>
          <p className="text-xs leading-relaxed text-gray-500 font-medium opacity-80">
            {product.description || "This premium 3D CAD design is crafted for professional manufacturing. Ready for 3D printing and precision investment casting. Includes production-ready settings."}
          </p>
        </div>

        {/* Trust Points */}
        <div className="grid grid-cols-1 gap-4 bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm shadow-gray-100">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                 <ShieldCheck size={20} />
              </div>
              <div className="flex flex-col">
                 <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">Precision Guaranteed</span>
                 <span className="text-[10px] font-medium text-gray-400">Production-ready design file</span>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                 <RotateCcw size={20} />
              </div>
              <div className="flex flex-col">
                 <span className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">Free Revisions</span>
                 <span className="text-[10px] font-medium text-gray-400">Includes 3 free adjustments</span>
              </div>
           </div>
        </div>
      </main>

      {/* Floating Call to Action */}
      <div className="fixed bottom-0 inset-x-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-50 rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-50 rounded-2xl p-2.5 flex items-center justify-between border border-gray-100">
             <button className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-400 border border-gray-100">
                <Minus size={16} />
             </button>
             <span className="font-bold text-gray-900">01</span>
             <button className="w-9 h-9 rounded-xl bg-green-900 flex items-center justify-center text-white shadow-md">
                <Plus size={16} />
             </button>
          </div>
          <button 
            onClick={() => addToCart(product, selectedFormat)}
            className="flex-[2] h-14 bg-black text-white rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            <ShoppingBag size={20} />
            Add to Library
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileProductDetails;
