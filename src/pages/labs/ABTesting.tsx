import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Play, Pause, RotateCcw, ArrowLeft, BarChart3, 
  Users, TrendingUp, Eye, MousePointer, Clock, Download,
  Settings, Zap, Award, AlertCircle, Layers, Grid,
  Monitor, Smartphone, Tablet, Share2, Save, Brain,
  Sliders, Filter, Calendar, FileText, ExternalLink,
  CheckCircle, XCircle, Activity, Cpu, HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Variant {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<any>;
  props: Record<string, any>;
  isControl: boolean;
}

interface TestResult {
  variant: string;
  views: number;
  clicks: number;
  conversions: number;
  conversionRate: number;
  confidence: number;
  engagementTime: number;
  scrollDepth: number;
  hoverRate: number;
}

interface Test {
  id: string;
  name: string;
  description: string;
  variants: Variant[];
  isRunning: boolean;
  duration: number;
  results: TestResult[];
  trafficSplit: number[];
  audience: {
    device: 'all' | 'mobile' | 'desktop';
    location: string;
    userType: 'all' | 'new' | 'returning';
  };
  hypothesis: string;
  successMetric: string;
}

interface UserPersona {
  id: string;
  name: string;
  device: 'mobile' | 'desktop' | 'tablet';
  speed: 'fast' | 'slow';
  experience: 'novice' | 'power';
  behavior: {
    clickProbability: number;
    scrollDepth: number;
    timeOnPage: number;
  };
}

interface HeatmapData {
  x: number;
  y: number;
  intensity: number;
  type: 'click' | 'scroll' | 'hover';
}

const ABTesting: React.FC = () => {
  const [selectedTest, setSelectedTest] = useState<string>('button-test');
  const [isRunning, setIsRunning] = useState(false);
  const [testDuration, setTestDuration] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [showResults, setShowResults] = useState(false);
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<string>('all');
  const [trafficSimulation, setTrafficSimulation] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [showSegmentation, setShowSegmentation] = useState(false);
  const [realTimeData, setRealTimeData] = useState<TestResult[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);

  const userPersonas: UserPersona[] = [
    {
      id: 'mobile-fast',
      name: 'Mobile Power User',
      device: 'mobile',
      speed: 'fast',
      experience: 'power',
      behavior: {
        clickProbability: 0.85,
        scrollDepth: 0.9,
        timeOnPage: 45
      }
    },
    {
      id: 'desktop-slow',
      name: 'Desktop Casual',
      device: 'desktop',
      speed: 'slow',
      experience: 'novice',
      behavior: {
        clickProbability: 0.45,
        scrollDepth: 0.6,
        timeOnPage: 120
      }
    },
    {
      id: 'tablet-medium',
      name: 'Tablet Explorer',
      device: 'tablet',
      speed: 'fast',
      experience: 'novice',
      behavior: {
        clickProbability: 0.65,
        scrollDepth: 0.75,
        timeOnPage: 80
      }
    }
  ];

  // Enhanced Button Test Variants
  const ButtonVariantA: React.FC<any> = ({ onClick }) => (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-md">
      <h3 className="text-xl font-bold mb-4">Control Version</h3>
      <p className="text-gray-600 mb-6">Standard button design with basic styling.</p>
      <button
        onClick={onClick}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Get Started
      </button>
    </div>
  );

  const ButtonVariantB: React.FC<any> = ({ onClick }) => (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-md">
      <h3 className="text-xl font-bold mb-4">Variant B - Gradient</h3>
      <p className="text-gray-600 mb-6">Enhanced button with gradient and animation effects.</p>
      <button
        onClick={onClick}
        className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg font-semibold"
      >
        Start Your Journey →
      </button>
    </div>
  );

  const ButtonVariantC: React.FC<any> = ({ onClick }) => (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-md">
      <h3 className="text-xl font-bold mb-4">Variant C - Urgency</h3>
      <p className="text-gray-600 mb-6">Button with urgency indicators and social proof.</p>
      <div className="mb-4 text-center">
        <span className="text-sm text-green-600 font-medium">🔥 Limited Time Offer</span>
        <div className="text-xs text-gray-500 mt-1">Join 10,000+ users</div>
      </div>
      <button
        onClick={onClick}
        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors border-2 border-green-400 shadow-md font-semibold"
      >
        🚀 Claim Your Spot Now
      </button>
    </div>
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
        <li>✓ Team collaboration</li>
      </ul>
      <button
        onClick={onClick}
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors font-semibold"
      >
        Choose Plan
      </button>
    </div>
  );

  const PricingVariantB: React.FC<any> = ({ onClick }) => (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 shadow-xl border-2 border-blue-200 max-w-sm relative">
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
        MOST POPULAR
      </div>
      <h3 className="text-xl font-bold mb-2">Pro Plan</h3>
      <div className="flex items-baseline mb-4">
        <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          $29
        </span>
        <span className="text-gray-500 ml-1">/mo</span>
        <span className="ml-2 text-sm text-green-600 font-medium">Save 40%</span>
      </div>
      <ul className="space-y-3 mb-6 text-gray-700">
        <li className="flex items-center">
          <CheckCircle size={16} className="text-green-500 mr-2" />
          Unlimited projects
        </li>
        <li className="flex items-center">
          <CheckCircle size={16} className="text-green-500 mr-2" />
          24/7 priority support
        </li>
        <li className="flex items-center">
          <CheckCircle size={16} className="text-green-500 mr-2" />
          Advanced analytics & insights
        </li>
        <li className="flex items-center">
          <CheckCircle size={16} className="text-green-500 mr-2" />
          Team collaboration tools
        </li>
      </ul>
      <button
        onClick={onClick}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
      >
        Start Free Trial
      </button>
      <div className="text-center mt-2 text-xs text-gray-500">
        No credit card required
      </div>
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
      <div className="flex items-center mb-4">
        <Award className="w-6 h-6 mr-2 text-yellow-400" />
        <span className="text-sm font-medium text-blue-100">#1 Website Builder</span>
      </div>
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
          Start Building Free
        </button>
        <button className="border-2 border-white text-white px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
          Watch Demo
        </button>
      </div>
      <div className="mt-4 text-sm text-blue-200">
        ⭐ Trusted by 50,000+ businesses
      </div>
    </div>
  );

  const tests: Test[] = [
    {
      id: 'button-test',
      name: 'CTA Button Optimization',
      description: 'Testing different call-to-action button designs and copy',
      isRunning: false,
      duration: 0,
      hypothesis: 'A gradient button with action-oriented copy will increase conversions',
      successMetric: 'Click-through rate',
      audience: { device: 'all', location: 'US', userType: 'all' },
      trafficSplit: [33, 33, 34],
      variants: [
        {
          id: 'button-a',
          name: 'Control - Standard Blue',
          description: 'Standard blue button with basic styling',
          component: ButtonVariantA,
          props: {},
          isControl: true
        },
        {
          id: 'button-b',
          name: 'Variant B - Gradient',
          description: 'Gradient button with arrow and hover effects',
          component: ButtonVariantB,
          props: {},
          isControl: false
        },
        {
          id: 'button-c',
          name: 'Variant C - Urgency',
          description: 'Green button with urgency indicators',
          component: ButtonVariantC,
          props: {},
          isControl: false
        }
      ],
      results: [
        { 
          variant: 'button-a', 
          views: 1250, 
          clicks: 87, 
          conversions: 23, 
          conversionRate: 1.84, 
          confidence: 85,
          engagementTime: 45,
          scrollDepth: 0.6,
          hoverRate: 0.15
        },
        { 
          variant: 'button-b', 
          views: 1198, 
          clicks: 142, 
          conversions: 45, 
          conversionRate: 3.76, 
          confidence: 95,
          engagementTime: 62,
          scrollDepth: 0.75,
          hoverRate: 0.28
        },
        { 
          variant: 'button-c', 
          views: 1301, 
          clicks: 98, 
          conversions: 28, 
          conversionRate: 2.15, 
          confidence: 78,
          engagementTime: 38,
          scrollDepth: 0.55,
          hoverRate: 0.18
        }
      ]
    },
    {
      id: 'pricing-test',
      name: 'Pricing Card Layout',
      description: 'Testing different pricing card layouts and social proof elements',
      isRunning: false,
      duration: 0,
      hypothesis: 'Adding social proof and visual hierarchy will increase sign-ups',
      successMetric: 'Conversion rate',
      audience: { device: 'all', location: 'Global', userType: 'new' },
      trafficSplit: [50, 50],
      variants: [
        {
          id: 'pricing-a',
          name: 'Control - Simple',
          description: 'Clean, minimal pricing card',
          component: PricingVariantA,
          props: {},
          isControl: true
        },
        {
          id: 'pricing-b',
          name: 'Variant B - Enhanced',
          description: 'Card with popular badge and gradient',
          component: PricingVariantB,
          props: {},
          isControl: false
        }
      ],
      results: [
        { 
          variant: 'pricing-a', 
          views: 892, 
          clicks: 45, 
          conversions: 12, 
          conversionRate: 1.35, 
          confidence: 72,
          engagementTime: 35,
          scrollDepth: 0.5,
          hoverRate: 0.12
        },
        { 
          variant: 'pricing-b', 
          views: 934, 
          clicks: 78, 
          conversions: 28, 
          conversionRate: 3.00, 
          confidence: 88,
          engagementTime: 58,
          scrollDepth: 0.8,
          hoverRate: 0.25
        }
      ]
    },
    {
      id: 'hero-test',
      name: 'Hero Section Impact',
      description: 'Testing different hero section designs and value propositions',
      isRunning: false,
      duration: 0,
      hypothesis: 'Social proof and stronger value prop will improve engagement',
      successMetric: 'Engagement time',
      audience: { device: 'desktop', location: 'US', userType: 'all' },
      trafficSplit: [50, 50],
      variants: [
        {
          id: 'hero-a',
          name: 'Control - Simple',
          description: 'Dark background with simple text',
          component: HeroVariantA,
          props: {},
          isControl: true
        },
        {
          id: 'hero-b',
          name: 'Variant B - Enhanced',
          description: 'Gradient background with social proof',
          component: HeroVariantB,
          props: {},
          isControl: false
        }
      ],
      results: [
        { 
          variant: 'hero-a', 
          views: 2156, 
          clicks: 234, 
          conversions: 67, 
          conversionRate: 3.11, 
          confidence: 91,
          engagementTime: 78,
          scrollDepth: 0.65,
          hoverRate: 0.22
        },
        { 
          variant: 'hero-b', 
          views: 2089, 
          clicks: 312, 
          conversions: 98, 
          conversionRate: 4.69, 
          confidence: 96,
          engagementTime: 95,
          scrollDepth: 0.82,
          hoverRate: 0.35
        }
      ]
    }
  ];

  const currentTest = tests.find(t => t.id === selectedTest);

  const startTest = () => {
    setIsRunning(true);
    setTestDuration(0);
    setShowResults(false);
    setTrafficSimulation(true);
    
    // Start real-time data simulation
    const interval = setInterval(() => {
      if (currentTest) {
        const updatedResults = currentTest.results.map(result => ({
          ...result,
          views: result.views + Math.floor(Math.random() * 10),
          clicks: result.clicks + Math.floor(Math.random() * 3),
          conversions: result.conversions + Math.floor(Math.random() * 2)
        }));
        setRealTimeData(updatedResults);
      }
    }, 2000);

    return () => clearInterval(interval);
  };

  const stopTest = () => {
    setIsRunning(false);
    setShowResults(true);
    setTrafficSimulation(false);
  };

  const resetTest = () => {
    setIsRunning(false);
    setTestDuration(0);
    setShowResults(false);
    setTrafficSimulation(false);
    setRealTimeData([]);
  };

  const handleVariantClick = (variantId: string) => {
    // Simulate click tracking with heatmap data
    const newHeatmapPoint: HeatmapData = {
      x: Math.random() * 400,
      y: Math.random() * 300,
      intensity: Math.random(),
      type: 'click'
    };
    
    setHeatmapData(prev => [...prev, newHeatmapPoint]);
    console.log(`Clicked variant: ${variantId}`);
  };

  const exportResults = () => {
    if (currentTest) {
      const exportData = {
        testName: currentTest.name,
        description: currentTest.description,
        hypothesis: currentTest.hypothesis,
        duration: testDuration,
        results: showResults ? currentTest.results : realTimeData,
        variants: currentTest.variants.map(v => ({ id: v.id, name: v.name, description: v.description })),
        audience: currentTest.audience,
        heatmapData: heatmapData,
        timestamp: new Date().toISOString()
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
    const results = showResults ? currentTest.results : realTimeData;
    if (results.length === 0) return null;
    
    return results.reduce((winner, current) => 
      current.conversionRate > winner.conversionRate ? current : winner
    );
  };

  const calculateStatisticalSignificance = (control: TestResult, variant: TestResult) => {
    // Simplified statistical significance calculation
    const controlRate = control.conversionRate / 100;
    const variantRate = variant.conversionRate / 100;
    const pooledRate = (control.conversions + variant.conversions) / (control.views + variant.views);
    
    const se = Math.sqrt(pooledRate * (1 - pooledRate) * (1/control.views + 1/variant.views));
    const zScore = Math.abs(variantRate - controlRate) / se;
    
    // Convert z-score to confidence level (simplified)
    return Math.min(99, Math.max(50, (1 - 2 * (1 - 0.8413 * zScore)) * 100));
  };

  const simulateUserBehavior = (persona: UserPersona, variant: Variant) => {
    // Simulate user interaction based on persona
    const willClick = Math.random() < persona.behavior.clickProbability;
    const scrollDepth = persona.behavior.scrollDepth + (Math.random() - 0.5) * 0.2;
    const timeOnPage = persona.behavior.timeOnPage + (Math.random() - 0.5) * 20;
    
    return {
      clicked: willClick,
      scrollDepth: Math.max(0, Math.min(1, scrollDepth)),
      timeOnPage: Math.max(10, timeOnPage),
      converted: willClick && Math.random() < 0.3 // 30% of clicks convert
    };
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

  // Generate heatmap data during simulation
  useEffect(() => {
    if (trafficSimulation) {
      const interval = setInterval(() => {
        const newPoints = Array.from({ length: 3 }, () => ({
          x: Math.random() * 400,
          y: Math.random() * 300,
          intensity: Math.random(),
          type: ['click', 'scroll', 'hover'][Math.floor(Math.random() * 3)] as 'click' | 'scroll' | 'hover'
        }));
        
        setHeatmapData(prev => [...prev.slice(-50), ...newPoints]); // Keep last 50 points
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [trafficSimulation]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Enhanced Header */}
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
                <h1 className="text-xl font-bold text-white">A/B Testing Lab Pro</h1>
                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">BETA</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-gray-300">
                <Clock size={16} />
                <span className="font-mono">{formatDuration(testDuration)}</span>
              </div>
              
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  showHeatmap ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Activity size={16} className="mr-2" />
                Heatmap
              </button>
              
              <button
                onClick={() => setShowSegmentation(!showSegmentation)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  showSegmentation ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Filter size={16} className="mr-2" />
                Segments
              </button>
              
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
              
              {(showResults || isRunning) && (
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
          {/* Enhanced Test Selection */}
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
                      <Target size={12} className="ml-2 mr-1" />
                      {test.successMetric}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Test Configuration */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Test Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Device Targeting
                  </label>
                  <select
                    value={activeDevice}
                    onChange={(e) => setActiveDevice(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="desktop">Desktop</option>
                    <option value="tablet">Tablet</option>
                    <option value="mobile">Mobile</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    User Persona
                  </label>
                  <select
                    value={selectedPersona}
                    onChange={(e) => setSelectedPersona(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Users</option>
                    {userPersonas.map((persona) => (
                      <option key={persona.id} value={persona.id}>
                        {persona.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Simulation Speed
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="5"
                    step="0.5"
                    value={simulationSpeed}
                    onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="text-xs text-gray-400 mt-1">{simulationSpeed}x speed</div>
                </div>
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
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Traffic Split</span>
                  <span className="text-white">
                    {currentTest?.trafficSplit.join('/') || 'N/A'}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Test Hypothesis */}
            {currentTest && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Brain size={20} className="mr-2 text-purple-400" />
                  Test Hypothesis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-white mb-2">Hypothesis</h4>
                    <p className="text-gray-300 text-sm">{currentTest.hypothesis}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">Success Metric</h4>
                    <p className="text-blue-400 text-sm font-medium">{currentTest.successMetric}</p>
                  </div>
                </div>
              </div>
            )}

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
                    className="relative"
                  >
                    <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/50 relative overflow-hidden">
                      {/* Heatmap Overlay */}
                      {showHeatmap && (
                        <div className="absolute inset-0 pointer-events-none">
                          {heatmapData
                            .filter(point => Math.random() > 0.7) // Show subset for this variant
                            .map((point, i) => (
                              <div
                                key={i}
                                className={`absolute w-4 h-4 rounded-full ${
                                  point.type === 'click' ? 'bg-red-500' :
                                  point.type === 'hover' ? 'bg-yellow-500' : 'bg-blue-500'
                                }`}
                                style={{
                                  left: `${point.x}px`,
                                  top: `${point.y}px`,
                                  opacity: point.intensity * 0.7
                                }}
                              />
                            ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white">{variant.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">
                            Variant {String.fromCharCode(65 + index)}
                          </span>
                          {variant.isControl && (
                            <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                              Control
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-6">{variant.description}</p>
                      
                      <div className="flex justify-center">
                        <variant.component 
                          onClick={() => handleVariantClick(variant.id)}
                          {...variant.props}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Real-time Metrics */}
            {isRunning && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Activity size={20} className="mr-2 text-green-400" />
                  Live Metrics
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {realTimeData.reduce((sum, r) => sum + r.views, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">Total Views</div>
                  </div>
                  
                  <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {realTimeData.reduce((sum, r) => sum + r.clicks, 0)}
                    </div>
                    <div className="text-sm text-gray-400">Total Clicks</div>
                  </div>
                  
                  <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {realTimeData.reduce((sum, r) => sum + r.conversions, 0)}
                    </div>
                    <div className="text-sm text-gray-400">Conversions</div>
                  </div>
                  
                  <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {getWinningVariant()?.variant.replace(/.*-/, '').toUpperCase() || 'TBD'}
                    </div>
                    <div className="text-sm text-gray-400">Leading</div>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            <AnimatePresence>
              {(showResults || isRunning) && currentTest && (
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
                        {isRunning ? 'Live Results' : 'Test Results'}
                      </h3>
                      {getWinningVariant() && (
                        <div className="flex items-center text-green-400">
                          <Award size={16} className="mr-1" />
                          Winner: {getWinningVariant()?.variant.replace(/.*-/, 'Variant ').toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      {(isRunning ? realTimeData : currentTest.results).map((result, index) => {
                        const isWinner = getWinningVariant()?.variant === result.variant;
                        const variant = currentTest.variants[index];
                        
                        return (
                          <div
                            key={result.variant}
                            className={`bg-gray-700/30 rounded-xl p-6 border transition-all duration-300 ${
                              isWinner
                                ? 'border-green-500 bg-green-500/10 shadow-lg'
                                : 'border-gray-600/50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-semibold text-white">
                                {variant?.name || `Variant ${String.fromCharCode(65 + index)}`}
                              </h4>
                              <div className="flex items-center space-x-2">
                                {variant?.isControl && (
                                  <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                                    Control
                                  </span>
                                )}
                                {isWinner && (
                                  <Award size={16} className="text-green-400" />
                                )}
                              </div>
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
                                    isWinner ? 'text-green-400' : 'text-blue-400'
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

                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-gray-400">Engagement</span>
                                  <span className="text-purple-400 text-sm">
                                    {result.engagementTime}s
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Statistical Analysis */}
                    <div className="bg-blue-600/10 rounded-xl p-6 border border-blue-500/20">
                      <h4 className="font-semibold text-white mb-3 flex items-center">
                        <AlertCircle size={16} className="mr-2" />
                        Statistical Analysis
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Sample Size:</span>
                          <span className="text-white ml-2">
                            {(isRunning ? realTimeData : currentTest.results)
                              .reduce((sum, r) => sum + r.views, 0).toLocaleString()} total views
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
                            {Math.max(...(isRunning ? realTimeData : currentTest.results).map(r => r.confidence))}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Segmentation Panel */}
            <AnimatePresence>
              {showSegmentation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Filter size={20} className="mr-2 text-green-400" />
                      Audience Segmentation
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-3">Device Breakdown</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Desktop</span>
                            <span className="text-white">45%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Mobile</span>
                            <span className="text-white">35%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Tablet</span>
                            <span className="text-white">20%</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-3">User Type</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">New Users</span>
                            <span className="text-white">60%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Returning</span>
                            <span className="text-white">40%</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <h4 className="font-semibold text-white mb-3">Geographic</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">US</span>
                            <span className="text-white">70%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">EU</span>
                            <span className="text-white">20%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Other</span>
                            <span className="text-white">10%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Testing Best Practices */}
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
                <li>• Use heatmaps and user recordings to understand behavior</li>
                <li>• Segment results by device, user type, and traffic source</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ABTesting;