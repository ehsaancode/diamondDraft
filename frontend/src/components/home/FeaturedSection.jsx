import React from 'react';
import { ArrowRight, Heart, Diamond } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FeaturedSection = () => {
  return (
    <section className="bg-black text-white py-20 overflow-hidden relative">
      <div className="flex flex-col lg:flex-row min-h-[600px] max-w-[1600px] mx-auto items-center">
        
        {/* Left Content Box */}
        <motion.div 
          className="w-full lg:w-1/2 p-12 md:p-24 flex flex-col justify-center relative z-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Diamond className="text-gray-400" size={20} />
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">Featured Innovation</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-serif mb-8 leading-tight">Masterpiece<br/>in the Matrix</h2>
          <p className="text-base text-gray-400 leading-relaxed mb-12 max-w-md">
            Dive into our premium selection of highly advanced parameteric designs. 
            Experience the flawless transition from digital wireframes to absolute reality 
            with our newest precision diamond setting CAD models. Perfect topologies, ready for print.
          </p>

          <Link to="/shop" className="flex items-center gap-4 text-sm font-semibold tracking-widest uppercase mb-16 hover:gap-6 transition-all w-max hover:text-gray-300 border-b border-white pb-2 hover:border-gray-500">
            Explore 3D Assets <ArrowRight size={18} />
          </Link>

          {/* Floating Featured Product Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="bg-[#111] border border-white/10 p-6 rounded-md shadow-2xl max-w-[320px] group cursor-pointer hover:border-white/30 transition-all relative backdrop-blur-md"
          >
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/10 transition-colors z-10 text-white cursor-pointer">
              <Heart size={18} className="text-gray-400" />
            </button>
            <div className="h-[200px] mb-6 flex items-center justify-center overflow-hidden bg-black/50 rounded-sm p-4">
              <img 
                src="/images/ring_1_1772534075731.png" 
                alt="Radiant Echo 3D Model" 
                className="max-h-full object-contain group-hover:scale-110 transition-transform duration-700 brightness-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              />
            </div>
            <h3 className="text-sm font-semibold text-white mb-1 tracking-wide">Radiant Echo Diamond Setting</h3>
            <p className="text-xs text-gray-500 italic mb-4">by Gwel Designs</p>
            <p className="text-sm font-bold text-white">₹16,500</p>
          </motion.div>
        </motion.div>

        {/* Right Large Image Box */}
        <motion.div 
          className="w-full lg:w-1/2 h-[500px] lg:h-[800px] relative lg:-ml-12"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {/* Subtle gradient overlays to merge seamlessly */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10 hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 block lg:hidden" />
          
          <img 
            src="/images/cad_jewelry_render_1773515996476.png" 
            alt="High-Tech CAD Render" 
            className="w-full h-full object-cover object-center shadow-[0_0_40px_rgba(0,0,0,0.8)]"
          />
        </motion.div>

      </div>
    </section>
  );
};

export default FeaturedSection;
