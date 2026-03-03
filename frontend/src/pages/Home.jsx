import React from 'react';
import Hero from '../components/home/Hero';
import BestSelling from '../components/home/BestSelling';
import FeaturedSection from '../components/home/FeaturedSection';
import Specifications from '../components/home/Specifications';

const Home = () => {
  return (
    <div className="w-full min-h-screen">
      <Hero />
      <BestSelling />
      <FeaturedSection />
      <Specifications />
    </div>
  );
};

export default Home;
