import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  Settings, 
  LogOut,
  Image as ImageIcon,
  Video as VideoIcon,
  Tag
} from 'lucide-react';

// Shell Components
const Sidebar = () => (
  <div className="w-64 bg-admin-primary text-white h-screen fixed left-0 top-0 flex flex-col p-6 overflow-y-auto">
    <div className="mb-10">
      <h1 className="text-xl font-bold tracking-tighter">DiamondDraft <span className="text-blue-500">Admin</span></h1>
    </div>
    <nav className="flex flex-col gap-2 flex-1">
      <NavLink icon={<LayoutDashboard size={20} />} label="Dashboard" to="/" />
      <NavLink icon={<Package size={20} />} label="Products" to="/products" />
      <NavLink icon={<PlusCircle size={20} />} label="Add Product" to="/add-product" />
      <NavLink icon={<Settings size={20} />} label="Settings" to="/settings" />
    </nav>
    <div className="mt-auto pt-6 border-t border-gray-800">
      <button className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full px-4 py-3">
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  </div>
);

const NavLink = ({ icon, label, to }) => (
  <Link to={to} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-admin-secondary transition-colors text-gray-300 hover:text-white">
    {icon}
    <span className="font-medium">{label}</span>
  </Link>
);

// Placeholder Pages
const Dashboard = () => (
  <div>
    <h2 className="text-3xl font-bold mb-8">Dashboard Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard label="Total Products" value="124" />
      <StatCard label="Total Categories" value="12" />
      <StatCard label="Monthly Rev" value="₹12.5k" />
    </div>
  </div>
);

const StatCard = ({ label, value }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <p className="text-gray-500 text-sm font-medium mb-1 uppercase tracking-wider">{label}</p>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

const AddProduct = () => (
  <div className="max-w-4xl bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
    <h2 className="text-2xl font-bold mb-8">Create New Product Listing</h2>
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
          <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="Elegant Diamond Ring..." />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Pricing (₹)</label>
          <input type="number" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="25000" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
        <textarea rows="4" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" placeholder="Describe your product..."></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center hover:border-blue-300 transition-colors cursor-pointer group">
          <ImageIcon className="text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" size={32} />
          <p className="text-sm font-bold text-gray-500 group-hover:text-gray-700 transition-colors">Upload Images</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
        </div>
        <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center hover:border-blue-300 transition-colors cursor-pointer group">
          <VideoIcon className="text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" size={32} />
          <p className="text-sm font-bold text-gray-500 group-hover:text-gray-700 transition-colors">Upload 360° Video</p>
          <p className="text-xs text-gray-400 mt-1">MP4 up to 50MB</p>
        </div>
      </div>

      <button type="button" className="w-full py-4 bg-admin-primary text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-95 shadow-black/10">
        Publish Product
      </button>
    </form>
  </div>
);

const AppView = () => (
  <BrowserRouter>
    <div className="flex bg-[#f9fafb] min-h-screen w-full">
      <Sidebar />
      <main className="ml-64 p-10 flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/products" element={<div className="text-3xl font-bold">Manage Products (TBD)</div>} />
          <Route path="/settings" element={<div className="text-3xl font-bold">System Settings (TBD)</div>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  </BrowserRouter>
);

export default AppView;
