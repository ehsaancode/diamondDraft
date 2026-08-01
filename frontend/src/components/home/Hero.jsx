import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Box, Sparkles, ArrowRight, Layers, ShieldCheck } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden bg-slate-950 text-slate-100 py-16">
      {/* Ambient Radial Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Geometric Background Mesh Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Centered Top-Level Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* CGTrader Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400">
          <Sparkles className="w-4 h-4" />
          <span>Production-Ready 3D Models & CGTrader Marketplace</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
          Precision 3D Models & <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
            CAD Asset Vault
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed">
          Discover high-poly & low-poly 3D models with interactive WebGL inspection, PBR channel controls, and temporal signed file downloads.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <Link
            to="/shop"
            className="px-8 py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-xl shadow-cyan-500/20 flex items-center gap-2"
          >
            <Box className="w-4 h-4" />
            <span>Browse 3D Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/escrow"
            className="px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-all flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Custom Freelance Projects</span>
          </Link>
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-800/80 w-full max-w-2xl text-xs text-slate-400">
          <div className="flex flex-col items-center gap-1">
            <span className="font-extrabold text-white text-sm">3D WebGL Viewer</span>
            <span>Interactive R3F Shader Inspection</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-extrabold text-white text-sm">All 3D Formats</span>
            <span>.blend, .fbx, .obj, .stl, .gltf</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-extrabold text-white text-sm">Temporal Signed URLs</span>
            <span>Secure Direct S3 Link Delivery</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
