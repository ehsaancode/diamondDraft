import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const About = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="bg-[#fafafa] flex flex-col items-center overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="/images/about_hero.png" 
            alt="About Gwel" 
            className="w-full h-full object-cover grayscale-[20%] brightness-90"
          />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>

        <div className="relative z-10 text-center text-white px-8">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="uppercase tracking-[0.3em] text-[10px] md:text-xs mb-4 font-semibold"
          >
            Since 2017
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-6xl md:text-8xl font-serif mb-6 leading-tight"
          >
            Digital Craftsmanship.
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce"
          >
            <ArrowDown className="text-white/60" size={24} />
          </motion.div>
        </div>
      </section>

      {/* Our Philosophy Section */}
      <section className="py-24 px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-6 font-bold">Our Philosophy</h2>
            <h3 className="text-4xl md:text-5xl font-serif text-black mb-8 leading-[1.2]">
              Architecting beauty in three dimensions.
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Gwel was born from a desire to redefine jewelry design through modern technology. We believe that exceptional jewelry begins with a flawless foundation—a precision-engineered 3D CAD model that captures every intricate detail before a single drop of metal is cast.
            </p>
            <p className="text-gray-500 leading-relaxed text-sm">
              We empower jewelers, brands, and individuals by providing production-ready digital designs. Combining traditional aesthetic sensibilities with cutting-edge software, we create architectural masterpieces for the hand that are optimized for perfect manufacturing.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden bg-gray-100 ring-1 ring-black/5 shadow-2xl">
              <img 
                src="/images/storefront.png" 
                alt="The Gwel Atelier" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-black text-white p-8 hidden md:block">
              <p className="font-serif italic text-xl">"Details make perfection, and perfection is not a detail."</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="w-full bg-[#E5E5E5] py-24 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif text-black mb-6"
            >
              The Art of Digital Jewelry
            </motion.h2>
            <div className="w-20 h-px bg-black mb-6" />
            <p className="max-w-2xl text-gray-600 leading-relaxed">
              Our digital artisans bring decades of bench-jewelry experience into the digital realm. We don't just know how to use CAD software; we know how jewelry is actually made. This ensures every model is not just beautiful on screen, but robust and perfectly calibrated for casting and stone setting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="group"
            >
              <div className="aspect-square mb-6 overflow-hidden">
                <img src="/images/craftsmanship.png" alt="Detail" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <h4 className="text-lg font-serif mb-3">Flawless Meshes</h4>
              <p className="text-xs text-gray-500 uppercase tracking-widest leading-loose">
                Watertight, production-ready STL and 3DM files optimized for 3D resin printing.
              </p>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.4 }}
               className="group"
            >
              <div className="aspect-square mb-6 overflow-hidden">
                <img src="/images/hero_hands_1772534059346.png" alt="Materials" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <h4 className="text-lg font-serif mb-3">Calculated Tolerances</h4>
              <p className="text-xs text-gray-500 uppercase tracking-widest leading-loose">
                Exact metal shrinkage rates and precise stone seat depths factored into every design.
              </p>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.6 }}
               className="group"
            >
              <div className="aspect-square mb-6 overflow-hidden">
                <img src="/images/necklaces_1772534131738.png" alt="Finish" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <h4 className="text-lg font-serif mb-3">Rapid Iteration</h4>
              <p className="text-xs text-gray-500 uppercase tracking-widest leading-loose">
                Seamless collaboration and quick revisions to perfect the design before manufacturing begins.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-8 max-w-5xl mx-auto w-full text-center">
        <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-12 font-bold">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h5 className="font-serif text-xl mb-3 italic">Quality</h5>
            <p className="text-xs text-gray-500 tracking-wider">Uncompromising standards in every detail.</p>
          </div>
          <div>
            <h5 className="font-serif text-xl mb-3 italic">Integrity</h5>
            <p className="text-xs text-gray-500 tracking-wider">Transparent sourcing and fair practices.</p>
          </div>
          <div>
            <h5 className="font-serif text-xl mb-3 italic">Innovation</h5>
            <p className="text-xs text-gray-500 tracking-wider">Modernizing the art of jewelry making.</p>
          </div>
          <div>
            <h5 className="font-serif text-xl mb-3 italic">Legacy</h5>
            <p className="text-xs text-gray-500 tracking-wider">Creating tomorrow's heirlooms today.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white w-full py-24 px-8 flex flex-col items-center text-center">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-serif mb-12"
        >
          Render your reality.
        </motion.h2>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-12 py-4 border border-white hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-[0.2em] text-sm"
        >
          Browse CAD Models
        </motion.button>
      </section>

    </div>
  );
};

export default About;
