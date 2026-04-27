import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';

// Pages
import { Dashboard } from './pages/Dashboard';
import { AddProduct } from './pages/AddProduct';
import { EditProduct } from './pages/EditProduct';
import { Products } from './pages/Products';
import { SettingsPage } from './pages/SettingsPage';

const AppView = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      {/* Background Ornaments */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-600/10 blur-[120px] pointer-events-none -z-10 mix-blend-screen mix-blend-color-dodge"></div>
      <div className="fixed bottom-[-10%] right-[-5%] w-[30%] h-[50%] rounded-full bg-accent/10 blur-[100px] pointer-events-none -z-10"></div>
      
      <div className="flex min-h-screen w-full relative">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col min-w-0 lg:ml-64 transition-all duration-300">
          <Header setIsOpen={setSidebarOpen} />
          <main className="flex-1 p-4 md:p-6 lg:p-10 relative z-0">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/edit-product/:id" element={<EditProduct />} />
              <Route path="/products" element={<Products />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default AppView;
