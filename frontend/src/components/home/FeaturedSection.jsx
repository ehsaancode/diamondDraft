/* eslint-disable */
import React from 'react';
import { ArrowRight, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FeaturedSection = () => {
  return (
    <section className="bg-[#fafafa]">
      <div className="flex flex-col lg:flex-row min-h-[600px] max-w-[1600px] mx-auto">
        
        {/* Left Content Box */}
        <motion.div 
          className="w-full lg:w-2/5 p-12 md:p-20 flex flex-col justify-center"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl text-gray-900 font-serif mb-6">Necklace</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-12 max-w-sm">
            Explore our new arrival jewelry collection: elegant necklaces, classic hoops, vibrant gemstone rings, pearl drop earrings, and chic charm bracelets. Perfect for everyday elegance!
          </p>

          <Link to="/shop" className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-16 hover:gap-4 transition-all w-max hover:text-gray-600">
            Shop All <ArrowRight size={16} />
          </Link>

          {/* Featured Product Card */}
          <div className="bg-white p-6 rounded-sm shadow-sm max-w-[280px] group cursor-pointer hover:shadow-md transition-shadow relative">
            <button className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-gray-50 transition-colors z-10">
              <Heart size={16} className="text-gray-400" />
            </button>
            <div className="h-[180px] mb-6 flex items-center justify-center overflow-hidden">
              <img 
                src="/images/ring_1_1772534075731.png" 
                alt="Twilight Serenity Ring" 
                className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">Twilight Serenity Ring</h3>
            <p className="text-xs text-gray-500 italic mb-2">by Lumière Jewelry</p>
            <p className="text-sm font-bold">$299.99</p>
          </div>
        </motion.div>

        {/* Right Large Image Box */}
        <motion.div 
          className="w-full lg:w-3/5 h-[500px] lg:h-auto overflow-hidden relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <img 
            src="/images/necklace_model_1772534092648.png" 
            alt="Model wearing necklace" 
            className="w-full h-full object-cover object-center"
          />
        </motion.div>

      </div>
    </section>
  );
};

export default FeaturedSection;
