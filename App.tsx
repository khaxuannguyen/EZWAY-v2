import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingContact } from './components/FloatingContact';
import { Home } from './pages/Home';
import { BuyingService } from './pages/BuyingService';
import { Services } from './pages/Services';
import { Pricing } from './pages/Pricing';
import { Contact } from './pages/Contact';
import { Tracking } from './pages/Tracking';
import { News } from './pages/News';
import { NewsDetail } from './pages/NewsDetail';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-surface font-sans text-brand-navy">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mua-ho-hang-my" element={<BuyingService />} />
            <Route path="/dich-vu" element={<Services />} />
            <Route path="/gia-cuoc" element={<Pricing />} />
            <Route path="/lien-he" element={<Contact />} />
            <Route path="/tra-cuu" element={<Tracking />} />
            <Route path="/tin-tuc" element={<News />} />
            <Route path="/tin-tuc/:slug" element={<NewsDetail />} />
          </Routes>
        </main>
        <Footer />
        <FloatingContact />
      </div>
    </HashRouter>
  );
};

export default App;