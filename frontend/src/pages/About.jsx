import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Box,
  CheckCircle2,
  Layers,
  Smartphone,
  ShieldCheck,
  Download,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';

const About = () => {
  return (
    <div className="bg-[#fafafa] min-h-screen text-gray-900 pb-32 font-sans">
      {/* Header Section */}
      <section className="py-16 md:py-20 px-4 max-w-7xl mx-auto border-b border-gray-200">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-700 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-gray-900" />
            <span>Fine Jewelry CAD & 3D Engineering Platform</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-gray-900 tracking-tight leading-tight">
            About Gwel Marketplace
          </h1>

          <p className="text-base text-gray-600 leading-relaxed font-sans">
            Gwel provides jewelers, CAD designers, and manufacturers with production-ready 3D models and CAD files optimized for lost-wax investment casting and DLP/SLA 3D printing.
          </p>
        </motion.div>
      </section>

      {/* Key Marketplace Metrics */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { metric: '10,000+', label: 'Production-Ready CADs', icon: Box },
            { metric: '100%', label: 'Watertight Mesh Tested', icon: CheckCircle2 },
            { metric: '15 Mins', label: 'Signed Download Expiration', icon: Download },
            { metric: 'Instant', label: 'WebAR Mobile Previews', icon: Smartphone }
          ].map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white border border-gray-200 p-5 rounded-sm shadow-xs flex flex-col justify-between"
              >
                <div className="w-9 h-9 rounded-sm bg-gray-100 flex items-center justify-center text-gray-900 mb-3">
                  <IconComponent size={18} />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900 font-mono tracking-tight">
                    {item.metric}
                  </h3>
                  <p className="text-xs font-medium text-gray-500 mt-1">{item.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Core Platform Capabilities */}
      <section className="py-12 px-4 max-w-7xl mx-auto border-t border-gray-200">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-extrabold text-gray-900">
            Engineered for Jewelry Manufacturing
          </h2>
          <p className="text-xs text-gray-500 font-mono mt-1">
            Built specifically to solve real workshop and 3D printing requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-gray-200 p-6 rounded-sm space-y-3 shadow-xs hover:border-gray-400 transition-all"
          >
            <div className="w-10 h-10 rounded-sm bg-gray-100 flex items-center justify-center text-gray-900">
              <Layers size={20} />
            </div>
            <h3 className="text-base font-bold text-gray-900">Interactive 3D WebGL Inspection</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              Inspect topology wireframes, polygon counts, vertex densities, and PBR material layers directly in your desktop or mobile browser.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border border-gray-200 p-6 rounded-sm space-y-3 shadow-xs hover:border-gray-400 transition-all"
          >
            <div className="w-10 h-10 rounded-sm bg-gray-100 flex items-center justify-center text-gray-900">
              <Smartphone size={20} />
            </div>
            <h3 className="text-base font-bold text-gray-900">Mobile WebAR Integration</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              Test ring, necklace, and earring scale in real physical environments using native iOS USDZ Quick Look and Android Scene Viewer.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white border border-gray-200 p-6 rounded-sm space-y-3 shadow-xs hover:border-gray-400 transition-all"
          >
            <div className="w-10 h-10 rounded-sm bg-gray-100 flex items-center justify-center text-gray-900">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-base font-bold text-gray-900">Exact Casting Tolerances</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              Every model includes calculated metal shrinkage rates, precise stone seat depths, and non-overlapping manifold geometry.
            </p>
          </motion.div>
        </div>
      </section>

      {/* File Formats Supported */}
      <section className="py-12 px-4 max-w-7xl mx-auto border-t border-gray-200">
        <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-sm shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-900">Supported File Formats</h3>
            <p className="text-xs text-gray-500 max-w-xl">
              Files are delivered in multi-format packages ready for Rhinoceros 3D, MatrixGold, Blender, and direct SLA 3D printing slicing software.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0 font-mono text-xs font-bold">
            {['.STL', '.3DM', '.OBJ', '.GLB', '.FBX'].map((fmt) => (
              <span key={fmt} className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-sm text-gray-900">
                {fmt}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="bg-black text-white p-8 md:p-12 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-serif font-bold">Ready to explore production-ready CADs?</h3>
            <p className="text-xs text-gray-400">Search thousands of fine jewelry models with instant file delivery.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="px-6 py-3 bg-white text-black font-bold text-xs rounded-sm hover:bg-gray-100 transition-colors uppercase tracking-wider flex items-center gap-2"
            >
              <span>Explore Gallery</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
