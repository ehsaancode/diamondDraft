import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PlusCircle, Package } from 'lucide-react';

export const Products = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-3xl font-bold font-grotesk tracking-tight">Products</h2>
        <p className="text-zinc-400 mt-1">Manage your inventory and listings.</p>
      </div>
      <Link to="/add-product" className="btn-primary flex items-center gap-2">
        <PlusCircle size={18} /> Add New
      </Link>
    </div>
    <div className="glass-panel p-8 flex flex-col items-center justify-center min-h-[400px] text-center border-dashed border-2">
      <div className="w-16 h-16 bg-surfaceHover rounded-2xl flex items-center justify-center border border-border mb-4 text-zinc-500">
        <Package size={32} />
      </div>
      <h3 className="text-xl font-semibold mb-2">No products loaded</h3>
      <p className="text-zinc-400 text-sm max-w-sm mb-6">You haven't added any products yet. Fetching from database is pending.</p>
      <Link to="/add-product" className="btn-secondary">Create Product</Link>
    </div>
  </motion.div>
);
