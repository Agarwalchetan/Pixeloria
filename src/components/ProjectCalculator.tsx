import React, { useState, useEffect } from 'react';
import { Calculator, ArrowRight, Check, DollarSign, Clock, Zap, Globe, ShoppingCart, Code, Sparkles, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectEstimate {
  cost: number;
  timeline: string;
}

const ProjectCalculator: React.FC = () => {
  const [projectType, setProjectType] = useState('website');
  const [pages, setPages] = useState(5);
  const [features, setFeatures] = useState<string[]>([]);
  const [estimate, setEstimate] = useState<ProjectEstimate>({ cost: 0, timeline: '' });
  const [activeStep, setActiveStep] = useState(1);

  const featureOptions = [
    { 
      id: 'auth', 
      label: 'User Authentication', 
      cost: 500,
      description: 'Secure login and user management system'
    },
    { 
      id: 'payment', 
      label: 'Payment Integration', 
      cost: 800,
      description: 'Secure payment processing with multiple gateways'
    },
    { 
      id: 'cms', 
      label: 'Content Management', 
      cost: 600,
      description: 'Easy-to-use interface for content updates'
    },
    { 
      id: 'analytics', 
      label: 'Analytics Dashboard', 
      cost: 700,
      description: 'Detailed insights and reporting'
    },
    {
      id: 'search',
      label: 'Advanced Search',
      cost: 400,
      description: 'Powerful search functionality with filters'
    },
    {
      id: 'api',
      label: 'API Integration',
      cost: 600,
      description: 'Connect with third-party services'
    }
  ];

  const projectTypes = [
    {
      id: 'website',
      label: 'Business Website',
      description: 'Professional website with modern design',
      icon: Globe
    },
    {
      id: 'ecommerce',
      label: 'E-Commerce Store',
      description: 'Full-featured online store',
      icon: ShoppingCart
    },
    {
      id: 'webapp',
      label: 'Web Application',
      description: 'Custom web app with complex functionality',
      icon: Code
    }
  ];

  const calculateEstimate = () => {
    let baseCost = 0;
    let baseTime = 0;

    switch (projectType) {
      case 'website':
        baseCost = 1500;
        baseTime = 2;
        break;
      case 'ecommerce':
        baseCost = 3000;
        baseTime = 4;
        break;
      case 'webapp':
        baseCost = 4000;
        baseTime = 6;
        break;
    }

    baseCost += pages * 200;
    baseTime += Math.floor(pages / 5);

    const featureCost = features.reduce((acc, feature) => {
      const featureOption = featureOptions.find(opt => opt.id === feature);
      return acc + (featureOption?.cost || 0);
    }, 0);
    baseCost += featureCost;
    baseTime += Math.ceil(features.length / 2);

    setEstimate({
      cost: baseCost,
      timeline: `${baseTime}-${baseTime + 2} weeks`
    });
  };

  useEffect(() => {
    calculateEstimate();
  }, [projectType, pages, features]);

  const nextStep = () => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Calculator className="text-white" size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Project Cost Calculator</h3>
              <p className="text-blue-100 text-sm">Get an instant estimate for your project</p>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      activeStep === step 
                        ? 'bg-white text-blue-600 border-white shadow-lg scale-110' : 
                        activeStep > step 
                          ? 'bg-green-400 border-green-400 text-white' 
                          : 'border-white/50 text-white/70'
                    }`}
                  >
                    {activeStep > step ? <Check size={20} /> : step}
                  </div>
                  {step !== 3 && (
                    <div 
                      className={`w-12 h-1 mx-3 rounded-full transition-all duration-300 ${
                        activeStep > step ? 'bg-green-400' : 'bg-white/30'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">Step {activeStep} of 3</div>
              <div className="text-xs text-blue-200">
                {activeStep === 1 && "Choose your project type"}
                {activeStep === 2 && "Select number of pages"}
                {activeStep === 3 && "Add extra features"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Project Type */}
          {activeStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h4 className="text-2xl font-bold text-gray-800 mb-3">
                  What type of project do you need?
                </h4>
                <p className="text-gray-600">Choose the option that best describes your project</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projectTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    onClick={() => setProjectType(type.id)}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 group ${
                      projectType === type.id
                        ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-md'
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                        projectType === type.id 
                          ? 'bg-blue-500 text-white shadow-lg' 
                          : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                      }`}>
                        <type.icon size={32} />
                      </div>
                      <h5 className="font-bold text-lg text-gray-900 mb-2">{type.label}</h5>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Pages */}
          {activeStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h4 className="text-2xl font-bold text-gray-800 mb-3">
                  How many pages do you need?
                </h4>
                <p className="text-gray-600">More pages mean more content and functionality</p>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-semibold text-gray-800">Number of Pages: {pages}</span>
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      pages === 1 ? 'bg-green-100 text-green-800' : 
                      pages <= 5 ? 'bg-blue-100 text-blue-800' :
                      pages <= 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {pages === 1 ? 'Landing Page' : 
                       pages <= 5 ? 'Small Website' :
                       pages <= 10 ? 'Medium Website' : 'Large Website'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={pages}
                    onChange={(e) => setPages(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>1</span>
                    <span>5</span>
                    <span>10</span>
                    <span>15</span>
                    <span>20</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Features */}
          {activeStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h4 className="text-2xl font-bold text-gray-800 mb-3">
                  Select Additional Features
                </h4>
                <p className="text-gray-600">Choose features that will enhance your project</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featureOptions.map((feature) => (
                  <motion.label
                    key={feature.id}
                    className={`relative flex items-start p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 group ${
                      features.includes(feature.id)
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-md'
                    }`}
                    whileHover={{ y: -2 }}
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
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-semibold text-gray-900">{feature.label}</div>
                        <div className="text-lg font-bold text-blue-600">+${feature.cost}</div>
                      </div>
                      <div className="text-sm text-gray-600">{feature.description}</div>
                    </div>
                    <div className={`absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      features.includes(feature.id)
                        ? 'border-blue-500 bg-blue-500 text-white scale-110'
                        : 'border-gray-300 group-hover:border-blue-400'
                    }`}>
                      {features.includes(feature.id) && <Check size={14} />}
                    </div>
                  </motion.label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
          {activeStep > 1 ? (
            <motion.button
              onClick={prevStep}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors flex items-center"
              whileHover={{ x: -2 }}
            >
              ← Back
            </motion.button>
          ) : <div></div>}
          
          {activeStep < 3 ? (
            <motion.button
              onClick={nextStep}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold flex items-center shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next Step →
            </motion.button>
          ) : (
            <motion.button
              onClick={() => window.location.href = '/cost-estimator'}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 font-bold flex items-center shadow-xl text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="mr-2" size={20} />
              Get Full Quote
              <ArrowRight className="ml-2" size={20} />
            </motion.button>
          )}
        </div>

        {/* Estimate Result */}
        <motion.div 
          className="mt-8 p-8 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 rounded-2xl border border-blue-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Your Project Estimate</h3>
            <p className="text-gray-600">Based on your selections</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="flex items-center space-x-4 bg-white rounded-xl p-6 shadow-sm"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600 font-medium">Estimated Cost</div>
                <div className="text-2xl font-bold text-blue-600">
                  ${estimate.cost.toLocaleString()}
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4 bg-white rounded-xl p-6 shadow-sm"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600 font-medium">Timeline</div>
                <div className="text-2xl font-bold text-purple-600">
                  {estimate.timeline}
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center space-x-4 bg-white rounded-xl p-6 shadow-sm"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-600 font-medium">Features</div>
                <div className="text-2xl font-bold text-green-600">
                  {features.length} Selected
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              * This is an estimate. Final pricing may vary based on specific requirements.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProjectCalculator;