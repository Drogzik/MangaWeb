import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileNav from './components/layout/MobileNav';
import SearchOverlay from './components/search/SearchOverlay';
import AuthModal from './components/auth/AuthModal';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import MangaPage from './pages/MangaPage';

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <Header onOpenSearch={() => setIsSearchOpen(true)} />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/manga/:id" element={<MangaPage />} />
      </Routes>

      <Footer />
      <MobileNav onOpenSearch={() => setIsSearchOpen(true)} />
      
      <SearchOverlay open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AuthModal />
    </>
  );
}

export default App;
