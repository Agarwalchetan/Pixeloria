import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  Code, ShoppingCart, Laptop, Database, Settings, LineChart, Palette, Globe, 
  Rocket, Server, Shield, Zap, ArrowRight, ChevronDown, ChevronRight, Search,
  Play, ExternalLink, Check, Star, Users, Clock, Award, Target, Brain,
  Coffee, Heart, Eye, MousePointer, Sparkles, Filter, X, Plus, Minus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ProjectCalculator from '../components/ProjectCalculator';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  techStack: string[];
  features: string[];
  subFeatures: Array<{
    title: string;
    description: string;
    icon: React.ComponentType<any>;
  }>;
  cta: string;
  gradient: string;
  businessOwnerBenefit: string;
  techTeamBenefit: string;
}

const Services: React.FC = () => {
  const [userType, setUserType] = useState<'business' | 'tech'>('business');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [expandedProcess, setExpandedProcess] = useState<number | null>(null);
  const [selectedTechCategory, setSelectedTechCategory] = useState('Frontend');
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const services: Service[] = [
    {
      id: 'web-design',
      title: 'Web Design',
      description: 'Beautiful, conversion-focused designs that captivate your audience',
      icon: Palette,
      techStack: ['Figma', 'Adobe XD', 'Framer', 'Webflow'],
      features: ['Custom Design Systems', 'Mobile-First Approach', 'SEO Optimization', 'Performance Focus'],
      subFeatures: [
        { title: 'Mobile-First', description: 'Responsive design for all devices', icon: Globe },
        { title: 'SEO Optimized', description: 'Built for search engine visibility', icon: Target },
        { title: 'Fast Loading', description: 'Optimized for Core Web Vitals', icon: Zap }
      ],
      cta: 'Start Design Project',
      gradient: 'from-pink-500 to-purple-600',
      businessOwnerBenefit: 'Increase conversions by 40% with professional design',
      techTeamBenefit: 'Design systems and component libraries for scalability'
    },
    {
      id: 'ecommerce',
      title: 'E-Commerce',
      description: 'Powerful online stores that convert visitors into customers',
      icon: ShoppingCart,
      techStack: ['Shopify', 'WooCommerce', 'Stripe', 'PayPal'],
      features: ['Secure Checkout', 'Inventory Management', 'Payment Integration', 'Analytics Dashboard'],
      subFeatures: [
        { title: 'Secure Checkout', description: 'PCI compliant payment processing', icon: Shield },
        { title: 'Inventory Management', description: 'Real-time stock tracking', icon: Database },
        { title: 'Analytics Dashboard', description: 'Sales insights and reporting', icon: LineChart }
      ],
      cta: 'Build Online Store',
      gradient: 'from-green-500 to-emerald-600',
      businessOwnerBenefit: 'Boost online sales by 60% with optimized checkout',
      techTeamBenefit: 'Headless commerce solutions with modern APIs'
    },
    {
      id: 'web-apps',
      title: 'Web Applications',
      description: 'Custom applications that streamline your business processes',
      icon: Laptop,
      techStack: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
      features: ['User Authentication', 'Real-time Updates', 'Cloud Integration', 'API Development'],
      subFeatures: [
        { title: 'Real-time Sync', description: 'Live data updates across devices', icon: Zap },
        { title: 'User Management', description: 'Secure authentication systems', icon: Users },
        { title: 'Cloud Integration', description: 'Scalable cloud infrastructure', icon: Server }
      ],
      cta: 'Build Custom App',
      gradient: 'from-blue-500 to-cyan-600',
      businessOwnerBenefit: 'Automate workflows and increase productivity by 10x',
      techTeamBenefit: 'Modern tech stack with TypeScript and microservices'
    },
    {
      id: 'cms',
      title: 'CMS Solutions',
      description: 'Easy-to-use content management for your team',
      icon: Database,
      techStack: ['Strapi', 'Sanity', 'WordPress', 'Contentful'],
      features: ['Content Workflow', 'User Roles', 'Media Management', 'SEO Tools'],
      subFeatures: [
        { title: 'Content Workflow', description: 'Streamlined publishing process', icon: Settings },
        { title: 'Media Management', description: 'Organized asset library', icon: Eye },
        { title: 'SEO Tools', description: 'Built-in optimization features', icon: Target }
      ],
      cta: 'Setup CMS',
      gradient: 'from-orange-500 to-red-600',
      businessOwnerBenefit: 'Update content 90% faster with intuitive CMS',
      techTeamBenefit: 'Headless CMS with GraphQL and REST APIs'
    },
    {
      id: 'api',
      title: 'API Development',
      description: 'Robust backend solutions that power your applications',
      icon: Server,
      techStack: ['Node.js', 'GraphQL', 'REST', 'WebSocket'],
      features: ['RESTful APIs', 'GraphQL', 'Real-time Data', 'Third-party Integrations'],
      subFeatures: [
        { title: 'GraphQL APIs', description: 'Efficient data fetching', icon: Code },
        { title: 'Real-time Data', description: 'WebSocket connections', icon: Zap },
        { title: 'Integrations', description: 'Third-party service connections', icon: Settings }
      ],
      cta: 'Build API',
      gradient: 'from-indigo-500 to-purple-600',
      businessOwnerBenefit: 'Connect all your tools with seamless integrations',
      techTeamBenefit: 'Scalable APIs with comprehensive documentation'
    },
    {
      id: 'optimization',
      title: 'Performance',
      description: 'Optimize for speed and maximum conversions',
      icon: Zap,
      techStack: ['Lighthouse', 'GTMetrix', 'Core Web Vitals', 'CDN'],
      features: ['Speed Optimization', 'Core Web Vitals', 'Conversion Tracking', 'A/B Testing'],
      subFeatures: [
        { title: 'Speed Optimization', description: 'Sub-second load times', icon: Zap },
        { title: 'Core Web Vitals', description: 'Google ranking factors', icon: Target },
        { title: 'A/B Testing', description: 'Data-driven improvements', icon: LineChart }
      ],
      cta: 'Optimize Performance',
      gradient: 'from-yellow-500 to-orange-600',
      businessOwnerBenefit: 'Improve conversions by 3x with faster loading',
      techTeamBenefit: 'Performance monitoring and optimization tools'
    }
  ];

  const processSteps = [
    {
      id: 1,
      title: 'Discover',
      icon: Search,
      description: 'Deep dive into your goals and requirements',
      details: [
        'Stakeholder interviews and requirement gathering',
        'Competitive analysis and market research',
        'Technical feasibility assessment',
        'Project scope and timeline definition'
      ],
      mockup: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 2,
      title: 'Design',
      icon: Palette,
      description: 'Create wireframes, prototypes & UI designs',
      details: [
        'User experience research and personas',
        'Wireframing and information architecture',
        'Visual design and brand integration',
        'Interactive prototypes and user testing'
      ],
      mockup: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 3,
      title: 'Develop',
      icon: Code,
      description: 'Build with clean, scalable, modular code',
      details: [
        'Frontend development with modern frameworks',
        'Backend API development and database design',
        'Third-party integrations and services',
        'Code review and quality assurance'
      ],
      mockup: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 4,
      title: 'Test & Refine',
      icon: Shield,
      description: 'QA, performance, and browser testing',
      details: [
        'Cross-browser and device testing',
        'Performance optimization and monitoring',
        'Security audits and vulnerability testing',
        'User acceptance testing and feedback'
      ],
      mockup: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 5,
      title: 'Launch & Support',
      icon: Rocket,
      description: 'Deployment and post-launch assistance',
      details: [
        'Production deployment and monitoring',
        'Team training and documentation',
        'Performance monitoring and analytics',
        'Ongoing maintenance and support'
      ],
      mockup: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  const techStack = {
    Frontend: [
      { name: 'React', popularity: 95, icon: '⚛️' },
      { name: 'Next.js', popularity: 90, icon: '▲' },
      { name: 'TypeScript', popularity: 88, icon: '📘' },
      { name: 'Tailwind CSS', popularity: 85, icon: '🎨' },
      { name: 'Framer Motion', popularity: 80, icon: '🎭' },
      { name: 'Three.js', popularity: 70, icon: '🎲' }
    ],
    Backend: [
      { name: 'Node.js', popularity: 92, icon: '🟢' },
      { name: 'Express', popularity: 88, icon: '🚂' },
      { name: 'GraphQL', popularity: 85, icon: '🔗' },
      { name: 'PostgreSQL', popularity: 82, icon: '🐘' },
      { name: 'MongoDB', popularity: 78, icon: '🍃' },
      { name: 'Redis', popularity: 75, icon: '🔴' }
    ],
    DevOps: [
      { name: 'Docker', popularity: 90, icon: '🐳' },
      { name: 'AWS', popularity: 88, icon: '☁️' },
      { name: 'Vercel', popularity: 85, icon: '▲' },
      { name: 'GitHub Actions', popularity: 82, icon: '🔄' },
      { name: 'Kubernetes', popularity: 75, icon: '⚙️' },
      { name: 'Terraform', popularity: 70, icon: '🏗️' }
    ],
    CMS: [
      { name: 'Strapi', popularity: 85, icon: '🚀' },
      { name: 'Sanity', popularity: 82, icon: '✨' },
      { name: 'Contentful', popularity: 80, icon: '📝' },
      { name: 'WordPress', popularity: 75, icon: '📰' },
      { name: 'Ghost', popularity: 70, icon: '👻' },
      { name: 'Prismic', popularity: 65, icon: '🔷' }
    ],
    Tools: [
      { name: 'Figma', popularity: 95, icon: '🎨' },
      { name: 'VS Code', popularity: 92, icon: '💻' },
      { name: 'Postman', popularity: 88, icon: '📮' },
      { name: 'Git', popularity: 98, icon: '📚' },
      { name: 'Slack', popularity: 85, icon: '💬' },
      { name: 'Notion', popularity: 80, icon: '📋' }
    ]
  };

  const faqs = [
    {
      question: "How long does a typical project take?",
      answer: "Project timelines vary based on complexity. A simple website might take 4-6 weeks, while a complex web application could take 3-6 months. We'll provide a detailed timeline during our initial consultation.",
      tags: ["timeline", "project", "duration"]
    },
    {
      question: "What is your development process?",
      answer: "We follow a proven 5-step methodology: Discover, Design, Develop, Test & Refine, and Launch & Support. Each phase includes regular client check-ins and deliverables.",
      tags: ["process", "methodology", "workflow"]
    },
    {
      question: "Do you provide ongoing support?",
      answer: "Yes, we offer various maintenance plans to keep your site secure, up-to-date, and performing optimally. This includes regular updates, security patches, and technical support.",
      tags: ["support", "maintenance", "ongoing"]
    },
    {
      question: "Can we update the content ourselves?",
      answer: "Absolutely! We build sites with user-friendly content management systems (CMS) and provide comprehensive training so you can easily update content without technical expertise.",
      tags: ["cms", "content", "updates", "training"]
    },
    {
      question: "What technologies do you use?",
      answer: "We use modern, proven technologies like React, Next.js, Node.js, and various databases. The specific stack is chosen based on your project's requirements to ensure the best performance and scalability.",
      tags: ["technology", "stack", "tools"]
    },
    {
      question: "How much does a project cost?",
      answer: "Project costs vary based on scope and complexity. We offer transparent pricing and will provide a detailed quote after understanding your requirements. Use our calculator below for an estimate.",
      tags: ["cost", "pricing", "budget", "quote"]
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
    faq.answer.toLowerCase().includes(faqSearch.toLowerCase()) ||
    faq.tags.some(tag => tag.toLowerCase().includes(faqSearch.toLowerCase()))
  );

  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <div className="bg-gray-900 overflow-hidden">
      {/* SECTION 1: Hero - Bold First Impression */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
          
          {/* Floating Particles */}
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

          {/* Gradient Pulse */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"
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

        <motion.div 
          className="container-custom relative z-10"
          style={{ y, opacity }}
        >
          <div className="max-w-4xl">
            {/* User Type Toggle */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="inline-flex items-center bg-gray-800/50 backdrop-blur-sm rounded-full p-1 border border-gray-700/50">
                <button
                  onClick={() => setUserType('business')}
                  className={`px-6 py-2 rounded-full transition-all duration-300 ${
                    userType === 'business'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  🏢 I'm a Business Owner
                </button>
                <button
                  onClick={() => setUserType('tech')}
                  className={`px-6 py-2 rounded-full transition-all duration-300 ${
                    userType === 'tech'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  👨‍💻 I'm a Tech Team
                </button>
              </div>
            </motion.div>

            {/* Animated Headlines */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
            >
              Full-Stack Expertise.
              <br />
              Tailored Solutions.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl"
            >
              {userType === 'business' 
                ? "From concept to launch, we build digital products that grow your business and delight your customers."
                : "From wireframe to deployment, we architect scalable solutions with modern tech stacks and best practices."
              }
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <a
                href="#services"
                className="btn-primary group relative overflow-hidden inline-flex items-center"
              >
                <span className="relative z-10 flex items-center">
                  Explore Services
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:scale-110 transition-transform duration-500"></div>
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: Service Category Grid */}
      <section id="services" className="py-20 relative">
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
              What We Offer
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {userType === 'business'
                ? "Comprehensive solutions to accelerate your business growth"
                : "Modern development services with cutting-edge technologies"
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <motion.div
                  className="h-full bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden cursor-pointer transition-all duration-500 hover:bg-gray-800/50 hover:border-gray-600/50 hover:shadow-2xl hover:shadow-blue-500/10"
                  whileHover={{ y: -10, scale: 1.02 }}
                  onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="relative p-8 h-full flex flex-col">
                    {/* Icon */}
                    <motion.div 
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} p-4 mb-6 shadow-lg`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <service.icon className="w-full h-full text-white" />
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-400 mb-4 flex-grow">
                      {service.description}
                    </p>

                    {/* Benefit Badge */}
                    <div className="mb-4">
                      <span className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 font-medium">
                        {userType === 'business' ? service.businessOwnerBenefit : service.techTeamBenefit}
                      </span>
                    </div>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {service.techStack.slice(0, 3).map((tech, techIndex) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: techIndex * 0.1 }}
                          className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${service.gradient} text-white font-medium`}
                        >
                          {tech}
                        </motion.span>
                      ))}
                      {service.techStack.length > 3 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                          +{service.techStack.length - 3}
                        </span>
                      )}
                    </div>

                    {/* CTA */}
                    <button className="w-full py-3 rounded-lg bg-gray-700/50 text-white font-medium hover:bg-gray-600/50 transition-colors group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600">
                      View Details
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Service Details Modal */}
      <AnimatePresence>
        {selectedService && selectedServiceData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedServiceData.gradient} p-4`}>
                      <selectedServiceData.icon className="w-full h-full text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white">{selectedServiceData.title}</h3>
                      <p className="text-gray-400">{selectedServiceData.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Sub-features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {selectedServiceData.subFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-700/30 rounded-xl p-6 text-center"
                    >
                      <feature.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                      <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Features List */}
                <div className="mb-8">
                  <h4 className="text-xl font-bold text-white mb-4">What's Included</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedServiceData.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <Check className="w-5 h-5 text-green-400" />
                        <span className="text-gray-300">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="mb-8">
                  <h4 className="text-xl font-bold text-white mb-4">Technology Stack</h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedServiceData.techStack.map((tech, index) => (
                      <span
                        key={index}
                        className={`px-4 py-2 rounded-lg bg-gradient-to-r ${selectedServiceData.gradient} text-white font-medium`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex space-x-4">
                  <Link
                    to="/contact"
                    className={`flex-1 py-4 rounded-lg bg-gradient-to-r ${selectedServiceData.gradient} text-white font-semibold text-center hover:opacity-90 transition-opacity`}
                  >
                    {selectedServiceData.cta}
                  </Link>
                  <Link
                    to="/cost-estimator"
                    className="flex-1 py-4 rounded-lg border border-gray-600 text-white font-semibold text-center hover:bg-gray-700/50 transition-colors"
                  >
                    Get Quote
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECTION 4: Development Process Timeline */}
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
              Our Development Process
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A proven 5-step methodology that ensures quality results and transparent communication
            </p>
          </motion.div>

          <div className="relative max-w-6xl mx-auto">
            {/* Progress Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-purple-500 opacity-30"></div>

            {processSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-16 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                  <motion.div
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 cursor-pointer"
                    whileHover={{ scale: 1.02, y: -5 }}
                    onClick={() => setExpandedProcess(expandedProcess === index ? null : index)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                      <ChevronDown 
                        className={`w-6 h-6 text-gray-400 transition-transform ${
                          expandedProcess === index ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>
                    <p className="text-gray-400 mb-4">{step.description}</p>
                    
                    <AnimatePresence>
                      {expandedProcess === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-gray-700 pt-4"
                        >
                          <ul className="space-y-2">
                            {step.details.map((detail, detailIndex) => (
                              <motion.li
                                key={detailIndex}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: detailIndex * 0.1 }}
                                className="flex items-center text-gray-300 text-sm"
                              >
                                <Check className="w-4 h-4 text-green-400 mr-2" />
                                {detail}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Step Icon */}
                <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                {/* Mockup */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'pl-8' : 'pr-8'}`}>
                  <motion.div
                    className="aspect-video rounded-xl overflow-hidden shadow-xl"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      src={step.mockup}
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: Tech Stack Visual Wall */}
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
              Our Tech Stack
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Modern, proven technologies that ensure your project is fast, secure, and scalable
            </p>
          </motion.div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {Object.keys(techStack).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedTechCategory(category)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedTechCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Tech Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTechCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
            >
              {techStack[selectedTechCategory as keyof typeof techStack].map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                  whileHover={{ y: -5, scale: 1.05 }}
                >
                  <div className="text-3xl mb-3">{tech.icon}</div>
                  <h4 className="font-semibold text-white mb-2">{tech.name}</h4>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${tech.popularity}%` }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{tech.popularity}% usage</span>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* SECTION 6: Interactive FAQ */}
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
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Find answers to common questions about our services and process
            </p>
          </motion.div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors"
                >
                  <span className="font-semibold text-white text-lg">{faq.question}</span>
                  <ChevronDown
                    className={`w-6 h-6 text-gray-400 transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-6 text-gray-300 border-t border-gray-700/50 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Original Calculator Section */}
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
              Project Cost Calculator
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Get an instant estimate for your project based on your specific requirements
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <ProjectCalculator />
          </div>
        </div>
      </section>

      {/* SECTION 7: Final CTA */}
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
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Ready to Build Something Amazing?
            </h2>
            
            <p className="text-xl text-gray-300 mb-8">
              {userType === 'business'
                ? "Let's transform your business with cutting-edge technology and exceptional design."
                : "Partner with us to build scalable, maintainable solutions with modern tech stacks."
              }
            </p>

            {/* Client Testimonial */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700/50"
            >
              <div className="flex items-center justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl text-gray-300 italic mb-4">
                "Pixeloria helped us launch a world-class platform in 3 weeks — can't recommend them enough."
              </blockquote>
              <cite className="text-blue-400 font-semibold">— Sarah Johnson, CEO at TechFlow</cite>
            </motion.div>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/contact"
                  className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
                >
                  📅 Book Free Consultation
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/portfolio"
                  className="inline-flex items-center px-8 py-4 rounded-full border-2 border-white/20 text-white font-bold text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                >
                  📄 See How We Work
                  <ExternalLink className="ml-2" size={20} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;