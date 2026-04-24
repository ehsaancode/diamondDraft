import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { Check } from '../components/icons/Check';
import axios from 'axios';

export const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '', sku: '', description: '', price: '', compareAtPrice: '', quantity: '', category: 'Rings'
  });
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      
      Array.from(images).forEach(image => data.append('images', image));
      if (video) data.append('video', video);

      await axios.post('http://localhost:5000/api/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(true);
      setFormData({ name: '', sku: '', description: '', price: '', compareAtPrice: '', quantity: '', category: 'Rings' });
      setImages([]);
      setVideo(null);
    } catch (err) {
      console.error(err);
      alert('Error creating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-grotesk tracking-tight">Add New Product</h2>
        <p className="text-zinc-400 mt-1">Fill out the form below to list a new piece of jewelry.</p>
        {success && <p className="text-green-500 mt-2">Product published successfully!</p>}
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
            </div>
          </div>

          {/* Media */}
          <div className="space-y-4 p-6 rounded-xl bg-surfaceHover/50 border border-border">
            <h3 className="text-lg font-semibold text-zinc-100 border-b border-border pb-2">Product Media</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <label className="relative border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary-500/50 hover:bg-primary-500/5 transition-all cursor-pointer group">
                <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} className="hidden" />
                <div className="w-12 h-12 rounded-full bg-surfaceHover border border-border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <ImageIcon size={24} className="text-zinc-400 group-hover:text-primary-500 transition-colors" />
                </div>
                <p className="text-sm font-semibold text-zinc-100 mb-1">Click to upload Images</p>
                <p className="text-xs text-zinc-500">{images.length > 0 ? `${images.length} files selected` : 'SVG, PNG, JPG (max 10MB)'}</p>
              </label>
              <label className="relative border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-accent/50 hover:bg-accent/5 transition-all cursor-pointer group">
                <input type="file" accept="video/mp4" onChange={(e) => setVideo(e.target.files[0])} className="hidden" />
                <div className="w-12 h-12 rounded-full bg-surfaceHover border border-border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <VideoIcon size={24} className="text-zinc-400 group-hover:text-accent transition-colors" />
                </div>
                <p className="text-sm font-semibold text-zinc-100 mb-1">Upload 360° Video</p>
                <p className="text-xs text-zinc-500">{video ? video.name : 'MP4, WEBM (max 50MB)'}</p>
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              <Check size={18} /> {loading ? 'Publishing...' : 'Publish Product'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
