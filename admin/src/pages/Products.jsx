import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PlusCircle, Package, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
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

      {loading ? (
        <div className="glass-panel p-8 flex items-center justify-center min-h-[400px]">
          <p className="text-zinc-400">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="glass-panel p-8 flex flex-col items-center justify-center min-h-[400px] text-center border-dashed border-2">
          <div className="w-16 h-16 bg-surfaceHover rounded-2xl flex items-center justify-center border border-border mb-4 text-zinc-500">
            <Package size={32} />
          </div>
          <h3 className="text-xl font-semibold mb-2">No products loaded</h3>
          <p className="text-zinc-400 text-sm max-w-sm mb-6">You haven't added any products yet. Start by creating a new one!</p>
          <Link to="/add-product" className="btn-secondary">Create Product</Link>
        </div>
      ) : (
        <div className="glass-panel overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surfaceHover border-b border-border">
                <th className="p-4 text-sm font-semibold text-zinc-400">Product</th>
                <th className="p-4 text-sm font-semibold text-zinc-400">SKU</th>
                <th className="p-4 text-sm font-semibold text-zinc-400">Category</th>
                <th className="p-4 text-sm font-semibold text-zinc-400">Price</th>
                <th className="p-4 text-sm font-semibold text-zinc-400">Stock</th>
                <th className="p-4 text-sm font-semibold text-zinc-400">Status</th>
                <th className="p-4 text-sm font-semibold text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-border hover:bg-surfaceHover/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-surfaceHover overflow-hidden border border-border flex items-center justify-center">
                        {product.images && product.images.length > 0 ? (
                          <img src={`http://localhost:5000${product.images[0]}`} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package size={20} className="text-zinc-500" />
                        )}
                      </div>
                      <span className="font-semibold text-zinc-100">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-zinc-300">{product.sku}</td>
                  <td className="p-4 text-sm text-zinc-300">{product.category}</td>
                  <td className="p-4 text-sm text-zinc-300">₹{product.price}</td>
                  <td className="p-4 text-sm text-zinc-300">{product.quantity}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${product.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-zinc-400 hover:text-primary-500 transition-colors"><Edit size={16} /></button>
                      <button className="p-2 text-zinc-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};
