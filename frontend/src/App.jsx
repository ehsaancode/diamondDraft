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
import MobileFavorites from './pages/MobileFavorites';
import MobileCart from './pages/MobileCart';
import MobileProfile from './pages/MobileProfile';
import MobileBottomNav from './components/mobile/MobileBottomNav';

import About from './pages/About';
import Contact from './pages/Contact';

const AppContent = () => {
  const isMobile = useMobile();
  const location = useLocation();
  const isProductPage = location.pathname.startsWith('/product/');
  const isCartPage = location.pathname === '/cart';

  return (
    <div className="antialiased text-gray-900 min-h-screen bg-[#fafafa] flex flex-col">
      {!isMobile && <Navbar />}
      {!isMobile && <CartDrawer />}
      <div className="flex-1 w-full relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/search" element={<MobileSearch />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          {/* Mobile Routes */}
          <Route path="/cart" element={<MobileCart />} />
          <Route path="/favorites" element={<MobileFavorites />} />
          <Route path="/profile" element={<MobileProfile />} />
        </Routes>
      </div>
      {isMobile && !isProductPage && !isCartPage && <MobileBottomNav />}
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
