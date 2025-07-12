import React, { useState, useEffect, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';
import throttle from 'lodash.throttle';

// Lazy-loaded components
const ParticleBackground = React.lazy(() => import('../components/ParticleBackground'));
const FloatingElements = React.lazy(() => import('../components/FloatingElements'));
const CursorTrail = React.lazy(() => import('../components/CursorTrail'));
const ChatWidget = React.lazy(() => import('../components/ChatWidget'));

const Layout: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = throttle(() => {
      setIsScrolled(window.scrollY > 10);
    }, 100);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      {/* Theme Toggle
      <div className="fixed top-4 right-4 z-40">
        <ThemeToggle />
      </div> */}

      {/* Background Effects — now always shown */}
      <Suspense fallback={null}>
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <ParticleBackground 
            particleCount={30}
            colors={['#3B82F6', '#8B5CF6', '#06B6D4', '#10B981']}
            speed={0.3}
            interactive={true}
          />
          <FloatingElements />
          <CursorTrail />
        </div>
      </Suspense>

      <Navbar isScrolled={isScrolled} />

      <main className="flex-grow relative z-10">
        <Outlet />
      </main>

      <Footer />

      {/* Chat AI Widget */}
      <Suspense fallback={null}>
        <ChatWidget mode="ai" position="bottom-right" />
      </Suspense>
    </div>
  );
};

export default Layout;
