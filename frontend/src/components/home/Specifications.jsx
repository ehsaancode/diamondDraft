import React, { useState } from 'react';
import AccordionItem from '../ui/AccordionItem';

const Specifications = () => {
  const [openIndex, setOpenIndex] = useState(1); // 1 is default open based on mock

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="px-8 py-16 max-w-7xl mx-auto w-full flex flex-col items-center">
      <h2 className="text-4xl font-serif text-black mb-16 text-center">Specifications</h2>

      <div className="w-full max-w-3xl">
        <AccordionItem 
          number="01" 
          title="Certifications" 
          isOpen={openIndex === 0} 
          onClick={() => toggleAccordion(0)}
        >
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Our jewelry items come with authentic certifications validating their quality and origin. Focus on conflict-free sourcing.
          </p>
        </AccordionItem>

        <AccordionItem 
          number="02" 
          title="Product Description" 
          isOpen={openIndex === 1} 
          onClick={() => toggleAccordion(1)}
        >
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 text-sm">
              <div className="grid grid-cols-[120px_1fr] gap-y-4 gap-x-4">
                <div className="font-semibold text-gray-800">Metal Type:</div>
                <div className="text-gray-600">18k Rose Gold</div>

                <div className="font-semibold text-gray-800">Gemstones</div>
                <div className="text-gray-600">Diamonds, 0.5 carats</div>

                <div className="font-semibold text-gray-800">Ring Size</div>
                <div className="text-gray-600">Adjustable <span className="text-gray-400 italic">(Available any sizes)</span></div>

                <div className="font-semibold text-gray-800">Design</div>
                <div className="text-gray-600 leading-relaxed">Intricate floral pattern with pave-set stones</div>

                <div className="font-semibold text-gray-800">Finish</div>
                <div className="text-gray-600">High-polish with textured details</div>
              </div>
            </div>
            
            {/* Small image on right in description */}
            <div className="w-48 flex-shrink-0 flex items-center justify-center">
              <img src="/images/ring_1_1772534075731.png" alt="Ring details" className="w-full object-contain" />
            </div>
          </div>
        </AccordionItem>

        <AccordionItem 
          number="03" 
          title="Features" 
          isOpen={openIndex === 2} 
          onClick={() => toggleAccordion(2)}
        >
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Hypoallergenic and crafted for every day comfort without compromising elegance.
          </p>
        </AccordionItem>

        <AccordionItem 
          number="04" 
          title="Accessories" 
          isOpen={openIndex === 3} 
          onClick={() => toggleAccordion(3)}
        >
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Comes with a luxurious velvet storage pouch and a cleaning cloth.
          </p>
        </AccordionItem>
        
        <AccordionItem 
          number="05" 
          title="Bowl" 
          isOpen={openIndex === 4} 
          onClick={() => toggleAccordion(4)}
        >
          <p className="text-sm text-gray-600 leading-relaxed mb-4">N/A</p>
        </AccordionItem>

        <AccordionItem 
          number="06" 
          title="Dimensions" 
          isOpen={openIndex === 5} 
          onClick={() => toggleAccordion(5)}
        >
          <p className="text-sm text-gray-600 leading-relaxed mb-4">Band width: 3mm, Setting height: 5mm.</p>
        </AccordionItem>
      </div>
    </section>
  );
};

export default Specifications;
