import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import CartDrawer from './components/cart/CartDrawer';
import { useMobile } from './hooks/useMobile';
import MobileSearch from './pages/MobileSearch';
import MobileBottomNav from './components/mobile/MobileBottomNav';

import About from './pages/About';
import Contact from './pages/Contact';

const AppContent = () => {
  const isMobile = useMobile();
  const location = useLocation();
  const isProductPage = location.pathname.startsWith('/product/');

  return (
    <div className="antialiased text-gray-900 min-h-screen bg-[#fafafa] flex flex-col">
      {!isMobile && <Navbar />}
      <CartDrawer />
      <div className="flex-1 w-full relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/search" element={<MobileSearch />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          {/* Mobile Placeholders */}
          <Route path="/cart" element={<div>Mobile Cart Coming Soon</div>} />
          <Route path="/favorites" element={<div>Mobile Favorites Coming Soon</div>} />
          <Route path="/profile" element={<div>Mobile Profile Coming Soon</div>} />
        </Routes>
      </div>
      {isMobile && !isProductPage && <MobileBottomNav />}
      {!isMobile && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
