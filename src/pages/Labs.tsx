import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Beaker, Palette, Zap, Code, Target, Brain, Sparkles, 
  ArrowRight, ExternalLink, Github, Star, TrendingUp,
  Users, Clock, Award, Filter, Search, Grid, List,
  Play, Eye, Download, Share2, Heart, MessageSquare,
  Lightbulb, Cpu, Activity, BarChart3, Layers, Settings,
  Package, CheckCircle
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
}

interface Contributor {
  id: string;
  name: string;
  avatar: string;
  role: string;
  contributions: number;
}

const Labs: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'trending'>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const experiments: Experiment[] = [
    {
      id: 'color-generator',
      title: 'AI Color Palette Generator',
      description: 'Generate beautiful, accessible color palettes using AI with real-time preview and collaboration features.',
      category: 'AI',
      tags: ['AI', 'Colors', 'Design', 'Accessibility', 'Collaboration'],
      icon: Palette,
      status: 'live',
      featured: true,
      aiPowered: true,
      stats: {
        views: 15420,
        likes: 892,
        forks: 156,
        lastUpdated: '2 days ago'
      },
      techStack: ['React', 'TypeScript', 'OpenAI', 'Tailwind'],
      difficulty: 'intermediate',
      estimatedTime: '15 min',
      link: '/labs/color-generator',
      demoUrl: '/labs/color-generator',
      sourceUrl: 'https://github.com/pixeloria/color-generator',
      preview: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 'animation-tester',
      title: 'Animation Tester Pro',
      description: 'Test and perfect UI animations with performance monitoring, accessibility audits, and code generation.',
      category: 'Animations',
      tags: ['Animations', 'Performance', 'Accessibility', 'Framer Motion'],
      icon: Zap,
      status: 'live',
      featured: true,
      stats: {
        views: 12350,
        likes: 743,
        forks: 98,
        lastUpdated: '1 week ago'
      },
      techStack: ['React', 'Framer Motion', 'GSAP', 'TypeScript'],
      difficulty: 'advanced',
      estimatedTime: '20 min',
      link: '/labs/animation-tester',
      demoUrl: '/labs/animation-tester',
      sourceUrl: 'https://github.com/pixeloria/animation-tester'
    },
    {
      id: 'code-playground',
      title: 'Live Code Playground',
      description: 'Multi-file code editor with AI assistance, real-time collaboration, and instant preview across devices.',
      category: 'Dev Tools',
      tags: ['Code Editor', 'Collaboration', 'AI', 'Multi-file'],
      icon: Code,
      status: 'live',
      featured: true,
      aiPowered: true,
      stats: {
        views: 18750,
        likes: 1205,
        forks: 234,
        lastUpdated: '3 days ago'
      },
      techStack: ['React', 'Monaco Editor', 'WebSocket', 'Node.js'],
      difficulty: 'advanced',
      estimatedTime: '30 min',
      link: '/labs/code-playground',
      demoUrl: '/labs/code-playground',
      sourceUrl: 'https://github.com/pixeloria/code-playground'
    },
    {
      id: 'ab-testing',
      title: 'A/B Testing Simulator',
      description: 'Advanced A/B testing platform with traffic simulation, heatmaps, and statistical analysis.',
      category: 'Analytics',
      tags: ['A/B Testing', 'Analytics', 'Statistics', 'Heatmaps'],
      icon: Target,
      status: 'live',
      featured: true,
      stats: {
        views: 9840,
        likes: 567,
        forks: 89,
        lastUpdated: '5 days ago'
      },
      techStack: ['React', 'D3.js', 'Statistics', 'TypeScript'],
      difficulty: 'intermediate',
      estimatedTime: '25 min',
      link: '/labs/ab-testing',
      demoUrl: '/labs/ab-testing',
      sourceUrl: 'https://github.com/pixeloria/ab-testing'
    },
    {
      id: 'component-store',
      title: 'Component Store',
      description: 'UI/UX component marketplace with live previews, code export, and AI-powered component generation.',
      category: 'UI/UX',
      tags: ['Components', 'Marketplace', 'UI Library', 'Code Export'],
      icon: Package,
      status: 'live',
      featured: true,
      aiPowered: true,
      stats: {
        views: 11200,
        likes: 678,
        forks: 123,
        lastUpdated: '1 day ago'
      },
      techStack: ['React', 'TypeScript', 'Tailwind', 'AI'],
      difficulty: 'intermediate',
      estimatedTime: '20 min',
      link: '/labs/component-store',
      demoUrl: '/labs/component-store',
      sourceUrl: 'https://github.com/pixeloria/component-store'
    },
    {
      id: 'animation-composer',
      title: 'Animation Composer',
      description: 'Visual animation builder with drag-and-drop interface, timeline editor, and code export.',
      category: 'Animations',
      tags: ['Animation', 'Visual Editor', 'Timeline', 'Code Export'],
      icon: Layers,
      status: 'live',
      featured: true,
      stats: {
        views: 8920,
        likes: 445,
        forks: 67,
        lastUpdated: '1 week ago'
      },
      techStack: ['React', 'Framer Motion', 'Canvas', 'TypeScript'],
      difficulty: 'advanced',
      estimatedTime: '35 min',
      link: '/labs/animation-composer',
      demoUrl: '/labs/animation-composer',
      sourceUrl: 'https://github.com/pixeloria/animation-composer'
    },
    {
      id: 'neural-network-viz',
      title: 'Neural Network Visualizer',
      description: 'Interactive visualization of neural networks with real-time training and customizable architectures.',
      category: 'AI',
      tags: ['AI', 'Machine Learning', 'Visualization', 'Neural Networks'],
      icon: Brain,
      status: 'live',
      featured: true,
      aiPowered: true,
      stats: {
        views: 7230,
        likes: 445,
        forks: 67,
        lastUpdated: '1 week ago'
      },
      techStack: ['React', 'TensorFlow.js', 'D3.js', 'WebGL'],
      difficulty: 'advanced',
      estimatedTime: '45 min',
      link: '/labs/neural-network-viz',
      demoUrl: '/labs/neural-network-viz',
      sourceUrl: 'https://github.com/pixeloria/neural-network-viz'
    },
    {
      id: 'css-grid-generator',
      title: 'CSS Grid Generator',
      description: 'Visual CSS Grid layout generator with responsive breakpoints and export functionality.',
      category: 'CSS',
      tags: ['CSS', 'Grid', 'Layout', 'Responsive'],
      icon: Grid,
      status: 'live',
      featured: false,
      stats: {
        views: 11200,
        likes: 678,
        forks: 123,
        lastUpdated: '2 weeks ago'
      },
      techStack: ['React', 'CSS Grid', 'TypeScript'],
      difficulty: 'beginner',
      estimatedTime: '10 min',
      link: '/labs/css-grid-generator',
      demoUrl: '/labs/css-grid-generator',
      sourceUrl: 'https://github.com/pixeloria/css-grid-generator'
    },
    {
      id: 'performance-monitor',
      title: 'Web Performance Monitor',
      description: 'Real-time web performance monitoring with Core Web Vitals tracking and optimization suggestions.',
      category: 'Performance',
      tags: ['Performance', 'Core Web Vitals', 'Monitoring', 'Optimization'],
      icon: Activity,
      status: 'beta',
      featured: false,
      stats: {
        views: 6890,
        likes: 389,
        forks: 45,
        lastUpdated: '4 days ago'
      },
      techStack: ['React', 'Web APIs', 'Lighthouse', 'TypeScript'],
      difficulty: 'intermediate',
      estimatedTime: '20 min',
      link: '/labs/performance-monitor',
      demoUrl: '/labs/performance-monitor',
      sourceUrl: 'https://github.com/pixeloria/performance-monitor'
    }
  ];

  const contributors: Contributor[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      role: 'Lead Developer',
      contributions: 45
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      role: 'UI/UX Designer',
      contributions: 32
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
      role: 'AI Specialist',
      contributions: 28
    },
    {
      id: '4',
      name: 'David Kim',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      role: 'Performance Expert',
      contributions: 19
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

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
        
        {/* Animated Background */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-4 mr-4"
              >
                <Beaker className="w-full h-full text-white" />
              </motion.div>
              <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Pixeloria Labs
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Inventing the Future, One Experiment at a Time
            </p>
            
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Explore cutting-edge web technologies, AI-powered tools, and innovative experiments. 
              Our lab is where creativity meets technology to push the boundaries of what's possible.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Explore Experiments
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:scale-110 transition-transform duration-500"></div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-outline group"
              >
                <Github className="mr-2" size={20} />
                View on GitHub
                <ExternalLink className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 relative -mt-10 z-10">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: experiments.length, label: "Active Experiments", icon: Beaker },
              { number: experiments.reduce((sum, exp) => sum + exp.stats.views, 0), label: "Total Views", icon: Eye },
              { number: contributors.length, label: "Contributors", icon: Users },
              { number: experiments.reduce((sum, exp) => sum + exp.stats.likes, 0), label: "Community Likes", icon: Heart }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-700/50"
              >
                <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <motion.h3 
                  className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {stat.number.toLocaleString()}
                </motion.h3>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Experiments */}
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
              Featured Experiments
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our most innovative and popular experiments showcasing the latest in web technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10"
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
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
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 flex items-center">
                        <Brain size={12} className="mr-1" />
                        AI Powered
                      </span>
                    </div>
                  )}

                  {/* Preview Image */}
                  {experiment.preview && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={experiment.preview}
                        alt={experiment.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                    </div>
                  )}

                  <div className="p-8">
                    {/* Icon and Title */}
                    <div className="flex items-center mb-4">
                      <motion.div 
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-3 mr-4"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <experiment.icon className="w-full h-full text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                          {experiment.title}
                        </h3>
                        <span className="text-sm text-gray-400">{experiment.category}</span>
                      </div>
                    </div>

                    <p className="text-gray-400 mb-6 line-clamp-3">
                      {experiment.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {experiment.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400"
                        >
                          {tag}
                        </span>
                      ))}
                      {experiment.tags.length > 3 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                          +{experiment.tags.length - 3}
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
                          <Star size={14} className="mr-1" />
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
                        Try It Live
                        <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                      
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

      {/* All Experiments */}
      <section className="py-20 bg-gradient-to-b from-gray-800/50 to-gray-900/50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              All Experiments
            </h2>
            
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
                      {allTags.map((tag) => (
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
                      <option value="newest">Newest</option>
                      <option value="popular">Most Popular</option>
                      <option value="trending">Trending</option>
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
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          experiment.status === 'live' ? 'bg-green-500/20 text-green-400' :
                          experiment.status === 'beta' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {experiment.status.replace('-', ' ').toUpperCase()}
                        </span>
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

      {/* Contributors Section */}
      <section className="py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Contributors Wall
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Meet the talented individuals who make Pixeloria Labs possible
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contributors.map((contributor, index) => (
              <motion.div
                key={contributor.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 text-center hover:border-blue-500/50 transition-all duration-300"
              >
                <img
                  src={contributor.avatar}
                  alt={contributor.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold text-white mb-1">{contributor.name}</h3>
                <p className="text-blue-400 text-sm mb-3">{contributor.role}</p>
                <div className="flex items-center justify-center text-gray-400 text-sm">
                  <Star size={14} className="mr-1" />
                  {contributor.contributions} contributions
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Ready to Collaborate?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join our community of innovators and help us build the future of web development. 
              Contribute to existing experiments or propose new ones.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
              >
                <Lightbulb className="mr-2" size={20} />
                Propose Experiment
                <ArrowRight className="ml-2" size={20} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 rounded-full border-2 border-white/20 text-white font-bold text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              >
                <Github className="mr-2" size={20} />
                View on GitHub
                <ExternalLink className="ml-2" size={20} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Labs;