import express from 'express';
import { db } from '../config/firebase.js';

const router = express.Router();

// Fallback in-memory store if Firestore is unavailable
let localOrders = [];

// Helper to generate readable Order ID
const generateOrderId = () => {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `ORD-${randomNum}`;
};

// @desc    Create a new order / CAD design request
// @route   POST /api/orders
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      notes,
      items = [],
      totalAmount = 0
    } = req.body;

    if (!customerName || !customerEmail || items.length === 0) {
      return res.status(400).json({ error: 'Customer name, email, and at least one item are required.' });
    }

    const orderId = generateOrderId();
    const orderData = {
      orderId,
      customerName,
      customerEmail,
      customerPhone: customerPhone || 'N/A',
      shippingAddress: shippingAddress || 'N/A',
      notes: notes || '',
      items: items.map((item) => ({
        id: item.id || item._id || 'MD-3001',
        name: item.name || 'CAD Model',
        format: item.size || item.selectedFormat || 'STL',
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        image: item.image || null
      })),
      totalAmount: Number(totalAmount) || 0,
      status: 'Pending', // Pending, Processing, Completed, Cancelled
      createdAt: new Date().toISOString()
    };

    if (db) {
      const docRef = await db.collection('orders').add(orderData);
      orderData.id = docRef.id;
    } else {
      orderData.id = orderId;
      localOrders.unshift(orderData);
    }

    res.status(201).json({ message: 'Order submitted successfully', order: orderData });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: err.message });
  }
});

// @desc    Get all orders (Admin / Catalog overview)
// @route   GET /api/orders
// @access  Public (or Admin)
router.get('/', async (req, res) => {
  try {
    let ordersList = [];

    if (db) {
      const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
      snapshot.forEach((doc) => {
        ordersList.push({ id: doc.id, ...doc.data() });
      });
    } else {
      ordersList = [...localOrders];
    }

    res.status(200).json(ordersList);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: err.message });
  }
});

// @desc    Get orders by customer email
// @route   GET /api/orders/user/:email
// @access  Public
router.get('/user/:email', async (req, res) => {
  try {
    const emailLower = req.params.email.toLowerCase().trim();
    let userOrders = [];

    if (db) {
      const snapshot = await db
        .collection('orders')
        .where('customerEmail', '==', emailLower)
        .get();
      snapshot.forEach((doc) => {
        userOrders.push({ id: doc.id, ...doc.data() });
      });
      userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      userOrders = localOrders.filter(
        (o) => o.customerEmail && o.customerEmail.toLowerCase() === emailLower
      );
    }

    res.status(200).json(userOrders);
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ error: err.message });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (db) {
      const doc = await db.collection('orders').doc(id).get();
      if (!doc.exists) {
        return res.status(404).json({ error: 'Order not found' });
      }
      return res.status(200).json({ id: doc.id, ...doc.data() });
    } else {
      const found = localOrders.find((o) => o.id === id || o.orderId === id);
      if (!found) return res.status(404).json({ error: 'Order not found' });
      return res.status(200).json(found);
    }
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ error: err.message });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Public / Admin
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Completed', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid order status' });
    }

    if (db) {
      const docRef = db.collection('orders').doc(id);
      await docRef.set({ status, updatedAt: new Date().toISOString() }, { merge: true });
      const updated = await docRef.get();
      return res.status(200).json({ message: 'Order status updated', order: { id: updated.id, ...updated.data() } });
    } else {
      const order = localOrders.find((o) => o.id === id || o.orderId === id);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      order.status = status;
      order.updatedAt = new Date().toISOString();
      return res.status(200).json({ message: 'Order status updated', order });
    }
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
