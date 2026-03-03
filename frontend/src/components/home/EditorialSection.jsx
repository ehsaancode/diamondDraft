import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { products } from '../../data/products';
import { ArrowUpRight } from 'lucide-react';

const EditorialSection = () => {
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start end", "end start"]
  });

  const textY = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const heroModel = "/beautiful_model_gold_necklace_1772562801429.png";
  const featureProduct = products[6] || products[0];

  return (
    <section ref={scrollRef} className="w-full bg-[#E5E5E5] py-20 px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-gray-300">
          
          {/* Left - Parallax Brand Hero */}
          <div className="bg-[#E5E5E5] relative min-h-[600px] flex flex-col justify-between p-12 overflow-hidden">
            <motion.h2 
              style={{ y: textY }}
              className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-bold text-black opacity-100 leading-none select-none pointer-events-none whitespace-nowrap z-0"
            >
              Gwel
            </motion.h2>
            
            <div className="relative z-10 flex-1 flex items-start justify-center h-[450px] overflow-hidden pt-12">
              <motion.img 
                style={{ y: imageY }}
                src={heroModel}
                alt="Brand Ambassador"
                className="w-full max-w-2xl h-auto object-contain mix-blend-multiply"
              />
            </div>

            <div className="relative z-20 flex justify-between items-end gap-8 pt-8 border-t border-gray-300">
              <span className="text-xl font-serif text-black italic">[ Since 2017 ]</span>
              <p className="max-w-[260px] text-[10px] leading-relaxed text-gray-600 text-right font-medium">
                Each design reflects the dialogue between craftsmanship and feeling, exploring what it means to express oneself with elegance.
              </p>
            </div>
          </div>

          {/* Right - Featured Product Card */}
          <div className="bg-[#E5E5E5] p-12 md:p-16 flex flex-col justify-center min-h-[600px] relative">
            <div className="max-w-sm ml-auto">
              <h2 className="text-4xl font-bold mb-2 text-black leading-tight">
                {featureProduct.name.split(' ').slice(0, 3).join(' ')} ring
              </h2>
              <p className="text-sm text-gray-500 mb-12 uppercase tracking-widest font-semibold">18K yellow gold</p>
              
              <div className="w-full aspect-square flex items-center justify-center mb-12">
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  src={featureProduct.image} 
                  alt={featureProduct.name} 
                  className="max-h-[300px] w-auto object-contain mix-blend-multiply drop-shadow-xl" 
                />
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-400 mb-1 uppercase tracking-tighter">From</p>
                  <p className="text-3xl font-bold text-black">${featureProduct.price.toLocaleString()}</p>
                </div>
                <button className="bg-black text-white p-6 hover:bg-gray-800 transition-colors cursor-pointer group">
                  <ArrowUpRight size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EditorialSection;
