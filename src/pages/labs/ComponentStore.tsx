import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Search, Filter, Grid, List, Star, Download, Copy, 
  Eye, Code, Play, ExternalLink, Heart, Share2, Bookmark,
  Layers, Palette, Zap, Settings, Users, Clock, Award,
  ChevronDown, ChevronRight, Plus, Minus, RotateCcw,
  Monitor, Smartphone, Tablet, Sparkles, Brain, Wand2,
  Package, Tag, Folder, GitFork, MessageSquare, ThumbsUp,
  FileText, Image, Video, Cpu, Database, Globe, Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Component {
  id: string;
  name: string;
  description: string;
  category: string;
  framework: string[];
  tags: string[];
  author: string;
  authorAvatar: string;
  preview: string;
  code: {
    react: string;
    vue: string;
    html: string;
    tailwind: string;
  };
  variants: Array<{
    name: string;
    props: Record<string, any>;
    preview: string;
  }>;
  stats: {
    views: number;
    downloads: number;
    stars: number;
    forks: number;
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lastUpdated: string;
  featured: boolean;
  premium: boolean;
  useCase: string[];
}

interface ComponentKit {
  id: string;
  name: string;
  description: string;
  components: string[];
  preview: string;
  price: number;
  author: string;
  downloads: number;
  rating: number;
}

const ComponentStore: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFramework, setSelectedFramework] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'downloads'>('popular');
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'props' | 'variants'>('preview');
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showFilters, setShowFilters] = useState(false);
  const [savedComponents, setSavedComponents] = useState<string[]>([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  const categories = [
    'All', 'Buttons', 'Cards', 'Forms', 'Navigation', 'Modals', 
    'Tables', 'Charts', 'Layouts', 'Headers', 'Footers', 'Sidebars'
  ];

  const frameworks = ['All', 'React', 'Vue', 'HTML', 'Tailwind', 'Chakra UI', 'Material UI'];

  const components: Component[] = [
    {
      id: 'gradient-button',
      name: 'Gradient Button',
      description: 'Modern gradient button with hover animations and multiple variants',
      category: 'Buttons',
      framework: ['React', 'Tailwind'],
      tags: ['gradient', 'animation', 'hover', 'modern'],
      author: 'Sarah Johnson',
      authorAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      preview: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
      code: {
        react: `import React from 'react';

const GradientButton = ({ children, variant = 'primary', size = 'md', ...props }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
    secondary: 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={\`\${variants[variant]} \${sizes[size]} text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl\`}
      {...props}
    >
      {children}
    </button>
  );
};

export default GradientButton;`,
        vue: `<template>
  <button
    :class="buttonClasses"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'GradientButton',
  props: {
    variant: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: 'md'
    }
  },
  computed: {
    buttonClasses() {
      const variants = {
        primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
        secondary: 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600',
        danger: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
      };

      const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
      };

      return \`\${variants[this.variant]} \${sizes[this.size]} text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl\`;
    }
  }
};
</script>`,
        html: `<button class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
  Click Me
</button>`,
        tailwind: `.gradient-btn {
  @apply bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl;
}`
      },
      variants: [
        { name: 'Primary', props: { variant: 'primary' }, preview: 'primary-preview.jpg' },
        { name: 'Secondary', props: { variant: 'secondary' }, preview: 'secondary-preview.jpg' },
        { name: 'Danger', props: { variant: 'danger' }, preview: 'danger-preview.jpg' }
      ],
      stats: { views: 15420, downloads: 2340, stars: 892, forks: 156 },
      difficulty: 'beginner',
      lastUpdated: '2 days ago',
      featured: true,
      premium: false,
      useCase: ['SaaS', 'Portfolio', 'E-commerce']
    },
    {
      id: 'pricing-card',
      name: 'Pricing Card',
      description: 'Professional pricing card with features list and call-to-action',
      category: 'Cards',
      framework: ['React', 'Tailwind'],
      tags: ['pricing', 'card', 'features', 'cta'],
      author: 'Mike Chen',
      authorAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      preview: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
      code: {
        react: `import React from 'react';
import { Check } from 'lucide-react';

const PricingCard = ({ 
  title, 
  price, 
  period = 'month', 
  features = [], 
  popular = false,
  buttonText = 'Get Started',
  onButtonClick 
}) => {
  return (
    <div className={\`relative bg-white rounded-2xl shadow-xl p-8 \${popular ? 'ring-2 ring-blue-500 scale-105' : ''}\`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-baseline justify-center">
          <span className="text-5xl font-bold text-gray-900">\${price}</span>
          <span className="text-gray-500 ml-2">/{period}</span>
        </div>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-3" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onButtonClick}
        className={\`w-full py-3 px-6 rounded-lg font-semibold transition-colors \${
          popular 
            ? 'bg-blue-500 hover:bg-blue-600 text-white' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
        }\`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default PricingCard;`,
        vue: `<!-- Vue implementation -->`,
        html: `<!-- HTML implementation -->`,
        tailwind: `/* Tailwind implementation */`
      },
      variants: [
        { name: 'Basic', props: { popular: false }, preview: 'basic-preview.jpg' },
        { name: 'Popular', props: { popular: true }, preview: 'popular-preview.jpg' }
      ],
      stats: { views: 12350, downloads: 1890, stars: 743, forks: 98 },
      difficulty: 'intermediate',
      lastUpdated: '1 week ago',
      featured: true,
      premium: false,
      useCase: ['SaaS', 'Landing Page']
    },
    {
      id: 'dashboard-sidebar',
      name: 'Dashboard Sidebar',
      description: 'Responsive sidebar navigation with icons and collapsible sections',
      category: 'Navigation',
      framework: ['React', 'Tailwind'],
      tags: ['sidebar', 'navigation', 'dashboard', 'responsive'],
      author: 'Emily Rodriguez',
      authorAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
      preview: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800',
      code: {
        react: `// Dashboard Sidebar Component`,
        vue: `<!-- Vue implementation -->`,
        html: `<!-- HTML implementation -->`,
        tailwind: `/* Tailwind implementation */`
      },
      variants: [
        { name: 'Expanded', props: { collapsed: false }, preview: 'expanded-preview.jpg' },
        { name: 'Collapsed', props: { collapsed: true }, preview: 'collapsed-preview.jpg' }
      ],
      stats: { views: 8920, downloads: 1456, stars: 567, forks: 89 },
      difficulty: 'advanced',
      lastUpdated: '3 days ago',
      featured: false,
      premium: true,
      useCase: ['Dashboard', 'Admin Panel']
    }
  ];

  const componentKits: ComponentKit[] = [
    {
      id: 'saas-starter',
      name: 'SaaS Starter Kit',
      description: 'Complete component library for SaaS applications',
      components: ['gradient-button', 'pricing-card', 'dashboard-sidebar'],
      preview: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 49,
      author: 'Pixeloria Team',
      downloads: 1250,
      rating: 4.9
    },
    {
      id: 'portfolio-kit',
      name: 'Portfolio Kit',
      description: 'Beautiful components for portfolio websites',
      components: ['gradient-button'],
      preview: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 29,
      author: 'Design Team',
      downloads: 890,
      rating: 4.7
    }
  ];

  const filteredComponents = components.filter(component => {
    const matchesCategory = selectedCategory === 'All' || component.category === selectedCategory;
    const matchesFramework = selectedFramework === 'All' || component.framework.includes(selectedFramework);
    const matchesSearch = component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         component.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesFramework && matchesSearch;
  });

  const sortedComponents = [...filteredComponents].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.stats.stars - a.stats.stars;
      case 'newest':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      case 'downloads':
        return b.stats.downloads - a.stats.downloads;
      default:
        return 0;
    }
  });

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  const toggleSaveComponent = (componentId: string) => {
    setSavedComponents(prev => 
      prev.includes(componentId) 
        ? prev.filter(id => id !== componentId)
        : [...prev, componentId]
    );
  };

  const generateAIComponent = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      // Add generated component to list
    }, 3000);
  };

  const openInSandbox = (component: Component) => {
    // Open in CodeSandbox or StackBlitz
    const files = {
      'package.json': {
        content: JSON.stringify({
          dependencies: {
            'react': '^18.0.0',
            'react-dom': '^18.0.0',
            'tailwindcss': '^3.0.0'
          }
        }, null, 2)
      },
      'src/App.js': {
        content: component.code.react
      }
    };
    
    console.log('Opening in sandbox:', files);
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
                <Package className="w-6 h-6 text-blue-400" />
                <h1 className="text-xl font-bold text-white">Component Store</h1>
                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">BETA</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAIGenerator(!showAIGenerator)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  showAIGenerator ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Brain size={16} className="mr-2" />
                AI Generator
              </button>
              <button className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                <Bookmark size={16} className="mr-2" />
                My Shelf ({savedComponents.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Generator Panel */}
      <AnimatePresence>
        {showAIGenerator && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-b border-gray-700/50"
          >
            <div className="container-custom py-6">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Sparkles size={20} className="mr-2 text-purple-400" />
                  AI Component Generator
                </h3>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Describe the component you want to create..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={generateAIComponent}
                    disabled={isGenerating || !aiPrompt}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold flex items-center disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="mr-2 animate-spin" size={16} />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2" size={16} />
                        Generate
                      </>
                    )}
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    'Create a responsive pricing card with hover animation',
                    'Build a modern navigation bar with dropdown menus',
                    'Design a dashboard widget with charts',
                    'Make a contact form with validation'
                  ].map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setAiPrompt(prompt)}
                      className="text-xs px-3 py-1 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container-custom py-8">
        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                showFilters ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Filter size={16} className="mr-2" />
              Filters
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="downloads">Most Downloaded</option>
            </select>

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
                <div>
                  <h4 className="font-semibold text-white mb-3">Category</h4>
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

                <div>
                  <h4 className="font-semibold text-white mb-3">Framework</h4>
                  <div className="flex flex-wrap gap-2">
                    {frameworks.map((framework) => (
                      <button
                        key={framework}
                        onClick={() => setSelectedFramework(framework)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedFramework === framework
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {framework}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Use Case</h4>
                  <div className="flex flex-wrap gap-2">
                    {['SaaS', 'Portfolio', 'E-commerce', 'Dashboard', 'Landing Page'].map((useCase) => (
                      <button
                        key={useCase}
                        className="px-3 py-1 rounded-full text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                      >
                        {useCase}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Featured Kits */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Featured Kits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {componentKits.map((kit) => (
              <motion.div
                key={kit.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group"
                whileHover={{ y: -5 }}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={kit.preview}
                    alt={kit.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-white">{kit.name}</h3>
                    <span className="text-lg font-bold text-green-400">${kit.price}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{kit.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center">
                        <Download size={14} className="mr-1" />
                        {kit.downloads}
                      </span>
                      <span className="flex items-center">
                        <Star size={14} className="mr-1" />
                        {kit.rating}
                      </span>
                    </div>
                    <span className="text-xs text-blue-400">{kit.components.length} components</span>
                  </div>
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold">
                    View Kit
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Components Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Components ({sortedComponents.length})
            </h2>
            <div className="text-sm text-gray-400">
              Showing {sortedComponents.length} of {components.length} components
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedComponents.map((component, index) => (
                <motion.div
                  key={component.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 group cursor-pointer"
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedComponent(component)}
                >
                  {/* Preview */}
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={component.preview}
                      alt={component.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex space-x-2">
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
                          <Code size={16} />
                        </button>
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
                          <Play size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex space-x-2">
                      {component.featured && (
                        <span className="px-2 py-1 bg-yellow-500 text-black text-xs rounded-full font-medium">
                          Featured
                        </span>
                      )}
                      {component.premium && (
                        <span className="px-2 py-1 bg-purple-500 text-white text-xs rounded-full font-medium">
                          Premium
                        </span>
                      )}
                    </div>

                    {/* Save Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveComponent(component.id);
                      }}
                      className="absolute top-2 right-2 p-2 bg-black/20 backdrop-blur-sm rounded-lg text-white hover:bg-black/40 transition-colors"
                    >
                      <Bookmark 
                        size={16} 
                        className={savedComponents.includes(component.id) ? 'fill-current text-blue-400' : ''} 
                      />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {component.name}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        component.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        component.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {component.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {component.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {component.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">
                          {tag}
                        </span>
                      ))}
                      {component.tags.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">
                          +{component.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Star size={12} className="mr-1" />
                          {component.stats.stars}
                        </span>
                        <span className="flex items-center">
                          <Download size={12} className="mr-1" />
                          {component.stats.downloads}
                        </span>
                      </div>
                      <span>{component.lastUpdated}</span>
                    </div>

                    {/* Author */}
                    <div className="flex items-center mt-3 pt-3 border-t border-gray-700">
                      <img
                        src={component.authorAvatar}
                        alt={component.author}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span className="text-xs text-gray-400">{component.author}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedComponents.map((component, index) => (
                <motion.div
                  key={component.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedComponent(component)}
                >
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={component.preview}
                        alt={component.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">{component.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className="flex items-center">
                            <Star size={14} className="mr-1" />
                            {component.stats.stars}
                          </span>
                          <span className="flex items-center">
                            <Download size={14} className="mr-1" />
                            {component.stats.downloads}
                          </span>
                          <span>{component.lastUpdated}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-3">{component.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {component.framework.map((fw) => (
                            <span key={fw} className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                              {fw}
                            </span>
                          ))}
                          {component.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaveComponent(component.id);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                          >
                            <Bookmark 
                              size={16} 
                              className={savedComponents.includes(component.id) ? 'fill-current text-blue-400' : ''} 
                            />
                          </button>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Component Detail Modal */}
      <AnimatePresence>
        {selectedComponent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedComponent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="bg-gray-800 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-full">
                {/* Left Panel - Preview */}
                <div className="flex-1 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedComponent.name}</h2>
                      <p className="text-gray-400">{selectedComponent.description}</p>
                    </div>
                    <button
                      onClick={() => setSelectedComponent(null)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </div>

                  {/* Device Preview Toggle */}
                  <div className="flex items-center justify-between mb-6">
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

                    <div className="flex space-x-2">
                      <button
                        onClick={() => openInSandbox(selectedComponent)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <ExternalLink size={16} className="mr-2" />
                        Open in Sandbox
                      </button>
                    </div>
                  </div>

                  {/* Preview Area */}
                  <div className={`bg-white rounded-xl p-8 min-h-[400px] flex items-center justify-center transition-all duration-300 ${
                    activeDevice === 'mobile' ? 'max-w-sm mx-auto' :
                    activeDevice === 'tablet' ? 'max-w-md mx-auto' : 'max-w-full'
                  }`}>
                    <div className="text-gray-900">
                      {/* Component Preview would render here */}
                      <div className="text-center">
                        <div className="w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mb-4 mx-auto"></div>
                        <h3 className="text-xl font-bold mb-2">Live Preview</h3>
                        <p className="text-gray-600">Interactive component preview</p>
                        <button className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                          Sample Button
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Code & Details */}
                <div className="w-96 bg-gray-900 border-l border-gray-700 flex flex-col">
                  {/* Tabs */}
                  <div className="flex border-b border-gray-700">
                    {(['preview', 'code', 'props', 'variants'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                          activeTab === tab
                            ? 'text-blue-400 border-b-2 border-blue-400'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'preview' && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-white mb-2">Component Info</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Category:</span>
                              <span className="text-white">{selectedComponent.category}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Difficulty:</span>
                              <span className="text-white">{selectedComponent.difficulty}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Author:</span>
                              <span className="text-white">{selectedComponent.author}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-white mb-2">Frameworks</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedComponent.framework.map((fw) => (
                              <span key={fw} className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                                {fw}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-white mb-2">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedComponent.tags.map((tag) => (
                              <span key={tag} className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-white mb-2">Stats</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-400">{selectedComponent.stats.stars}</div>
                              <div className="text-xs text-gray-400">Stars</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-400">{selectedComponent.stats.downloads}</div>
                              <div className="text-xs text-gray-400">Downloads</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-purple-400">{selectedComponent.stats.views}</div>
                              <div className="text-xs text-gray-400">Views</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-yellow-400">{selectedComponent.stats.forks}</div>
                              <div className="text-xs text-gray-400">Forks</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'code' && (
                      <div className="space-y-4">
                        <div className="flex space-x-2 mb-4">
                          {Object.keys(selectedComponent.code).map((lang) => (
                            <button
                              key={lang}
                              className="px-3 py-1 bg-gray-700 text-gray-300 rounded text-sm hover:bg-gray-600 transition-colors"
                            >
                              {lang.toUpperCase()}
                            </button>
                          ))}
                        </div>
                        
                        <div className="relative">
                          <pre className="bg-gray-800 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
                            <code>{selectedComponent.code.react}</code>
                          </pre>
                          <button
                            onClick={() => copyToClipboard(selectedComponent.code.react, 'React')}
                            className="absolute top-2 right-2 p-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>
                    )}

                    {activeTab === 'variants' && (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-white">Available Variants</h4>
                        {selectedComponent.variants.map((variant, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedVariant(index)}
                            className={`w-full text-left p-4 rounded-lg border transition-colors ${
                              selectedVariant === index
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <div className="font-medium text-white">{variant.name}</div>
                            <div className="text-sm text-gray-400 mt-1">
                              {Object.entries(variant.props).map(([key, value]) => (
                                <span key={key} className="mr-2">
                                  {key}: {String(value)}
                                </span>
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="p-6 border-t border-gray-700 space-y-3">
                    <button
                      onClick={() => toggleSaveComponent(selectedComponent.id)}
                      className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-semibold transition-colors ${
                        savedComponents.includes(selectedComponent.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <Bookmark size={16} className="mr-2" />
                      {savedComponents.includes(selectedComponent.id) ? 'Saved' : 'Save to Shelf'}
                    </button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                        <GitFork size={16} className="mr-2" />
                        Fork
                      </button>
                      <button className="flex items-center justify-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                        <Share2 size={16} className="mr-2" />
                        Share
                      </button>
                    </div>
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

export default ComponentStore;