import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, RotateCcw, Settings, ArrowLeft, Copy, 
  Zap, MousePointer, Eye, Code, Download, Save,
  Layers, Grid, Monitor, Smartphone, Tablet, Clock,
  BarChart3, Cpu, Activity, AlertTriangle, CheckCircle,
  Share2, Users, Link2, FileText, Sliders, Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Animation {
  id: string;
  name: string;
  category: string;
  description: string;
  component: React.ComponentType<any>;
  props: Record<string, any>;
  code: {
    framerMotion: string;
    gsap: string;
    css: string;
    reactSpring: string;
  };
  performance: {
    fps: number;
    memory: number;
    layoutShift: boolean;
  };
  accessibility: {
    respectsReducedMotion: boolean;
    duration: number;
    flashRisk: boolean;
  };
}

interface ComponentBase {
  id: string;
  name: string;
  component: React.ComponentType<any>;
  states: string[];
}

const AnimationTester: React.FC = () => {
  const [selectedAnimation, setSelectedAnimation] = useState<string>('fadeIn');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [selectedCodeFormat, setSelectedCodeFormat] = useState<'framerMotion' | 'gsap' | 'css' | 'reactSpring'>('framerMotion');
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedComponent, setSelectedComponent] = useState<string>('card');
  const [selectedState, setSelectedState] = useState<string>('hover');
  const [showPerformance, setShowPerformance] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [collaborationMode, setCollaborationMode] = useState(false);
  const [customProps, setCustomProps] = useState<Record<string, any>>({
    duration: 0.5,
    delay: 0,
    scale: 1.1,
    x: 0,
    y: 0,
    rotate: 0,
    stiffness: 300,
    damping: 30
  });

  const performanceRef = useRef<{ fps: number; memory: number }>({ fps: 60, memory: 0 });

  const componentBases: ComponentBase[] = [
    {
      id: 'card',
      name: 'Card',
      component: ({ children, ...props }) => (
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm">
          <h3 className="text-lg font-bold mb-2">Sample Card</h3>
          <p className="text-gray-600">This is a sample card component for testing animations.</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Action
          </button>
        </div>
      ),
      states: ['hover', 'tap', 'load', 'exit']
    },
    {
      id: 'button',
      name: 'Button',
      component: ({ children, ...props }) => (
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg">
          Click Me
        </button>
      ),
      states: ['hover', 'tap', 'focus', 'disabled']
    },
    {
      id: 'modal',
      name: 'Modal',
      component: ({ children, ...props }) => (
        <div className="bg-white rounded-xl p-8 shadow-2xl max-w-md">
          <h2 className="text-xl font-bold mb-4">Modal Title</h2>
          <p className="text-gray-600 mb-6">This is a modal dialog for testing entrance and exit animations.</p>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">Confirm</button>
            <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded">Cancel</button>
          </div>
        </div>
      ),
      states: ['enter', 'exit', 'backdrop']
    },
    {
      id: 'list',
      name: 'List Item',
      component: ({ children, ...props }) => (
        <div className="space-y-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center p-3 bg-white rounded-lg shadow">
              <div className="w-10 h-10 bg-blue-600 rounded-full mr-3"></div>
              <div>
                <div className="font-medium">List Item {item}</div>
                <div className="text-sm text-gray-500">Description text</div>
              </div>
            </div>
          ))}
        </div>
      ),
      states: ['stagger', 'hover', 'load']
    },
    {
      id: 'tooltip',
      name: 'Tooltip',
      component: ({ children, ...props }) => (
        <div className="relative inline-block">
          <button className="px-4 py-2 bg-gray-200 rounded">Hover me</button>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded shadow-lg">
            Tooltip content
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </div>
      ),
      states: ['show', 'hide', 'position']
    }
  ];

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
      code: {
        framerMotion: `<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  {children}
</motion.div>`,
        gsap: `gsap.fromTo(element, 
  { opacity: 0 }, 
  { opacity: 1, duration: 0.5 }
);`,
        css: `@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}`,
        reactSpring: `const styles = useSpring({
  from: { opacity: 0 },
  to: { opacity: 1 },
  config: { duration: 500 }
});`
      },
      performance: { fps: 60, memory: 2, layoutShift: false },
      accessibility: { respectsReducedMotion: true, duration: 0.5, flashRisk: false }
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
          transition={{ 
            duration: props.duration, 
            delay: props.delay,
            type: "spring",
            stiffness: props.stiffness,
            damping: props.damping
          }}
        >
          {children}
        </motion.div>
      ),
      props: { duration: 0.6, delay: 0, stiffness: 300, damping: 30 },
      code: {
        framerMotion: `<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ 
    duration: 0.6,
    type: "spring",
    stiffness: 300,
    damping: 30
  }}
>
  {children}
</motion.div>`,
        gsap: `gsap.fromTo(element, 
  { opacity: 0, y: 50 }, 
  { 
    opacity: 1, 
    y: 0, 
    duration: 0.6,
    ease: "back.out(1.7)"
  }
);`,
        css: `@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(50px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.slide-up {
  animation: slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}`,
        reactSpring: `const styles = useSpring({
  from: { opacity: 0, transform: 'translateY(50px)' },
  to: { opacity: 1, transform: 'translateY(0px)' },
  config: { tension: 300, friction: 30 }
});`
      },
      performance: { fps: 58, memory: 3, layoutShift: false },
      accessibility: { respectsReducedMotion: true, duration: 0.6, flashRisk: false }
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
      code: {
        framerMotion: `<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.4 }}
>
  {children}
</motion.div>`,
        gsap: `gsap.fromTo(element, 
  { opacity: 0, scale: 0.8 }, 
  { opacity: 1, scale: 1, duration: 0.4 }
);`,
        css: `@keyframes scaleIn {
  from { 
    opacity: 0; 
    transform: scale(0.8); 
  }
  to { 
    opacity: 1; 
    transform: scale(1); 
  }
}

.scale-in {
  animation: scaleIn 0.4s ease-out;
}`,
        reactSpring: `const styles = useSpring({
  from: { opacity: 0, transform: 'scale(0.8)' },
  to: { opacity: 1, transform: 'scale(1)' },
  config: { duration: 400 }
});`
      },
      performance: { fps: 60, memory: 2, layoutShift: false },
      accessibility: { respectsReducedMotion: true, duration: 0.4, flashRisk: false }
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
      code: {
        framerMotion: `<motion.div
  animate={{ scale: [1, 1.1, 1] }}
  transition={{ 
    duration: 0.6, 
    repeat: Infinity, 
    repeatType: "reverse" 
  }}
>
  {children}
</motion.div>`,
        gsap: `gsap.to(element, {
  scale: 1.1,
  duration: 0.6,
  yoyo: true,
  repeat: -1,
  ease: "power2.inOut"
});`,
        css: `@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.bounce {
  animation: bounce 0.6s ease-in-out infinite alternate;
}`,
        reactSpring: `const styles = useSpring({
  from: { transform: 'scale(1)' },
  to: async (next) => {
    while (true) {
      await next({ transform: 'scale(1.1)' });
      await next({ transform: 'scale(1)' });
    }
  },
  config: { duration: 600 }
});`
      },
      performance: { fps: 55, memory: 4, layoutShift: false },
      accessibility: { respectsReducedMotion: false, duration: 0.6, flashRisk: false }
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
      code: {
        framerMotion: `<motion.div
  animate={{ rotate: 360 }}
  transition={{ 
    duration: 2, 
    repeat: Infinity, 
    ease: "linear" 
  }}
>
  {children}
</motion.div>`,
        gsap: `gsap.to(element, {
  rotation: 360,
  duration: 2,
  repeat: -1,
  ease: "none"
});`,
        css: `@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.rotate {
  animation: rotate 2s linear infinite;
}`,
        reactSpring: `const styles = useSpring({
  from: { transform: 'rotate(0deg)' },
  to: async (next) => {
    while (true) {
      await next({ transform: 'rotate(360deg)' });
    }
  },
  config: { duration: 2000 }
});`
      },
      performance: { fps: 60, memory: 3, layoutShift: false },
      accessibility: { respectsReducedMotion: false, duration: 2, flashRisk: false }
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
      code: {
        framerMotion: `<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
  {children}
</motion.div>`,
        gsap: `element.addEventListener('mouseenter', () => {
  gsap.to(element, { scale: 1.05, duration: 0.2 });
});

element.addEventListener('mouseleave', () => {
  gsap.to(element, { scale: 1, duration: 0.2 });
});`,
        css: `.hover-effect {
  transition: transform 0.2s ease;
}

.hover-effect:hover {
  transform: scale(1.05);
}

.hover-effect:active {
  transform: scale(0.95);
}`,
        reactSpring: `const [hovered, setHovered] = useState(false);

const styles = useSpring({
  transform: hovered ? 'scale(1.05)' : 'scale(1)',
  config: { duration: 200 }
});`
      },
      performance: { fps: 60, memory: 2, layoutShift: false },
      accessibility: { respectsReducedMotion: true, duration: 0.2, flashRisk: false }
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
      code: {
        framerMotion: `<motion.div
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
</motion.div>`,
        gsap: `gsap.fromTo('.stagger-item', 
  { opacity: 0, y: 20 }, 
  { 
    opacity: 1, 
    y: 0, 
    duration: 0.5,
    stagger: 0.1
  }
);`,
        css: `.stagger-item {
  opacity: 0;
  transform: translateY(20px);
  animation: staggerIn 0.5s ease-out forwards;
}

.stagger-item:nth-child(1) { animation-delay: 0s; }
.stagger-item:nth-child(2) { animation-delay: 0.1s; }
.stagger-item:nth-child(3) { animation-delay: 0.2s; }

@keyframes staggerIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}`,
        reactSpring: `const trail = useTrail(items.length, {
  from: { opacity: 0, transform: 'translateY(20px)' },
  to: { opacity: 1, transform: 'translateY(0px)' },
  config: { duration: 500 }
});`
      },
      performance: { fps: 58, memory: 5, layoutShift: false },
      accessibility: { respectsReducedMotion: true, duration: 0.5, flashRisk: false }
    }
  ];

  const categories = ['All', ...new Set(animations.map(a => a.category))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredAnimations = selectedCategory === 'All' 
    ? animations 
    : animations.filter(a => a.category === selectedCategory);

  const currentAnimation = animations.find(a => a.id === selectedAnimation);
  const currentComponent = componentBases.find(c => c.id === selectedComponent);

  const playAnimation = () => {
    setIsPlaying(true);
    // Simulate performance monitoring
    performanceRef.current = { fps: 60 - Math.random() * 5, memory: Math.random() * 10 };
    setTimeout(() => setIsPlaying(false), (customProps.duration * 1000) + 500);
  };

  const copyCode = () => {
    if (currentAnimation) {
      navigator.clipboard.writeText(currentAnimation.code[selectedCodeFormat]);
    }
  };

  const exportAnimation = () => {
    if (currentAnimation) {
      const exportData = {
        name: currentAnimation.name,
        component: selectedComponent,
        state: selectedState,
        code: currentAnimation.code,
        props: customProps,
        performance: currentAnimation.performance,
        accessibility: currentAnimation.accessibility
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

  const exportToCodeSandbox = () => {
    if (currentAnimation) {
      const files = {
        'package.json': {
          content: JSON.stringify({
            dependencies: {
              'react': '^18.0.0',
              'react-dom': '^18.0.0',
              'framer-motion': '^10.0.0'
            }
          }, null, 2)
        },
        'src/App.js': {
          content: `import React from 'react';
import { motion } from 'framer-motion';

export default function App() {
  return (
    <div style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      ${currentAnimation.code.framerMotion}
    </div>
  );
}`
        }
      };

      // This would normally open CodeSandbox with the files
      console.log('Export to CodeSandbox:', files);
    }
  };

  // Performance monitoring simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        performanceRef.current.fps = 60 - Math.random() * 10;
        performanceRef.current.memory += Math.random() * 2;
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

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
                <Zap className="w-6 h-6 text-blue-400" />
                <h1 className="text-xl font-bold text-white">Animation Tester Pro</h1>
                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">BETA</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCollaborationMode(!collaborationMode)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  collaborationMode ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Users size={16} className="mr-2" />
                {collaborationMode ? 'Live' : 'Solo'}
              </button>
              <button
                onClick={() => setShowPerformance(!showPerformance)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  showPerformance ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Activity size={16} className="mr-2" />
                Performance
              </button>
              <button
                onClick={() => setShowAccessibility(!showAccessibility)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  showAccessibility ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Target size={16} className="mr-2" />
                A11y
              </button>
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
          {/* Enhanced Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Component Builder */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Layers size={20} className="mr-2 text-blue-400" />
                Component Builder
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Base Component</label>
                  <select
                    value={selectedComponent}
                    onChange={(e) => setSelectedComponent(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {componentBases.map((component) => (
                      <option key={component.id} value={component.id}>
                        {component.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {currentComponent?.states.map((state) => (
                      <option key={state} value={state}>
                        {state.charAt(0).toUpperCase() + state.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Animation Categories */}
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

            {/* Animation Library */}
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
                    <div className="flex items-center mt-2 space-x-2">
                      <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">
                        {animation.category}
                      </span>
                      {animation.accessibility.respectsReducedMotion && (
                        <CheckCircle size={12} className="text-green-400" />
                      )}
                    </div>
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
                  {currentAnimation?.name} - {currentComponent?.name}
                </h2>
                <div className="flex items-center space-x-3">
                  {/* Device Toggle */}
                  <div className="flex bg-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => setActiveDevice('desktop')}
                      className={`p-2 rounded ${activeDevice === 'desktop' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                    >
                      <Monitor size={16} />
                    </button>
                    <button
                      onClick={() => setActiveDevice('tablet')}
                      className={`p-2 rounded ${activeDevice === 'tablet' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                    >
                      <Tablet size={16} />
                    </button>
                    <button
                      onClick={() => setActiveDevice('mobile')}
                      className={`p-2 rounded ${activeDevice === 'mobile' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                    >
                      <Smartphone size={16} />
                    </button>
                  </div>

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

              <div className={`bg-gray-900/50 rounded-xl p-12 min-h-[400px] flex items-center justify-center transition-all duration-300 ${
                activeDevice === 'mobile' ? 'max-w-sm mx-auto' :
                activeDevice === 'tablet' ? 'max-w-md mx-auto' : 'max-w-full'
              }`}>
                <AnimatePresence mode="wait">
                  {currentAnimation && currentComponent && (
                    <currentAnimation.component
                      key={`${selectedAnimation}-${selectedComponent}-${isPlaying}`}
                      {...customProps}
                    >
                      <currentComponent.component />
                    </currentAnimation.component>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Performance Monitor */}
            <AnimatePresence>
              {showPerformance && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Activity size={20} className="mr-2 text-green-400" />
                      Performance Monitor
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400">FPS</span>
                          <Cpu size={16} className="text-blue-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {Math.round(performanceRef.current.fps)}
                        </div>
                        <div className="text-sm text-gray-400">
                          {performanceRef.current.fps >= 55 ? 'Excellent' : 'Needs optimization'}
                        </div>
                      </div>

                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400">Memory</span>
                          <BarChart3 size={16} className="text-purple-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {Math.round(performanceRef.current.memory)}MB
                        </div>
                        <div className="text-sm text-gray-400">
                          {performanceRef.current.memory < 5 ? 'Low usage' : 'High usage'}
                        </div>
                      </div>

                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400">Layout Shift</span>
                          <AlertTriangle size={16} className="text-yellow-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {currentAnimation?.performance.layoutShift ? 'Yes' : 'No'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {currentAnimation?.performance.layoutShift ? 'May cause CLS' : 'Safe'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold text-white mb-3">Recommendations</h4>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li className="flex items-center">
                          <CheckCircle size={14} className="mr-2 text-green-400" />
                          Use transform and opacity for best performance
                        </li>
                        <li className="flex items-center">
                          <CheckCircle size={14} className="mr-2 text-green-400" />
                          Avoid animating layout properties
                        </li>
                        <li className="flex items-center">
                          <AlertTriangle size={14} className="mr-2 text-yellow-400" />
                          Consider will-change CSS property for complex animations
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Accessibility Panel */}
            <AnimatePresence>
              {showAccessibility && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Target size={20} className="mr-2 text-purple-400" />
                      Accessibility Audit
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400">Reduced Motion</span>
                          {currentAnimation?.accessibility.respectsReducedMotion ? (
                            <CheckCircle size={16} className="text-green-400" />
                          ) : (
                            <AlertTriangle size={16} className="text-red-400" />
                          )}
                        </div>
                        <div className="text-lg font-bold text-white">
                          {currentAnimation?.accessibility.respectsReducedMotion ? 'Supported' : 'Not Supported'}
                        </div>
                      </div>

                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400">Duration</span>
                          <Clock size={16} className="text-blue-400" />
                        </div>
                        <div className="text-lg font-bold text-white">
                          {currentAnimation?.accessibility.duration}s
                        </div>
                        <div className="text-sm text-gray-400">
                          {(currentAnimation?.accessibility.duration || 0) <= 0.5 ? 'Good' : 'Consider shorter'}
                        </div>
                      </div>

                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400">Flash Risk</span>
                          {currentAnimation?.accessibility.flashRisk ? (
                            <AlertTriangle size={16} className="text-red-400" />
                          ) : (
                            <CheckCircle size={16} className="text-green-400" />
                          )}
                        </div>
                        <div className="text-lg font-bold text-white">
                          {currentAnimation?.accessibility.flashRisk ? 'High' : 'Low'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold text-white mb-3">Guidelines</h4>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li className="flex items-center">
                          <CheckCircle size={14} className="mr-2 text-green-400" />
                          Respect prefers-reduced-motion setting
                        </li>
                        <li className="flex items-center">
                          <CheckCircle size={14} className="mr-2 text-green-400" />
                          Keep animations under 0.5s for micro-interactions
                        </li>
                        <li className="flex items-center">
                          <AlertTriangle size={14} className="mr-2 text-yellow-400" />
                          Avoid flashing more than 3 times per second
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Animation Properties */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Sliders size={20} className="mr-2" />
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
                    Stiffness (Spring)
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="500"
                    value={customProps.stiffness}
                    onChange={(e) => setCustomProps(prev => ({ ...prev, stiffness: parseInt(e.target.value) }))}
                    className="w-full accent-blue-600"
                  />
                  <div className="text-xs text-gray-400 mt-1">{customProps.stiffness}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Damping (Spring)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={customProps.damping}
                    onChange={(e) => setCustomProps(prev => ({ ...prev, damping: parseInt(e.target.value) }))}
                    className="w-full accent-blue-600"
                  />
                  <div className="text-xs text-gray-400 mt-1">{customProps.damping}</div>
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
                    <div className="flex items-center space-x-4">
                      <h3 className="text-lg font-semibold text-white">Code</h3>
                      <div className="flex space-x-2">
                        {(['framerMotion', 'gsap', 'css', 'reactSpring'] as const).map((format) => (
                          <button
                            key={format}
                            onClick={() => setSelectedCodeFormat(format)}
                            className={`px-3 py-1 rounded text-sm transition-colors ${
                              selectedCodeFormat === format
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {format === 'framerMotion' ? 'Framer Motion' :
                             format === 'gsap' ? 'GSAP' :
                             format === 'css' ? 'CSS' : 'React Spring'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={copyCode}
                        className="flex items-center px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                      >
                        <Copy size={16} className="mr-2" />
                        Copy
                      </button>
                      <button
                        onClick={exportToCodeSandbox}
                        className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        <ExternalLink size={16} className="mr-2" />
                        CodeSandbox
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <pre className="text-sm text-gray-300 overflow-x-auto">
                      <code>{currentAnimation.code[selectedCodeFormat]}</code>
                    </pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Collaboration Panel */}
        <AnimatePresence>
          {collaborationMode && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 right-4 bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-xl max-w-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white">Live Collaboration</h4>
                <button
                  onClick={() => setCollaborationMode(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">3 users online</span>
                </div>
                
                <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Link2 size={16} className="mr-2" />
                  Share Session
                </button>
                
                <div className="text-xs text-gray-400">
                  Collaborate on animations in real-time
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnimationTester;