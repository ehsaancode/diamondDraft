import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/firebase.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Fallback in-memory user store if Firestore is unavailable
let localUsers = [];

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

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nowIso = new Date().toISOString();
    let userId = null;
    let userName = name.trim();

    if (db) {
      // Check if user already exists in Firestore
      const userSnapshot = await db
        .collection('users')
        .where('email', '==', emailLower)
        .limit(1)
        .get();

      if (!userSnapshot.empty) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }

      const newUser = {
        name: userName,
        email: emailLower,
        password: hashedPassword,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      const docRef = await db.collection('users').add(newUser);
      userId = docRef.id;
    } else {
      // Check local users store
      const existing = localUsers.find((u) => u.email === emailLower);
      if (existing) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }

      userId = `USR-${Date.now()}`;
      const newUser = {
        id: userId,
        name: userName,
        email: emailLower,
        password: hashedPassword,
        createdAt: nowIso,
      };
      localUsers.push(newUser);
    }

    // Generate JWT token
    const token = generateToken(userId, emailLower, userName);

    res.status(201).json({
      id: userId,
      name: userName,
      email: emailLower,
      token,
    });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: err.message || 'Registration failed' });
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
    let userDocData = null;
    let userId = null;

    if (db) {
      const userSnapshot = await db
        .collection('users')
        .where('email', '==', emailLower)
        .limit(1)
        .get();

      if (userSnapshot.empty) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const doc = userSnapshot.docs[0];
      userDocData = doc.data();
      userId = doc.id;
    } else {
      const found = localUsers.find((u) => u.email === emailLower);
      if (!found) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      userDocData = found;
      userId = found.id;
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, userDocData.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(userId, emailLower, userDocData.name);

    res.status(200).json({
      id: userId,
      name: userDocData.name,
      email: emailLower,
      token,
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// @desc    Get user profile details
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    if (db) {
      const userDoc = await db.collection('users').doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        return res.status(200).json({
          id: userDoc.id,
          name: userData.name,
          email: userData.email,
          createdAt: userData.createdAt,
        });
      }
    }

    const foundLocal = localUsers.find((u) => u.id === userId || u.email === req.user.email);
    if (foundLocal) {
      return res.status(200).json({
        id: foundLocal.id,
        name: foundLocal.name,
        email: foundLocal.email,
        createdAt: foundLocal.createdAt,
      });
    }

    // Default payload if decoded from JWT token
    return res.status(200).json({
      id: req.user.id,
      name: req.user.name || 'Gwel Customer',
      email: req.user.email,
    });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch profile' });
  }
});

export default router;
