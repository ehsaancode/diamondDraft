/* eslint-disable */
import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="px-8 pb-16 pt-8 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-12">
      {/* Left side text */}
      <motion.div 
        className="w-full lg:w-1/3 flex flex-col items-start z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h1 className="text-5xl lg:text-7xl font-serif leading-tight text-black mb-8">
          Precision<br />
          Crafted<br />
          Jewelry<br />
          CAD Design
        </h1>
        <button className="bg-black text-white px-8 py-4 text-xs font-semibold tracking-wider uppercase hover:bg-gray-900 transition-colors">
          Browse CAD Models
        </button>
      </motion.div>

      {/* Right side images collage */}
      <div className="w-full lg:w-2/3 h-[500px] relative flex justify-end items-center gap-4">
        
        {/* Left small image */}
        <motion.div 
          className="w-[200px] h-[250px] overflow-hidden self-end mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <img src="/images/necklaces_1772534131738.png" alt="Necklace detail" className="w-full h-full object-cover" />
        </motion.div>

        {/* Center large image */}
        <motion.div 
          className="w-[300px] h-[400px] overflow-hidden z-20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <img src="/images/hero_hands_1772534059346.png" alt="Statement ring on hands" className="w-full h-full object-cover" />
        </motion.div>

        {/* Right small image */}
        <motion.div 
          className="w-[120px] h-[300px] overflow-hidden self-start mt-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <img src="/images/bracelets_1772534147312.png" alt="Bracelets detail" className="w-full h-full object-cover" />
        </motion.div>
        
      </div>
    </section>
  );
};

export default Hero;
