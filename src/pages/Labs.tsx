import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Beaker, Github, ExternalLink, Play, Code, Palette, Cpu, Brain, 
  Wrench, Globe, Star, Filter, ArrowRight, Zap, Eye, Heart,
  Calendar, User, Tag, Coffee, Lightbulb, Rocket, Target
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
}

const experiments: Experiment[] = [
  {
    id: 1,
    title: "AI-Powered Color Palette Generator",
    description: "Generate beautiful color schemes using machine learning algorithms trained on award-winning designs.",
    category: "AI",
    tags: ["Machine Learning", "Design", "Colors", "API"],
    preview: "https://images.pexels.com/photos/1509428/pexels-photo-1509428.jpeg?auto=compress&cs=tinysrgb&w=800",
    demoUrl: "/labs/color-generator",
    githubUrl: "#",
    featured: true,
    author: "Sarah Johnson",
    date: "2024-03-15",
    status: "live",
    likes: 234
  },
  {
    id: 2,
    title: "Micro-Interaction Library",
    description: "A collection of delightful micro-interactions built with Framer Motion and CSS animations.",
    category: "UI/UX",
    tags: ["Animations", "React", "Framer Motion", "Components"],
    preview: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800",
    demoUrl: "/labs/animation-tester",
    githubUrl: "#",
    author: "Mike Chen",
    date: "2024-03-10",
    status: "live",
    likes: 189
  },
  {
    id: 3,
    title: "Real-time Code Playground",
    description: "Interactive code editor with live preview for HTML, CSS, and JavaScript experimentation.",
    category: "Dev Tools",
    tags: ["Code Editor", "Live Preview", "HTML", "CSS", "JavaScript"],
    preview: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800",
    demoUrl: "/labs/code-playground",
    githubUrl: "#",
    author: "Alex Rodriguez",
    date: "2024-03-05",
    status: "live",
    likes: 156
  },
  {
    id: 4,
    title: "A/B Testing Laboratory",
    description: "Interactive A/B testing tool for comparing different UI variations and measuring performance.",
    category: "Analytics",
    tags: ["A/B Testing", "Analytics", "Conversion", "UI Testing"],
    preview: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800",
    demoUrl: "/labs/ab-testing",
    githubUrl: "#",
    author: "Emily Davis",
    date: "2024-02-28",
    status: "live",
    likes: 298
  },
  {
    id: 5,
    title: "Voice-Controlled UI",
    description: "Experimental interface that responds to voice commands using Web Speech API.",
    category: "AI",
    tags: ["Voice Recognition", "Web Speech API", "Accessibility"],
    preview: "https://images.pexels.com/photos/3861458/pexels-photo-3861458.jpeg?auto=compress&cs=tinysrgb&w=800",
    demoUrl: "#",
    githubUrl: "#",
    author: "David Kim",
    date: "2024-02-20",
    status: "concept",
    likes: 87
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
    likes: 167
  }
];

const categories = ['All', 'UI/UX', 'Animations', 'APIs', 'AI', 'Dev Tools', 'Analytics', 'Open Source'];

const Labs: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredExperiments, setFilteredExperiments] = useState(experiments);
  const [isFilterSticky, setIsFilterSticky] = useState(false);

  const featuredExperiment = experiments.find(exp => exp.featured);
  const regularExperiments = experiments.filter(exp => !exp.featured);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredExperiments(experiments);
    } else {
      setFilteredExperiments(experiments.filter(exp => exp.category === selectedCategory));
    }
  }, [selectedCategory]);

  useEffect(() => {
    const handleScroll = () => {
      setIsFilterSticky(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-purple-500/10 to-transparent"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute w-96 h-96 -top-48 -left-48 bg-blue-500/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute w-96 h-96 -bottom-48 -right-48 bg-purple-500/10 rounded-full blur-3xl"
            animate={{ 
              x: [0, -100, 0],
              y: [0, 50, 0],
              scale: [1.2, 1, 1.2]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute w-64 h-64 top-1/2 left-1/2 bg-pink-500/10 rounded-full blur-2xl"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.5, 1]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 mb-8"
            >
              <Beaker className="w-10 h-10 text-blue-400" />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Pixeloria Labs
            </h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 mb-8"
            >
              Inventing the Future, One Experiment at a Time
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-gray-400 text-lg max-w-2xl mx-auto mb-12"
            >
              Welcome to our digital playground where we push boundaries, test new technologies, 
              and create experimental projects that shape tomorrow's web experiences.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <a
                href="#experiments"
                className="btn-primary group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Explore Experiments
                  <Rocket className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:scale-110 transition-transform duration-500"></div>
              </a>
              <Link
                to="/contact"
                className="btn-outline group"
              >
                Collaborate With Us
                <Coffee className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-gray-300 font-medium">Filter by Category</span>
            </div>
            <div className="text-sm text-gray-400">
              {filteredExperiments.length} experiment{filteredExperiments.length !== 1 ? 's' : ''}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Featured Experiment */}
      {featuredExperiment && selectedCategory === 'All' && (
        <section className="py-16">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-4 left-8 z-10">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold text-sm">
                  <Star className="w-4 h-4 mr-2" />
                  Featured Experiment
                </span>
              </div>
              
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative aspect-video md:aspect-auto">
                    <img
                      src={featuredExperiment.preview}
                      alt={featuredExperiment.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-transparent"></div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(featuredExperiment.status)}`}>
                        {getStatusIcon(featuredExperiment.status)}
                        <span className="ml-1 capitalize">{featuredExperiment.status}</span>
                      </span>
                      <span className="text-blue-400 font-medium">{featuredExperiment.category}</span>
                    </div>
                    
                    <h2 className="text-3xl font-bold mb-4 text-white">
                      {featuredExperiment.title}
                    </h2>
                    
                    <p className="text-gray-300 mb-6 text-lg">
                      {featuredExperiment.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {featuredExperiment.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center">
                          <User size={16} className="mr-1" />
                          {featuredExperiment.author}
                        </span>
                        <span className="flex items-center">
                          <Calendar size={16} className="mr-1" />
                          {new Date(featuredExperiment.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Heart size={16} className="mr-1" />
                          {featuredExperiment.likes}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-4">
                      {featuredExperiment.demoUrl && (
                        <Link
                          to={featuredExperiment.demoUrl}
                          className="btn-primary group flex items-center"
                        >
                          <Play className="mr-2" size={18} />
                          Live Demo
                          <ExternalLink className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                        </Link>
                      )}
                      {featuredExperiment.githubUrl && (
                        <a
                          href={featuredExperiment.githubUrl}
                          className="btn-outline group flex items-center"
                        >
                          <Github className="mr-2" size={18} />
                          Source Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Experiments Grid */}
      <section id="experiments" className="py-20">
        <div className="container-custom">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredExperiments.filter(exp => !exp.featured || selectedCategory !== 'All').map((experiment, index) => (
                <motion.div
                  key={experiment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={experiment.preview}
                      alt={experiment.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4 flex space-x-2">
                        {experiment.demoUrl && (
                          <Link
                            to={experiment.demoUrl}
                            className="flex-1 bg-white/20 backdrop-blur-sm text-white text-center py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center"
                          >
                            <Play size={16} className="mr-1" />
                            Demo
                          </Link>
                        )}
                        {experiment.githubUrl && (
                          <a
                            href={experiment.githubUrl}
                            className="flex-1 bg-white/20 backdrop-blur-sm text-white text-center py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center"
                          >
                            <Github size={16} className="mr-1" />
                            Code
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(experiment.status)}`}>
                        {getStatusIcon(experiment.status)}
                        <span className="ml-1 capitalize">{experiment.status}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
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
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {experiment.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded-md bg-gray-700/50 text-gray-300 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {experiment.tags.length > 3 && (
                        <span className="px-2 py-1 rounded-md bg-gray-700/50 text-gray-300 text-xs">
                          +{experiment.tags.length - 3}
                        </span>
                      )}
                    </div>
                    
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
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Test Zone */}
      <section className="py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Test Zone
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Interactive playground where you can test our experimental tools and components.
            </p>
          </motion.div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Palette, title: "Color Generator", desc: "Test AI color palettes", link: "/labs/color-generator" },
                { icon: Zap, title: "Animation Tester", desc: "Preview micro-interactions", link: "/labs/animation-tester" },
                { icon: Code, title: "Code Playground", desc: "Live code editor", link: "/labs/code-playground" },
                { icon: Target, title: "A/B Testing", desc: "Compare variations", link: "/labs/ab-testing" }
              ].map((tool, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-6 rounded-xl bg-gray-700/30 hover:bg-gray-700/50 transition-colors cursor-pointer group"
                >
                  <Link to={tool.link} className="block">
                    <tool.icon className="w-8 h-8 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-white mb-2">{tool.title}</h3>
                    <p className="text-gray-400 text-sm">{tool.desc}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Behind the Build Section */}
      <section className="py-20 bg-gradient-to-b from-gray-800/50 to-gray-900/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Behind the Build
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Dive deeper into our development process with detailed write-ups and technical insights.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Building Real-time Collaboration",
                excerpt: "How we implemented WebSocket connections for seamless multi-user experiences.",
                readTime: "5 min read",
                date: "March 15, 2024"
              },
              {
                title: "AI Color Theory in Practice",
                excerpt: "The machine learning algorithms behind our intelligent color palette generator.",
                readTime: "8 min read",
                date: "March 10, 2024"
              },
              {
                title: "Performance Optimization Techniques",
                excerpt: "Advanced strategies for building lightning-fast web applications.",
                readTime: "6 min read",
                date: "March 5, 2024"
              }
            ].map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 group cursor-pointer"
              >
                <h3 className="text-lg font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-400 mb-4 text-sm">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{article.readTime}</span>
                  <span>{article.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Collaborate */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Ready to Collaborate?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Have an experimental idea? Want to contribute to our open-source projects? 
              Let's build the future of web together.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contact"
                className="btn-primary group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Pitch Your Idea
                  <Lightbulb className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:scale-110 transition-transform duration-500"></div>
              </Link>
              <a
                href="https://github.com/pixeloria"
                className="btn-outline group flex items-center"
              >
                <Github className="mr-2" size={20} />
                View on GitHub
                <ExternalLink className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-b from-gray-800/50 to-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white"
          >
            <h3 className="text-2xl font-bold mb-4">Get Monthly Lab Drops</h3>
            <p className="mb-6 text-blue-100">
              Be the first to know about our latest experiments and get exclusive access to beta features.
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-l-lg sm:rounded-r-none rounded-r-lg mb-2 sm:mb-0 bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="px-6 py-3 bg-white text-blue-600 rounded-r-lg sm:rounded-l-none rounded-l-lg font-semibold hover:bg-blue-50 transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Labs;