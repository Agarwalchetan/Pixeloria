import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Labs from './pages/Labs';
import CostEstimator from './pages/CostEstimator';
import NotFound from './pages/NotFound';

// Admin Components
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './admin/AdminLayout';

// Admin Tab Components
import Dashboard from './admin/Dashboard';
import AdminPortfolio from './admin/Portfolio';
import AdminBlog from './admin/Blog';
import AdminServices from './admin/Services';
import AdminLabs from './admin/Labs';
import AdminTestimonials from './admin/Testimonials';
import AdminContactInquiries from './admin/ContactInquiries';
import AdminNewsletter from './admin/Newsletter';
import AdminSettings from './admin/Settings';
import AdminAnalytics from './admin/Analytics';
import AdminUsers from './admin/Users';
import AdminCalculator from './admin/Calculator';
import AdminChats from './admin/Chats';

// Content Management Components
import AdminHomeContent from './admin/HomeContent';
import AdminAboutContent from './admin/AboutContent';

// Lab Tools
import ColorGenerator from './pages/labs/ColorGenerator';
import AnimationTester from './pages/labs/AnimationTester';
import CodePlayground from './pages/labs/CodePlayground';
import ABTesting from './pages/labs/ABTesting';
import ComponentStore from './pages/labs/ComponentStore';
import AnimationComposer from './pages/labs/AnimationComposer';
import NeuralNetworkViz from './pages/labs/NeuralNetworkViz';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="blog" element={<Blog />} />
        <Route path="labs" element={<Labs />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      
      {/* Cost Estimator - Standalone */}
      <Route path="/cost-estimator" element={<CostEstimator />} />
      
      {/* Admin Login */}
      <Route path="/admin" element={<AdminLogin />} />
      
      {/* Protected Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="overview" element={<Dashboard />} />
        <Route path="portfolio" element={<AdminPortfolio />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="labs" element={<AdminLabs />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="contact-inquiries" element={<AdminContactInquiries />} />
        <Route path="newsletter" element={<AdminNewsletter />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="home-content" element={<AdminHomeContent />} />
        <Route path="about-content" element={<AdminAboutContent />} />
        <Route path="calculator" element={<AdminCalculator />} />
        <Route path="chats" element={<AdminChats />} />
      </Route>
      
      {/* Lab Tools Routes */}
      <Route path="/labs/color-generator" element={<ColorGenerator />} />
      <Route path="/labs/animation-tester" element={<AnimationTester />} />
      <Route path="/labs/code-playground" element={<CodePlayground />} />
      <Route path="/labs/ab-testing" element={<ABTesting />} />
      <Route path="/labs/component-store" element={<ComponentStore />} />
      <Route path="/labs/animation-composer" element={<AnimationComposer />} />
      <Route path="/labs/neural-network-viz" element={<NeuralNetworkViz />} />
    </Routes>
  );
}

export default App;