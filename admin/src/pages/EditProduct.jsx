import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Image as ImageIcon, Video as VideoIcon, Box as BoxIcon, X, FileCheck, Sparkles } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check } from '../components/icons/Check';
import axios from 'axios';
import { Modal } from '../components/common/Modal';

const CATEGORY_MAP = {
  '3D Models': ['Hard Surface', 'Characters', 'Vehicles', 'Weapons', 'Abstract', 'Architecture'],
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
    name: '',
    sku: '',
    description: '',
    price: '',
    compareAtPrice: '',
    quantity: '1',
    category: '3D Models',
    subcategory: 'Hard Surface',
    polyCount: '45000',
    vertexCount: '52000',
    license: 'Royalty-Free'
  });
  const [selectedFormats, setSelectedFormats] = useState(['.FBX', '.OBJ', '.STL', '.GLB']);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [modelFile, setModelFile] = useState(null);
  const [templateImage, setTemplateImage] = useState(null);

  const [existingImages, setExistingImages] = useState([]);
  const [existingVideo, setExistingVideo] = useState(null);
  const [existingGlbUrl, setExistingGlbUrl] = useState(null);
  const [existingTemplateImage, setExistingTemplateImage] = useState(null);

  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);
  const [templateImagePreview, setTemplateImagePreview] = useState(null);

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

  useEffect(() => {
    if (!templateImage) {
      setTemplateImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(templateImage);
    setTemplateImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [templateImage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        category: value,
        subcategory: CATEGORY_MAP[value] ? CATEGORY_MAP[value][0] : ''
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
          quantity: data.quantity || '1',
          category: data.category || '3D Models',
          subcategory: data.subcategory || (CATEGORY_MAP[data.category || '3D Models'] ? CATEGORY_MAP[data.category || '3D Models'][0] : ''),
          polyCount: data.polyCount || '45000',
          vertexCount: data.vertexCount || '52000',
          license: data.license || 'Royalty-Free'
        });
        setSelectedFormats(data.formats || ['.FBX', '.OBJ', '.STL', '.GLB']);
        setExistingImages(data.images || []);
        setExistingVideo(data.video || null);
        setExistingGlbUrl(data.glbUrl || data.modelUrl || null);
        setExistingTemplateImage(data.templateImage || data.image || null);
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
      if (modelFile) data.append('modelFile', modelFile);
      if (templateImage) data.append('templateImage', templateImage);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.put(`${apiUrl}/api/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setModal({
        show: true,
        title: 'Success!',
        message: '3D Product listing and template image updated successfully.',
        type: 'success',
        actionLabel: 'Great'
      });
      setTimeout(() => navigate('/products'), 1500);
    } catch (err) {
      console.error(err);
      setModal({
        show: true,
        title: 'Update Failed',
        message: err.response?.data?.error || 'Error updating 3D product. Please check your data and try again.',
        type: 'error',
        actionLabel: 'Close'
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="p-8 text-center text-zinc-400 font-mono">Loading 3D Product Details...</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-grotesk tracking-tight">Edit 3D Product</h2>
        <p className="text-zinc-400 mt-1">Update 3D model files, card template image, specifications, and pricing.</p>
      </div>

      <div className="glass-panel p-6 md:p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* General Info */}
          <div className="space-y-4 shadow p-6 rounded-xl bg-surfaceHover/50 border border-border">
            <h3 className="text-lg font-semibold text-zinc-100 border-b border-border pb-2">General Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Product Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="input-field" placeholder="E.g. Sci-Fi Helmet Model..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">SKU / Model ID</label>
                <input type="text" name="sku" required value={formData.sku} onChange={handleInputChange} className="input-field" placeholder="MD-3001" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
              <textarea rows="4" name="description" value={formData.description} onChange={handleInputChange} className="input-field resize-none" placeholder="Describe the 3D model in detail..."></textarea>
            </div>
          </div>

          {/* Pricing & Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 p-6 rounded-xl bg-surfaceHover/50 border border-border relative overflow-hidden">
              <h3 className="text-lg font-semibold text-zinc-100 border-b border-border pb-2 relative z-10">Pricing & License</h3>
              <div className="relative z-10">
                <label className="block text-sm font-medium text-zinc-300 mb-2">Price ($ USD)</label>
                <div className="relative text-zinc-400 focus-within:text-primary-500 transition-colors">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2">$</span>
                  <input type="number" name="price" required value={formData.price} onChange={handleInputChange} className="input-field pl-8" placeholder="49" />
                </div>
              </div>
              <div className="relative z-10">
                <label className="block text-sm font-medium text-zinc-300 mb-2">Compare at Price ($ USD)</label>
                <div className="relative text-zinc-400 focus-within:text-zinc-300 transition-colors">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2">$</span>
                  <input type="number" name="compareAtPrice" value={formData.compareAtPrice} onChange={handleInputChange} className="input-field pl-8" placeholder="89" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">License Type</label>
                <select name="license" value={formData.license} onChange={handleInputChange} className="input-field">
                  <option value="Royalty-Free">Royalty-Free</option>
                  <option value="Editorial">Editorial</option>
                  <option value="No-AI License">No-AI License</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 p-6 rounded-xl bg-surfaceHover/50 border border-border">
              <h3 className="text-lg font-semibold text-zinc-100 border-b border-border pb-2">3D Specs & Category</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Poly Count</label>
                  <input type="number" name="polyCount" value={formData.polyCount} onChange={handleInputChange} className="input-field" placeholder="45000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Vertex Count</label>
                  <input type="number" name="vertexCount" value={formData.vertexCount} onChange={handleInputChange} className="input-field" placeholder="52000" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Category</label>
                  <div className="relative">
                    <select name="category" value={formData.category} onChange={handleInputChange} className="input-field appearance-none">
                      <option value="3D Models">3D Models</option>
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
                <label className="block text-sm font-medium text-zinc-300 mb-2">Included Formats</label>
                <div className="flex flex-wrap gap-4 mt-2 bg-black/20 p-3 rounded-lg border border-border/40">
                  {['.FBX', '.OBJ', '.STL', '.GLB', '.BLEND', '.3DM'].map(fmt => (
                    <label key={fmt} className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
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

          {/* 3D Model File Upload Section */}
          <div className="space-y-4 p-6 rounded-xl bg-surfaceHover/50 border border-cyan-500/30">
            <h3 className="text-lg font-semibold text-cyan-400 border-b border-border pb-2 flex items-center gap-2">
              <BoxIcon size={20} />
              <span>1. 3D Model File (.glb, .gltf, .fbx, .obj, .stl, .zip)</span>
            </h3>

            {existingGlbUrl && !modelFile && (
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-xs flex items-center justify-between text-cyan-300 mb-3">
                <span className="font-mono">Active 3D Asset: {existingGlbUrl.split('/').pop()}</span>
                <span className="text-zinc-400">Upload new file below to overwrite</span>
              </div>
            )}

            <label className="relative border-2 border-dashed border-cyan-500/40 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-cyan-400 hover:bg-cyan-500/5 transition-all cursor-pointer group min-h-[160px]">
              <input
                type="file"
                accept=".glb,.gltf,.fbx,.obj,.stl,.zip"
                onChange={(e) => setModelFile(e.target.files[0])}
                className="hidden"
              />
              {modelFile ? (
                <div className="w-full space-y-3 pointer-events-auto">
                  <div className="p-4 bg-cyan-500/20 border border-cyan-400 rounded-xl max-w-sm mx-auto flex items-center justify-between text-cyan-300">
                    <div className="flex items-center gap-3">
                      <FileCheck size={24} className="text-cyan-400" />
                      <div className="text-left">
                        <p className="text-xs font-bold text-white line-clamp-1">{modelFile.name}</p>
                        <p className="text-[10px] text-zinc-400 font-mono">{(modelFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setModelFile(null);
                      }}
                      className="p-1 hover:bg-red-500/30 text-zinc-400 hover:text-red-400 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-cyan-400 font-medium">Click to replace selected 3D model file</p>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <BoxIcon size={24} className="text-cyan-400" />
                  </div>
                  <p className="text-sm font-bold text-white mb-1">Upload New 3D Model File</p>
                  <p className="text-xs text-zinc-400">Supports .GLB, .GLTF, .FBX, .OBJ, .STL, .ZIP</p>
                </>
              )}
            </label>
          </div>

          {/* Conditional Option 2: Upload Template Image when 3D file attached */}
          {(modelFile || existingGlbUrl || formData.category === '3D Models') && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 p-6 rounded-xl bg-amber-500/5 border border-amber-500/30">
              <h3 className="text-lg font-semibold text-amber-400 border-b border-amber-500/20 pb-2 flex items-center gap-2">
                <Sparkles size={20} />
                <span>2. Template Image Upload (Product Card Preview for Homepage)</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Upload or update the template image displayed on homepage product cards for this 3D asset. Supports any image format (PNG, JPG, WEBP, GIF, SVG).
              </p>

              {existingTemplateImage && !templateImage && (
                <div className="flex items-center gap-3 p-3 bg-black/30 border border-amber-500/30 rounded-xl">
                  <img src={existingTemplateImage} alt="Current Card Template" className="w-16 h-16 object-cover rounded-lg border border-amber-400/50" />
                  <div className="text-xs">
                    <p className="font-bold text-amber-300">Active Card Template Image</p>
                    <p className="text-[10px] text-zinc-400">Upload a new image below to replace</p>
                  </div>
                </div>
              )}

              <label className="relative border-2 border-dashed border-amber-500/40 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-amber-400 hover:bg-amber-500/10 transition-all cursor-pointer group min-h-[160px]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setTemplateImage(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                {templateImagePreview ? (
                  <div className="w-full space-y-3 pointer-events-auto">
                    <div className="relative max-w-xs mx-auto aspect-square rounded-xl overflow-hidden border-2 border-amber-400 shadow-md bg-black/60 group/template">
                      <img src={templateImagePreview} alt="Template Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setTemplateImage(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-red-500 text-white rounded-full transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-amber-300 font-medium">{templateImage.name}</p>
                    <p className="text-[10px] text-zinc-400">Click anywhere else to replace template image</p>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <ImageIcon size={24} className="text-amber-400" />
                    </div>
                    <p className="text-sm font-bold text-white mb-1">Upload New Template Image for Product Card</p>
                    <p className="text-xs text-zinc-400">Any image format supported (.png, .jpg, .webp, .svg, .gif)</p>
                  </>
                )}
              </label>
            </motion.div>
          )}

          <div className="pt-4 flex justify-end gap-4">
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-6 py-3 bg-cyan-500 text-slate-950 font-bold rounded-xl hover:bg-cyan-400 transition-colors">
              <Check size={18} /> {loading ? 'Saving Changes...' : 'Save 3D Product Changes'}
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
