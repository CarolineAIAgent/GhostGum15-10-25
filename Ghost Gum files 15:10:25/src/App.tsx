// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './components/Cart';
import { CartProvider } from './context/CartContext';

/* Pages */
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Story from './pages/Story';
import Sustainability from './pages/Sustainability';
import Contact from './pages/Contact';

/* Vessels */
import Vessels from './pages/Vessels';
import VesselDetail from './pages/VesselDetail';

/* ---------- Scroll management ---------- */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  // Scroll to top on route change (when no hash)
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Smooth-scroll to in-page anchors (e.g., /#ingredients)
  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 84; // adjust for sticky header
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [hash]);

  return null;
}

function AppShell() {
  return (
    <div className="min-h-screen bg-[#F6F3EE] font-body text-[#1F1F1F]">
      <Header />
      <main>
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Commerce */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:handle" element={<ProductDetail />} />

          {/* Vessels */}
          <Route path="/vessels" element={<Vessels />} />
          <Route path="/vessels/:id" element={<VesselDetail />} />
          {/* Legacy product route (kept for compatibility) */}
          <Route path="/vessel/:handle" element={<ProductDetail />} />

          {/* Brand pages */}
          <Route path="/story" element={<Story />} />
          <Route path="/sustainability" element={<Sustainability />} />

          {/* Support */}
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
      <Cart />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollManager />
        <AppShell />
      </Router>
    </CartProvider>
  );
}
