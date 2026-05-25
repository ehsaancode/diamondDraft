import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, X } from 'lucide-react';

export const Toast = ({ show, message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (show && duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`pointer-events-auto relative flex items-center gap-3 px-4 py-3.5 rounded-xl border backdrop-blur-md shadow-2xl min-w-[320px] max-w-md overflow-hidden ${
              type === 'success'
                ? 'bg-zinc-950/80 border-emerald-500/30 text-emerald-400 shadow-emerald-500/5'
                : 'bg-zinc-950/80 border-red-500/30 text-red-400 shadow-red-500/5'
            }`}
          >
            {/* Status Icon */}
            <div className="flex-shrink-0">
              {type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
            </div>

            {/* Message Text */}
            <div className="flex-1 text-sm font-medium text-zinc-100 pr-2">
              {message}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="flex-shrink-0 text-zinc-500 hover:text-zinc-300 transition-colors p-0.5 rounded-lg hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Progress bar timer */}
            {duration && (
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-0.5 rounded-b-xl ${
                  type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
