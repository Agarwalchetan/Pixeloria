import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, RotateCcw, Settings, ArrowLeft, Copy, 
  Zap, MousePointer, Eye, Code, Download
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Animation {
  id: string;
  name: string;
  category: string;
  description: string;
  component: React.ComponentType<any>;
  props: Record<string, any>;
  code: string;
}

const AnimationTester: React.FC = () => {
  const [selectedAnimation, setSelectedAnimation] = useState<string>('fadeIn');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [customProps, setCustomProps] = useState<Record<string, any>>({
    duration: 0.5,
    delay: 0,
    scale: 1.1,
    x: 0,
    y: 0,
    rotate: 0
  });

  const animations: Animation[] = [
    {
      id: 'fadeIn',
      name: 'Fade In',
      category: 'Entrance',
      description: 'Simple fade in animation',
      component: ({ children, ...props }) => (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: props.duration, delay: props.delay }}
        >
          {children}
        </motion.div>
      ),
      props: { duration: 0.5, delay: 0 },
      code: `<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>`
    },
    {
      id: 'slideUp',
      name: 'Slide Up',
      category: 'Entrance',
      description: 'Slide up from bottom',
      component: ({ children, ...props }) => (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: props.duration, delay: props.delay }}
        >
          {children}
        </motion.div>
      ),
      props: { duration: 0.6, delay: 0 },
      code: `<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>`
    },
    {
      id: 'scaleIn',
      name: 'Scale In',
      category: 'Entrance',
      description: 'Scale from small to normal',
      component: ({ children, ...props }) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: props.duration, delay: props.delay }}
        >
          {children}
        </motion.div>
      ),
      props: { duration: 0.4, delay: 0 },
      code: `<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.4 }}
>
  Content
</motion.div>`
    },
    {
      id: 'bounce',
      name: 'Bounce',
      category: 'Attention',
      description: 'Bouncy scale animation',
      component: ({ children, ...props }) => (
        <motion.div
          animate={{ scale: [1, props.scale, 1] }}
          transition={{ 
            duration: props.duration, 
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
        >
          {children}
        </motion.div>
      ),
      props: { duration: 0.6, scale: 1.1 },
      code: `<motion.div
  animate={{ scale: [1, 1.1, 1] }}
  transition={{ 
    duration: 0.6, 
    repeat: Infinity, 
    repeatType: "reverse" 
  }}
>
  Content
</motion.div>`
    },
    {
      id: 'rotate',
      name: 'Rotate',
      category: 'Transform',
      description: 'Continuous rotation',
      component: ({ children, ...props }) => (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ 
            duration: props.duration, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {children}
        </motion.div>
      ),
      props: { duration: 2 },
      code: `<motion.div
  animate={{ rotate: 360 }}
  transition={{ 
    duration: 2, 
    repeat: Infinity, 
    ease: "linear" 
  }}
>
  Content
</motion.div>`
    },
    {
      id: 'hover',
      name: 'Hover Effect',
      category: 'Interactive',
      description: 'Scale on hover',
      component: ({ children, ...props }) => (
        <motion.div
          whileHover={{ scale: props.scale }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: props.duration }}
        >
          {children}
        </motion.div>
      ),
      props: { duration: 0.2, scale: 1.05 },
      code: `<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
  Content
</motion.div>`
    },
    {
      id: 'stagger',
      name: 'Stagger Children',
      category: 'Complex',
      description: 'Staggered animation for multiple items',
      component: ({ children, ...props }) => (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: props.delay || 0.1
              }
            }
          }}
        >
          {[1, 2, 3].map((item) => (
            <motion.div
              key={item}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="w-full h-8 bg-blue-500 rounded mb-2"
            />
          ))}
        </motion.div>
      ),
      props: { delay: 0.1 },
      code: `<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }}
>
  {items.map((item) => (
    <motion.div
      key={item}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>`
    }
  ];

  const categories = ['All', ...new Set(animations.map(a => a.category))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredAnimations = selectedCategory === 'All' 
    ? animations 
    : animations.filter(a => a.category === selectedCategory);

  const currentAnimation = animations.find(a => a.id === selectedAnimation);

  const playAnimation = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), (customProps.duration * 1000) + 500);
  };

  const copyCode = () => {
    if (currentAnimation) {
      navigator.clipboard.writeText(currentAnimation.code);
    }
  };

  const exportAnimation = () => {
    if (currentAnimation) {
      const exportData = {
        name: currentAnimation.name,
        code: currentAnimation.code,
        props: customProps
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentAnimation.name.toLowerCase().replace(/\s+/g, '-')}-animation.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
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
                <Zap className="w-6 h-6 text-blue-400" />
                <h1 className="text-xl font-bold text-white">Animation Tester</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCode(!showCode)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  showCode ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Code size={16} className="mr-2" />
                {showCode ? 'Hide Code' : 'Show Code'}
              </button>
              <button
                onClick={exportAnimation}
                className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Download size={16} className="mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Animation Library */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700/50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Animations</h3>
              <div className="space-y-2">
                {filteredAnimations.map((animation) => (
                  <button
                    key={animation.id}
                    onClick={() => setSelectedAnimation(animation.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedAnimation === animation.id
                        ? 'bg-blue-600/20 border border-blue-500'
                        : 'hover:bg-gray-700/50 border border-transparent'
                    }`}
                  >
                    <div className="font-medium text-white">{animation.name}</div>
                    <div className="text-sm text-gray-400">{animation.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Preview Area */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {currentAnimation?.name}
                </h2>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={playAnimation}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Play size={16} className="mr-2" />
                    Play
                  </button>
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <RotateCcw size={16} className="mr-2" />
                    Reset
                  </button>
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-12 min-h-[300px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {currentAnimation && (
                    <currentAnimation.component
                      key={`${selectedAnimation}-${isPlaying}`}
                      {...customProps}
                    >
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Zap className="w-12 h-12 text-white" />
                      </div>
                    </currentAnimation.component>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Settings size={20} className="mr-2" />
                Animation Properties
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration (seconds)
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={customProps.duration}
                    onChange={(e) => setCustomProps(prev => ({ ...prev, duration: parseFloat(e.target.value) }))}
                    className="w-full accent-blue-600"
                  />
                  <div className="text-xs text-gray-400 mt-1">{customProps.duration}s</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Delay (seconds)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={customProps.delay}
                    onChange={(e) => setCustomProps(prev => ({ ...prev, delay: parseFloat(e.target.value) }))}
                    className="w-full accent-blue-600"
                  />
                  <div className="text-xs text-gray-400 mt-1">{customProps.delay}s</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Scale
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={customProps.scale}
                    onChange={(e) => setCustomProps(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                    className="w-full accent-blue-600"
                  />
                  <div className="text-xs text-gray-400 mt-1">{customProps.scale}x</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    X Offset
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={customProps.x}
                    onChange={(e) => setCustomProps(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                    className="w-full accent-blue-600"
                  />
                  <div className="text-xs text-gray-400 mt-1">{customProps.x}px</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Y Offset
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={customProps.y}
                    onChange={(e) => setCustomProps(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                    className="w-full accent-blue-600"
                  />
                  <div className="text-xs text-gray-400 mt-1">{customProps.y}px</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rotation
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={customProps.rotate}
                    onChange={(e) => setCustomProps(prev => ({ ...prev, rotate: parseInt(e.target.value) }))}
                    className="w-full accent-blue-600"
                  />
                  <div className="text-xs text-gray-400 mt-1">{customProps.rotate}°</div>
                </div>
              </div>
            </div>

            {/* Code Display */}
            <AnimatePresence>
              {showCode && currentAnimation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
                >
                  <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white">Code</h3>
                    <button
                      onClick={copyCode}
                      className="flex items-center px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                      <Copy size={16} className="mr-2" />
                      Copy
                    </button>
                  </div>
                  <div className="p-4">
                    <pre className="text-sm text-gray-300 overflow-x-auto">
                      <code>{currentAnimation.code}</code>
                    </pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tips */}
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl p-6 border border-blue-500/20">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Eye size={20} className="mr-2" />
                Animation Tips
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Keep animations under 0.5s for micro-interactions</li>
                <li>• Use easing functions to make animations feel natural</li>
                <li>• Consider reduced motion preferences for accessibility</li>
                <li>• Test animations on different devices and screen sizes</li>
                <li>• Use stagger animations for lists and grids</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationTester;