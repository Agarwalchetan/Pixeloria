import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Beaker, Palette, Zap, Code, Target, Brain, Sparkles, 
  ArrowRight, ExternalLink, Github, Star, TrendingUp,
  Users, Clock, Award, Filter, Search, Grid, List,
  Play, Eye, Download, Share2, Heart, MessageSquare,
  Lightbulb, Cpu, Activity, BarChart3, Layers, Settings,
  Terminal, GitBranch, Coffee, Rocket, Mail, Bell,
  ChevronRight, ChevronDown, X, Plus, Monitor, Smartphone,
  Tablet, Globe, Database, Server, Shield, MousePointer,
  Headphones, Camera, Mic, Video, Edit, FileText,
  BookOpen, PenTool, Scissors, Wand2, Sliders
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
  buildStory?: string;
  usedInProduction?: number;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  date: string;
  tags: string[];
  image: string;
  deepDive: boolean;
  relatedExperiment?: string;
}

interface Contributor {
  id: string;
  name: string;
  avatar: string;
  role: string;
  contributions: number;
  github?: string;
}

const Labs: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activePlayground, setActivePlayground] = useState('color-generator');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [expandedBlog, setExpandedBlog] = useState<string | null>(null);
  const [collaborationForm, setCollaborationForm] = useState({
    name: '',
    email: '',
    idea: '',
    type: 'experiment'
  });

  // Scroll animations
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  // Typing animation state
  const [typedText, setTypedText] = useState('');
  const fullText = "Inventing the Future, One Experiment at a Time";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

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
      usedInProduction: 847,
      stats: {
        views: 25420,
        likes: 1892,
        forks: 256,
        lastUpdated: '2 days ago'
      },
      techStack: ['React', 'TypeScript', 'OpenAI', 'Tailwind', 'Framer Motion'],
      difficulty: 'intermediate',
      estimatedTime: '15 min',
      link: '/labs/color-generator',
      demoUrl: '/labs/color-generator',
      sourceUrl: 'https://github.com/pixeloria/ai-color-generator',
      preview: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
      buildStory: 'Built using GPT-4 for intelligent color theory and accessibility scoring'
    },
    {
      id: 'animation-tester-pro',
      title: 'Animation Tester Pro',
      description: 'Advanced animation testing with performance monitoring, accessibility audits, and multi-framework code generation.',
      category: 'Animations',
      tags: ['Animations', 'Performance', 'Accessibility', 'Framer Motion', 'GSAP'],
      icon: Zap,
      status: 'live',
      featured: true,
      usedInProduction: 623,
      stats: {
        views: 18350,
        likes: 1243,
        forks: 198,
        lastUpdated: '1 week ago'
      },
      techStack: ['React', 'Framer Motion', 'GSAP', 'TypeScript', 'Performance API'],
      difficulty: 'advanced',
      estimatedTime: '25 min',
      link: '/labs/animation-tester',
      demoUrl: '/labs/animation-tester',
      sourceUrl: 'https://github.com/pixeloria/animation-tester-pro',
      buildStory: 'Performance-first animation testing with real-time FPS monitoring'
    },
    {
      id: 'live-code-playground',
      title: 'Live Code Playground',
      description: 'Multi-file code editor with AI assistance, real-time collaboration, and instant preview across devices.',
      category: 'Dev Tools',
      tags: ['Code Editor', 'Collaboration', 'AI', 'Multi-file', 'Templates'],
      icon: Code,
      status: 'live',
      featured: true,
      aiPowered: true,
      usedInProduction: 1205,
      stats: {
        views: 32750,
        likes: 2105,
        forks: 434,
        lastUpdated: '3 days ago'
      },
      techStack: ['React', 'Monaco Editor', 'WebSocket', 'Node.js', 'OpenAI'],
      difficulty: 'advanced',
      estimatedTime: '35 min',
      link: '/labs/code-playground',
      demoUrl: '/labs/code-playground',
      sourceUrl: 'https://github.com/pixeloria/live-code-playground',
      buildStory: 'Built with real-time collaboration and AI code suggestions'
    },
    {
      id: 'ab-testing-simulator',
      title: 'A/B Testing Simulator',
      description: 'Advanced A/B testing platform with traffic simulation, heatmaps, statistical analysis, and winner detection.',
      category: 'Analytics',
      tags: ['A/B Testing', 'Analytics', 'Statistics', 'Heatmaps', 'Simulation'],
      icon: Target,
      status: 'live',
      featured: true,
      usedInProduction: 389,
      stats: {
        views: 14840,
        likes: 967,
        forks: 189,
        lastUpdated: '5 days ago'
      },
      techStack: ['React', 'D3.js', 'Statistics', 'TypeScript', 'Canvas API'],
      difficulty: 'intermediate',
      estimatedTime: '30 min',
      link: '/labs/ab-testing',
      demoUrl: '/labs/ab-testing',
      sourceUrl: 'https://github.com/pixeloria/ab-testing-simulator',
      buildStory: 'Statistical significance testing with real-time traffic simulation'
    },
    {
      id: 'neural-network-viz',
      title: 'Neural Network Visualizer',
      description: 'Interactive visualization of neural networks with real-time training and customizable architectures.',
      category: 'AI',
      tags: ['AI', 'Machine Learning', 'Visualization', 'Neural Networks', 'WebGL'],
      icon: Brain,
      status: 'beta',
      featured: false,
      aiPowered: true,
      usedInProduction: 156,
      stats: {
        views: 9230,
        likes: 645,
        forks: 87,
        lastUpdated: '1 week ago'
      },
      techStack: ['React', 'TensorFlow.js', 'D3.js', 'WebGL', 'Three.js'],
      difficulty: 'advanced',
      estimatedTime: '45 min',
      link: '/labs/neural-network-viz',
      demoUrl: '/labs/neural-network-viz',
      sourceUrl: 'https://github.com/pixeloria/neural-network-viz',
      buildStory: 'Real-time neural network training visualization with WebGL acceleration'
    },
    {
      id: 'css-grid-generator',
      title: 'CSS Grid Generator',
      description: 'Visual CSS Grid layout generator with responsive breakpoints and export functionality.',
      category: 'UI/UX',
      tags: ['CSS', 'Grid', 'Layout', 'Responsive', 'Generator'],
      icon: Grid,
      status: 'live',
      featured: false,
      usedInProduction: 892,
      stats: {
        views: 16200,
        likes: 1078,
        forks: 223,
        lastUpdated: '2 weeks ago'
      },
      techStack: ['React', 'CSS Grid', 'TypeScript', 'Responsive Design'],
      difficulty: 'beginner',
      estimatedTime: '12 min',
      link: '/labs/css-grid-generator',
      demoUrl: '/labs/css-grid-generator',
      sourceUrl: 'https://github.com/pixeloria/css-grid-generator',
      buildStory: 'Drag-and-drop grid builder with live CSS output'
    },
    {
      id: 'performance-monitor',
      title: 'Web Performance Monitor',
      description: 'Real-time web performance monitoring with Core Web Vitals tracking and optimization suggestions.',
      category: 'Dev Tools',
      tags: ['Performance', 'Core Web Vitals', 'Monitoring', 'Optimization', 'Lighthouse'],
      icon: Activity,
      status: 'beta',
      featured: false,
      usedInProduction: 234,
      stats: {
        views: 8890,
        likes: 589,
        forks: 65,
        lastUpdated: '4 days ago'
      },
      techStack: ['React', 'Web APIs', 'Lighthouse', 'TypeScript', 'Service Worker'],
      difficulty: 'intermediate',
      estimatedTime: '22 min',
      link: '/labs/performance-monitor',
      demoUrl: '/labs/performance-monitor',
      sourceUrl: 'https://github.com/pixeloria/performance-monitor',
      buildStory: 'Real-time performance tracking with automated optimization suggestions'
    },
    {
      id: 'component-library',
      title: 'Interactive Component Library',
      description: 'Comprehensive component library with live examples, props documentation, and code generation.',
      category: 'UI/UX',
      tags: ['Components', 'Documentation', 'Storybook', 'Design System', 'React'],
      icon: Layers,
      status: 'coming-soon',
      featured: false,
      usedInProduction: 0,
      stats: {
        views: 0,
        likes: 0,
        forks: 0,
        lastUpdated: 'Coming soon'
      },
      techStack: ['React', 'Storybook', 'TypeScript', 'Tailwind', 'MDX'],
      difficulty: 'intermediate',
      estimatedTime: '30 min',
      link: '/labs/component-library',
      demoUrl: '/labs/component-library',
      sourceUrl: 'https://github.com/pixeloria/component-library',
      buildStory: 'Auto-generated documentation with interactive examples'
    }
  ];

  const blogPosts: BlogPost[] = [
    {
      id: 'building-ai-color-generator',
      title: 'Building an AI-Powered Color Generator',
      excerpt: 'Deep dive into how we built our most popular experiment using GPT-4 and color theory algorithms.',
      author: 'Sarah Johnson',
      readTime: '8 min read',
      date: '2 days ago',
      tags: ['AI', 'Color Theory', 'GPT-4', 'React'],
      image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
      deepDive: true,
      relatedExperiment: 'ai-color-generator'
    },
    {
      id: 'performance-animation-testing',
      title: 'Performance-First Animation Testing',
      excerpt: 'How we built real-time FPS monitoring and accessibility auditing into our animation tester.',
      author: 'Mike Chen',
      readTime: '6 min read',
      date: '1 week ago',
      tags: ['Performance', 'Animations', 'Accessibility'],
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
      deepDive: true,
      relatedExperiment: 'animation-tester-pro'
    },
    {
      id: 'real-time-collaboration',
      title: 'Real-Time Collaboration in Web Apps',
      excerpt: 'The technical challenges and solutions for building live collaborative features.',
      author: 'Emily Rodriguez',
      readTime: '10 min read',
      date: '2 weeks ago',
      tags: ['WebSocket', 'Collaboration', 'Real-time'],
      image: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=800',
      deepDive: true,
      relatedExperiment: 'live-code-playground'
    }
  ];

  const contributors: Contributor[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      role: 'Lead Developer',
      contributions: 45,
      github: 'sarahjohnson'
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      role: 'UI/UX Designer',
      contributions: 32,
      github: 'mikechen'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
      role: 'AI Specialist',
      contributions: 28,
      github: 'emilyrodriguez'
    },
    {
      id: '4',
      name: 'David Kim',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      role: 'Performance Expert',
      contributions: 19,
      github: 'davidkim'
    },
    {
      id: '5',
      name: 'Alex Thompson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      role: 'DevOps Engineer',
      contributions: 15,
      github: 'alexthompson'
    },
    {
      id: '6',
      name: 'Lisa Wang',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      role: 'Frontend Developer',
      contributions: 12,
      github: 'lisawang'
    }
  ];

  const categories = ['All', 'AI', 'Animations', 'UI/UX', 'Dev Tools', 'Analytics', 'Open Source', '⭐ Featured'];
  const allTags = [...new Set(experiments.flatMap(exp => exp.tags))];

  const playgroundTools = [
    { id: 'color-generator', name: 'Color Generator', icon: Palette },
    { id: 'animation-tester', name: 'Animation Tester', icon: Zap },
    { id: 'code-editor', name: 'Code Editor', icon: Code },
    { id: 'ab-tester', name: 'A/B Tester', icon: Target }
  ];

  const filteredExperiments = experiments.filter(exp => {
    const matchesCategory = selectedCategory === 'All' || 
                           (selectedCategory === '⭐ Featured' ? exp.featured : exp.category === selectedCategory);
    const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exp.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => exp.tags.includes(tag));
    
    return matchesCategory && matchesSearch && matchesTags;
  });

  const featuredExperiments = experiments.filter(exp => exp.featured).slice(0, 2);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  const handleCollaborationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Collaboration form submitted:', collaborationForm);
    setCollaborationForm({ name: '', email: '', idea: '', type: 'experiment' });
  };

  return (
    <div className="min-h-screen bg-gray-900 overflow-hidden">
      {/* 1. HERO SECTION - Welcome to Pixeloria Labs */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Morphing Gradient Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-pink-900/30"
            animate={{
              background: [
                "linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.3))",
                "linear-gradient(90deg, rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.3), rgba(59, 130, 246, 0.3))",
                "linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3))",
                "linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3), rgba(236, 72, 153, 0.3))"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Animated Lab Elements */}
          <div className="absolute inset-0">
            {/* Floating Circuits */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-400/40 rounded-full"
                animate={{
                  x: [0, 100, 0],
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                  scale: [1, 1.5, 1]
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
            
            {/* Glowing Orbs */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`orb-${i}`}
                className="absolute w-32 h-32 rounded-full blur-xl opacity-20"
                style={{
                  background: `radial-gradient(circle, ${
                    ['#3B82F6', '#9333EA', '#EC4899', '#10B981'][i % 4]
                  }, transparent)`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 6 + i,
                  repeat: Infinity,
                  delay: i * 0.8
                }}
              />
            ))}
          </div>
        </div>

        <motion.div 
          className="container-custom relative z-10"
          style={{ y, opacity }}
        >
          <div className="max-w-5xl">
            {/* Animated Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="flex items-center mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 p-5 mr-6 shadow-2xl"
                >
                  <Beaker className="w-full h-full text-white" />
                </motion.div>
                <div>
                  <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
                    Pixeloria Labs
                  </h1>
                  <div className="text-2xl md:text-3xl text-gray-300 font-light h-12">
                    {typedText}
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="text-blue-400"
                    >
                      |
                    </motion.span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl leading-relaxed"
            >
              Where creativity meets technology to push the boundaries of what's possible. 
              Explore cutting-edge experiments, AI-powered tools, and innovative solutions 
              that shape the future of web development.
            </motion.p>

            {/* Bold CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <motion.a
                href="#experiments"
                className="group relative overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center justify-center">
                  🔬 Explore Experiments
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                  initial={{ x: "100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
              
              <motion.a
                href="#collaborate"
                className="group relative overflow-hidden px-8 py-4 rounded-full border-2 border-white/20 text-white font-bold text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center justify-center">
                  🤝 Collaborate With Us
                  <Users className="ml-2 group-hover:scale-110 transition-transform" size={20} />
                </span>
              </motion.a>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {[
                { number: experiments.length, label: "Live Experiments", icon: Beaker },
                { number: experiments.reduce((sum, exp) => sum + exp.stats.views, 0), label: "Total Views", icon: Eye },
                { number: contributors.length, label: "Contributors", icon: Users },
                { number: experiments.reduce((sum, exp) => sum + (exp.usedInProduction || 0), 0), label: "Production Uses", icon: Rocket }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <motion.div 
                    className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  >
                    {stat.number > 1000 ? `${Math.round(stat.number / 1000)}k` : stat.number}
                  </motion.div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 2. FEATURED EXPERIMENT BLOCK */}
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
              ⭐ Featured Experiments
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our most innovative and popular experiments showcasing the latest in web technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredExperiments.map((experiment, index) => (
              <motion.div
                key={experiment.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <motion.div
                  className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10"
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  {/* Preview Image/Animation */}
                  {experiment.preview && (
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={experiment.preview}
                        alt={experiment.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                      
                      {/* Play Button Overlay */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </motion.div>

                      {/* Status Badges */}
                      <div className="absolute top-4 left-4 flex space-x-2">
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded-full backdrop-blur-sm">
                          {experiment.status.toUpperCase()}
                        </span>
                        {experiment.aiPowered && (
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm font-medium rounded-full backdrop-blur-sm flex items-center">
                            <Brain size={12} className="mr-1" />
                            AI Powered
                          </span>
                        )}
                      </div>

                      {/* Quick Stats */}
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <span className="px-2 py-1 bg-black/40 backdrop-blur-sm text-white text-xs rounded-full">
                          🧠 GPT-4
                        </span>
                        <span className="px-2 py-1 bg-black/40 backdrop-blur-sm text-white text-xs rounded-full">
                          📈 {experiment.usedInProduction}+ uses
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-8">
                    {/* Icon and Title */}
                    <div className="flex items-center mb-4">
                      <motion.div 
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-4 mr-4 shadow-lg"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <experiment.icon className="w-full h-full text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                          {experiment.title}
                        </h3>
                        <span className="text-blue-400 text-sm font-medium">{experiment.category}</span>
                      </div>
                    </div>

                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {experiment.description}
                    </p>

                    {/* Build Story */}
                    {experiment.buildStory && (
                      <div className="mb-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="flex items-center mb-2">
                          <Lightbulb className="w-4 h-4 text-blue-400 mr-2" />
                          <span className="text-blue-400 text-sm font-medium">How It Was Built</span>
                        </div>
                        <p className="text-gray-300 text-sm">{experiment.buildStory}</p>
                      </div>
                    )}

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {experiment.techStack.slice(0, 4).map((tech, techIndex) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: techIndex * 0.1 }}
                          className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30"
                        >
                          {tech}
                        </motion.span>
                      ))}
                      {experiment.techStack.length > 4 && (
                        <span className="text-xs px-3 py-1 rounded-full bg-gray-700 text-gray-300">
                          +{experiment.techStack.length - 4}
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
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-center flex items-center justify-center group/btn"
                      >
                        <Play size={16} className="mr-2" />
                        See Live
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

      {/* 3. FILTERABLE EXPERIMENTS GRID */}
      <section id="experiments" className="py-20">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                All Experiments
              </h2>
              <p className="text-gray-400 text-lg">
                Explore our complete collection of innovative tools and experiments
              </p>
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

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
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

                  {/* Status */}
                  <div>
                    <h4 className="font-semibold text-white mb-3">Status</h4>
                    <div className="space-y-2">
                      {['live', 'beta', 'coming-soon'].map((status) => (
                        <label key={status} className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-gray-300 capitalize">{status.replace('-', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <h4 className="font-semibold text-white mb-3">Difficulty</h4>
                    <div className="space-y-2">
                      {['beginner', 'intermediate', 'advanced'].map((difficulty) => (
                        <label key={difficulty} className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-gray-300 capitalize">{difficulty}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Experiments Grid/List */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
            {filteredExperiments.map((experiment, index) => (
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
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            experiment.status === 'live' ? 'bg-green-500/20 text-green-400' :
                            experiment.status === 'beta' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {experiment.status.replace('-', ' ').toUpperCase()}
                          </span>
                          {experiment.aiPowered && (
                            <span className="px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-400">
                              AI
                            </span>
                          )}
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

          {filteredExperiments.length === 0 && (
            <div className="text-center py-12">
              <Beaker className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No experiments found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. TEST ZONE - Interactive Playground */}
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
              🧪 Interactive Test Zone
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Try our tools live in your browser. No installation required.
            </p>
          </motion.div>

          {/* Tool Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {playgroundTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActivePlayground(tool.id)}
                className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 ${
                  activePlayground === tool.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <tool.icon size={20} className="mr-2" />
                {tool.name}
              </button>
            ))}
          </div>

          {/* Playground Area */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {playgroundTools.find(t => t.id === activePlayground)?.name} Playground
                </h3>
                <div className="flex items-center space-x-2">
                  {/* Device Preview Toggle */}
                  <div className="flex bg-gray-700 rounded-lg p-1">
                    <button className="p-2 rounded bg-blue-600 text-white">
                      <Monitor size={16} />
                    </button>
                    <button className="p-2 rounded text-gray-400">
                      <Tablet size={16} />
                    </button>
                    <button className="p-2 rounded text-gray-400">
                      <Smartphone size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Playground Content */}
              <div className="bg-gray-900/50 rounded-xl p-8 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    {playgroundTools.find(t => t.id === activePlayground)?.icon && (
                      <playgroundTools.find(t => t.id === activePlayground)!.icon size={32} className="text-white" />
                    )}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    {playgroundTools.find(t => t.id === activePlayground)?.name} Demo
                  </h4>
                  <p className="text-gray-400 mb-6">
                    Interactive demo coming soon. Click below to try the full version.
                  </p>
                  <Link
                    to={`/labs/${activePlayground}`}
                    className="btn-primary inline-flex items-center"
                  >
                    <Play size={16} className="mr-2" />
                    Try Full Version
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BEHIND THE BUILD - Blog-style Writeups */}
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
              📚 Behind the Build
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Deep dives into how our experiments were built, the challenges we faced, and lessons learned.
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
                className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden hover:border-blue-500/50 transition-all duration-300 group cursor-pointer"
                onClick={() => setExpandedBlog(expandedBlog === post.id ? null : post.id)}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-400 text-sm font-medium">{post.author}</span>
                      {post.deepDive && (
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                          Deep Dive
                        </span>
                      )}
                    </div>
                    <span className="text-gray-500 text-sm">{post.readTime}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">{post.date}</span>
                    {post.relatedExperiment && (
                      <Link
                        to={`/labs/${post.relatedExperiment}`}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Experiment
                        <ExternalLink size={12} className="ml-1" />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. COLLABORATE WITH US */}
      <section id="collaborate" className="py-20 bg-gradient-to-b from-gray-800/50 to-gray-900/50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* SVG Circuits */}
          <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1000 1000">
            <defs>
              <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M10,10 L90,10 L90,90 L10,90 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
                <circle cx="10" cy="10" r="2" fill="currentColor"/>
                <circle cx="90" cy="90" r="2" fill="currentColor"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" className="text-blue-400"/>
          </svg>
          
          {/* Typing Terminal Effect */}
          <div className="absolute top-10 right-10 bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 font-mono text-green-400 text-sm">
            <div>$ git clone pixeloria-labs</div>
            <div>$ npm install</div>
            <div>$ npm run experiment</div>
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              _
            </motion.div>
          </div>
        </div>

        <div className="container-custom relative z-10">
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
              Join our community of innovators. Share ideas, contribute code, or just stay updated with our latest experiments.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Side - Forms */}
            <div className="space-y-8">
              {/* Pitch Your Idea */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Lightbulb className="w-6 h-6 mr-3 text-yellow-400" />
                  Pitch Your Idea
                </h3>
                
                <form onSubmit={handleCollaborationSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={collaborationForm.name}
                      onChange={(e) => setCollaborationForm(prev => ({ ...prev, name: e.target.value }))}
                      className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={collaborationForm.email}
                      onChange={(e) => setCollaborationForm(prev => ({ ...prev, email: e.target.value }))}
                      className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <select
                    value={collaborationForm.type}
                    onChange={(e) => setCollaborationForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="experiment">New Experiment</option>
                    <option value="improvement">Improvement Idea</option>
                    <option value="collaboration">Collaboration Proposal</option>
                    <option value="other">Other</option>
                  </select>
                  
                  <textarea
                    placeholder="Describe your idea..."
                    value={collaborationForm.idea}
                    onChange={(e) => setCollaborationForm(prev => ({ ...prev, idea: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    required
                  />
                  
                  <button
                    type="submit"
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    <Rocket className="mr-2" size={20} />
                    Submit Idea
                  </button>
                </form>
              </motion.div>

              {/* Newsletter */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl p-8 border border-blue-500/30"
              >
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Bell className="w-6 h-6 mr-3 text-blue-400" />
                  Join Our Labs Newsletter
                </h3>
                <p className="text-gray-300 mb-6">
                  Get notified when we drop new experiments, behind-the-scenes content, and early access to beta features.
                </p>
                
                <form onSubmit={handleSubscribe} className="flex space-x-3">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Subscribe
                  </button>
                </form>
                
                {subscribed && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm"
                  >
                    🎉 You've been added to our next Lab Drop!
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Right Side - Community */}
            <div className="space-y-8">
              {/* GitHub Repos */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Github className="w-6 h-6 mr-3" />
                  View on GitHub
                </h3>
                
                <div className="space-y-4">
                  {experiments.slice(0, 3).map((experiment) => (
                    <div key={experiment.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center">
                        <experiment.icon className="w-5 h-5 text-blue-400 mr-3" />
                        <div>
                          <div className="font-medium text-white">{experiment.title}</div>
                          <div className="text-sm text-gray-400">{experiment.stats.forks} forks • {experiment.stats.likes} stars</div>
                        </div>
                      </div>
                      <a
                        href={experiment.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  ))}
                </div>
                
                <a
                  href="https://github.com/pixeloria"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full mt-6 py-3 text-center border border-gray-600 text-white rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  View All Repositories
                </a>
              </motion.div>

              {/* Contributors Wall */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Users className="w-6 h-6 mr-3 text-green-400" />
                  Contributors Wall
                </h3>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {contributors.map((contributor) => (
                    <motion.div
                      key={contributor.id}
                      className="text-center group cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        src={contributor.avatar}
                        alt={contributor.name}
                        className="w-16 h-16 rounded-full mx-auto mb-2 object-cover border-2 border-gray-600 group-hover:border-blue-400 transition-colors"
                      />
                      <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                        {contributor.name.split(' ')[0]}
                      </div>
                      <div className="text-xs text-gray-400">{contributor.contributions} commits</div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="text-center">
                  <span className="text-gray-400 text-sm">Want to see your face here?</span>
                  <a href="#" className="text-blue-400 hover:text-blue-300 ml-2 text-sm font-medium">
                    Start Contributing →
                  </a>
                </div>
              </motion.div>

              {/* Open Issues */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <GitBranch className="w-6 h-6 mr-3 text-orange-400" />
                  Open Issues
                </h3>
                
                <div className="space-y-3">
                  {[
                    { title: "Add dark mode to Color Generator", label: "enhancement", difficulty: "good first issue" },
                    { title: "Performance optimization for Animation Tester", label: "performance", difficulty: "intermediate" },
                    { title: "Add export functionality to A/B Tester", label: "feature", difficulty: "advanced" }
                  ].map((issue, index) => (
                    <div key={index} className="p-3 bg-gray-700/30 rounded-lg">
                      <div className="font-medium text-white mb-1">{issue.title}</div>
                      <div className="flex space-x-2">
                        <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                          {issue.label}
                        </span>
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                          {issue.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <a
                  href="https://github.com/pixeloria/labs/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full mt-4 py-3 text-center border border-gray-600 text-white rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  View All Issues
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SUBSCRIBE + STAY UPDATED */}
      <section className="py-20 relative overflow-hidden">
        {/* Neon-themed Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
          
          {/* Matrix-style Animation */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-green-400 font-mono text-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  y: [0, -100],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              >
                {Math.random().toString(36).substring(7)}
              </motion.div>
            ))}
          </div>
          
          {/* Animated Glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"
            animate={{
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Ready to Experiment?
            </h2>
            
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of developers and designers pushing the boundaries of what's possible on the web.
            </p>

            {/* Final CTA */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
              <motion.a
                href="#experiments"
                className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Rocket className="mr-2" size={20} />
                Start Experimenting
                <ArrowRight className="ml-2" size={20} />
              </motion.a>
              
              <motion.a
                href="https://github.com/pixeloria/labs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 rounded-full border-2 border-white/20 text-white font-bold text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="mr-2" size={20} />
                Contribute on GitHub
                <ExternalLink className="ml-2" size={20} />
              </motion.a>
            </div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50"
            >
              <div className="flex items-center justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl text-gray-300 italic mb-4">
                "Pixeloria Labs is where I go to discover the future of web development. 
                Every experiment teaches me something new."
              </blockquote>
              <cite className="text-blue-400 font-semibold">— Alex Chen, Senior Developer at Vercel</cite>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Labs;