import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Image as ImageIcon, Video as VideoIcon, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check } from '../components/icons/Check';
import axios from 'axios';
import { Modal } from '../components/common/Modal';

const CATEGORY_MAP = {
  'Rings': ['Engagement', 'Wedding Bands', 'Eternity', 'Cocktail'],
  'Necklaces': ['Chokers', 'Pendants', 'Chains', 'Lariats'],
  'Earrings': ['Studs', 'Hoops', 'Drops', 'Huggies'],
  'Bracelets': ['Tennis', 'Bangles', 'Cuffs', 'Chain & Link']
};

export const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [modal, setModal] = useState({ show: false, title: '', message: '', type: 'success', actionLabel: 'Okay' });
  const [formData, setFormData] = useState({
    name: '', sku: '', description: '', price: '', compareAtPrice: '', quantity: '', category: 'Rings', subcategory: 'Engagement'
  });
  const [selectedFormats, setSelectedFormats] = useState(['STL', '3DM']);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [existingVideo, setExistingVideo] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);

  useEffect(() => {
    if (images.length === 0) {
      setImagePreviews([]);
      return;
    }
    const urls = Array.from(images).map(file => URL.createObjectURL(file));
    setImagePreviews(urls);
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, [images]);

  useEffect(() => {
    if (!video) {
      setVideoPreview(null);
      return;
    }
    const url = URL.createObjectURL(video);
    setVideoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [video]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        category: value,
        subcategory: CATEGORY_MAP[value][0]
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/products/${id}`);
        const data = res.data;
        setFormData({
          name: data.name || '',
          sku: data.sku || '',
          description: data.description || '',
          price: data.price || '',
          compareAtPrice: data.compareAtPrice || '',
          quantity: data.quantity || '',
          category: data.category || 'Rings',
          subcategory: data.subcategory || (CATEGORY_MAP[data.category || 'Rings'] ? CATEGORY_MAP[data.category || 'Rings'][0] : '')
        });
        setSelectedFormats(data.formats || ['STL', '3DM']);
        setExistingImages(data.images || []);
        setExistingVideo(data.video || null);
      } catch (err) {
        console.error('Failed to load product', err);
        alert('Failed to load product for editing');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setModal(prev => ({ ...prev, show: false }));
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      
      data.append('existingImages', JSON.stringify(existingImages));
      data.append('existingVideo', existingVideo !== null ? existingVideo : 'null');
      data.append('formats', JSON.stringify(selectedFormats));

      Array.from(images).forEach(image => data.append('images', image));
      if (video) data.append('video', video);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.put(`${apiUrl}/api/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setModal({
        show: true,
        title: 'Success!',
        message: 'Product listing has been updated and changes saved to the database successfully.',
        type: 'success',
        actionLabel: 'Great'
      });
      setTimeout(() => navigate('/products'), 1500);
    } catch (err) {
      console.error(err);
      setModal({
        show: true,
        title: 'Update Failed',
        message: err.response?.data?.error || 'Error updating product. Please check your data and try again.',
        type: 'error',
        actionLabel: 'Close'
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="p-8 text-center text-zinc-400">Loading product...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-grotesk tracking-tight">Edit Product</h2>
        <p className="text-zinc-400 mt-1">Update your jewelry listing information.</p>
      </div>

      <div className="glass-panel p-6 md:p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* General Info */}
          <div className="space-y-4 shadow p-6 rounded-xl bg-surfaceHover/50 border border-border">
            <h3 className="text-lg font-semibold text-zinc-100 border-b border-border pb-2">General Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Product Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="input-field" placeholder="E.g. Emerald Cut Diamond Ring..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">SKU</label>
                <input type="text" name="sku" required value={formData.sku} onChange={handleInputChange} className="input-field" placeholder="RING-001" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
              <textarea rows="4" name="description" value={formData.description} onChange={handleInputChange} className="input-field resize-none" placeholder="Describe the piece in detail..."></textarea>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 p-6 rounded-xl bg-surfaceHover/50 border border-border relative overflow-hidden">
              <h3 className="text-lg font-semibold text-zinc-100 border-b border-border pb-2 relative z-10">Pricing</h3>
              <div className="relative z-10">
                <label className="block text-sm font-medium text-zinc-300 mb-2">Price (₹)</label>
                <div className="relative text-zinc-400 focus-within:text-primary-500 transition-colors">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2">₹</span>
                  <input type="number" name="price" required value={formData.price} onChange={handleInputChange} className="input-field pl-8" placeholder="50000" />
                </div>
              </div>
              <div className="relative z-10">
                <label className="block text-sm font-medium text-zinc-300 mb-2">Compare at Price (₹) - Optional</label>
                <div className="relative text-zinc-400 focus-within:text-zinc-300 transition-colors">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2">₹</span>
                  <input type="number" name="compareAtPrice" value={formData.compareAtPrice} onChange={handleInputChange} className="input-field pl-8" placeholder="60000" />
                </div>
              </div>
            </div>
            <div className="space-y-4 p-6 rounded-xl bg-surfaceHover/50 border border-border">
              <h3 className="text-lg font-semibold text-zinc-100 border-b border-border pb-2">Inventory</h3>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Quantity in Stock</label>
                <input type="number" name="quantity" required value={formData.quantity} onChange={handleInputChange} className="input-field" placeholder="10" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Category</label>
                  <div className="relative">
                    <select name="category" value={formData.category} onChange={handleInputChange} className="input-field appearance-none">
                      <option value="Rings">Rings</option>
                      <option value="Necklaces">Necklaces</option>
                      <option value="Earrings">Earrings</option>
                      <option value="Bracelets">Bracelets</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Subcategory</label>
                  <div className="relative">
                    <select name="subcategory" value={formData.subcategory} onChange={handleInputChange} className="input-field appearance-none">
                      {(CATEGORY_MAP[formData.category] || []).map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <label className="block text-sm font-medium text-zinc-300 mb-2">Available Formats</label>
                <div className="flex flex-wrap gap-6 mt-2 bg-black/20 p-3 rounded-lg border border-border/40">
                  {['STL', '3DM', 'OBJ', 'STEP'].map(fmt => (
                    <label key={fmt} className="flex items-center gap-2.5 text-sm text-zinc-300 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={selectedFormats.includes(fmt)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFormats(prev => [...prev, fmt]);
                          } else {
                            setSelectedFormats(prev => prev.filter(f => f !== fmt));
                          }
                        }}
                        className="rounded border-zinc-700 bg-zinc-800 text-primary-500 focus:ring-primary-500/50 w-4 h-4"
                      />
                      <span className="font-semibold">{fmt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="space-y-4 p-6 rounded-xl bg-surfaceHover/50 border border-border">
            <h3 className="text-lg font-semibold text-zinc-100 border-b border-border pb-2">Product Media</h3>
            
            {/* Existing Media Preview */}
            {(existingImages.length > 0 || existingVideo) && (
              <div className="space-y-3 pb-4 border-b border-border">
                <h4 className="text-sm font-semibold text-zinc-300">Current Media (Click X to remove)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {existingImages.map((imgUrl, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-border bg-black aspect-square">
                      <img 
                        src={imgUrl.startsWith('http') ? imgUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${imgUrl.replace(/^\//, '')}`} 
                        alt={`Product ${idx + 1}`} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                      />
                      <button 
                        type="button"
                        onClick={() => setExistingImages(existingImages.filter(img => img !== imgUrl))}
                        className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-red-500 text-white rounded-full transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 shadow-md"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  
                  {existingVideo && (
                    <div className="relative group rounded-lg overflow-hidden border border-border bg-black aspect-square flex items-center justify-center">
                      <video 
                        src={existingVideo.startsWith('http') ? existingVideo : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${existingVideo.replace(/^\//, '')}`} 
                        className="w-full h-full object-cover" 
                        muted
                      />
                      <button 
                        type="button"
                        onClick={() => setExistingVideo(null)}
                        className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-red-500 text-white rounded-full transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 shadow-md z-10"
                      >
                        <X size={14} />
                      </button>
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                        <VideoIcon size={20} className="text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <label className="relative border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary-500/50 hover:bg-primary-500/5 transition-all cursor-pointer group min-h-[180px]">
                <input type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files))} className="hidden" />
                {imagePreviews.length > 0 ? (
                  <div className="w-full space-y-3">
                    <div className="grid grid-cols-3 gap-2 justify-center max-w-[240px] mx-auto pointer-events-auto">
                      {imagePreviews.slice(0, 6).map((preview, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg border border-border overflow-hidden bg-black/40 group/item">
                          <img src={preview} alt="Selected preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setImages(prev => prev.filter((_, i) => i !== idx));
                            }}
                            className="absolute top-1 right-1 p-0.5 bg-black/70 hover:bg-red-500 text-white rounded-full transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover/item:opacity-100 shadow-md"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-primary-400">Click anywhere else to change selection</p>
                      <p className="text-[10px] text-zinc-500">{images.length} files selected</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-surfaceHover border border-border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <ImageIcon size={24} className="text-zinc-400 group-hover:text-primary-500 transition-colors" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-100 mb-1">Click to upload new Images</p>
                    <p className="text-xs text-zinc-500">SVG, PNG, JPG (max 10MB)</p>
                  </>
                )}
              </label>
              <label className="relative border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-accent/50 hover:bg-accent/5 transition-all cursor-pointer group min-h-[180px]">
                <input type="file" accept="video/mp4" onChange={(e) => setVideo(e.target.files[0])} className="hidden" />
                {videoPreview ? (
                  <div className="w-full space-y-3">
                    <div className="relative w-16 h-16 mx-auto rounded-lg border border-border overflow-hidden bg-black/40 flex items-center justify-center pointer-events-auto group/video">
                      <VideoIcon size={28} className="text-accent" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setVideo(null);
                        }}
                        className="absolute top-1 right-1 p-0.5 bg-black/70 hover:bg-red-500 text-white rounded-full transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover/video:opacity-100 shadow-md"
                      >
                        <X size={10} />
                      </button>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-accent line-clamp-1 max-w-[200px] mx-auto">{video.name}</p>
                      <p className="text-[10px] text-zinc-500">Click anywhere else to change video</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-surfaceHover border border-border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <VideoIcon size={24} className="text-zinc-400 group-hover:text-accent transition-colors" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-100 mb-1">Upload new 360° Video</p>
                    <p className="text-xs text-zinc-500">MP4, WEBM (max 50MB)</p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              <Check size={18} /> {loading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
      <Modal 
        show={modal.show} 
        title={modal.title} 
        message={modal.message} 
        type={modal.type} 
        actionLabel={modal.actionLabel}
        onClose={() => setModal(prev => ({ ...prev, show: false }))} 
      />
    </motion.div>
  );
};
