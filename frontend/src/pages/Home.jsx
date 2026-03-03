import React from 'react';
import Hero from '../components/home/Hero';
import BestSelling from '../components/home/BestSelling';
import FeaturedSection from '../components/home/FeaturedSection';
import Specifications from '../components/home/Specifications';
import YouMayAlsoLike from '../components/home/YouMayAlsoLike';

const Home = () => {
  return (
    <div className="w-full min-h-screen">
      <Hero />
      <BestSelling />
      <FeaturedSection />
      <Specifications />
      <YouMayAlsoLike />
    </div>
  );
};

export default Home;
