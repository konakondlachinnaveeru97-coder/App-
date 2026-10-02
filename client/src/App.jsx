import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Assistant from './components/Assistant.jsx';
import Home from './pages/Home.jsx';
import Cart from './pages/Cart.jsx';
import Tracking from './pages/Tracking.jsx';
import NotFound from './pages/NotFound.jsx';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/track" element={<Tracking />} />
        <Route path="/track/:orderId" element={<Tracking />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Assistant />
      <Footer />
    </div>
  );
}
