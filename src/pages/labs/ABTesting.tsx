import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Play, Pause, RotateCcw, ArrowLeft, BarChart3, 
  Users, TrendingUp, Eye, MousePointer, Clock, Download,
  Settings, Zap, Award, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Variant {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<any>;
  props: Record<string, any>;
}

interface TestResult {
  variant: string;
  views: number;
  clicks: number;
  conversions: number;
  conversionRate: number;
  confidence: number;
}

interface Test {
  id: string;
  name: string;
  description: string;
  variants: Variant[];
  isRunning: boolean;
  duration: number;
  results: TestResult[];
}

const ABTesting: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<string>('button-test');
  const [isRunning, setIsRunning] = useState(false);
  const [testDuration, setTestDuration] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [showResults, setShowResults] = useState(false);

  // Button Test Variants
  const ButtonVariantA: React.FC<any> = ({ onClick }) => (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Get Started
    </button>
  );

  const ButtonVariantB: React.FC<any> = ({ onClick }) => (
    <button
      onClick={onClick}
      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
    >
      Start Your Journey →
    </button>
  );

  const ButtonVariantC: React.FC<any> = ({ onClick }) => (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors border-2 border-green-400 shadow-md"
    >
      🚀 Launch Now
    </button>
  );

  // Pricing Card Variants
  const PricingVariantA: React.FC<any> = ({ onClick }) => (
    <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 max-w-sm">
      <h3 className="text-xl font-bold mb-2">Pro Plan</h3>
      <div className="text-3xl font-bold text-blue-600 mb-4">$29/mo</div>
      <ul className="space-y-2 mb-6 text-gray-600">
        <li>✓ Unlimited projects</li>
        <li>✓ 24/7 support</li>
        <li>✓ Advanced analytics</li>
      </ul>
      <button
        onClick={onClick}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Choose Plan
      </button>
    </div>
  );

  const PricingVariantB: React.FC<any> = ({ onClick }) => (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-xl border-2 border-blue-200 max-w-sm relative">
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
        POPULAR
      </div>
      <h3 className="text-xl font-bold mb-2">Pro Plan</h3>
      <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
        $29/mo
      </div>
      <ul className="space-y-3 mb-6 text-gray-700">
        <li className="flex items-center">
          <span className="text-green-500 mr-2">✓</span>
          Unlimited projects
        </li>
        <li className="flex items-center">
          <span className="text-green-500 mr-2">✓</span>
          24/7 support
        </li>
        <li className="flex items-center">
          <span className="text-green-500 mr-2">✓</span>
          Advanced analytics
        </li>
      </ul>
      <button
        onClick={onClick}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 font-semibold"
      >
        Start Free Trial
      </button>
    </div>
  );

  // Hero Section Variants
  const HeroVariantA: React.FC<any> = ({ onClick }) => (
    <div className="bg-gray-900 text-white p-8 rounded-lg max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">Build Better Websites</h1>
      <p className="text-gray-300 mb-6">
        Create stunning websites with our powerful tools and templates.
      </p>
      <button
        onClick={onClick}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
      >
        Get Started
      </button>
    </div>
  );

  const HeroVariantB: React.FC<any> = ({ onClick }) => (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl max-w-2xl">
      <h1 className="text-4xl font-bold mb-4">
        Transform Your Ideas Into Reality
      </h1>
      <p className="text-blue-100 mb-6 text-lg">
        Join thousands of creators building amazing websites with our platform.
      </p>
      <div className="flex space-x-4">
        <button
          onClick={onClick}
          className="bg-white text-blue-600 px-8 py-3 rounded-full hover:bg-blue-50 transition-colors font-semibold"
        >
          Start Building
        </button>
        <button className="border-2 border-white text-white px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
          Watch Demo
        </button>
      </div>
    </div>
  );

  const tests: Test[] = [
    {
      id: 'button-test',
      name: 'CTA Button Test',
      description: 'Testing different call-to-action button designs',
      isRunning: false,
      duration: 0,
      variants: [
        {
          id: 'button-a',
          name: 'Simple Blue',
          description: 'Standard blue button',
          component: ButtonVariantA,
          props: {}
        },
        {
          id: 'button-b',
          name: 'Gradient with Arrow',
          description: 'Gradient button with arrow and hover effects',
          component: ButtonVariantB,
          props: {}
        },
        {
          id: 'button-c',
          name: 'Green with Emoji',
          description: 'Green button with emoji and border',
          component: ButtonVariantC,
          props: {}
        }
      ],
      results: [
        { variant: 'button-a', views: 1250, clicks: 87, conversions: 23, conversionRate: 1.84, confidence: 85 },
        { variant: 'button-b', views: 1198, clicks: 142, conversions: 45, conversionRate: 3.76, confidence: 95 },
        { variant: 'button-c', views: 1301, clicks: 98, conversions: 28, conversionRate: 2.15, confidence: 78 }
      ]
    },
    {
      id: 'pricing-test',
      name: 'Pricing Card Test',
      description: 'Testing different pricing card layouts',
      isRunning: false,
      duration: 0,
      variants: [
        {
          id: 'pricing-a',
          name: 'Simple Card',
          description: 'Clean, minimal pricing card',
          component: PricingVariantA,
          props: {}
        },
        {
          id: 'pricing-b',
          name: 'Popular Badge',
          description: 'Card with popular badge and gradient',
          component: PricingVariantB,
          props: {}
        }
      ],
      results: [
        { variant: 'pricing-a', views: 892, clicks: 45, conversions: 12, conversionRate: 1.35, confidence: 72 },
        { variant: 'pricing-b', views: 934, clicks: 78, conversions: 28, conversionRate: 3.00, confidence: 88 }
      ]
    },
    {
      id: 'hero-test',
      name: 'Hero Section Test',
      description: 'Testing different hero section designs',
      isRunning: false,
      duration: 0,
      variants: [
        {
          id: 'hero-a',
          name: 'Simple Dark',
          description: 'Dark background with simple text',
          component: HeroVariantA,
          props: {}
        },
        {
          id: 'hero-b',
          name: 'Gradient with CTA',
          description: 'Gradient background with multiple CTAs',
          component: HeroVariantB,
          props: {}
        }
      ],
      results: [
        { variant: 'hero-a', views: 2156, clicks: 234, conversions: 67, conversionRate: 3.11, confidence: 91 },
        { variant: 'hero-b', views: 2089, clicks: 312, conversions: 98, conversionRate: 4.69, confidence: 96 }
      ]
    }
  ];

  const currentTest = tests.find(t => t.id === selectedTest);

  const startTest = () => {
    setIsRunning(true);
    setTestDuration(0);
    setShowResults(false);
  };

  const stopTest = () => {
    setIsRunning(false);
    setShowResults(true);
  };

  const resetTest = () => {
    setIsRunning(false);
    setTestDuration(0);
    setShowResults(false);
  };

  const handleVariantClick = (variantId: string) => {
    // Simulate click tracking
    console.log(`Clicked variant: ${variantId}`);
  };

  const exportResults = () => {
    if (currentTest) {
      const exportData = {
        testName: currentTest.name,
        description: currentTest.description,
        duration: testDuration,
        results: currentTest.results
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentTest.name.toLowerCase().replace(/\s+/g, '-')}-results.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const getWinningVariant = () => {
    if (!currentTest) return null;
    return currentTest.results.reduce((winner, current) => 
      current.conversionRate > winner.conversionRate ? current : winner
    );
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTestDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/labs" 
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Labs
              </Link>
              <div className="w-px h-6 bg-gray-600"></div>
              <div className="flex items-center space-x-3">
                <Target className="w-6 h-6 text-blue-400" />
                <h1 className="text-xl font-bold text-white">A/B Testing Lab</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-gray-300">
                <Clock size={16} />
                <span className="font-mono">{formatDuration(testDuration)}</span>
              </div>
              {isRunning ? (
                <button
                  onClick={stopTest}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Pause size={16} className="mr-2" />
                  Stop Test
                </button>
              ) : (
                <button
                  onClick={startTest}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Play size={16} className="mr-2" />
                  Start Test
                </button>
              )}
              <button
                onClick={resetTest}
                className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <RotateCcw size={16} className="mr-2" />
                Reset
              </button>
              {showResults && (
                <button
                  onClick={exportResults}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download size={16} className="mr-2" />
                  Export
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Test Selection */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Test Scenarios</h3>
              <div className="space-y-3">
                {tests.map((test) => (
                  <button
                    key={test.id}
                    onClick={() => setSelectedTest(test.id)}
                    className={`w-full text-left p-4 rounded-lg transition-colors ${
                      selectedTest === test.id
                        ? 'bg-blue-600/20 border border-blue-500'
                        : 'hover:bg-gray-700/50 border border-transparent'
                    }`}
                  >
                    <div className="font-medium text-white">{test.name}</div>
                    <div className="text-sm text-gray-400 mt-1">{test.description}</div>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Users size={12} className="mr-1" />
                      {test.variants.length} variants
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Test Status */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Test Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isRunning ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {isRunning ? 'Running' : 'Stopped'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Duration</span>
                  <span className="text-white font-mono">{formatDuration(testDuration)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Variants</span>
                  <span className="text-white">{currentTest?.variants.length || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Variants Preview */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-bold text-white mb-6">
                {currentTest?.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentTest?.variants.map((variant, index) => (
                  <motion.div
                    key={variant.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-white">{variant.name}</h3>
                      <span className="text-xs text-gray-400">Variant {String.fromCharCode(65 + index)}</span>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-6">{variant.description}</p>
                    
                    <div className="flex justify-center">
                      <variant.component 
                        onClick={() => handleVariantClick(variant.id)}
                        {...variant.props}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Results */}
            <AnimatePresence>
              {showResults && currentTest && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center">
                        <BarChart3 size={24} className="mr-2" />
                        Test Results
                      </h3>
                      {getWinningVariant() && (
                        <div className="flex items-center text-green-400">
                          <Award size={16} className="mr-1" />
                          Winner: {getWinningVariant()?.variant.replace('button-', 'Variant ').replace('pricing-', 'Variant ').replace('hero-', 'Variant ').toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      {currentTest.results.map((result, index) => (
                        <div
                          key={result.variant}
                          className={`bg-gray-700/30 rounded-xl p-6 border ${
                            getWinningVariant()?.variant === result.variant
                              ? 'border-green-500 bg-green-500/10'
                              : 'border-gray-600/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-white">
                              Variant {String.fromCharCode(65 + index)}
                            </h4>
                            {getWinningVariant()?.variant === result.variant && (
                              <Award size={16} className="text-green-400" />
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 flex items-center">
                                <Eye size={14} className="mr-1" />
                                Views
                              </span>
                              <span className="text-white font-semibold">{result.views.toLocaleString()}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 flex items-center">
                                <MousePointer size={14} className="mr-1" />
                                Clicks
                              </span>
                              <span className="text-white font-semibold">{result.clicks}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 flex items-center">
                                <TrendingUp size={14} className="mr-1" />
                                Conversions
                              </span>
                              <span className="text-white font-semibold">{result.conversions}</span>
                            </div>
                            
                            <div className="border-t border-gray-600 pt-3">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400">Conversion Rate</span>
                                <span className={`font-bold ${
                                  getWinningVariant()?.variant === result.variant
                                    ? 'text-green-400'
                                    : 'text-blue-400'
                                }`}>
                                  {result.conversionRate}%
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-gray-400">Confidence</span>
                                <span className={`text-sm ${
                                  result.confidence >= 95 ? 'text-green-400' :
                                  result.confidence >= 85 ? 'text-yellow-400' : 'text-red-400'
                                }`}>
                                  {result.confidence}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Statistical Significance */}
                    <div className="bg-blue-600/10 rounded-xl p-6 border border-blue-500/20">
                      <h4 className="font-semibold text-white mb-3 flex items-center">
                        <AlertCircle size={16} className="mr-2" />
                        Statistical Analysis
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Sample Size:</span>
                          <span className="text-white ml-2">
                            {currentTest.results.reduce((sum, r) => sum + r.views, 0).toLocaleString()} total views
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Test Duration:</span>
                          <span className="text-white ml-2">{formatDuration(testDuration)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Best Performer:</span>
                          <span className="text-green-400 ml-2">
                            {getWinningVariant()?.conversionRate}% conversion rate
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Confidence Level:</span>
                          <span className="text-white ml-2">
                            {Math.max(...currentTest.results.map(r => r.confidence))}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Testing Tips */}
            <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Zap size={20} className="mr-2" />
                A/B Testing Best Practices
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>• Test one element at a time for clear results</li>
                <li>• Run tests for at least 1-2 weeks to account for weekly patterns</li>
                <li>• Ensure statistical significance (95%+ confidence) before making decisions</li>
                <li>• Test with sufficient sample size (minimum 1000 visitors per variant)</li>
                <li>• Consider external factors that might influence results</li>
                <li>• Document your hypotheses and learnings for future tests</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ABTesting;