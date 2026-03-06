import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import CartDrawer from './components/cart/CartDrawer';

function App() {
  return (
    <BrowserRouter>
      <div className="antialiased text-gray-900 min-h-screen bg-[#fafafa] flex flex-col">
        <Navbar />
        <CartDrawer />
        <div className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
