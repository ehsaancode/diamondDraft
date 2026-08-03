import React from 'react';
import Hero from '../components/home/Hero';
import Explore3DModels from '../components/home/Explore3DModels';
import YouMayAlsoLike from '../components/home/YouMayAlsoLike';
import EditorialSection from '../components/home/EditorialSection';
import BestSelling from '../components/home/BestSelling';

const MobileHome = () => {
  return (
    <div className="w-full min-h-screen bg-[#fafafa] text-gray-900 pb-32 overflow-x-hidden">
      <Hero />
      <Explore3DModels />
      <YouMayAlsoLike />
      <EditorialSection />
      <BestSelling />
    </div>
  );
};

export default MobileHome;
