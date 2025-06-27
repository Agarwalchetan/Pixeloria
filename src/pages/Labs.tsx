import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Beaker, Github, ExternalLink, Play, Code, Palette, Cpu, Brain, 
  Wrench, Globe, Star, Filter, ArrowRight, Zap, Eye, Heart,
  Calendar, User, Tag, Coffee, Lightbulb, Rocket, Target, Grid,
  List, Search, ChevronDown, Copy, Download, Share2, BookOpen,
  Users, GitBranch, Mail, Bell, Sparkles, MousePointer, Terminal,
  Layers, Database, BarChart, Smartphone, Settings, Award, TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Experiment {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  preview: string;
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  author: string;
  date: string;
  status: 'live' | 'beta' | 'concept';
  likes: number;
  stats?: {
    aiUsed?: boolean;
    gptBuilt?: boolean;
    testsRun?: number;
    contributors?: number;
  };
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  author: string;
  tags: string[];
  relatedExperiment?: number;
}

const Labs: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredExperiments, setFilteredExperiments] = useState<Experiment[]>([]);
  const [isFilterSticky, setIsFilterSticky] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activePlaygroundTool, setActivePlaygroundTool] = useState('color-generator');

  const experiments: Experiment[] = [
    {
      id: 1,
      title: "AI-Powered Color Palette Generator",
      description: "Generate beautiful color schemes using machine learning algorithms trained on award-winning designs.",
      category: "AI",
      tags: ["Machine Learning", "Design", "Colors", "API", "React"],
      preview: "https://images.pexels.com/photos/1509428/pexels-photo-1509428.jpeg?auto=compress&cs=tinysrgb&w=800",
      demoUrl: "/labs/color-generator",
      githubUrl: "#",
      featured: true,
      author: "Sarah Johnson",
      date: "2024-03-15",
      status: "live",
      likes: 234,
      stats: {
        aiUsed: true,
        gptBuilt: true,
        testsRun: 1250,
        contributors: 8
      }
    },
    {
      id: 2,
      title: "Micro-Interaction Library",
      description: "A collection of delightful micro-interactions built with Framer Motion and CSS animations.",
      category: "UI/UX",
      tags: ["Animations", "React", "Framer Motion", "Components", "GSAP"],
      preview: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800",
      demoUrl: "/labs/animation-tester",
      githubUrl: "#",
      featured: true,
      author: "Mike Chen",
      date: "2024-03-10",
      status: "live",
      likes: 189,
      stats: {
        testsRun: 890,
        contributors: 12
      }
    },
    {
      id: 3,
      title: "Real-time Code Playground",
      description: "Interactive code editor with live preview for HTML, CSS, and JavaScript experimentation.",
      category: "Dev Tools",
      tags: ["Code Editor", "Live Preview", "HTML", "CSS", "JavaScript", "CodeMirror"],
      preview: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800",
      demoUrl: "/labs/code-playground",
      githubUrl: "#",
      author: "Alex Rodriguez",
      date: "2024-03-05",
      status: "live",
      likes: 156,
      stats: {
        testsRun: 2340,
        contributors: 6
      }
    },
    {
      id: 4,
      title: "A/B Testing Laboratory",
      description: "Interactive A/B testing tool for comparing different UI variations and measuring performance.",
      category: "Analytics",
      tags: ["A/B Testing", "Analytics", "Conversion", "UI Testing", "React"],
      preview: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800",
      demoUrl: "/labs/ab-testing",
      githubUrl: "#",
      author: "Emily Davis",
      date: "2024-02-28",
      status: "live",
      likes: 298,
      stats: {
        testsRun: 567,
        contributors: 4
      }
    },
    {
      id: 5,
      title: "Voice-Controlled UI",
      description: "Experimental interface that responds to voice commands using Web Speech API.",
      category: "AI",
      tags: ["Voice Recognition", "Web Speech API", "Accessibility", "AI"],
      preview: "https://images.pexels.com/photos/3861458/pexels-photo-3861458.jpeg?auto=compress&cs=tinysrgb&w=800",
      demoUrl: "#",
      githubUrl: "#",
      author: "David Kim",
      date: "2024-02-20",
      status: "concept",
      likes: 87,
      stats: {
        aiUsed: true,
        contributors: 3
      }
    },
    {
      id: 6,
      title: "CSS Grid Layout Generator",
      description: "Visual tool for creating complex CSS Grid layouts with drag-and-drop interface.",
      category: "Dev Tools",
      tags: ["CSS Grid", "Layout", "Visual Editor", "Code Generation"],
      preview: "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=800",
      demoUrl: "#",
      githubUrl: "#",
      author: "Lisa Wang",
      date: "2024-02-15",
      status: "live",
      likes: 167,
      stats: {
        testsRun: 445,
        contributors: 7
      }
    },
    {
      id: 7,
      title: "3D Model Viewer",
      description: "WebGL-based 3D model viewer with interactive controls and material editor.",
      category: "UI/UX",
      tags: ["Three.js", "WebGL", "3D", "Interactive", "Materials"],
      preview: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800",
      demoUrl: "#",
      githubUrl: "#",
      author: "James Wilson",
      date: "2024-02-10",
      status: "beta",
      likes: 203,
      stats: {
        testsRun: 123,
        contributors: 5
      }
    },
    {
      id: 8,
      title: "API Documentation Generator",
      description: "Automatically generate beautiful API docs from OpenAPI specifications.",
      category: "Dev Tools",
      tags: ["API", "Documentation", "OpenAPI", "Swagger", "Auto-generation"],
      preview: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800",
      demoUrl: "#",
      githubUrl: "#",
      author: "Maria Garcia",
      date: "2024-02-05",
      status: "live",
      likes: 134,
      stats: {
        testsRun: 789,
        contributors: 9
      }
    }
  ];

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Building Real-time Collaboration with WebSockets",
      excerpt: "How we implemented WebSocket connections for seamless multi-user experiences in our code playground.",
      readTime: "8 min read",
      date: "March 15, 2024",
      author: "Alex Rodriguez",
      tags: ["WebSockets", "Real-time", "Collaboration"],
      relatedExperiment: 3
    },
    {
      id: 2,
      title: "AI Color Theory in Practice",
      excerpt: "The machine learning algorithms behind our intelligent color palette generator and design principles.",
      readTime: "12 min read",
      date: "March 10, 2024",
      author: "Sarah Johnson",
      tags: ["AI", "Machine Learning", "Color Theory"],
      relatedExperiment: 1
    },
    {
      id: 3,
      title: "Performance Optimization for Interactive Animations",
      excerpt: "Advanced strategies for building smooth 60fps animations in web applications.",
      readTime: "6 min read",
      date: "March 5, 2024",
      author: "Mike Chen",
      tags: ["Performance", "Animations", "Optimization"],
      relatedExperiment: 2
    }
  ];

  const categories = ['All', 'Featured', 'UI/UX', 'Animations', 'APIs', 'AI', 'Dev Tools', 'Analytics', 'Open Source'];

  const playgroundTools = [
    {
      id: 'color-generator',
      name: 'Color Generator',
      icon: Palette,
      description: 'AI-powered color palette creation'
    },
    {
      id: 'animation-tester',
      name: 'Animation Tester',
      icon: Zap,
      description: 'Test micro-interactions and animations'
    },
    {
      id: 'code-editor',
      name: 'Code Editor',
      icon: Code,
      description: 'Live HTML/CSS/JS playground'
    },
    {
      id: 'ab-tester',
      name: 'A/B Tester',
      icon: BarChart,
      description: 'Compare UI variations'
    }
  ];

  const contributors = [
    { name: "Sarah J.", avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100", contributions: 23 },
    { name: "Mike C.", avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100", contributions: 18 },
    { name: "Alex R.", avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100", contributions: 15 },
    { name: "Emily D.", avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100", contributions: 12 },
    { name: "David K.", avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100", contributions: 9 }
  ];

  useEffect(() => {
    let filtered = experiments;
    
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Featured') {
        filtered = experiments.filter(exp => exp.featured);
      } else {
        filtered = experiments.filter(exp => exp.category === selectedCategory);
      }
    }
    
    if (searchTerm) {
      filtered = filtered.filter(exp => 
        exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredExperiments(filtered);
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      setIsFilterSticky(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featuredExperiments = experiments.filter(exp => exp.featured);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-800';
      case 'beta': return 'bg-yellow-100 text-yellow-800';
      case 'concept': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live': return <Zap size={12} />;
      case 'beta': return <Eye size={12} />;
      case 'concept': return <Lightbulb size={12} />;
      default: return <Code size={12} />;
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 overflow-hidden">
      {/* SECTION 1: Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
          
          {/* Morphing Gradient */}
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
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />

          {/* Floating Lab Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                animate={{
                  x: [0, 100, 0],
                  y: [0, -50, 0],
                  rotate: [0, 180, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 6 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
              >
                {i % 4 === 0 && <Beaker className="w-6 h-6 text-blue-400/30" />}
                {i % 4 === 1 && <Code className="w-5 h-5 text-purple-400/30" />}
                {i % 4 === 2 && <Zap className="w-4 h-4 text-pink-400/30" />}
                {i % 4 === 3 && <Cpu className="w-5 h-5 text-cyan-400/30" />}
              </motion.div>
            ))}
          </div>

          {/* Glowing Circuits */}
          <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1000 1000">
            <motion.path
              d="M100,100 L200,100 L200,200 L300,200 L300,300 L400,300"
              stroke="url(#circuit-gradient)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path
              d="M600,100 L700,100 L700,200 L800,200 L800,300 L900,300"
              stroke="url(#circuit-gradient)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, repeat: Infinity, delay: 1, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="circuit-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Lab Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 mb-8"
            >
              <Beaker className="w-12 h-12 text-blue-400" />
            </motion.div>
            
            {/* Animated Tagline */}
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Pixeloria
              </span>
              <br />
              <motion.span
                className="text-white"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                Labs
              </motion.span>
            </motion.h1>
            
            {/* Typed Tagline Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-2xl md:text-3xl text-gray-300 mb-8 font-light"
            >
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.5, duration: 2 }}
                className="inline-block overflow-hidden whitespace-nowrap border-r-2 border-blue-400"
              >
                Inventing the Future, One Experiment at a Time
              </motion.span>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.8 }}
              className="text-gray-400 text-xl max-w-3xl mx-auto mb-12"
            >
              Welcome to our digital playground where we push boundaries, test new technologies, 
              and create experimental projects that shape tomorrow's web experiences.
            </motion.p>

            {/* Dual CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-6"
            >
              <motion.a
                href="#experiments"
                className="group relative overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-2xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center">
                  🔬 Explore Experiments
                  <Rocket className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/contact"
                  className="group px-8 py-4 rounded-full border-2 border-white/20 text-white font-bold text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300 inline-flex items-center"
                >
                  🤝 Collaborate With Us
                  <Coffee className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Mouse Trail Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="w-4 h-4 bg-blue-400/30 rounded-full blur-sm"
            animate={{
              x: [0, 100, 200, 100, 0],
              y: [0, 50, 100, 150, 100]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </section>

      {/* SECTION 2: Filterable Experiments Grid */}
      <section id="experiments" className="py-20 relative">
        {/* Sticky Filter Bar */}
        <motion.div
          className={`transition-all duration-300 z-40 ${
            isFilterSticky 
              ? 'fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-800' 
              : 'relative'
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="container-custom py-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search experiments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category === 'Featured' && <Star size={14} className="mr-1 inline" />}
                    {category}
                  </motion.button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="container-custom">
          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 text-center"
          >
            <p className="text-gray-400">
              Showing {filteredExperiments.length} experiment{filteredExperiments.length !== 1 ? 's' : ''}
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </motion.div>

          {/* Experiments Grid/List */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${viewMode}-${selectedCategory}-${searchTerm}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                  : 'space-y-6'
              }
            >
              {filteredExperiments.map((experiment, index) => (
                <motion.div
                  key={experiment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`group relative ${
                    viewMode === 'list' ? 'flex gap-6 items-center' : ''
                  }`}
                >
                  <div className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 ${
                    viewMode === 'list' ? 'flex-1 flex' : ''
                  }`}>
                    {/* Preview Image */}
                    <div className={`relative overflow-hidden ${
                      viewMode === 'list' ? 'w-48 h-32' : 'aspect-video'
                    }`}>
                      <img
                        src={experiment.preview}
                        alt={experiment.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      
                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                          {experiment.demoUrl && (
                            <Link
                              to={experiment.demoUrl}
                              className="flex-1 bg-white/20 backdrop-blur-sm text-white text-center py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center text-sm"
                            >
                              <Play size={14} className="mr-1" />
                              Demo
                            </Link>
                          )}
                          {experiment.githubUrl && (
                            <a
                              href={experiment.githubUrl}
                              className="flex-1 bg-white/20 backdrop-blur-sm text-white text-center py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center text-sm"
                            >
                              <Github size={14} className="mr-1" />
                              Code
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(experiment.status)}`}>
                          {getStatusIcon(experiment.status)}
                          <span className="ml-1 capitalize">{experiment.status}</span>
                        </span>
                      </div>

                      {/* Featured Badge */}
                      {experiment.featured && (
                        <div className="absolute top-4 right-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium">
                            <Star size={12} className="mr-1" />
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-400 font-medium text-sm">{experiment.category}</span>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Heart size={14} className="mr-1" />
                          {experiment.likes}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
                        {experiment.title}
                      </h3>
                      
                      <p className="text-gray-400 mb-4 text-sm">
                        {experiment.description}
                      </p>

                      {/* Stats */}
                      {experiment.stats && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {experiment.stats.aiUsed && (
                            <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 flex items-center">
                              <Brain size={10} className="mr-1" />
                              AI Used
                            </span>
                          )}
                          {experiment.stats.gptBuilt && (
                            <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 flex items-center">
                              <Sparkles size={10} className="mr-1" />
                              GPT-4 Built
                            </span>
                          )}
                          {experiment.stats.testsRun && (
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 flex items-center">
                              <BarChart size={10} className="mr-1" />
                              {experiment.stats.testsRun}+ tests
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {experiment.tags.slice(0, viewMode === 'list' ? 5 : 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 rounded-md bg-gray-700/50 text-gray-300 text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {experiment.tags.length > (viewMode === 'list' ? 5 : 3) && (
                          <span className="px-2 py-1 rounded-md bg-gray-700/50 text-gray-300 text-xs">
                            +{experiment.tags.length - (viewMode === 'list' ? 5 : 3)}
                          </span>
                        )}
                      </div>
                      
                      {/* Author & Date */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center">
                          <User size={12} className="mr-1" />
                          {experiment.author}
                        </span>
                        <span className="flex items-center">
                          <Calendar size={12} className="mr-1" />
                          {new Date(experiment.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* No Results */}
          {filteredExperiments.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Beaker className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No experiments found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* SECTION 3: Featured Experiment Block */}
      {featuredExperiments.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-gray-800/50 to-gray-900/50">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Featured Experiments
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Our most impressive and latest projects showcasing cutting-edge technology
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredExperiments.slice(0, 2).map((experiment, index) => (
                <motion.div
                  key={experiment.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl overflow-hidden border border-blue-500/20 shadow-2xl">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={experiment.preview}
                        alt={experiment.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                      
                      {/* Floating Stats */}
                      {experiment.stats && (
                        <div className="absolute top-4 right-4 space-y-2">
                          {experiment.stats.aiUsed && (
                            <div className="bg-purple-500/20 backdrop-blur-sm text-purple-300 px-3 py-1 rounded-full text-xs font-medium">
                              🧠 AI Powered
                            </div>
                          )}
                          {experiment.stats.testsRun && (
                            <div className="bg-blue-500/20 backdrop-blur-sm text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                              📈 {experiment.stats.testsRun}+ Tests
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-blue-400 font-medium">{experiment.category}</span>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className="flex items-center">
                            <Heart size={14} className="mr-1" />
                            {experiment.likes}
                          </span>
                          <span className="flex items-center">
                            <Users size={14} className="mr-1" />
                            {experiment.stats?.contributors || 0}
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
                        {experiment.title}
                      </h3>
                      
                      <p className="text-gray-300 mb-6">
                        {experiment.description}
                      </p>
                      
                      <div className="flex space-x-4">
                        {experiment.demoUrl && (
                          <Link
                            to={experiment.demoUrl}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-center flex items-center justify-center"
                          >
                            <Play size={16} className="mr-2" />
                            See Live
                          </Link>
                        )}
                        <button className="flex-1 border border-gray-600 text-white py-3 rounded-lg hover:bg-gray-700/50 transition-colors font-semibold">
                          How It Was Built
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: Test Zone - Interactive Playground */}
      <section className="py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Test Zone
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Interactive playground where you can test our experimental tools and components live
            </p>
          </motion.div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
            {/* Tool Tabs */}
            <div className="flex border-b border-gray-700/50 overflow-x-auto">
              {playgroundTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActivePlaygroundTool(tool.id)}
                  className={`flex items-center px-6 py-4 whitespace-nowrap transition-colors ${
                    activePlaygroundTool === tool.id
                      ? 'bg-blue-600/20 text-blue-400 border-b-2 border-blue-500'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                  }`}
                >
                  <tool.icon size={20} className="mr-2" />
                  <div className="text-left">
                    <div className="font-medium">{tool.name}</div>
                    <div className="text-xs opacity-75">{tool.description}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Tool Content */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePlaygroundTool}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="min-h-[400px] flex items-center justify-center"
                >
                  {activePlaygroundTool === 'color-generator' && (
                    <div className="text-center">
                      <Palette className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">AI Color Generator</h3>
                      <p className="text-gray-400 mb-6">Generate beautiful color palettes using machine learning</p>
                      <Link
                        to="/labs/color-generator"
                        className="btn-primary inline-flex items-center"
                      >
                        <Sparkles size={16} className="mr-2" />
                        Try Color Generator
                      </Link>
                    </div>
                  )}
                  
                  {activePlaygroundTool === 'animation-tester' && (
                    <div className="text-center">
                      <Zap className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">Animation Tester</h3>
                      <p className="text-gray-400 mb-6">Test and preview micro-interactions and animations</p>
                      <Link
                        to="/labs/animation-tester"
                        className="btn-primary inline-flex items-center"
                      >
                        <Play size={16} className="mr-2" />
                        Try Animation Tester
                      </Link>
                    </div>
                  )}
                  
                  {activePlaygroundTool === 'code-editor' && (
                    <div className="text-center">
                      <Code className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">Live Code Editor</h3>
                      <p className="text-gray-400 mb-6">Interactive HTML, CSS, and JavaScript playground</p>
                      <Link
                        to="/labs/code-playground"
                        className="btn-primary inline-flex items-center"
                      >
                        <Terminal size={16} className="mr-2" />
                        Try Code Editor
                      </Link>
                    </div>
                  )}
                  
                  {activePlaygroundTool === 'ab-tester' && (
                    <div className="text-center">
                      <BarChart className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">A/B Testing Lab</h3>
                      <p className="text-gray-400 mb-6">Compare UI variations and measure performance</p>
                      <Link
                        to="/labs/ab-testing"
                        className="btn-primary inline-flex items-center"
                      >
                        <Target size={16} className="mr-2" />
                        Try A/B Tester
                      </Link>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Behind the Build - Blog-style Writeups */}
      <section className="py-20 bg-gradient-to-b from-gray-800/50 to-gray-900/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Behind the Build
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Deep dive into our development process with detailed writeups and technical insights
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
                className="group bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-blue-400 font-medium">Deep Dive</span>
                  <span className="text-xs text-gray-500">{post.readTime}</span>
                </div>
                
                <h3 className="text-lg font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-gray-400 mb-4 text-sm">
                  {post.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 rounded-md bg-gray-700/50 text-gray-300 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center">
                    <User size={12} className="mr-1" />
                    {post.author}
                  </span>
                  <span>{post.date}</span>
                </div>
                
                {post.relatedExperiment && (
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center">
                      <ExternalLink size={12} className="mr-1" />
                      View Related Experiment
                    </button>
                  </div>
                )}
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
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Collaborate With Us
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Join our community of developers and designers building the future of web
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pitch Your Idea */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl p-8 border border-blue-500/20"
            >
              <Lightbulb className="w-12 h-12 text-blue-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Pitch Your Idea</h3>
              <p className="text-gray-300 mb-6">
                Have an experimental idea? Share it with us and let's build it together.
              </p>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Describe your idea..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold">
                  Submit Idea
                </button>
              </form>
            </motion.div>

            {/* GitHub Integration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50"
            >
              <Github className="w-12 h-12 text-gray-300 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">View on GitHub</h3>
              <p className="text-gray-300 mb-6">
                Explore our open-source experiments and contribute to the codebase.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                  <span className="text-white font-medium">pixeloria/color-generator</span>
                  <GitBranch className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                  <span className="text-white font-medium">pixeloria/animation-lib</span>
                  <GitBranch className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                  <span className="text-white font-medium">pixeloria/code-playground</span>
                  <GitBranch className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <a
                href="https://github.com/pixeloria"
                className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-semibold text-center block"
              >
                View All Repositories
              </a>
            </motion.div>

            {/* Contributors Wall */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50"
            >
              <Users className="w-12 h-12 text-green-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Contributors Wall</h3>
              <p className="text-gray-300 mb-6">
                Amazing people who help make our experiments possible.
              </p>
              
              <div className="space-y-3 mb-6">
                {contributors.map((contributor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={contributor.avatar}
                        alt={contributor.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-white font-medium">{contributor.name}</span>
                    </div>
                    <span className="text-green-400 text-sm">{contributor.contributions} commits</span>
                  </div>
                ))}
              </div>
              
              <Link
                to="/contact"
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold text-center block"
              >
                Join Our Team
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 7: Subscribe + Stay Updated */}
      <section className="py-20 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          
          {/* Matrix-style Animation */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-blue-400/20 font-mono text-sm"
                animate={{
                  y: [-100, window.innerHeight + 100],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
                style={{
                  left: `${Math.random() * 100}%`
                }}
              >
                {Math.random().toString(36).substring(7)}
              </motion.div>
            ))}
          </div>

          {/* Neon Glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"
            animate={{
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                  "0 0 40px rgba(147, 51, 234, 0.3)",
                  "0 0 20px rgba(59, 130, 246, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 mb-8"
            >
              <Bell className="w-10 h-10 text-blue-400" />
            </motion.div>

            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Get Monthly Lab Drops
            </h2>
            
            <p className="text-xl text-gray-300 mb-8">
              Be the first to know about our latest experiments and get exclusive access to beta features.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row max-w-md mx-auto mb-8">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 px-6 py-4 rounded-l-xl sm:rounded-r-none rounded-r-xl mb-2 sm:mb-0 bg-gray-800/50 backdrop-blur-sm border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <motion.button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-r-xl sm:rounded-l-none rounded-l-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </form>

            <AnimatePresence>
              {subscribed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="bg-green-600/20 border border-green-500/30 rounded-xl p-4 mb-8"
                >
                  <div className="flex items-center justify-center text-green-400">
                    <Sparkles className="w-5 h-5 mr-2" />
                    🎉 You've been added to our next Lab Drop!
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-gray-400 text-sm">
              Join 2,500+ developers and designers getting exclusive lab updates
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Labs;