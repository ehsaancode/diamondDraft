import React, { useState } from 'react';
import {
  ChevronLeft,
  Share2,
  Heart,
  Star,
  ShoppingBag,
  Info,
  ShieldCheck,
  RotateCcw,
  Smartphone,
  Download,
  CheckCircle2,
  Clock,
  Layers,
  Box,
  Image as ImageIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CanvasWrapper from '../canvas/CanvasWrapper';
import WebARModal from '../components/WebARModal';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoriteContext';

const MobileProductDetails = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const getAssetUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${apiUrl}${cleanPath}`;
  };

  const resolvedGlbUrl = getAssetUrl(product?.glbUrl || product?.modelUrl);
  const is3DProduct = product?.is3D || !!resolvedGlbUrl;
  const gallery =
    product?.images && product?.images.length > 0
      ? product.images
      : [
          product?.image || '/images/jewellery_cad_ring.png',
          'https://images.unsplash.com/photo-1605100804763-247f67b25406?w=800&auto=format&fit=crop&q=60'
        ];

  const formats =
    product?.formats && product.formats.length > 0
      ? product.formats
      : ['STL', '3DM', 'OBJ', 'STEP'];

  const [activeTab, setActiveTab] = useState('image'); // 'image' or '3d'
  const [mainImage, setMainImage] = useState(gallery[0]);
  const [selectedFormat, setSelectedFormat] = useState(formats[0]);
  const [isWebAROpen, setIsWebAROpen] = useState(false);
  const [isFormatGuideOpen, setIsFormatGuideOpen] = useState(false);

  const modelIdDisplay = product?.sku || product?.id || product?._id || 'MD-3001';
  const isFav = isFavorite(modelIdDisplay);

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-8 font-sans">
      {/* Fixed Top Header */}
      <div className="fixed top-0 inset-x-0 z-40 p-4 flex items-center justify-between bg-white/90 backdrop-blur-md border-b border-gray-100/80 shadow-xs">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-xs active:scale-95 transition-transform"
        >
          <ChevronLeft size={20} className="text-gray-800" />
        </button>
        <h1 className="text-sm font-bold text-gray-900 line-clamp-1 max-w-[180px]">
          {product?.name || 'Product Details'}
        </h1>
        <button
          onClick={() => toggleFavorite(product)}
          className={`w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-xs active:scale-95 transition-transform ${
            isFav ? 'text-red-500' : 'text-gray-400'
          }`}
        >
          <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>

      <main className="pt-20 px-4 flex flex-col gap-6">
        {/* View Toggle Tabs if 3D asset exists */}
        {is3DProduct && (
          <div className="flex items-center justify-center gap-2 bg-gray-200/60 p-1 rounded-xl w-full">
            <button
              onClick={() => setActiveTab('image')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'image'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Media Images ({gallery.length})
            </button>
            <button
              onClick={() => setActiveTab('3d')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === '3d'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Interactive 3D View
            </button>
          </div>
        )}

        {/* Top Media Container: 3D Viewport OR Image Viewport */}
        {is3DProduct && activeTab === '3d' ? (
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-slate-950">
              <CanvasWrapper
                glbUrl={resolvedGlbUrl}
                formats={product?.formats}
                modelType={product?.modelType || 'character'}
                className="h-[360px] w-full"
              />
            </div>

            {/* AR Trigger Banner */}
            <div className="flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-2xl shadow-xs">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-gray-800 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">WebAR Mobile View</h4>
                  <p className="text-[10px] text-gray-500">View 3D model in real environment</p>
                </div>
              </div>
              <button
                onClick={() => setIsWebAROpen(true)}
                className="px-3.5 py-1.5 bg-black text-white text-xs font-bold rounded-xl shadow-xs shrink-0"
              >
                Launch AR
              </button>
            </div>
          </div>
        ) : (
          /* Media Gallery View */
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden flex items-center justify-center p-6"
            >
              <img
                src={mainImage || product?.image || '/images/jewellery_cad_ring.png'}
                alt={product?.name}
                className="max-h-full max-w-full object-contain"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-gray-200 text-[10px] font-mono text-gray-700 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" /> Media View
              </div>
            </motion.div>

            {/* Gallery Thumbnails */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`w-14 h-14 rounded-xl border-2 overflow-hidden bg-white p-1 shrink-0 transition-all ${
                      mainImage === img ? 'border-black scale-105 shadow-xs' : 'border-gray-200 opacity-60'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Title, Category & Price Info */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider font-mono">
              {product?.brand || product?.category || 'Jewelry'}
            </span>
            <span className="px-2.5 py-0.5 bg-gray-100 border border-gray-200 rounded-md text-[10px] font-mono font-bold text-gray-800">
              SKU: {modelIdDisplay}
            </span>
          </div>

          <h2 className="text-xl font-bold text-gray-900 leading-tight">{product?.name}</h2>

          <div className="flex items-baseline gap-2 pt-1 border-t border-gray-100">
            <span className="text-2xl font-black text-gray-900">
              ₹{Number(product?.price || 4999).toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-gray-500 font-mono font-medium">INR</span>
          </div>
        </div>

        {/* Specifications Box if 3D */}
        {is3DProduct && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              3D Technical Specifications
            </h3>
            <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                <span className="text-gray-400 block text-[9px]">Polygons</span>
                <span className="font-bold text-gray-900">
                  {(product?.polyCount || 45000).toLocaleString()}
                </span>
              </div>
              <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                <span className="text-gray-400 block text-[9px]">Vertices</span>
                <span className="font-bold text-gray-900">
                  {(product?.vertexCount || 52000).toLocaleString()}
                </span>
              </div>
              <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                <span className="text-gray-400 block text-[9px]">License</span>
                <span className="font-bold text-gray-900">{product?.license || 'Royalty-Free'}</span>
              </div>
              <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                <span className="text-gray-400 block text-[9px]">Geometry</span>
                <span className="font-bold text-gray-900">Watertight</span>
              </div>
            </div>
          </div>
        )}

        {/* Format Selector */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Select Download Format
            </h3>
            <button
              onClick={() => setIsFormatGuideOpen(true)}
              className="text-[11px] font-bold text-gray-500 flex items-center gap-1 underline"
            >
              <Info size={13} /> Guide
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formats.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedFormat(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all border ${
                  selectedFormat === f
                    ? 'bg-black text-white border-black shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Description Box */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-2 shadow-xs">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Description</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            {product?.description ||
              'Exquisite fine jewelry CAD design crafted with mathematical accuracy, suitable for direct 3D printing and casting.'}
          </p>
        </div>
      </main>

      {/* Sticky Bottom Actions Bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 p-4 flex items-center gap-3 shadow-lg">
        <button
          onClick={() => {
            addToCart(product, selectedFormat);
            setIsCartOpen(true);
          }}
          className="flex-1 py-3.5 bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>

        <button
          onClick={() => toggleFavorite(product)}
          className={`p-3.5 rounded-xl border transition-all ${
            isFav
              ? 'bg-red-50 border-red-200 text-red-500'
              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
          }`}
        >
          <Heart className="w-5 h-5" fill={isFav ? 'currentColor' : 'none'} />
        </button>
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white z-[110] shadow-2xl rounded-2xl p-5 space-y-4 text-gray-900 max-h-[85vh] overflow-y-auto"
            >
              <h3 className="text-base font-bold border-b border-gray-100 pb-2">File Formats Guide</h3>
              <div className="space-y-3 text-xs text-gray-600">
                <div>
                  <span className="font-bold text-gray-900 block">STL (Stereolithography)</span>
                  <span>Industry standard for direct 3D printing & lost-wax casting.</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900 block">3DM (Rhinoceros 3D)</span>
                  <span>Native editable CAD format for Rhino / MatrixGold.</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900 block">OBJ (Wavefront)</span>
                  <span>Polygonal mesh for rendering & digital visualization.</span>
                </div>
              </div>
              <button
                onClick={() => setIsFormatGuideOpen(false)}
                className="w-full py-2 bg-black text-white text-xs font-bold rounded-xl"
              >
                Close Guide
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* WebAR Trigger Modal */}
      {is3DProduct && (
        <WebARModal
          isOpen={isWebAROpen}
          onClose={() => setIsWebAROpen(false)}
          productName={product?.name}
          usdzUrl={product?.usdzUrl}
          glbUrl={product?.glbUrl}
        />
      )}
    </div>
  );
};

export default MobileProductDetails;
