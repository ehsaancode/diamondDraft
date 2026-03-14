import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, PenTool, Gem } from 'lucide-react';

const FeaturesGrid = () => {
  const features = [
    {
      icon: <PenTool size={32} strokeWidth={1.5} />,
      title: "Precision Modeling",
      description: "Every CAD is architected with exact tolerances for shrinkage and perfect stone seating."
    },
    {
      icon: <Target size={32} strokeWidth={1.5} />,
      title: "Production Ready",
      description: "Flawless watertight meshes optimized specifically for DLP/SLA 3D resin printing."
    },
    {
      icon: <ShieldCheck size={32} strokeWidth={1.5} />,
      title: "Quality Assurance",
      description: "Each model passes a rigorous 14-point digital inspection before delivery."
    },
    {
      icon: <Gem size={32} strokeWidth={1.5} />,
      title: "Custom Alterations",
      description: "Easily request modifications to dimensions, stone shapes, or ring sizes on any design."
    }
  ];

  return (
    <section className="py-24 px-8 bg-white w-full border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-gray-50 flex items-center justify-center rounded-full mb-6 text-black">
                {feature.icon}
              </div>
              <h3 className="font-serif text-lg text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-[250px]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
