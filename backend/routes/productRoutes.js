import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { admin, bucket, db } from '../config/firebase.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Config
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadFile = async (req, file, folderName) => {
  const fileExt = path.extname(file.originalname);

  // Try Cloudinary upload if credentials are provided
  if (process.env.CLOUD_NAME && process.env.API_KEY && process.env.CLOUDINARY_API_SECRET) {
    try {
      const resultUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `diamondDraft/${folderName}`,
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        uploadStream.end(file.buffer);
      });
      return resultUrl;
    } catch (err) {
      console.warn('Cloudinary upload failed, falling back to local upload:', err.message || err);
    }
  }

  // Fallback to local upload
  const localFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}${fileExt}`;
  const localDir = path.join(uploadDir, folderName);
  if (!fs.existsSync(localDir)) {
    fs.mkdirSync(localDir, { recursive: true });
  }
  const filePath = path.join(localDir, localFileName);
  await fs.promises.writeFile(filePath, file.buffer);

  return `${req.protocol}://${req.get('host')}/uploads/${folderName}/${localFileName}`;
};

// POST: Create Product with Images/Video
router.post('/', upload.fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  try {
    const { name, sku, description, price, compareAtPrice, quantity, category, status } = req.body;
    
    // Upload files
    let imageUrls = [];
    if (req.files?.images) {
      const uploadPromises = req.files.images.map(file => uploadFile(req, file, 'products'));
      imageUrls = await Promise.all(uploadPromises);
    }
    
    let videoUrl = null;
    if (req.files?.video && req.files.video.length > 0) {
      videoUrl = await uploadFile(req, req.files.video[0], 'videos');
    }

    const newProduct = {
      name,
      sku,
      description,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
      quantity: Number(quantity),
      category,
      images: imageUrls,
      video: videoUrl,
      status: status || 'Active',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('products').add(newProduct);
    res.status(201).json({ _id: docRef.id, ...newProduct });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch all products
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
    const products = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch single product
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('products').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ _id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update a product
router.put('/:id', upload.fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  try {
    const docRef = db.collection('products').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ message: 'Product not found' });

    const updateData = { ...req.body, updatedAt: admin.firestore.FieldValue.serverTimestamp() };
    
    // Upload files if new ones are provided
    if (req.files?.images) {
      const uploadPromises = req.files.images.map(file => uploadFile(req, file, 'products'));
      updateData.images = await Promise.all(uploadPromises);
    }
    
    if (req.files?.video && req.files.video.length > 0) {
      updateData.video = await uploadFile(req, req.files.video[0], 'videos');
    }

    await docRef.update(updateData);
    const updatedDoc = await docRef.get();
    res.status(200).json({ _id: updatedDoc.id, ...updatedDoc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper for deletion
const deleteFile = async (fileUrl) => {
  if (!fileUrl) return;
  
  if (fileUrl.includes('cloudinary.com')) {
    try {
      const urlParts = fileUrl.split('/upload/');
      if (urlParts.length === 2) {
        const pathWithVersion = urlParts[1];
        const pathParts = pathWithVersion.split('/');
        if (pathParts[0].startsWith('v') && !isNaN(pathParts[0].substring(1))) {
          pathParts.shift();
        }
        const fileWithExt = pathParts.join('/');
        const lastDotIndex = fileWithExt.lastIndexOf('.');
        const publicId = lastDotIndex !== -1 ? fileWithExt.substring(0, lastDotIndex) : fileWithExt;

        const resourceType = fileUrl.includes('/video/') ? 'video' : 'image';
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
      }
    } catch (err) {
      console.error('Error deleting from Cloudinary:', err.message || err);
    }
  } else if (fileUrl.includes('firebasestorage')) {
    if (!bucket) return;
    try {
      const urlObj = new URL(fileUrl);
      const pathParts = urlObj.pathname.split('/o/');
      if (pathParts.length === 2) {
        const filePath = decodeURIComponent(pathParts[1]);
        await bucket.file(filePath).delete();
      }
    } catch (err) {
      console.error('Error deleting from firebase:', err.message);
    }
  } else if (fileUrl.includes('/uploads/')) {
    try {
      const urlObj = new URL(fileUrl);
      const relativePath = urlObj.pathname.replace(/^\/uploads\//, '');
      const filePath = path.join(uploadDir, relativePath);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (err) {
      console.error('Error deleting local file:', err.message || err);
    }
  }
};

// DELETE: Remove product and its assets
router.delete('/:id', async (req, res) => {
  try {
    const docRef = db.collection('products').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ message: 'Product not found' });

    const product = doc.data();

    // Delete associated images
    if (product.images && product.images.length > 0) {
      for (const imgUrl of product.images) {
        await deleteFile(imgUrl);
      }
    }
    // Delete associated video
    if (product.video) {
      await deleteFile(product.video);
    }

    await docRef.delete();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
