import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, ArrowRight, Check, DollarSign, Clock, Zap, Globe, ShoppingCart, Code, 
  Sparkles, TrendingUp, Mail, Phone, Download, PieChart, List, Star, Shield,
  Palette, Database, Search, CreditCard, BarChart, Smartphone, Users, Settings,
  FileText, Calendar, Award, Target, Lightbulb, Coffee
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { calculatorApi, estimateApi } from '../utils/api';

interface ProjectEstimate {
  baseCost: number;
  featureCost: number;
  designCost: number;
  totalCost: number;
  timeline: string;
  breakdown: Array<{ label: string; cost: number; percentage: number }>;
}

const CostEstimator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [projectType, setProjectType] = useState('');
  const [pages, setPages] = useState(5);
  const [features, setFeatures] = useState<string[]>([]);
  const [designComplexity, setDesignComplexity] = useState('');
  const [timeline, setTimeline] = useState('');
  const [email, setEmail] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dynamicProjectTypes, setDynamicProjectTypes] = useState<any[]>([]);
  const [dynamicFeatures, setDynamicFeatures] = useState<any[]>([]);
  const [dynamicDesignOptions, setDynamicDesignOptions] = useState<any[]>([]);
  const [dynamicTimelineOptions, setDynamicTimelineOptions] = useState<any[]>([]);
  const [estimate, setEstimate] = useState<ProjectEstimate>({
    baseCost: 0,
    featureCost: 0,
    designCost: 0,
    totalCost: 0,
    timeline: '',
    breakdown: []
  });

  const steps = [
    { title: "Welcome", subtitle: "Let's estimate your project cost" },
    { title: "Project Type", subtitle: "What are you building?" },
    { title: "Pages & Content", subtitle: "How much content do you need?" },
    { title: "Features", subtitle: "What functionality do you need?" },
    { title: "Design", subtitle: "What's your design preference?" },
    { title: "Timeline", subtitle: "When do you need it?" },
    { title: "Results", subtitle: "Your project estimate" }
  ];

  const projectTypes = [
    {
      id: 'business',
      label: 'Business Website',
      description: 'Professional corporate site with company info, services, and contact',
      icon: Globe,
      baseCost: 2500,
      timeline: 3,
      popular: false
    },
    {
      id: 'blog',
      label: 'Blog/Content Site',
      description: 'Content-focused site with articles, categories, and CMS',
      icon: FileText,
      baseCost: 2000,
      timeline: 2,
      popular: false
    },
    {
      id: 'ecommerce',
      label: 'E-Commerce Store',
      description: 'Online store with products, cart, checkout, and payments',
      icon: ShoppingCart,
      baseCost: 4500,
      timeline: 6,
      popular: true
    },
    {
      id: 'webapp',
      label: 'Web Application',
      description: 'Custom app with user accounts, dashboards, and complex features',
      icon: Code,
      baseCost: 6000,
      timeline: 8,
      popular: false
    },
    {
      id: 'custom',
      label: 'Custom Solution',
      description: 'Unique project with specialized requirements',
      icon: Lightbulb,
      baseCost: 5000,
      timeline: 6,
      popular: false
    }
  ];

  const featureOptions = [
    { 
      id: 'auth', 
      label: 'User Authentication', 
      cost: 800,
      description: 'Login, registration, password reset, user profiles',
      icon: Shield,
      category: 'User Management'
    },
    { 
      id: 'payment', 
      label: 'Payment Integration', 
      cost: 1200,
      description: 'Stripe, PayPal, credit cards, subscription billing',
      icon: CreditCard,
      category: 'E-Commerce'
    },
    { 
      id: 'cms', 
      label: 'Content Management', 
      cost: 900,
      description: 'Easy content editing, media library, blog management',
      icon: Database,
      category: 'Content'
    },
    { 
      id: 'analytics', 
      label: 'Analytics Dashboard', 
      cost: 1000,
      description: 'Custom analytics, reporting, data visualization',
      icon: BarChart,
      category: 'Analytics'
    },
    {
      id: 'search',
      label: 'Advanced Search',
      cost: 600,
      description: 'Filters, sorting, autocomplete, search results',
      icon: Search,
      category: 'Functionality'
    },
    {
      id: 'api',
      label: 'API Integration',
      cost: 800,
      description: 'Third-party services, social media, external data',
      icon: Settings,
      category: 'Integration'
    },
    {
      id: 'mobile',
      label: 'Mobile App',
      cost: 2500,
      description: 'Native iOS/Android app with your website features',
      icon: Smartphone,
      category: 'Mobile'
    },
    {
      id: 'seo',
      label: 'SEO Optimization',
      cost: 500,
      description: 'Search engine optimization, meta tags, sitemaps',
      icon: TrendingUp,
      category: 'Marketing'
    }
  ];

  const designOptions = [
    {
      id: 'template',
      label: 'Template-Based',
      description: 'Professional template customized for your brand',
      cost: 0,
      multiplier: 1,
      popular: false
    },
    {
      id: 'semi-custom',
      label: 'Semi-Custom Design',
      description: 'Custom layouts with some template components',
      cost: 1500,
      multiplier: 1.2,
      popular: true
    },
    {
      id: 'custom',
      label: 'Fully Custom Design',
      description: 'Unique design created from scratch for your brand',
      cost: 3000,
      multiplier: 1.5,
      popular: false
    },
    {
      id: 'premium',
      label: 'Premium Custom UI',
      description: 'High-end design with animations and micro-interactions',
      cost: 5000,
      multiplier: 2,
      popular: false
    }
  ];

  const timelineOptions = [
    {
      id: 'standard',
      label: 'Standard Timeline',
      description: 'Normal development pace with regular check-ins',
      multiplier: 1,
      weeks: 0
    },
    {
      id: 'fast',
      label: 'Fast Track',
      description: 'Accelerated development with priority support',
      multiplier: 1.3,
      weeks: -2
    },
    {
      id: 'rush',
      label: 'Rush Job',
      description: 'Urgent delivery with dedicated team focus',
      multiplier: 1.6,
      weeks: -4
    }
  ];

  // Fetch dynamic calculator configuration
  useEffect(() => {
    const fetchCalculatorConfig = async () => {
      try {
        const response = await calculatorApi.getConfig();
        if (response.success && response.data) {
          setDynamicProjectTypes(response.data.projectTypes || []);
          setDynamicFeatures(response.data.features || []);
          setDynamicDesignOptions(response.data.designOptions || []);
          setDynamicTimelineOptions(response.data.timelineOptions || []);
        }
      } catch (error) {
        console.error('Error fetching calculator config:', error);
        // Use fallback data if API fails
      }
    };

    fetchCalculatorConfig();
  }, []);

  // Use dynamic data if available, otherwise use fallback
  const displayProjectTypes = dynamicProjectTypes.length > 0 ? dynamicProjectTypes : projectTypes;
  const displayFeatures = dynamicFeatures.length > 0 ? dynamicFeatures : featureOptions;
  const displayDesignOptions = dynamicDesignOptions.length > 0 ? dynamicDesignOptions : designOptions;
  const displayTimelineOptions = dynamicTimelineOptions.length > 0 ? dynamicTimelineOptions : timelineOptions;

  const calculateEstimate = () => {
    const selectedProject = displayProjectTypes.find(p => p.id === projectType);
    const selectedDesign = displayDesignOptions.find(d => d.id === designComplexity);
    const selectedTimeline = displayTimelineOptions.find(t => t.id === timeline);
    
    if (!selectedProject || !selectedDesign || !selectedTimeline) return;

    const baseCost = selectedProject.baseCost;
    const pageCost = pages * 150;
    const featureCost = features.reduce((acc, featureId) => {
      const feature = displayFeatures.find(f => f.id === featureId);
      return acc + (feature?.cost || 0);
    }, 0);
    
    const designCost = selectedDesign.cost;
    const subtotal = (baseCost + pageCost + featureCost + designCost);
    const totalCost = Math.round(subtotal * selectedTimeline.multiplier);
    
    const baseTimeline = selectedProject.timeline + Math.floor(pages / 3) + Math.ceil(features.length / 2);
    const finalTimeline = Math.max(2, baseTimeline + selectedTimeline.weeks);

    const breakdown = [
      { label: 'Base Project', cost: baseCost, percentage: (baseCost / totalCost) * 100 },
      { label: 'Pages & Content', cost: pageCost, percentage: (pageCost / totalCost) * 100 },
      { label: 'Features', cost: featureCost, percentage: (featureCost / totalCost) * 100 },
      { label: 'Design', cost: designCost, percentage: (designCost / totalCost) * 100 },
    ];

    if (selectedTimeline.multiplier > 1) {
      const rushCost = totalCost - subtotal;
      breakdown.push({ label: 'Rush Fee', cost: rushCost, percentage: (rushCost / totalCost) * 100 });
    }

    setEstimate({
      baseCost,
      featureCost,
      designCost,
      totalCost,
      timeline: `${finalTimeline}-${finalTimeline + 2} weeks`,
      breakdown: breakdown.filter(item => item.cost > 0)
    });
  };

  useEffect(() => {
    if (projectType && designComplexity && timeline) {
      calculateEstimate();
    }
  }, [projectType, pages, features, designComplexity, timeline]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (email) {
      submitCalculatorData();
    }
    setShowResults(true);
    setCurrentStep(steps.length - 1);
  };

  const submitCalculatorData = async () => {
    setIsSubmitting(true);
    try {
      const submissionData = {
        projectType,
        pages,
        features,
        designComplexity,
        timeline,
        contactInfo: {
          name: email.split('@')[0], // Extract name from email as fallback
          email,
          company: ''
        },
        estimate
      };

      const response = await estimateApi.calculate(submissionData);
      if (response.success) {
        console.log('Calculator submission saved successfully');
      }
    } catch (error) {
      console.error('Error submitting calculator data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Code size={32} className="text-blue-600" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Pixeloria
              </span>
            </Link>
            <div className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container-custom">
          <div className="relative">
            <div className="h-2 bg-gray-200 rounded-full">
              <motion.div
                className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Welcome Step */}
            {currentStep === 0 && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center space-y-8"
              >
                <div className="space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center"
                  >
                    <Calculator className="w-12 h-12 text-white" />
                  </motion.div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Website Cost Calculator
                  </h1>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Get an instant, detailed estimate for your website project in under 60 seconds. 
                    Our interactive calculator helps you understand costs and make informed decisions.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  {[
                    { icon: Zap, title: "Instant Results", desc: "Get estimates in seconds" },
                    { icon: Shield, title: "Transparent Pricing", desc: "No hidden costs" },
                    { icon: Award, title: "Expert Insights", desc: "Professional guidance" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                    >
                      <item.icon className="w-8 h-8 text-blue-600 mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  onClick={nextStep}
                  className="btn-primary text-lg px-8 py-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Calculator <ArrowRight className="ml-2" />
                </motion.button>
              </motion.div>
            )}

            {/* Project Type Step */}
            {currentStep === 1 && (
              <motion.div
                key="project-type"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    What type of project are you building?
                  </h2>
                  <p className="text-gray-600">Choose the option that best describes your needs</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayProjectTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      onClick={() => setProjectType(type.id)}
                      className={`relative p-6 rounded-xl border-2 text-left transition-all duration-300 ${
                        projectType === type.id
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {type.popular && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-pink-400 text-white text-xs px-2 py-1 rounded-full">
                          Popular
                        </div>
                      )}
                      <type.icon className={`w-12 h-12 mb-4 ${
                        projectType === type.id ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{type.label}</h3>
                      <p className="text-sm text-gray-600 mb-4">{type.description}</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-600 font-semibold">From ${type.baseCost.toLocaleString()}</span>
                        <span className="text-gray-500">{type.timeline}+ weeks</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Pages Step */}
            {currentStep === 2 && (
              <motion.div
                key="pages"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    How many pages do you need?
                  </h2>
                  <p className="text-gray-600">Each page represents a unique section of content</p>
                </div>

                <div className="max-w-2xl mx-auto">
                  <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-2xl font-bold text-gray-900">Pages: {pages}</span>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                        pages <= 3 ? 'bg-green-100 text-green-800' : 
                        pages <= 8 ? 'bg-blue-100 text-blue-800' :
                        pages <= 15 ? 'bg-yellow-100 text-yellow-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {pages <= 3 ? 'Simple Site' : 
                         pages <= 8 ? 'Standard Site' :
                         pages <= 15 ? 'Large Site' : 'Enterprise Site'}
                      </span>
                    </div>
                    
                    <input
                      type="range"
                      min="1"
                      max="25"
                      value={pages}
                      onChange={(e) => setPages(parseInt(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-4"
                    />
                    
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>1</span>
                      <span>5</span>
                      <span>10</span>
                      <span>15</span>
                      <span>20</span>
                      <span>25</span>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Cost impact:</strong> +${(pages * 150).toLocaleString()} 
                        (${150} per additional page)
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Features Step */}
            {currentStep === 3 && (
              <motion.div
                key="features"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    What features do you need?
                  </h2>
                  <p className="text-gray-600">Select all the functionality your project requires</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featureOptions.map((feature) => (
                    <motion.label
                      key={feature.id}
                      className={`relative flex items-start p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        features.includes(feature.id)
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                      whileHover={{ y: -1 }}
                    >
                      <input
                        type="checkbox"
                        checked={features.includes(feature.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFeatures([...features, feature.id]);
                          } else {
                            setFeatures(features.filter(f => f !== feature.id));
                          }
                        }}
                        className="sr-only"
                      />
                      
                      <feature.icon className={`w-8 h-8 mr-4 mt-1 ${
                        features.includes(feature.id) ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">{feature.label}</h3>
                          <span className="text-lg font-bold text-blue-600">+${feature.cost.toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          {feature.category}
                        </span>
                      </div>
                      
                      <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        features.includes(feature.id)
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-300'
                      }`}>
                        {features.includes(feature.id) && <Check size={14} />}
                      </div>
                    </motion.label>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Design Step */}
            {currentStep === 4 && (
              <motion.div
                key="design"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    What's your design preference?
                  </h2>
                  <p className="text-gray-600">Choose the level of customization you need</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {designOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      onClick={() => setDesignComplexity(option.id)}
                      className={`relative p-6 rounded-xl border-2 text-left transition-all duration-300 ${
                        designComplexity === option.id
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option.popular && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-400 to-blue-400 text-white text-xs px-2 py-1 rounded-full">
                          Recommended
                        </div>
                      )}
                      <Palette className={`w-10 h-10 mb-4 ${
                        designComplexity === option.id ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                      <h3 className="font-bold text-xl text-gray-900 mb-2">{option.label}</h3>
                      <p className="text-gray-600 mb-4">{option.description}</p>
                      <div className="text-lg font-bold text-blue-600">
                        {option.cost === 0 ? 'Included' : `+$${option.cost.toLocaleString()}`}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Timeline Step */}
            {currentStep === 5 && (
              <motion.div
                key="timeline"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    When do you need it completed?
                  </h2>
                  <p className="text-gray-600">Timeline affects pricing and resource allocation</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {timelineOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      onClick={() => setTimeline(option.id)}
                      className={`p-6 rounded-xl border-2 text-center transition-all duration-300 ${
                        timeline === option.id
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Clock className={`w-12 h-12 mx-auto mb-4 ${
                        timeline === option.id ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                      <h3 className="font-bold text-xl text-gray-900 mb-2">{option.label}</h3>
                      <p className="text-gray-600 mb-4">{option.description}</p>
                      <div className="text-lg font-bold text-blue-600">
                        {option.multiplier === 1 ? 'Standard Rate' : `+${Math.round((option.multiplier - 1) * 100)}% cost`}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Results Step */}
            {currentStep === 6 && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-6"
                  >
                    <Check className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Your Project Estimate
                  </h2>
                  <p className="text-gray-600">Based on your selections, here's what your project would cost</p>
                </div>

                {/* Main Estimate Card */}
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
                  <div className="text-6xl font-bold mb-2">
                    ${estimate.totalCost.toLocaleString()}
                  </div>
                  <div className="text-xl opacity-90 mb-4">
                    Timeline: {estimate.timeline}
                  </div>
                  <div className="text-sm opacity-75">
                    * This is an estimate. Final pricing may vary based on specific requirements.
                  </div>
                </div>

                {/* Breakdown */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Cost Breakdown</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setViewMode('chart')}
                        className={`p-2 rounded-lg ${viewMode === 'chart' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                      >
                        <PieChart size={20} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
                      >
                        <List size={20} />
                      </button>
                    </div>
                  </div>

                  {viewMode === 'list' && (
                    <div className="space-y-4">
                      {estimate.breakdown.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-900">{item.label}</span>
                          <span className="font-bold text-blue-600">${item.cost.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {viewMode === 'chart' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {estimate.breakdown.map((item, index) => (
                        <div key={index} className="text-center">
                          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {Math.round(item.percentage)}%
                          </div>
                          <div className="text-sm font-medium text-gray-900">{item.label}</div>
                          <div className="text-sm text-blue-600">${item.cost.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* CTA Section */}
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Ready to get started?
                    </h3>
                    <p className="text-gray-600">
                      Get a detailed PDF quote or book a free consultation
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Get Detailed Quote</h4>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <button 
                        type="button"
                        onClick={submitCalculatorData}
                        disabled={isSubmitting || !email}
                        className="w-full btn-primary flex items-center justify-center disabled:opacity-50"
                      >
                        <Download className="mr-2" size={20} />
                        {isSubmitting ? 'Generating...' : 'Send PDF Quote'}
                      </button>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Book Free Consultation</h4>
                      <p className="text-sm text-gray-600">
                        Discuss your project with our experts
                      </p>
                      <Link to="/contact" className="w-full btn-outline flex items-center justify-center">
                        <Calendar className="mr-2" size={20} />
                        Schedule Call
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Upsells */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                    <Target className="w-8 h-8 text-green-600 mb-3" />
                    <h4 className="font-bold text-gray-900 mb-2">Free Website Audit</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Get a professional analysis of your current site
                    </p>
                    <button className="text-green-600 font-medium hover:text-green-700">
                      Request Audit →
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <Coffee className="w-8 h-8 text-purple-600 mb-3" />
                    <h4 className="font-bold text-gray-900 mb-2">Content Planning Help</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Need help planning your website content?
                    </p>
                    <button className="text-purple-600 font-medium hover:text-purple-700">
                      Get Help →
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {currentStep > 0 && currentStep < steps.length - 1 && (
            <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-200">
              <button
                onClick={prevStep}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors flex items-center"
              >
                ← Back
              </button>
              
              <button
                onClick={currentStep === 5 ? handleSubmit : nextStep}
                disabled={
                  (currentStep === 1 && !projectType) ||
                  (currentStep === 4 && !designComplexity) ||
                  (currentStep === 5 && !timeline)
                }
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === 5 ? 'Get Results' : 'Next Step'} →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CostEstimator;