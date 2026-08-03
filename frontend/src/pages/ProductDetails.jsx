import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ShoppingBag, Heart, Star, ChevronLeft, ShieldCheck, Download, RotateCcw, Info, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Specifications from '../components/home/Specifications';
import CanvasWrapper from '../canvas/CanvasWrapper';
import WebARModal from '../components/WebARModal';
import { useCartStore } from '../store/useCartStore';
import { useFavorites } from '../context/FavoriteContext';
import { useMobile } from '../hooks/useMobile';
import MobileProductDetails from './MobileProductDetails';

const fallbackProduct = {
  id: 'mock',
  name: 'Elegant Diamond Ring',
  brand: 'Jewelry',
  price: 350.0,
  rating: 4.8,
  reviews: 124,
  description: 'Exquisite fine jewelry CAD design crafted with mathematical accuracy, suitable for direct 3D printing and casting.',
  image: 'https://images.unsplash.com/photo-1605100804763-247f67b25406?w=800&auto=format&fit=crop&q=60'
};

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const { isFavorite, toggleFavorite } = useFavorites();
  const isMobile = useMobile();

  const [product, setProduct] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [selectedFormat, setSelectedFormat] = useState('STL');
  const [isFormatGuideOpen, setIsFormatGuideOpen] = useState(false);
  const [isWebAROpen, setIsWebAROpen] = useState(false);
  const [activeTab, setActiveTab] = useState('image'); // 'image' or '3d'

  useEffect(() => {
    if (location.state && (location.state.id === id || location.state._id === id)) {
      setProduct(location.state);
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const p = await res.json();

        const getImageUrl = (url) => (url?.startsWith('http') ? url : `${apiUrl}${url}`);
        const DEFAULT_SUBCATEGORIES = {
          Rings: 'Engagement',
          Necklaces: 'Pendants',
          Earrings: 'Studs',
          Bracelets: 'Tennis'
        };
        const sub = p.subcategory || DEFAULT_SUBCATEGORIES[p.category] || '';
        const modelFileUrl = p.glbUrl || p.modelUrl || null;
        const is3DAsset = !!modelFileUrl || p.category === '3D Models';

        const mappedProduct = {
          id: p._id || p.id || id,
          sku: p.sku || p._id || id,
          name: p.name,
          brand: p.category || 'Jewelry',
          category: p.category || 'Jewelry',
          subcategory: sub,
          price: p.price,
          rating: 5.0,
          reviews: 0,
          description: p.description,
          image: p.images && p.images.length > 0 ? getImageUrl(p.images[0]) : p.image || '/images/jewellery_cad_ring.png',
          images: p.images ? p.images.map((img) => getImageUrl(img)) : (p.image ? [p.image] : []),
          tag: sub,
          status: p.status,
          glbUrl: modelFileUrl ? getImageUrl(modelFileUrl) : null,
          is3D: is3DAsset,
          formats: p.formats || (is3DAsset ? ['.FBX', '.OBJ', '.STL', '.BLEND', '.GLB'] : ['STL', '3DM', 'OBJ', 'STEP']),
          polyCount: p.polyCount || (is3DAsset ? 45000 : 0),
          vertexCount: p.vertexCount || (is3DAsset ? 52000 : 0),
          license: p.license || 'Royalty-Free'
        };

        setProduct(mappedProduct);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setProduct(fallbackProduct);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, location.state]);

  const activeProduct = product || fallbackProduct;
  const isFav = isFavorite(activeProduct.id || activeProduct._id);
  const is3DProduct = activeProduct.is3D || !!activeProduct.glbUrl;

  const [mainImage, setMainImage] = useState(activeProduct.image);

  useEffect(() => {
    if (product) {
      setMainImage(product.image);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isMobile) {
    return <MobileProductDetails product={activeProduct} />;
  }

  const gallery =
    activeProduct.images && activeProduct.images.length > 0
      ? activeProduct.images
      : [
          activeProduct.image,
          'https://images.unsplash.com/photo-1605100804763-247f67b25406?w=800&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1599643477874-dc3b91490214?w=800&auto=format&fit=crop&q=60'
        ];

  const formats =
    activeProduct.formats && activeProduct.formats.length > 0
      ? activeProduct.formats
      : ['STL', '3DM', 'OBJ', 'STEP'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 pb-32 md:pb-24 bg-white text-gray-900"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black mb-8 transition-colors cursor-pointer"
      >
        <ChevronLeft size={16} />
        Back to Products
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
        {/* Left Column: Gallery OR 3D Viewport */}
        <div className="lg:col-span-7 space-y-4">
          {/* View Toggle Tabs if 3D model exists */}
          {is3DProduct && (
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl w-fit mb-2">
              <button
                onClick={() => setActiveTab('image')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'image'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Media Images ({gallery.length})
              </button>
              <button
                onClick={() => setActiveTab('3d')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === '3d'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Interactive 3D View
              </button>
            </div>
          )}

          {is3DProduct && activeTab === '3d' ? (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <CanvasWrapper
                  glbUrl={activeProduct.glbUrl}
                  formats={activeProduct.formats}
                  modelType={activeProduct.modelType || 'character'}
                  className="h-[500px] w-full"
                />
              </div>

              {/* WebAR Banner */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-gray-700" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      Mobile AR View (USDZ / GLB)
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Scan QR code on your mobile camera to test scale in real environment.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsWebAROpen(true)}
                  className="px-4 py-2 bg-black text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Launch AR QR
                </button>
              </div>
            </div>
          ) : (
            /* Image Gallery View */
            <div className="flex flex-col-reverse md:flex-row gap-4">
              {/* Thumbnail List */}
              {gallery.length > 1 && (
                <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[500px] scrollbar-hide shrink-0">
                  {gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMainImage(img)}
                      className={`cursor-pointer w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white shrink-0 ${
                        mainImage === img ? 'border-black scale-105 shadow-sm' : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Preview Container */}
              <div className="flex-1 aspect-square bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center p-6">
                <img
                  src={mainImage || activeProduct.image}
                  alt={activeProduct.name}
                  className="w-full h-full object-contain max-h-[500px]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Product Information & Purchase Form */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 block mb-1 font-sans">
              {activeProduct.brand || activeProduct.category || 'Jewelry'}
            </span>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 leading-tight">
              {activeProduct.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {activeProduct.rating || 5.0} ({activeProduct.reviews || 24} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl md:text-3xl font-bold text-gray-900">
                ${activeProduct.price}
              </span>
              <span className="text-xs text-gray-400 font-medium">USD</span>
            </div>
          </div>

          {/* Product Description */}
          <div className="border-t border-b border-gray-100 py-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-sans">
              {activeProduct.description ||
                'Exquisite fine jewelry CAD design crafted with mathematical accuracy, suitable for direct 3D printing and casting.'}
            </p>
          </div>

          {/* Formats Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-900">
                Select File Format
              </span>
              <button
                onClick={() => setIsFormatGuideOpen(true)}
                className="text-xs text-gray-500 hover:text-black flex items-center gap-1 font-medium underline cursor-pointer"
              >
                <Info size={14} /> Format Guide
              </button>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-3">
              {formats.map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFormat(f)}
                  className={`cursor-pointer px-4 py-2 rounded-full border text-xs md:text-sm font-medium transition-all ${
                    selectedFormat === f
                      ? 'border-black bg-black text-white shadow-sm'
                      : 'border-gray-300 text-gray-700 hover:border-black'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => addToCart(activeProduct)}
              className="cursor-pointer flex-1 bg-black text-white px-6 py-4 flex items-center justify-center gap-3 text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-colors rounded-xl shadow-md"
            >
              <ShoppingBag size={18} />
              Add to Requests
            </button>

            <button
              onClick={() => toggleFavorite(activeProduct)}
              className={`cursor-pointer p-4 rounded-xl border flex items-center justify-center transition-colors ${
                isFav
                  ? 'border-red-500 bg-red-50 text-red-500'
                  : 'border-gray-300 text-gray-900 hover:border-black'
              }`}
            >
              <Heart size={20} fill={isFav ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>

      {/* Specifications Section */}
      <div className="mt-16 md:mt-24 border-t border-gray-100 pt-16">
        <Specifications product={activeProduct} />
      </div>

      {/* Features Banner */}
      <div className="mt-12 md:mt-20 border-t border-gray-100 py-12 md:py-16 bg-gray-50/50 rounded-3xl">
        <div className="flex flex-col md:flex-row items-center justify-around gap-8 md:gap-4 px-4 md:px-8">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400 border border-gray-100">
              <Download size={22} />
            </div>
            <span className="text-[10px] md:text-xs font-medium uppercase tracking-widest text-gray-400">
              Instant Digital Delivery ({formats.join('/')})
            </span>
          </div>

          <div className="hidden md:block h-12 w-px bg-gray-100"></div>

          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400 border border-gray-100">
              <ShieldCheck size={22} />
            </div>
            <span className="text-[10px] md:text-xs font-medium uppercase tracking-widest text-gray-400">
              Production-ready precision
            </span>
          </div>

          <div className="hidden md:block h-12 w-px bg-gray-100"></div>

          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-400 border border-gray-100">
              <RotateCcw size={22} />
            </div>
            <span className="text-[10px] md:text-xs font-medium uppercase tracking-widest text-gray-400">
              Includes 3 free design revisions
            </span>
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
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-white z-[110] shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh] text-gray-900"
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
                    The industry standard for 3D printing. Represents the model surface using a mesh of triangles. Best for sending directly to your 3D printer or casting house.{' '}
                    <span className="text-black font-semibold">Cannot be easily edited.</span>
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-1">3DM (Rhinoceros 3D)</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    The native file format for Rhino and Matrix/MatrixGold. Contains full NURBS geometry and is the best choice if your jeweler intends to{' '}
                    <span className="text-black font-semibold">manipulate or edit the design</span> before printing.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-1">OBJ (Wavefront)</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    A universally accepted format that supports polygonal geometry, commonly used in rendering software (like Blender or KeyShot) or animation pipelines.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-1">STEP (Standard Exchange)</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    A highly accurate, cross-platform solid modeling format widely used in precision engineering. Retains mathematical accuracy of curves and surfaces.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 text-center sticky bottom-0">
                <p className="text-xs text-gray-500 italic">
                  Select <span className="font-bold text-black">STL</span> for direct 3D printing, or <span className="font-bold text-black">3DM</span> if your local jeweler needs to edit the design.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* WebAR Trigger Modal */}
      {is3DProduct && (
        <WebARModal
          isOpen={isWebAROpen}
          onClose={() => setIsWebAROpen(false)}
          productName={activeProduct.name}
          usdzUrl={activeProduct.usdzUrl}
          glbUrl={activeProduct.glbUrl}
        />
      )}
    </motion.div>
  );
};

export default ProductDetails;
