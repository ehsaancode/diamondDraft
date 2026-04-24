import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  compareAtPrice: { type: Number },
  quantity: { type: Number, default: 0 },
  category: { type: String },
  images: [{ type: String }], // Array of uploaded image paths/URLs
  video: { type: String },    // Uploaded 360 video path/URL
  status: { type: String, default: 'Active', enum: ['Active', 'Draft', 'Out of Stock'] }
}, {
  timestamps: true
});

export default mongoose.model('Product', productSchema);
