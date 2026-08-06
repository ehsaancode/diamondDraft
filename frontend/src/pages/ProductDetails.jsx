import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Image as ImageIcon
} from 'lucide-react';
import CanvasWrapper from '../canvas/CanvasWrapper';
import WebARModal from '../components/WebARModal';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoriteContext';
import { useMobile } from '../hooks/useMobile';
import MobileProductDetails from './MobileProductDetails';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart, setIsCartOpen } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isMobile = useMobile();

  const [product, setProduct] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [selectedFormat, setSelectedFormat] = useState('STL');
  const [isFormatGuideOpen, setIsFormatGuideOpen] = useState(false);
  const [isWebAROpen, setIsWebAROpen] = useState(false);
  const [activeTab, setActiveTab] = useState('image'); // 'image' or '3d'
  const [signedDownload, setSignedDownload] = useState(null);
  const [isClaimingSignedUrl, setIsClaimingSignedUrl] = useState(false);

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
        if (!res.ok) throw new Error('Failed to fetch product details');
        const data = await res.json();

        const getImageUrl = (url) => (url?.startsWith('http') ? url : `${apiUrl}${url}`);
        const modelFileUrl = data.glbUrl || data.modelUrl || null;
        const is3DAsset = !!modelFileUrl || data.category === '3D Models';

        const mappedProduct = {
          id: data._id || data.id,
          sku: data.sku || data._id || data.id,
          name: data.name,
          brand: data.category || 'Jewelry',
          category: data.category || 'Jewelry',
          price: Number(data.price) || 0,
          rating: data.rating !== undefined ? Number(data.rating) : 5.0,
          reviews: data.reviews !== undefined ? Number(data.reviews) : 0,
          description: data.description || '',
          image:
            data.images && data.images.length > 0
              ? getImageUrl(data.images[0])
              : data.image || null,
          images: data.images ? data.images.map((img) => getImageUrl(img)) : (data.image ? [data.image] : []),
          glbUrl: modelFileUrl ? getImageUrl(modelFileUrl) : null,
          is3D: is3DAsset,
          formats: data.formats || (is3DAsset ? ['.FBX', '.OBJ', '.STL', '.GLB'] : ['STL', '3DM', 'OBJ']),
          polyCount: Number(data.polyCount) || (is3DAsset ? 45000 : 0),
          vertexCount: Number(data.vertexCount) || (is3DAsset ? 52000 : 0),
          license: data.license || 'Royalty-Free'
        };

        setProduct(mappedProduct);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, location.state]);

  const activeProduct = product;

  const [mainImage, setMainImage] = useState(activeProduct?.image || null);

  useEffect(() => {
    if (product) {
      setMainImage(product.image);
    }
  }, [product]);

  const handleClaimSignedDownloadUrl = async () => {
    setIsClaimingSignedUrl(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/vault/signed-download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: activeProduct.id, format: selectedFormat }),
      });
      const data = await res.json();
      setSignedDownload(data);
    } catch (e) {
      setSignedDownload({
        downloadUrl: activeProduct?.glbUrl || '#',
        expiresInSeconds: 900,
        format: selectedFormat,
        productName: activeProduct?.name || '3D Asset',
      });
    } finally {
      setIsClaimingSignedUrl(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 animate-pulse space-y-8 bg-[#fafafa]">
        <div className="h-6 w-32 bg-gray-200 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 h-[450px] bg-gray-200 rounded-3xl" />
          <div className="lg:col-span-5 space-y-6">
            <div className="h-8 w-3/4 bg-gray-200 rounded-xl" />
            <div className="h-6 w-1/3 bg-gray-200 rounded-lg" />
            <div className="h-32 w-full bg-gray-200 rounded-2xl" />
            <div className="h-12 w-full bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!activeProduct) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-20 text-center bg-[#fafafa]">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-xs text-gray-500 mb-6">The requested product could not be located in our catalog.</p>
        <button onClick={() => navigate('/shop')} className="px-6 py-2.5 bg-black text-white text-xs font-bold rounded-xl">
          Return to Shop
        </button>
      </div>
    );
  }

  if (isMobile) {
    return <MobileProductDetails product={activeProduct} />;
  }

  const isFav = isFavorite(activeProduct.id || activeProduct._id);
  const is3DProduct = activeProduct.is3D || !!activeProduct.glbUrl;

  const gallery =
    activeProduct.images && activeProduct.images.length > 0
      ? activeProduct.images
      : activeProduct.image
      ? [activeProduct.image]
      : [];

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
                {mainImage || activeProduct.image ? (
                  <img
                    src={mainImage || activeProduct.image}
                    alt={activeProduct.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center text-gray-400">
                    <ImageIcon className="w-12 h-12 mb-2 text-gray-300" />
                    <span className="text-xs font-semibold text-gray-500">No Image Uploaded</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Information & Actions */}
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
                {activeProduct.rating || 5.0} ({activeProduct.reviews || 0} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl md:text-3xl font-bold text-gray-900">
                ₹{Number(activeProduct.price || 0).toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-gray-400 font-medium font-mono">INR</span>
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
              onClick={() => {
                addToCart(activeProduct, selectedFormat);
                setIsCartOpen(true);
              }}
              className="flex-1 cursor-pointer py-4 px-6 bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} />
              Add to Cart
            </button>

            <button
              onClick={() => toggleFavorite(activeProduct)}
              className={`cursor-pointer p-4 rounded-xl border flex items-center justify-center transition-colors ${
                isFav
                  ? 'border-red-200 bg-red-50 text-red-500'
                  : 'border-gray-300 text-gray-700 hover:border-black'
              }`}
            >
              <Heart size={20} fill={isFav ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Signed Download Mutation Button */}
          {is3DProduct && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-3">
              <button
                onClick={handleClaimSignedDownloadUrl}
                disabled={isClaimingSignedUrl}
                className="w-full py-3 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-gray-300" />
                <span>
                  {isClaimingSignedUrl ? 'Generating Temporal Signed Link...' : 'Generate Temporal Signed Download Link'}
                </span>
              </button>

              {signedDownload && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs space-y-2">
                  <div className="flex items-center justify-between text-emerald-700 font-bold">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Temporal Signed Link Active
                    </span>
                    <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Expires in 15 mins
                    </span>
                  </div>
                  <a
                    href={signedDownload.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Download {selectedFormat} File Package
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Specifications Card */}
          {is3DProduct && (
            <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                3D CAD Technical Specifications
              </h4>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-gray-400 block text-[10px]">Polygons</span>
                  <span className="font-semibold text-gray-800">
                    {(activeProduct.polyCount || 45000).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Vertices</span>
                  <span className="font-semibold text-gray-800">
                    {(activeProduct.vertexCount || 52000).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">License</span>
                  <span className="font-semibold text-gray-800">{activeProduct.license || 'Royalty-Free'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Geometry Mesh</span>
                  <span className="font-semibold text-gray-800">Watertight / Solid</span>
                </div>
              </div>
            </div>
          )}
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
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white z-50 shadow-2xl rounded-2xl p-6 space-y-4 text-gray-900"
            >
              <h3 className="text-lg font-bold border-b border-gray-100 pb-2">3D File Format Guide</h3>
              <div className="space-y-3 text-xs text-gray-600">
                <div>
                  <span className="font-bold text-gray-900 block">STL (Stereolithography)</span>
                  <span>Triangle mesh file for direct 3D printing & SLA resin printers.</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900 block">3DM (Rhinoceros 3D)</span>
                  <span>NURBS surface file for MatrixGold & Rhino editing.</span>
                </div>
                <div>
                  <span className="font-bold text-gray-900 block">OBJ / GLB</span>
                  <span>Open polygonal mesh formats for WebGL & AR inspection.</span>
                </div>
              </div>
              <button
                onClick={() => setIsFormatGuideOpen(false)}
                className="w-full py-2.5 bg-black text-white text-xs font-bold rounded-xl"
              >
                Close Guide
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* WebAR Modal */}
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
