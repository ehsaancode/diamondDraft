import React from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import BestSelling from '../components/home/BestSelling';
import FeaturedSection from '../components/home/FeaturedSection';
import Specifications from '../components/home/Specifications';

const Home = () => {
  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <Hero />
      <BestSelling />
      <FeaturedSection />
      <Specifications />
    </div>
  );
};

export default Home;
