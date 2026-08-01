import React from 'react';
import Hero from '../components/home/Hero';
import Explore3DModels from '../components/home/Explore3DModels';
import FeaturesGrid from '../components/home/FeaturesGrid';
import BestSelling from '../components/home/BestSelling';
import FeaturedSection from '../components/home/FeaturedSection';
import YouMayAlsoLike from '../components/home/YouMayAlsoLike';
import EditorialSection from '../components/home/EditorialSection';
import { useMobile } from '../hooks/useMobile';
import MobileHome from './MobileHome';

const Home = () => {
  const isMobile = useMobile();

  if (isMobile) {
    return <MobileHome />;
  }

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100">
      <Hero />
      <Explore3DModels />
      <YouMayAlsoLike />
      <EditorialSection />
      <BestSelling />
      <FeaturedSection />
      <FeaturesGrid />
    </div>
  );
};

export default Home;
