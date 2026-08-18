import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
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
  const fileExt = path.extname(file.originalname).toLowerCase();
  const is3DModel = folderName === 'models' || ['.glb', '.gltf', '.json', '.fbx', '.obj', '.stl', '.zip'].includes(fileExt);

  // Try Cloudinary upload if credentials are provided
  if (process.env.CLOUD_NAME && process.env.API_KEY && process.env.CLOUDINARY_API_SECRET) {
    try {
      const resultUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `gwel/${folderName}`,
            resource_type: is3DModel ? 'raw' : 'auto',
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

// POST: Create Product with Images, Video, and 3D Model File
router.post(
  '/',
  upload.fields([
    { name: 'images', maxCount: 25 },
    { name: 'video', maxCount: 1 },
    { name: 'modelFile', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const {
        name,
        sku,
        description,
        price,
        compareAtPrice,
        quantity,
        category,
        subcategory,
        status,
        formats,
        polyCount,
        vertexCount,
        license
      } = req.body;

      // Upload Images
      let imageUrls = [];
      if (req.files?.images) {
        const uploadPromises = req.files.images.map((file) => uploadFile(req, file, 'products'));
        imageUrls = await Promise.all(uploadPromises);
      }

      // Upload Video
      let videoUrl = null;
      if (req.files?.video && req.files.video.length > 0) {
        videoUrl = await uploadFile(req, req.files.video[0], 'videos');
      }

      // Upload 3D Model File (.glb, .gltf, Three.js .json, .fbx, .obj, .stl, .zip)
      let glbUrl = null;
      if (req.files?.modelFile && req.files.modelFile.length > 0) {
        glbUrl = await uploadFile(req, req.files.modelFile[0], 'models');
      }

      let parsedFormats = ['.glb', '.gltf', '.json', '.fbx', '.obj', '.stl'];
      if (formats) {
        try {
          parsedFormats = typeof formats === 'string' ? JSON.parse(formats) : formats;
        } catch (e) {
          parsedFormats = Array.isArray(formats) ? formats : [formats];
        }
      }

      const newProduct = {
        name,
        sku,
        description,
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        quantity: Number(quantity),
        category: category || '3D Models',
        subcategory: subcategory || '',
        images: imageUrls,
        image: imageUrls.length > 0 ? imageUrls[0] : null,
        video: videoUrl,
        glbUrl: glbUrl,
        modelUrl: glbUrl,
        polyCount: polyCount ? Number(polyCount) : 45000,
        vertexCount: vertexCount ? Number(vertexCount) : 52000,
        license: license || 'Royalty-Free',
        status: status || 'Active',
        formats: parsedFormats,
        createdAt: admin ? admin.firestore.FieldValue.serverTimestamp() : new Date().toISOString(),
        updatedAt: admin ? admin.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
      };

      const docRef = await db.collection('products').add(newProduct);
      res.status(201).json({ _id: docRef.id, ...newProduct });
    } catch (err) {
      console.error('Error creating product:', err);
      res.status(500).json({ error: err.message });
    }
  }
);

// GET: Fetch all products
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('products').orderBy('createdAt', 'desc').get();
    const products = snapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
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
router.put(
  '/:id',
  upload.fields([
    { name: 'images', maxCount: 25 },
    { name: 'video', maxCount: 1 },
    { name: 'modelFile', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const docRef = db.collection('products').doc(req.params.id);
      const doc = await docRef.get();
      if (!doc.exists) return res.status(404).json({ message: 'Product not found' });

      const product = doc.data();
      const updateData = { ...req.body, updatedAt: admin ? admin.firestore.FieldValue.serverTimestamp() : new Date().toISOString() };

      if (req.body.price) updateData.price = Number(req.body.price);
      if (req.body.polyCount) updateData.polyCount = Number(req.body.polyCount);
      if (req.body.vertexCount) updateData.vertexCount = Number(req.body.vertexCount);

      let parsedFormats = undefined;
      if (req.body.formats !== undefined) {
        try {
          parsedFormats = typeof req.body.formats === 'string' ? JSON.parse(req.body.formats) : req.body.formats;
        } catch (e) {
          parsedFormats = Array.isArray(req.body.formats) ? req.body.formats : [req.body.formats];
        }
      }
      if (parsedFormats !== undefined) {
        updateData.formats = parsedFormats;
      }

      // Handle images
      let updatedImages = product.images || [];
      if (req.body.existingImages !== undefined) {
        let parsedExisting = [];
        try {
          parsedExisting = JSON.parse(req.body.existingImages);
        } catch (e) {
          parsedExisting = Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages];
        }

        const deletedImages = (product.images || []).filter((img) => !parsedExisting.includes(img));
        for (const imgUrl of deletedImages) {
          await deleteFile(imgUrl);
        }
        updatedImages = parsedExisting;
      }
      delete updateData.existingImages;

      if (req.files?.images) {
        const uploadPromises = req.files.images.map((file) => uploadFile(req, file, 'products'));
        const newImageUrls = await Promise.all(uploadPromises);
        updatedImages = [...updatedImages, ...newImageUrls];
      }
      updateData.images = updatedImages;

      // Handle video
      let updatedVideo = product.video;
      if (req.body.existingVideo === 'null' || req.body.existingVideo === null) {
        if (product.video) {
          await deleteFile(product.video);
        }
        updatedVideo = null;
      }
      delete updateData.existingVideo;

      if (req.files?.video && req.files.video.length > 0) {
        if (product.video) {
          await deleteFile(product.video);
        }
        updatedVideo = await uploadFile(req, req.files.video[0], 'videos');
      }
      updateData.video = updatedVideo;

      // Handle 3D model file (.glb, .gltf, .fbx, .obj, .stl, .zip)
      if (req.files?.modelFile && req.files.modelFile.length > 0) {
        if (product.glbUrl) {
          await deleteFile(product.glbUrl);
        }
        const newModelUrl = await uploadFile(req, req.files.modelFile[0], 'models');
        updateData.glbUrl = newModelUrl;
        updateData.modelUrl = newModelUrl;
      }

      await docRef.update(updateData);
      const updatedDoc = await docRef.get();
      res.status(200).json({ _id: updatedDoc.id, ...updatedDoc.data() });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

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

    if (product.images && product.images.length > 0) {
      for (const imgUrl of product.images) {
        await deleteFile(imgUrl);
      }
    }
    if (product.video) {
      await deleteFile(product.video);
    }
    if (product.glbUrl) {
      await deleteFile(product.glbUrl);
    }

    await docRef.delete();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Submit customer product review
router.post('/:id/reviews', async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    if (!name || !rating || !comment) {
      return res.status(400).json({ error: 'Name, rating, and comment are required.' });
    }

    if (!db) {
      return res.status(500).json({ error: 'Database service is currently unavailable.' });
    }

    const docRef = db.collection('products').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: 'Product not found' });

    const product = doc.data();
    const existingReviews = product.reviewsList || [];
    const currentCount = Number(product.reviews || existingReviews.length || 0);
    const currentRating = Number(product.rating || 5.0);

    const newRatingNum = Number(rating);
    const newCount = currentCount + 1;
    const newAvgRating = Number(((currentRating * currentCount + newRatingNum) / newCount).toFixed(1));

    const newReview = {
      id: Date.now().toString(),
      name: name.trim(),
      rating: newRatingNum,
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedReviews = [newReview, ...existingReviews];

    await docRef.set(
      {
        rating: newAvgRating,
        reviews: newCount,
        reviewsList: updatedReviews
      },
      { merge: true }
    );

    res.status(201).json({
      message: 'Review submitted successfully',
      rating: newAvgRating,
      reviewsCount: newCount,
      review: newReview
    });
  } catch (err) {
    console.error('Error submitting product review:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
