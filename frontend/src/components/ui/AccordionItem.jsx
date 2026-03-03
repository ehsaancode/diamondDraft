import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AccordionItem = ({ title, children, isOpen, onClick, number }) => {
  return (
    <div className="border-t border-gray-200 py-4">
      <button 
        className="w-full flex items-center justify-between text-left group cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center gap-12 flex-1">
          <span className="text-xs font-medium text-gray-500 w-6">{number}</span>
          <span className="text-lg font-serif text-gray-900 group-hover:text-black transition-colors">{title}</span>
        </div>
        <div className="bg-blue-950 text-white rounded-full p-1.5 transition-transform duration-300">
          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pl-18 pr-8 pb-4 pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccordionItem;
