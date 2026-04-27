import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { admin, bucket, db } from '../config/firebase.js';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Config
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadToFirebase = async (file, folderName) => {
  if (!bucket) {
    throw new Error('Firebase Storage is not configured properly.');
  }

  const fileExt = path.extname(file.originalname);
  const fileName = `${folderName}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}${fileExt}`;
  const bucketFile = bucket.file(fileName);
  const uuid = uuidv4();
  
  await bucketFile.save(file.buffer, {
    metadata: {
      contentType: file.mimetype,
      metadata: {
        firebaseStorageDownloadTokens: uuid
      }
    }
  });

  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${uuid}`;
};

// POST: Create Product with Images/Video
router.post('/', upload.fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
  try {
    const { name, sku, description, price, compareAtPrice, quantity, category, status } = req.body;
    
    // Upload files to Firebase
    let imageUrls = [];
    if (req.files?.images) {
      const uploadPromises = req.files.images.map(file => uploadToFirebase(file, 'products'));
      imageUrls = await Promise.all(uploadPromises);
    }
    
    let videoUrl = null;
    if (req.files?.video && req.files.video.length > 0) {
      videoUrl = await uploadToFirebase(req.files.video[0], 'videos');
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
    
    // Upload files to Firebase if new ones are provided
    if (req.files?.images) {
      const uploadPromises = req.files.images.map(file => uploadToFirebase(file, 'products'));
      updateData.images = await Promise.all(uploadPromises);
    }
    
    if (req.files?.video && req.files.video.length > 0) {
      updateData.video = await uploadToFirebase(req.files.video[0], 'videos');
    }

    await docRef.update(updateData);
    const updatedDoc = await docRef.get();
    res.status(200).json({ _id: updatedDoc.id, ...updatedDoc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper for Firebase deletion
const deleteFromFirebase = async (fileUrl) => {
  if (!bucket || !fileUrl.includes('firebasestorage')) return;
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
        await deleteFromFirebase(imgUrl);
      }
    }
    // Delete associated video
    if (product.video) {
      await deleteFromFirebase(product.video);
    }

    await docRef.delete();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
