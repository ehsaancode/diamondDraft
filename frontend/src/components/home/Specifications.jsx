import React, { useState } from 'react';
import AccordionItem from '../ui/AccordionItem';

const Specifications = ({ product }) => {
  const [openIndex, setOpenIndex] = useState(1); // 1 is default open based on mock

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-serif text-black mb-12">Specifications</h2>

      <div className="w-full">
        <AccordionItem 
          number="01" 
          title="CAD Deliverables" 
          isOpen={openIndex === 0} 
          onClick={() => toggleAccordion(0)}
        >
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Upon completion, you will receive production-ready 3D models in your requested formats (STL, 3DM, OBJ). Files are optimized for 3D printing and casting.
          </p>
        </AccordionItem>

        <AccordionItem 
          number="02" 
          title="Design Parameters" 
          isOpen={openIndex === 1} 
          onClick={() => toggleAccordion(1)}
        >
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 text-sm">
              <div className="grid grid-cols-[120px_1fr] gap-y-4 gap-x-4">
                <div className="font-semibold text-gray-800">Target Metal:</div>
                <div className="text-gray-600">{product?.metalType || 'Configurable (e.g., 18k Gold, Platinum)'}</div>

                <div className="font-semibold text-gray-800">Stone Map:</div>
                <div className="text-gray-600">{product?.gemstones || 'Included in design files'}</div>

                <div className="font-semibold text-gray-800">Ring Size:</div>
                <div className="text-gray-600">Customizable <span className="text-gray-400 italic">(Default US 7)</span></div>

                <div className="font-semibold text-gray-800">Geometry:</div>
                <div className="text-gray-600 leading-relaxed">Watertight mesh, zero non-manifold edges</div>

                <div className="font-semibold text-gray-800">Shrinkage:</div>
                <div className="text-gray-600">Calculated for standard lost-wax casting</div>
              </div>
            </div>
            
            <div className="w-48 flex-shrink-0 flex items-center justify-center">
              <img src="/images/ring_1_1772534075731.png" alt="CAD details" className="w-full object-contain grayscale" />
            </div>
          </div>
        </AccordionItem>

        <AccordionItem 
          number="03" 
          title="Revisions" 
          isOpen={openIndex === 2} 
          onClick={() => toggleAccordion(2)}
        >
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Standard requests include 3 rounds of minor revisions to ensure the final design meets your exact production requirements.
          </p>
        </AccordionItem>

        <AccordionItem 
          number="04" 
          title="Photo-Realistic Renders" 
          isOpen={openIndex === 3} 
          onClick={() => toggleAccordion(3)}
        >
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Includes 3 high-resolution rendered images from different angles to present to your clients before final production.
          </p>
        </AccordionItem>
        
        <AccordionItem 
          number="05" 
          title="Support" 
          isOpen={openIndex === 4} 
          onClick={() => toggleAccordion(4)}
        >
          <p className="text-sm text-gray-600 leading-relaxed mb-4">Dedicated technical support for issues relating to slicing and 3D printing the provide models.</p>
        </AccordionItem>
      </div>
    </div>
  );
};

export default Specifications;
