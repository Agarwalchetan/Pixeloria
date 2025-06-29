import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';
import ParticleBackground from '../components/ParticleBackground';
import FloatingElements from '../components/FloatingElements';
import CursorTrail from '../components/CursorTrail';
import ThemeToggle from '../components/ThemeToggle';
import { useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showEffects, setShowEffects] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Disable effects on certain pages for performance
  useEffect(() => {
    const heavyPages = ['/labs/animation-composer', '/labs/neural-network-viz'];
    setShowEffects(!heavyPages.some(page => location.pathname.startsWith(page)));
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      {/* Background Effects */}
      {showEffects && (
        <>
          <ParticleBackground 
            particleCount={30} 
            colors={['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981']}
            speed={0.3}
            interactive={true}
          />
          <FloatingElements />
          <CursorTrail />
        </>
      )}

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <Navbar isScrolled={isScrolled} />
      
      <main className="flex-grow relative z-10">
        <Outlet />
      </main>
      
      <Footer />
      <ChatWidget mode="ai" position="bottom-right" />
    </div>
  );
};

export default Layout;