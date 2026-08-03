import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ArrowRight, Layers, ShieldCheck, Box, CheckCircle2 } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop`, { state: { focusSearch: true, query: searchTerm } });
    }
  };

  return (
    <section className="relative w-full bg-[#fafafa] border-b border-gray-200 py-16 md:py-24 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Subtle Category Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-700 shadow-xs">
            <Box className="w-3.5 h-3.5 text-gray-900" />
            <span>Production-Ready Fine Jewelry CAD & 3D Assets</span>
          </div>

          {/* Hero Title */}
          <h1 className="hidden md:block text-4xl sm:text-5xl md:text-6xl font-serif font-extrabold text-gray-900 tracking-tight leading-tight">
            High-Precision CAD Models <br className="hidden sm:block" />
            & Jewelry 3D Asset Vault
          </h1>

          {/* Subtitle */}
          <p className="hidden md:block text-gray-600 text-base md:text-lg leading-relaxed font-sans max-w-2xl">
            Browse production-ready 3D printing STL files, Rhinoceros 3DM designs, and WebGL inspectable models for master jewelers and manufacturers.
          </p>

          {/* Practical Search Input */}
          <form onSubmit={handleSearchSubmit} className="w-full max-w-xl relative">
            <input
              type="text"
              placeholder="Search by ring size, metal, CAD format (.stl, .3dm)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-4 pl-5 pr-32 bg-white border border-gray-300 rounded-2xl shadow-sm text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </form>

          {/* Practical Category Shortcuts */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {['All Categories', 'Rings', 'Necklaces', 'Earrings', 'Bracelets', '3D Models'].map((cat) => (
              <button
                key={cat}
                onClick={() => navigate('/shop', { state: { category: cat } })}
                className="px-4 py-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 transition-all shadow-xs"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Explore Full Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/escrow"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-gray-900 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Custom CAD Project Board</span>
            </Link>
          </div>

          {/* Practical Highlights Row */}
          <div className="hidden sm:grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 border-t border-gray-200/80 w-full text-xs text-gray-600">
            <div className="flex items-center justify-center gap-2 bg-white p-3 rounded-xl border border-gray-100 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-gray-800">100% Watertight Mesh Files</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white p-3 rounded-xl border border-gray-100 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-gray-800">Included STL, 3DM, OBJ Formats</span>
            </div>
            <div className="flex items-center justify-center gap-2 bg-white p-3 rounded-xl border border-gray-100 shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold text-gray-800">Instant Download Delivery</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
