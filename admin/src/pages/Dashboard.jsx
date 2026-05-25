import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp, DollarSign, Users, Package, Edit, Trash2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { chartData } from '../constants/data';

export const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/api/products`);
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products on dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        await axios.delete(`${apiUrl}/api/products/${id}`);
        setProducts(products.filter(p => p._id !== id));
      } catch (err) {
        console.error('Failed to delete product', err);
        alert('Failed to delete product');
      }
    }
  };

  const stats = [
    { label: "Total Revenue", value: "₹4,25,000", change: "+12.5%", icon: <DollarSign size={24} />, positive: true },
    { label: "Total Sales", value: "1,245", change: "+8.2%", icon: <TrendingUp size={24} />, positive: true },
    { label: "New Customers", value: "320", change: "-2.4%", icon: <Users size={24} />, positive: false },
    { label: "Total Products", value: loading ? "..." : products.length, change: "+4.1%", icon: <Package size={24} />, positive: true },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold font-grotesk tracking-tight">Overview</h2>
        <p className="text-zinc-400 mt-1">Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div key={idx} whileHover={{ y: -5 }} className="glass-panel p-6 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl group-hover:bg-primary-500/20 transition-all duration-500"></div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-surfaceHover rounded-xl text-primary-400 border border-border">
                {stat.icon}
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${stat.positive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-zinc-400 text-sm font-medium mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-zinc-100">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Chart area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold font-grotesk">Revenue Analytics</h3>
            <select className="bg-surfaceHover border border-border text-zinc-300 text-sm rounded-lg px-3 py-1 outline-none">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121214', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Products */}
        <div className="glass-panel p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold font-grotesk">Recent Products</h3>
            <Link to="/products" className="text-sm text-primary-400 hover:text-primary-300">View All</Link>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-zinc-500 text-sm">Loading recent products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center">
                <p className="text-zinc-500 text-sm">No products found.</p>
              </div>
            ) : (
              products.slice(0, 4).map(product => (
                <div key={product._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-surfaceHover border border-transparent hover:border-border transition-all group relative">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500 border border-border overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0].startsWith('http') ? product.images[0] : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/${product.images[0].replace(/^\//, '')}`} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Package size={20} />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-100 line-clamp-1 max-w-[120px]">{product.name}</h4>
                      <p className="text-xs text-zinc-500">₹{product.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right sm:opacity-100 group-hover:opacity-0 transition-opacity duration-200">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${product.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        {product.status || 'Active'}
                      </span>
                    </div>
                    <div className="absolute right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-surfaceHover sm:relative sm:right-auto sm:bg-transparent">
                      <Link to={`/edit-product/${product._id}`} className="p-1.5 text-zinc-400 hover:text-primary-500 transition-colors">
                        <Edit size={14} />
                      </Link>
                      <button onClick={() => handleDelete(product._id)} className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
