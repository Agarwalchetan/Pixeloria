import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Labs from './pages/Labs';
import CostEstimator from './pages/CostEstimator';
import NotFound from './pages/NotFound';

// Lab Tools
import ColorGenerator from './pages/labs/ColorGenerator';
import AnimationTester from './pages/labs/AnimationTester';
import CodePlayground from './pages/labs/CodePlayground';
import ABTesting from './pages/labs/ABTesting';
import ComponentStore from './pages/labs/ComponentStore';

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
      
      {/* Lab Tools Routes */}
      <Route path="/labs/color-generator" element={<ColorGenerator />} />
      <Route path="/labs/animation-tester" element={<AnimationTester />} />
      <Route path="/labs/code-playground" element={<CodePlayground />} />
      <Route path="/labs/ab-testing" element={<ABTesting />} />
      <Route path="/labs/component-store" element={<ComponentStore />} />
    </Routes>
  );
}

export default App;