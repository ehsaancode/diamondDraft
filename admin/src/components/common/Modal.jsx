import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

export const Modal = ({ show, title, message, type = 'success', onClose, actionLabel = 'Okay', onAction }) => {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className={`relative z-10 w-full max-w-md p-6 rounded-2xl border text-center shadow-2xl overflow-hidden ${
              type === 'success'
                ? 'bg-zinc-950/90 border-emerald-500/20 shadow-emerald-500/5'
                : 'bg-zinc-950/90 border-red-500/20 shadow-red-500/5'
            }`}
          >
            {/* Ambient background glow */}
            <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none ${
              type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
            }`}></div>

            {/* Centered Icon */}
            <div className="flex justify-center mb-4 relative z-10">
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.15, stiffness: 200 }}
                className={`p-3 rounded-full ${
                  type === 'success' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}
              >
                {type === 'success' ? (
                  <CheckCircle2 size={36} className="text-emerald-400" />
                ) : (
                  <XCircle size={36} className="text-red-400" />
                )}
              </motion.div>
            </div>

            {/* Title & Message */}
            <h3 className="text-xl font-bold font-grotesk text-zinc-100 mb-2 relative z-10">{title}</h3>
            <p className="text-sm text-zinc-400 mb-6 relative z-10 leading-relaxed">{message}</p>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center relative z-10">
              <button
                type="button"
                onClick={onAction || onClose}
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 w-full ${
                  type === 'success'
                    ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-neon'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {actionLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
