/* eslint-disable */
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5; // Plays video at half speed
    }
  }, []);

  return (
    <section className="relative w-full h-[85vh] md:h-[90vh] flex items-center justify-center overflow-hidden bg-[#fafafa]">
      
      {/* Video Background Layer */}
      <div className="absolute inset-0 z-0">
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover mix-blend-multiply opacity-90"
        >
          <source src="/images/Video_Generation_Request_Fulfilled.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Gradual Blend from Bottom */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#fafafa] via-[#fafafa]/80 to-transparent z-10 pointer-events-none" />

      {/* Centered Top-Level Content */}
      <motion.div 
        className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl mx-auto -mt-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.1] text-black mb-6 md:mb-8 tracking-tight">
          Precision Crafted <br className="hidden md:block" /> Jewelry CAD Design
        </h1>
        <p className="text-gray-700 text-sm md:text-lg mb-8 md:mb-10 max-w-xl font-medium px-4">
          Discover exquisite 3D models ready for seamless printing and precision casting.
        </p>
        <button className="bg-black text-white px-8 md:px-10 py-4 text-xs md:text-sm font-semibold tracking-wider uppercase hover:bg-gray-800 transition-all shadow-2xl tracking-[0.2em]">
          Browse CAD Models
        </button>
      </motion.div>
    </section>
  );
};

export default Hero;
