import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useContent } from './ContentContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import NotFound from './pages/NotFound.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  const { content, error, loading, reload } = useContent();

  if (loading && !content) {
    return (
      <div className="status-screen" role="status">
        <span className="spinner" aria-hidden="true" />
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-screen">
        <p>We couldn’t load the site right now.</p>
        <button className="btn btn-primary" onClick={reload}>Try again</button>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
