import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ShoppingBag, ArrowRight, User, Mail, Phone, MapPin, FileText } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function CheckoutModal({ isOpen, onClose }) {
  const { cartItems, cartTotal, setCartItems } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError('Please provide your name and email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const payload = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: formData.address,
        notes: formData.notes,
        items: cartItems,
        totalAmount: cartTotal
      };

      const res = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit order');

      setCompletedOrder(data.order);
      // Clear cart
      if (setCartItems) setCartItems([]);
      localStorage.removeItem('cart');
    } catch (err) {
      console.error('Submit order error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCompletedOrder(null);
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[1000]"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-lg bg-white z-[1001] shadow-2xl rounded-3xl p-6 md:p-8 space-y-6 text-gray-900 border border-gray-100 max-h-[90vh] overflow-y-auto"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gray-900" />
                <h3 className="text-lg font-serif font-bold text-gray-900">
                  {completedOrder ? 'Order Confirmed!' : 'Complete CAD Request'}
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-500 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            {completedOrder ? (
              /* Success Confirmation View */
              <div className="text-center py-6 space-y-5">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-100 shadow-sm">
                  <CheckCircle2 size={36} />
                </div>

                <div>
                  <h4 className="text-xl font-extrabold text-gray-900">Request Received</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Your CAD request <span className="font-mono font-bold text-black">{completedOrder.orderId}</span> has been logged.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs text-left space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Order Reference:</span>
                    <span className="font-mono font-bold text-gray-900">{completedOrder.orderId}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Customer Email:</span>
                    <span className="font-semibold text-gray-900">{completedOrder.customerEmail}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Total Estimate:</span>
                    <span className="font-bold text-black">₹{Number(completedOrder.totalAmount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Status:</span>
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {completedOrder.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 font-sans">
                  Our CAD engineers will review your files and contact you shortly.
                </p>

                <button
                  onClick={handleClose}
                  className="w-full py-3.5 bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-800 transition-colors shadow-md"
                >
                  Done
                </button>
              </div>
            ) : (
              /* Checkout Form View */
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                    {error}
                  </div>
                )}

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <User size={14} className="text-gray-400" /> Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Master Jeweler Rahul"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 font-medium focus:outline-none focus:border-black focus:bg-white transition-colors"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail size={14} className="text-gray-400" /> Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="jeweler@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 font-medium focus:outline-none focus:border-black focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Phone size={14} className="text-gray-400" /> Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 font-medium focus:outline-none focus:border-black focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Delivery / Shipping Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin size={14} className="text-gray-400" /> Workshop / Shipping Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Studio / Workshop location or city"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 font-medium focus:outline-none focus:border-black focus:bg-white transition-colors"
                  />
                </div>

                {/* Special Notes */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText size={14} className="text-gray-400" /> CAD Customization Notes
                  </label>
                  <textarea
                    name="notes"
                    rows={2}
                    placeholder="Ring sizes, weight requirements, or diamond stone tolerances..."
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 font-medium focus:outline-none focus:border-black focus:bg-white transition-colors"
                  />
                </div>

                {/* Summary Box */}
                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 flex justify-between items-center text-xs">
                  <span className="text-gray-500 font-medium">Total CAD Request Value</span>
                  <span className="text-base font-black text-gray-900">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-black text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-800 transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{loading ? 'Submitting CAD Request...' : 'Confirm & Submit Request'}</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
