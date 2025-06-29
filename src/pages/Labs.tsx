import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Beaker, Palette, Zap, Code, Target, Brain, Sparkles, 
  ArrowRight, ExternalLink, Github, Star, TrendingUp,
  Users, Clock, Award, Filter, Search, Grid, List,
  Play, Eye, Download, Share2, Heart, MessageSquare,
  Lightbulb, Cpu, Activity, BarChart3, Layers, Settings,
  BookOpen, Coffee, Rocket, Globe, Shield, MousePointer,
  Wand2, Sliders, Monitor, Smartphone, Tablet, Link2,
  Plus, ChevronRight, ChevronDown, X, Save, Copy,
  GitBranch, Bookmark, Bell, Mail, Send, Mic, Camera,
  Headphones, Gamepad2, Zap as Lightning, Flame, Check
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Experiment {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  icon: React.ComponentType<any>;
  status: 'live' | 'beta' | 'coming-soon';
  featured: boolean;
  stats: {
    views: number;
    likes: number;
    forks: number;
    lastUpdated: string;
  };
  techStack: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  link: string;
  demoUrl?: string;
  sourceUrl?: string;
  preview?: string;
  aiPowered?: boolean;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  buildStory?: string;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  features: string[];
  component: React.ComponentType<any>;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  readTime: string;
  tags: string[];
  relatedExperiments: string[];
  reactions: {
    likes: number;
    comments: number;
  };
}

const Labs: React.FC = () => {
  const [activeSection, setActiveSection] = useState('experiments');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending'>('trending');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [savedExperiments, setSavedExperiments] = useState<string[]>([]);
  const [currentHeadline, setCurrentHeadline] = useState(0);
  const [showLabGPT, setShowLabGPT] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [subscribed, setSubscribed] = useState(false);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const headlines = [
    "Reimagining Design.",
    "Rebuilding the Web.", 
    "Releasing Experiments."
  ];

  const experiments: Experiment[] = [
    {
      id: 'ai-color-generator',
      title: 'AI Color Palette Generator',
      description: 'Generate beautiful, accessible color palettes using AI with real-time preview and collaboration features.',
      category: 'AI',
      tags: ['AI', 'Colors', 'Design', 'Accessibility', 'GPT-4'],
      icon: Palette,
      status: 'live',
      featured: true,
      aiPowered: true,
      stats: {
        views: 25420,
        likes: 1892,
        forks: 356,
        lastUpdated: '2 days ago'
      },
      techStack: ['React', 'TypeScript', 'OpenAI', 'Tailwind', 'Framer Motion'],
      difficulty: 'intermediate',
      estimatedTime: '15 min',
      link: '/labs/color-generator',
      demoUrl: '/labs/color-generator',
      sourceUrl: 'https://github.com/pixeloria/ai-color-generator',
      preview: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
        role: 'AI Engineer'
      },
      buildStory: 'Built using GPT-4 for intelligent color harmony analysis and WCAG accessibility compliance.'
    },
    {
      id: 'animation-composer',
      title: 'Animation Composer Pro',
      description: 'Visual timeline editor for creating complex animations with Framer Motion, GSAP, and CSS keyframes.',
      category: 'Animations',
      tags: ['Animations', 'Timeline', 'Framer Motion', 'GSAP', 'Visual Editor'],
      icon: Zap,
      status: 'live',
      featured: true,
      stats: {
        views: 18750,
        likes: 1243,
        forks: 298,
        lastUpdated: '1 week ago'
      },
      techStack: ['React', 'Framer Motion', 'GSAP', 'Canvas API', 'Web Animations API'],
      difficulty: 'advanced',
      estimatedTime: '30 min',
      link: '/labs/animation-composer',
      demoUrl: '/labs/animation-composer',
      sourceUrl: 'https://github.com/pixeloria/animation-composer',
      author: {
        name: 'Mike Chen',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
        role: 'Motion Designer'
      },
      buildStory: 'Features a custom timeline engine with real-time preview and export to multiple animation libraries.'
    },
    {
      id: 'code-playground-ai',
      title: 'AI-Powered Code Playground',
      description: 'Multi-file code editor with AI assistance, real-time collaboration, and instant preview across devices.',
      category: 'Dev Tools',
      tags: ['Code Editor', 'AI Assistant', 'Collaboration', 'Multi-file', 'GPT-4'],
      icon: Code,
      status: 'beta',
      featured: true,
      aiPowered: true,
      stats: {
        views: 32100,
        likes: 2105,
        forks: 567,
        lastUpdated: '3 days ago'
      },
      techStack: ['React', 'Monaco Editor', 'WebSocket', 'Node.js', 'OpenAI'],
      difficulty: 'advanced',
      estimatedTime: '45 min',
      link: '/labs/code-playground',
      demoUrl: '/labs/code-playground',
      sourceUrl: 'https://github.com/pixeloria/ai-code-playground',
      author: {
        name: 'Emily Rodriguez',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
        role: 'Full Stack Developer'
      },
      buildStory: 'Integrates GPT-4 for code suggestions, debugging help, and automatic documentation generation.'
    },
    {
      id: 'ab-testing-simulator',
      title: 'A/B Testing Simulator',
      description: 'Advanced testing platform with traffic simulation, heatmaps, statistical analysis, and conversion tracking.',
      category: 'Analytics',
      tags: ['A/B Testing', 'Analytics', 'Statistics', 'Heatmaps', 'Conversion'],
      icon: Target,
      status: 'live',
      featured: false,
      stats: {
        views: 14840,
        likes: 967,
        forks: 189,
        lastUpdated: '5 days ago'
      },
      techStack: ['React', 'D3.js', 'Statistics.js', 'Canvas API', 'WebGL'],
      difficulty: 'intermediate',
      estimatedTime: '25 min',
      link: '/labs/ab-testing',
      demoUrl: '/labs/ab-testing',
      sourceUrl: 'https://github.com/pixeloria/ab-testing-simulator',
      author: {
        name: 'David Kim',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
        role: 'Data Scientist'
      },
      buildStory: 'Uses Monte Carlo simulations for realistic traffic patterns and Bayesian statistics for significance testing.'
    },
    {
      id: 'neural-network-viz',
      title: 'Neural Network Visualizer',
      description: 'Interactive 3D visualization of neural networks with real-time training and customizable architectures.',
      category: 'AI',
      tags: ['AI', 'Machine Learning', 'Visualization', 'Neural Networks', '3D'],
      icon: Brain,
      status: 'beta',
      featured: false,
      aiPowered: true,
      stats: {
        views: 12230,
        likes: 845,
        forks: 167,
        lastUpdated: '1 week ago'
      },
      techStack: ['React', 'Three.js', 'TensorFlow.js', 'WebGL', 'D3.js'],
      difficulty: 'advanced',
      estimatedTime: '60 min',
      link: '/labs/neural-network-viz',
      demoUrl: '/labs/neural-network-viz',
      sourceUrl: 'https://github.com/pixeloria/neural-network-viz',
      author: {
        name: 'Alex Thompson',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        role: 'ML Engineer'
      },
      buildStory: 'Built with Three.js for 3D rendering and TensorFlow.js for real neural network computations.'
    },
    {
      id: 'component-store',
      title: 'Component Store',
      description: 'Curated collection of production-ready UI components with live previews and multiple export formats.',
      category: 'UI/UX',
      tags: ['Components', 'UI Library', 'React', 'Tailwind', 'Design System'],
      icon: Layers,
      status: 'live',
      featured: false,
      stats: {
        views: 19500,
        likes: 1234,
        forks: 445,
        lastUpdated: '4 days ago'
      },
      techStack: ['React', 'Storybook', 'Tailwind CSS', 'TypeScript', 'Figma API'],
      difficulty: 'beginner',
      estimatedTime: '10 min',
      link: '/labs/component-store',
      demoUrl: '/labs/component-store',
      sourceUrl: 'https://github.com/pixeloria/component-store',
      author: {
        name: 'Lisa Wang',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
        role: 'Design Systems Lead'
      },
      buildStory: 'Features automated Figma sync and generates React, Vue, and Svelte component variants.'
    }
  ];

  const tools: Tool[] = [
    {
      id: 'color-generator',
      name: 'AI Color Generator',
      description: 'AI-driven palette tool with harmony lock, style presets, accessibility checker',
      icon: Palette,
      category: 'Design',
      features: ['AI-powered palettes', 'WCAG compliance', 'Export to Tailwind/SCSS', 'Harmony analysis'],
      component: () => <div className="p-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl text-white">Color Generator Tool</div>
    },
    {
      id: 'animation-tester',
      name: 'Animation Tester',
      description: 'Micro-interaction composer with timeline editor and presets',
      icon: Zap,
      category: 'Animation',
      features: ['Timeline editor', 'Framer Motion/GSAP/CSS', 'Performance monitoring', 'Export options'],
      component: () => <div className="p-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl text-white">Animation Tester Tool</div>
    },
    {
      id: 'code-playground',
      name: 'Code Playground',
      description: 'Real-time editor with preview, console, and AI assistant',
      icon: Code,
      category: 'Development',
      features: ['Multi-file editor', 'Live preview', 'AI suggestions', 'GitHub integration'],
      component: () => <div className="p-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white">Code Playground Tool</div>
    },
    {
      id: 'ab-testing',
      name: 'A/B Testing Simulator',
      description: 'UI variant simulator with fake traffic and smart analytics',
      icon: Target,
      category: 'Analytics',
      features: ['Traffic simulation', 'Heatmap analysis', 'Statistical significance', 'Conversion tracking'],
      component: () => <div className="p-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl text-white">A/B Testing Tool</div>
    }
  ];

  const blogPosts: BlogPost[] = [
    {
      id: 'webgl-performance',
      title: 'Optimizing WebGL Performance for 60fps Animations',
      excerpt: 'Deep dive into GPU optimization techniques that made our neural network visualizer run smoothly on mobile devices.',
      content: 'Full article content here...',
      author: {
        name: 'Alex Thompson',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        role: 'ML Engineer'
      },
      publishedAt: '2024-01-15',
      readTime: '8 min read',
      tags: ['WebGL', 'Performance', 'Three.js', 'Optimization'],
      relatedExperiments: ['neural-network-viz'],
      reactions: {
        likes: 234,
        comments: 18
      }
    },
    {
      id: 'ai-color-theory',
      title: 'Teaching AI Color Theory: How We Built the Palette Generator',
      excerpt: 'The journey of training GPT-4 to understand color harmony, accessibility, and brand psychology.',
      content: 'Full article content here...',
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
        role: 'AI Engineer'
      },
      publishedAt: '2024-01-10',
      readTime: '12 min read',
      tags: ['AI', 'Color Theory', 'GPT-4', 'Design'],
      relatedExperiments: ['ai-color-generator'],
      reactions: {
        likes: 456,
        comments: 32
      }
    },
    {
      id: 'realtime-collaboration',
      title: 'Building Real-time Collaboration with WebSockets and CRDTs',
      excerpt: 'How we implemented conflict-free collaborative editing in our code playground using operational transforms.',
      content: 'Full article content here...',
      author: {
        name: 'Emily Rodriguez',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
        role: 'Full Stack Developer'
      },
      publishedAt: '2024-01-05',
      readTime: '15 min read',
      tags: ['WebSockets', 'Collaboration', 'CRDTs', 'Real-time'],
      relatedExperiments: ['code-playground-ai'],
      reactions: {
        likes: 189,
        comments: 24
      }
    }
  ];

  const categories = ['All', ...new Set(experiments.map(exp => exp.category))];
  const allTags = [...new Set(experiments.flatMap(exp => exp.tags))];

  const filteredExperiments = experiments.filter(exp => {
    const matchesCategory = selectedCategory === 'All' || exp.category === selectedCategory;
    const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exp.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => exp.tags.includes(tag));
    
    return matchesCategory && matchesSearch && matchesTags;
  });

  const sortedExperiments = [...filteredExperiments].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.stats.likes - a.stats.likes;
      case 'trending':
        return b.stats.views - a.stats.views;
      default:
        return new Date(b.stats.lastUpdated).getTime() - new Date(a.stats.lastUpdated).getTime();
    }
  });

  const featuredExperiments = experiments.filter(exp => exp.featured);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const toggleSaveExperiment = (experimentId: string) => {
    setSavedExperiments(prev => 
      prev.includes(experimentId)
        ? prev.filter(id => id !== experimentId)
        : [...prev, experimentId]
    );
  };

  // Animated headline rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadline((prev) => (prev + 1) % headlines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 overflow-hidden">
      {/* SECTION 1: Immersive Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* WebGL-style Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-pink-900/30"></div>
          
          {/* Particle Grid Animation */}
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
                animate={{
                  x: [0, Math.random() * 200 - 100, 0],
                  y: [0, Math.random() * 200 - 100, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 4 + Math.random() * 4,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
              />
            ))}
          </div>

          {/* Motion-reactive waves */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"
            animate={{
              background: [
                "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))",
                "linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))",
                "linear-gradient(225deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1), rgba(59, 130, 246, 0.1))",
                "linear-gradient(315deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))"
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <motion.div 
          className="container-custom relative z-10"
          style={{ y, opacity }}
        >
          <div className="max-w-6xl">
            {/* Navigation Tabs */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex flex-wrap gap-4">
                {[
                  { id: 'experiments', label: 'Labs', icon: Beaker },
                  { id: 'playground', label: 'Playground', icon: Code },
                  { id: 'build-stories', label: 'Behind the Build', icon: BookOpen },
                  { id: 'radar', label: 'Lab Radar', icon: Target }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id)}
                    className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 ${
                      activeSection === tab.id
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 backdrop-blur-sm'
                    }`}
                  >
                    <tab.icon size={16} className="mr-2" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Dynamic Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <div className="text-6xl md:text-8xl font-bold mb-4">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentHeadline}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                  >
                    {headlines[currentHeadline]}
                  </motion.span>
                </AnimatePresence>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-2xl text-gray-300 max-w-3xl"
              >
                Inventing the Future, One Interaction at a Time.
              </motion.p>
            </motion.div>

            {/* Hero CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-6"
            >
              <motion.button
                onClick={() => setActiveSection('experiments')}
                className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center">
                  <Lightbulb className="mr-2" size={20} />
                  Explore Experiments
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                  initial={{ x: "100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
              
              <motion.button
                onClick={() => setShowLabGPT(true)}
                className="group px-8 py-4 border-2 border-white/20 text-white rounded-full font-bold text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center">
                  <Wand2 className="mr-2" size={20} />
                  Pitch an Idea
                  <Sparkles className="ml-2 group-hover:rotate-12 transition-transform" size={20} />
                </span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: Featured Experiments Carousel */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800/50 to-gray-900/50"></div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              🌟 Featured Experiments
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our most innovative and popular experiments showcasing the latest in web technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {featuredExperiments.map((experiment, index) => (
              <motion.div
                key={experiment.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <motion.div
                  className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10"
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  {/* Preview Image/GIF */}
                  {experiment.preview && (
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={experiment.preview}
                        alt={experiment.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          experiment.status === 'live' ? 'bg-green-500/20 text-green-400' :
                          experiment.status === 'beta' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {experiment.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>

                      {/* AI Badge */}
                      {experiment.aiPowered && (
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 flex items-center">
                            <Brain size={12} className="mr-1" />
                            AI Powered
                          </span>
                        </div>
                      )}

                      {/* Play Button Overlay */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-white ml-1" />
                        </div>
                      </motion.div>
                    </div>
                  )}

                  <div className="p-8">
                    {/* Author */}
                    <div className="flex items-center mb-4">
                      <img
                        src={experiment.author.avatar}
                        alt={experiment.author.name}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-white">{experiment.author.name}</div>
                        <div className="text-xs text-gray-400">{experiment.author.role}</div>
                      </div>
                    </div>

                    {/* Title and Description */}
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-3">
                      {experiment.title}
                    </h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">
                      {experiment.description}
                    </p>

                    {/* Build Story */}
                    {experiment.buildStory && (
                      <div className="mb-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <p className="text-sm text-blue-300">{experiment.buildStory}</p>
                      </div>
                    )}

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {experiment.techStack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400"
                        >
                          {tech}
                        </span>
                      ))}
                      {experiment.techStack.length > 3 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                          +{experiment.techStack.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-6 text-sm text-gray-400">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Eye size={14} className="mr-1" />
                          {experiment.stats.views.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Heart size={14} className="mr-1" />
                          {experiment.stats.likes}
                        </span>
                        <span className="flex items-center">
                          <GitBranch size={14} className="mr-1" />
                          {experiment.stats.forks}
                        </span>
                      </div>
                      <span>{experiment.stats.lastUpdated}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                      <Link
                        to={experiment.link}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-center flex items-center justify-center group/btn"
                      >
                        <Play size={16} className="mr-2" />
                        Try Live
                        <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                      
                      <button
                        onClick={() => toggleSaveExperiment(experiment.id)}
                        className={`p-3 rounded-lg transition-colors ${
                          savedExperiments.includes(experiment.id)
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                      >
                        <Heart size={16} />
                      </button>
                      
                      {experiment.sourceUrl && (
                        <a
                          href={experiment.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          <Github size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Dynamic Experiments Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-800/50 to-gray-900/50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                All Experiments
              </h2>
              <p className="text-gray-400 mt-2">Discover, fork, and build upon our latest innovations</p>
            </motion.div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search experiments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filters */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  showFilters ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Filter size={16} className="mr-2" />
                Filters
              </button>

              {/* View Mode */}
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Categories */}
                  <div>
                    <h4 className="font-semibold text-white mb-3">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            selectedCategory === category
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h4 className="font-semibold text-white mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {allTags.slice(0, 12).map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            selectedTags.includes(tag)
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <h4 className="font-semibold text-white mb-3">Sort By</h4>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="trending">Trending</option>
                      <option value="newest">Newest</option>
                      <option value="popular">Most Popular</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Experiments Grid/List */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
            {sortedExperiments.map((experiment, index) => (
              <motion.div
                key={experiment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={viewMode === 'list' ? 'flex bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden hover:border-blue-500/50 transition-all duration-300' : ''}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden hover:border-blue-500/50 transition-all duration-300 group">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <experiment.icon className="w-8 h-8 text-blue-400 mr-3" />
                          <div>
                            <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                              {experiment.title}
                            </h3>
                            <span className="text-xs text-gray-400">{experiment.category}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {experiment.aiPowered && (
                            <Brain size={16} className="text-purple-400" />
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            experiment.status === 'live' ? 'bg-green-500/20 text-green-400' :
                            experiment.status === 'beta' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {experiment.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {experiment.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {experiment.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-xs text-gray-400">
                          <span className="flex items-center">
                            <Heart size={12} className="mr-1" />
                            {experiment.stats.likes}
                          </span>
                          <span className="flex items-center">
                            <Eye size={12} className="mr-1" />
                            {experiment.stats.views.toLocaleString()}
                          </span>
                        </div>
                        <Link
                          to={experiment.link}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center"
                        >
                          Try It
                          <ArrowRight size={14} className="ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  // List View
                  <>
                    <div className="flex-1 p-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <experiment.icon className="w-6 h-6 text-blue-400 mr-3" />
                          <h3 className="font-semibold text-white">{experiment.title}</h3>
                          {experiment.aiPowered && (
                            <span className="ml-2 px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                              AI
                            </span>
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          experiment.status === 'live' ? 'bg-green-500/20 text-green-400' :
                          experiment.status === 'beta' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {experiment.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-3">{experiment.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {experiment.tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-3 text-xs text-gray-400">
                            <span className="flex items-center">
                              <Heart size={12} className="mr-1" />
                              {experiment.stats.likes}
                            </span>
                            <span className="flex items-center">
                              <Eye size={12} className="mr-1" />
                              {experiment.stats.views.toLocaleString()}
                            </span>
                          </div>
                          
                          <Link
                            to={experiment.link}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
                          >
                            <Play size={14} className="mr-1" />
                            Try It
                          </Link>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>

          {sortedExperiments.length === 0 && (
            <div className="text-center py-12">
              <Beaker className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No experiments found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4: Test Zone - Interactive Playground */}
      <section className="py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              🧪 Test Zone: Interactive Playground
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Live tools with full dev sandbox experience. Build, test, and export your creations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <motion.div
                  className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-3 mr-4">
                        <tool.icon className="w-full h-full text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                          {tool.name}
                        </h3>
                        <span className="text-sm text-gray-400">{tool.category}</span>
                      </div>
                    </div>

                    <p className="text-gray-400 mb-6">{tool.description}</p>

                    <div className="space-y-2 mb-6">
                      {tool.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-gray-300">
                          <Check className="w-4 h-4 text-green-400 mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <div className="aspect-video mb-6 rounded-lg overflow-hidden">
                      <tool.component />
                    </div>

                    <div className="flex space-x-3">
                      <Link
                        to={`/labs/${tool.id}`}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-center flex items-center justify-center"
                      >
                        <Play size={16} className="mr-2" />
                        Launch Tool
                      </Link>
                      <button className="p-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                        <Bookmark size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: Behind the Build - Tech Blog */}
      <section className="py-20 bg-gradient-to-b from-gray-800/50 to-gray-900/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              📖 Behind the Build
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Real-world dev stories, performance techniques, and the technology behind our experiments
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <motion.div
                  className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                  whileHover={{ y: -5 }}
                >
                  <div className="p-8">
                    {/* Author */}
                    <div className="flex items-center mb-4">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-white">{post.author.name}</div>
                        <div className="text-xs text-gray-400">{post.author.role}</div>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-3">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <span>{post.readTime}</span>
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </div>

                    {/* Reactions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center">
                          <Heart size={14} className="mr-1" />
                          {post.reactions.likes}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare size={14} className="mr-1" />
                          {post.reactions.comments}
                        </span>
                      </div>
                      <button className="text-blue-400 hover:text-blue-300 font-medium flex items-center">
                        Read More
                        <ArrowRight size={14} className="ml-1" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: Collaborate With Us */}
      <section className="py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              🤝 Collaborate With Us
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Join our community of innovators and help us build the future of web development
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Pitch Your Idea */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Lightbulb className="mr-3 text-yellow-400" />
                Pitch Your Idea
              </h3>
              
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Experiment Title
                  </label>
                  <input
                    type="text"
                    placeholder="AI-powered design tool..."
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe your experiment idea..."
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tech Stack
                  </label>
                  <input
                    type="text"
                    placeholder="React, AI, WebGL..."
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold flex items-center justify-center"
                >
                  <Send className="mr-2" size={20} />
                  Submit Idea
                </button>
              </form>
            </motion.div>

            {/* Community & GitHub */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* GitHub Projects */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Github className="mr-3 text-white" />
                  Open Source Projects
                </h3>
                <div className="space-y-4">
                  {[
                    { name: 'ai-color-generator', stars: 1200, language: 'TypeScript' },
                    { name: 'animation-composer', stars: 890, language: 'JavaScript' },
                    { name: 'neural-network-viz', stars: 567, language: 'TypeScript' }
                  ].map((repo, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div>
                        <div className="font-medium text-white">{repo.name}</div>
                        <div className="text-sm text-gray-400">{repo.language}</div>
                      </div>
                      <div className="flex items-center text-yellow-400">
                        <Star size={14} className="mr-1" />
                        {repo.stars}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">
                  View All Repositories
                </button>
              </div>

              {/* Contributors Wall */}
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Users className="mr-3 text-blue-400" />
                  Contributors Wall
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { name: 'Sarah', role: 'AI', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400' },
                    { name: 'Mike', role: 'Design', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400' },
                    { name: 'Emily', role: 'Code', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400' },
                    { name: 'David', role: 'UX', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400' }
                  ].map((contributor, index) => (
                    <div key={index} className="text-center">
                      <img
                        src={contributor.avatar}
                        alt={contributor.name}
                        className="w-12 h-12 rounded-full mx-auto mb-2"
                      />
                      <div className="text-xs text-white font-medium">{contributor.name}</div>
                      <div className="text-xs text-gray-400">{contributor.role}</div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Join Community
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 7: Labs Drop Subscription */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        
        {/* Animated Background */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3 + i * 0.2,
                repeat: Infinity,
                delay: i * 0.1
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              📩 Get the Latest Lab Drops
            </h2>
            
            <p className="text-xl text-gray-300 mb-8">
              Get monthly exclusive experiments, dev insights & early access to new tools.
            </p>

            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <motion.button
                  onClick={() => setSubscribed(true)}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mail className="mr-2" size={20} />
                  Subscribe
                </motion.button>
              </div>
              
              {subscribed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-green-400 flex items-center justify-center"
                >
                  <Check className="mr-2" size={16} />
                  🎉 You've been added to our next Lab Drop!
                </motion.div>
              )}
            </div>

            <div className="text-sm text-gray-400">
              <strong>Bonus download for subscribers:</strong> "Top 10 Pixeloria Experiments PDF"
            </div>
          </motion.div>
        </div>
      </section>

      {/* LabGPT Modal */}
      <AnimatePresence>
        {showLabGPT && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLabGPT(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 p-3">
                      <Brain className="w-full h-full text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">LabGPT Assistant</h3>
                      <p className="text-gray-400">AI-powered experiment builder</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowLabGPT(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Describe your experiment idea
                    </label>
                    <textarea
                      rows={4}
                      placeholder="I want to create a tool that generates color palettes using AI..."
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Category
                      </label>
                      <select className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option>AI Tools</option>
                        <option>Design Tools</option>
                        <option>Dev Tools</option>
                        <option>Analytics</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Complexity
                      </label>
                      <select className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                    <h4 className="font-semibold text-purple-300 mb-2">AI Suggestions:</h4>
                    <ul className="space-y-1 text-sm text-purple-200">
                      <li>• Consider adding accessibility features</li>
                      <li>• Include export functionality</li>
                      <li>• Add real-time preview</li>
                      <li>• Implement sharing capabilities</li>
                    </ul>
                  </div>

                  <div className="flex space-x-4">
                    <button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold">
                      Generate Experiment
                    </button>
                    <button className="px-6 py-3 border border-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                      Save Draft
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Labs;