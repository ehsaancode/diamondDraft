import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, Star, ChevronLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import Specifications from '../components/home/Specifications';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info } from 'lucide-react';
import { useMobile } from '../hooks/useMobile';
import MobileProductDetails from './MobileProductDetails';

const fallbackProduct = {
  id: 'mock',
  name: 'Elegant Diamond Ring',
  brand: 'Lustro & Co.',
  price: 350.00,
  rating: 4.8,
  reviews: 124,
  image: 'https://images.unsplash.com/photo-1605100804763-247f67b25406?w=800&auto=format&fit=crop&q=60'
};

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const isMobile = useMobile();
  
  // Using passed product from location state, or fallback if accessed directly
  const product = location.state || fallbackProduct;

  if (isMobile) {
    return <MobileProductDetails product={product} />;
  }
  
  // Existing desktop code...
  const [mainImage, setMainImage] = useState(product.image);
  const [isLiked, setIsLiked] = useState(product.isLiked || false);
  const [format, setFormat] = useState('STL');
  const [isFormatGuideOpen, setIsFormatGuideOpen] = useState(false);
  
  // Generating mock gallery if none exists
  const gallery = [
    product.image,
    'https://images.unsplash.com/photo-1605100804763-247f67b25406?w=800&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1599643477874-dc3b91490214?w=800&auto=format&fit=crop&q=60'
  ];

  const formats = ['STL', '3DM', 'OBJ', 'STEP'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12"
    >
      {/* Back to Products */}
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors mb-6 md:mb-10 cursor-pointer"
      >
        <ChevronLeft size={16} />
        Back to Shop
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16">
        {/* Left Column - Gallery */}
        <div className="flex flex-col gap-4 md:gap-6">
          <motion.div 
            className="w-full bg-white rounded-md aspect-square flex items-center justify-center p-4 md:p-8 shadow-sm overflow-hidden"
            layoutId={`product-image-${product.id}`}
          >
            <img 
              src={mainImage} 
              alt={product.name} 
              className="max-h-full object-contain mix-blend-multiply drop-shadow-lg"
            />
          </motion.div>
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setMainImage(img)}
                className={`bg-white rounded-md aspect-square p-2 md:p-4 flex items-center justify-center shadow-sm border-2 transition-all cursor-pointer ${mainImage === img ? 'border-black' : 'border-transparent hover:border-gray-200'}`}
              >
                <img src={img} alt={`Gallery ${idx}`} className="max-h-full object-contain mix-blend-multiply" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="flex flex-col py-4 md:py-6">
          <p className="text-xs md:text-sm font-medium text-gray-500 mb-2 uppercase tracking-widest">{product.brand}</p>
          <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" className="opacity-50" />
            </div>
            <span className="text-xs md:text-sm text-gray-500 font-medium">{product.rating} ({product.reviews} reviews)</span>
          </div>

          <div className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6 md:mb-8">
            ₹{product.price?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>

          <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-8 md:mb-10">
            {product.description || "Request a custom CAD design based on this breathtaking piece. Our expert designers will craft a production-ready 3D model according to your specific requirements, ready for 3D printing and casting."}
          </p>

          {/* Formats */}
          <div className="mb-8 md:mb-10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Select CAD Format</span>
              <button 
                onClick={() => setIsFormatGuideOpen(true)}
                className="text-xs md:text-sm text-gray-500 underline hover:text-black cursor-pointer flex items-center gap-1"
              >
                <Info size={14} /> Format Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-3 md:gap-4">
              {formats.map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`cursor-pointer w-16 md:w-20 h-10 md:h-12 rounded-full border flex items-center justify-center text-xs md:text-sm font-medium transition-colors
                    ${format === f ? 'border-black bg-black text-white' : 'border-gray-300 text-gray-700 hover:border-black'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <button 
              onClick={() => addToCart(product, format)}
              className="cursor-pointer flex-1 bg-black text-white px-6 md:px-8 py-3.5 md:py-4 flex items-center justify-center gap-3 text-sm md:text-base font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors"
            >
              <ShoppingBag size={18} />
              Add to Requests
            </button>
            <div className="flex gap-3 flex-1">
              <button 
                onClick={() => addToCart(product, format)}
                className="cursor-pointer flex-1 border-2 border-black text-black px-4 md:px-8 py-3.5 md:py-4 flex items-center justify-center gap-3 text-sm md:text-base font-medium uppercase tracking-wider hover:bg-gray-50 transition-colors"
              >
                Request Now
              </button>
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className="cursor-pointer w-14 md:w-16 flex-shrink-0 border border-gray-300 flex items-center justify-center hover:border-black transition-colors"
              >
                <Heart size={20} className={isLiked ? "text-red-500 hover:text-red-600" : "text-gray-900"} fill={isLiked ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Section */}
      <div className="mt-16 md:mt-24 border-t border-gray-100 pt-16">
        <Specifications product={product} />
      </div>

      {/* Shipping & Support Features - Now at the bottom */}
      <div className="mt-12 md:mt-20 border-t border-gray-100 py-12 md:py-16 bg-gray-50/50 rounded-3xl">
        <div className="flex flex-col md:flex-row items-center justify-around gap-8 md:gap-4 px-4 md:px-8">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400 border border-gray-100">
              <Truck size={22} />
            </div>
            <span className="text-[10px] md:text-xs font-medium uppercase tracking-widest text-gray-400">Delivery within 2-3 business days</span>
          </div>
          
          <div className="hidden md:block h-12 w-px bg-gray-100"></div>

          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400 border border-gray-100">
              <ShieldCheck size={22} />
            </div>
            <span className="text-[10px] md:text-xs font-medium uppercase tracking-widest text-gray-400">Production-ready precision</span>
          </div>

          <div className="hidden md:block h-12 w-px bg-gray-100"></div>

          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400 border border-gray-100">
              <RotateCcw size={22} />
            </div>
            <span className="text-[10px] md:text-xs font-medium uppercase tracking-widest text-gray-400">Includes 3 free design revisions</span>
          </div>
        </div>
      </div>

      {/* Format Guide Modal */}
      <AnimatePresence>
        {isFormatGuideOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormatGuideOpen(false)}
              className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-white z-[110] shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50 sticky top-0">
                <span className="text-xl font-serif font-bold text-gray-900 flex items-center gap-2">
                  <Info size={20} className="text-black" /> File Formats Guide
                </span>
                <button 
                  onClick={() => setIsFormatGuideOpen(false)} 
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                >
                  <X size={20} className="text-gray-900" />
                </button>
              </div>
              
              <div className="p-6 md:p-8 overflow-y-auto space-y-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">STL (Stereolithography)</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    The industry standard for 3D printing. It represents the surface of the model using a mesh of triangles. Best for sending directly to your 3D printer or casting house. <span className="text-black font-semibold">Cannot be easily edited.</span>
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">3DM (Rhinoceros 3D)</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    The native file format for Rhino and Matrix/MatrixGold. This contains the full NURBS geometry and is the absolute best choice if your jeweler intends to <span className="text-black font-semibold">manipulate or edit the design</span> before printing.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-1">OBJ (Wavefront)</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    A universally accepted format that supports polygonal geometry, commonly used in rendering software (like Blender or KeyShot) or animation pipelines. Good for visual representation but rarely used for precise manufacturing.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-1">STEP (Standard for the Exchange of Product model data)</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    A highly accurate, cross-platform solid modeling format widely used in precision engineering. Retains mathematical accuracy of curves and surfaces, making it great for CNC milling or importing into parametric CAD software like SolidWorks.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 text-center sticky bottom-0">
                <p className="text-xs text-gray-500 italic">
                  Not sure what you need? Select <span className="font-bold text-black">STL</span> for direct printing, or <span className="font-bold text-black">3DM</span> if your local jeweler needs to edit the design.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductDetails;
