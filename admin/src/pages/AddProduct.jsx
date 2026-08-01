import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Image as ImageIcon, Video as VideoIcon, Box as BoxIcon, X, FileCheck, Sparkles } from 'lucide-react';
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

export const AddProduct = () => {
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setModal(prev => ({ ...prev, show: false }));
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      data.append('formats', JSON.stringify(selectedFormats));

      Array.from(images).forEach(image => data.append('images', image));
      if (video) data.append('video', video);
      if (modelFile) data.append('modelFile', modelFile);
      if (templateImage) data.append('templateImage', templateImage);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${apiUrl}/api/products`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setModal({
        show: true,
        title: 'Success!',
        message: '3D Product listing & template image created and published successfully.',
        type: 'success',
        actionLabel: 'Great'
      });
      setFormData({
        name: '', sku: '', description: '', price: '', compareAtPrice: '', quantity: '1', category: '3D Models', subcategory: 'Hard Surface', polyCount: '45000', vertexCount: '52000', license: 'Royalty-Free'
      });
      setSelectedFormats(['.FBX', '.OBJ', '.STL', '.GLB']);
      setImages([]);
      setVideo(null);
      setModelFile(null);
      setTemplateImage(null);
    } catch (err) {
      console.error(err);
      setModal({
        show: true,
        title: 'Submission Failed',
        message: err.response?.data?.error || 'Error creating 3D product. Please check your data and try again.',
        type: 'error',
        actionLabel: 'Close'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-grotesk tracking-tight">Add New 3D Product</h2>
        <p className="text-zinc-400 mt-1">Upload 3D model files (.glb, .gltf, .fbx, .obj, .stl, .zip), template card image, and specs.</p>
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
              <textarea rows="4" name="description" value={formData.description} onChange={handleInputChange} className="input-field resize-none" placeholder="Describe the 3D model, topology, and features in detail..."></textarea>
            </div>
          </div>

          {/* Pricing & 3D Technical Specs */}
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
                <label className="block text-sm font-medium text-zinc-300 mb-2">Compare at Price ($ USD) - Optional</label>
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
              <span>1. 3D Model File Upload (.glb, .gltf, .fbx, .obj, .stl, .zip)</span>
            </h3>

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
                  <p className="text-xs text-cyan-400 font-medium">Click to replace 3D model file</p>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <BoxIcon size={24} className="text-cyan-400" />
                  </div>
                  <p className="text-sm font-bold text-white mb-1">Click to upload 3D Model File</p>
                  <p className="text-xs text-zinc-400">Supports .GLB, .GLTF, .FBX, .OBJ, .STL, .ZIP</p>
                </>
              )}
            </label>
          </div>

          {/* Conditional Option 2: Upload Template Image when 3D file attached */}
          {(modelFile || formData.category === '3D Models') && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 p-6 rounded-xl bg-amber-500/5 border border-amber-500/30">
              <h3 className="text-lg font-semibold text-amber-400 border-b border-amber-500/20 pb-2 flex items-center gap-2">
                <Sparkles size={20} />
                <span>2. Template Image Upload (Product Card Preview for Homepage)</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Upload a template/thumbnail image that will be rendered on the product cards in the homepage & catalog for this 3D product. Supports any image format (PNG, JPG, WEBP, GIF, SVG).
              </p>

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
                    <p className="text-sm font-bold text-white mb-1">Upload Template Image for Product Card</p>
                    <p className="text-xs text-zinc-400">Any image format supported (.png, .jpg, .webp, .svg, .gif)</p>
                  </>
                )}
              </label>
            </motion.div>
          )}

          {/* Media (Additional Gallery Images & Video) */}
          <div className="space-y-4 p-6 rounded-xl bg-surfaceHover/50 border border-border">
            <h3 className="text-lg font-semibold text-zinc-100 border-b border-border pb-2">Additional Media & Gallery Images</h3>
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
                            className="absolute top-1 right-1 p-0.5 bg-black/70 hover:bg-red-500 text-white rounded-full transition-all duration-200 opacity-100 shadow-md"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-primary-400">Click anywhere else to change images</p>
                      <p className="text-[10px] text-zinc-500">{images.length} files selected</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-surfaceHover border border-border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <ImageIcon size={24} className="text-zinc-400 group-hover:text-primary-500 transition-colors" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-100 mb-1">Upload Additional Gallery Images</p>
                    <p className="text-xs text-zinc-500">PNG, JPG, WEBP (max 10MB)</p>
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
                        className="absolute top-1 right-1 p-0.5 bg-black/70 hover:bg-red-500 text-white rounded-full transition-all duration-200 opacity-100 shadow-md"
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
                    <p className="text-sm font-semibold text-zinc-100 mb-1">Upload 360° Turntable Video</p>
                    <p className="text-xs text-zinc-500">MP4, WEBM (max 50MB)</p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-6 py-3 bg-cyan-500 text-slate-950 font-bold rounded-xl hover:bg-cyan-400 transition-colors">
              <Check size={18} /> {loading ? 'Publishing 3D Product...' : 'Publish 3D Product'}
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
