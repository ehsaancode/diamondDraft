import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { admin, db } from '../config/firebase.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper to generate JWT token
const generateToken = (id, email, name) => {
  return jwt.sign(
    { id, email, name },
    process.env.JWT_SECRET || 'jwellsecretjwt',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please provide name, email and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const emailLower = email.toLowerCase().trim();

    // Check if Firebase is initialized correctly
    if (!db) {
      return res.status(500).json({ error: 'Database service is currently unavailable.' });
    }

    // Check if user already exists
    const userSnapshot = await db
      .collection('users')
      .where('email', '==', emailLower)
      .limit(1)
      .get();

    if (!userSnapshot.empty) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user to Firestore
    const newUser = {
      name: name.trim(),
      email: emailLower,
      password: hashedPassword,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('users').add(newUser);

    // Generate JWT token
    const token = generateToken(docRef.id, emailLower, newUser.name);

    res.status(201).json({
      id: docRef.id,
      name: newUser.name,
      email: emailLower,
      token,
    });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: err.message });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const emailLower = email.toLowerCase().trim();

    // Check if Firebase is initialized correctly
    if (!db) {
      return res.status(500).json({ error: 'Database service is currently unavailable.' });
    }

    // Fetch user from Firestore
    const userSnapshot = await db
      .collection('users')
      .where('email', '==', emailLower)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    // Verify password
    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(userDoc.id, emailLower, userData.name);

    res.status(200).json({
      id: userDoc.id,
      name: userData.name,
      email: emailLower,
      token,
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: err.message });
  }
});

// @desc    Get user profile details
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database service is currently unavailable.' });
    }

    const userDoc = await db.collection('users').doc(req.user.id).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const userData = userDoc.data();

    res.status(200).json({
      id: userDoc.id,
      name: userData.name,
      email: userData.email,
      createdAt: userData.createdAt,
    });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
