import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import AdminLayout from './admin/AdminLayout';
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

// Admin Dashboard Components
import Dashboard from './admin/Dashboard';
import Portfolio as AdminPortfolio from './admin/Portfolio';
import Blog as AdminBlog from './admin/Blog';
import Users from './admin/Users';

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
      <Route path="/cost-estimator" element={<CostEstimator />} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="overview" element={<Dashboard />} />
        <Route path="portfolio" element={<AdminPortfolio />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="labs" element={<div>Labs Management Coming Soon</div>} />
        <Route path="services" element={<div>Services Management Coming Soon</div>} />
        <Route path="testimonials" element={<div>Testimonials Management Coming Soon</div>} />
        <Route path="contact-inquiries" element={<div>Contact Inquiries Coming Soon</div>} />
        <Route path="newsletter" element={<div>Newsletter Management Coming Soon</div>} />
        <Route path="analytics" element={<div>Analytics Coming Soon</div>} />
        <Route path="users" element={<Users />} />
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