import React from 'react';
import Hero from '../components/home/Hero';
import BestSelling from '../components/home/BestSelling';
import YouMayAlsoLike from '../components/home/YouMayAlsoLike';
import EditorialSection from '../components/home/EditorialSection';

const Home = () => {
  return (
    <div className="w-full min-h-screen">
      <Hero />
      <BestSelling />
      <EditorialSection />
      <YouMayAlsoLike />
    </div>
  );
};

export default Home;
