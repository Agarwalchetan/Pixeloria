import React, { useState, useRef, useEffect } from 'react';
import Hero from '../components/Hero';
import SectionHeader from '../components/SectionHeader';
import { 
  Code, ShoppingCart, Laptop, Database, Settings, LineChart, Star, Zap, Users, Clock, 
  CheckCircle, ArrowRight, Calculator, ExternalLink, Play, Filter, Award, TrendingUp,
  Globe, Palette, Server, Shield, Eye, Heart, Quote, ChevronLeft, ChevronRight,
  Sparkles, Target, Coffee, Rocket, Brain, MousePointer
} from 'lucide-react';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { portfolioApi, servicesApi } from '../utils/api';

const Home: React.FC = () => {
  // Interactive Services State
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  // Projects Carousel State
  const [currentProject, setCurrentProject] = useState(0);
  const [projectFilter, setProjectFilter] = useState('All');

  // Testimonials State
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [testimonialFilter, setTestimonialFilter] = useState('All');

  // Count-up animation state
  const [countsStarted, setCountsStarted] = useState(false);
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true });
  
  // API Data State
  const [apiProjects, setApiProjects] = useState<any[]>([]);
  const [apiServices, setApiServices] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  const services = [
    {
      id: 'web-design',
      title: 'Web Design',
      shortDesc: 'Beautiful, responsive websites',
      description: 'Stunning, conversion-focused designs that captivate your audience and drive business results.',
      icon: Palette,
      color: 'from-blue-500 to-cyan-500',
      techStack: ['Figma', 'Adobe XD', 'Framer', 'Webflow'],
      features: ['Custom Design Systems', 'Mobile-First Approach', 'SEO Optimization', 'Performance Focus'],
      results: '+40% conversion rates on average'
    },
    {
      id: 'ecommerce',
      title: 'E-Commerce',
      shortDesc: 'Powerful online stores',
      description: 'Full-featured e-commerce platforms that convert visitors into loyal customers.',
      icon: ShoppingCart,
      color: 'from-green-500 to-emerald-500',
      techStack: ['Shopify', 'WooCommerce', 'Stripe', 'PayPal'],
      features: ['Secure Checkout', 'Inventory Management', 'Payment Integration', 'Analytics Dashboard'],
      results: '+60% sales increase typical'
    },
    {
      id: 'web-apps',
      title: 'Web Applications',
      shortDesc: 'Custom web applications',
      description: 'Scalable web applications that streamline your business processes and enhance productivity.',
      icon: Laptop,
      color: 'from-purple-500 to-pink-500',
      techStack: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
      features: ['User Authentication', 'Real-time Updates', 'Cloud Integration', 'API Development'],
      results: '10x faster workflows'
    },
    {
      id: 'cms',
      title: 'CMS Solutions',
      shortDesc: 'Content management systems',
      description: 'Easy-to-use content management systems that empower your team to update content effortlessly.',
      icon: Database,
      color: 'from-orange-500 to-red-500',
      techStack: ['Strapi', 'Sanity', 'WordPress', 'Contentful'],
      features: ['Content Workflow', 'User Roles', 'Media Management', 'SEO Tools'],
      results: '90% faster content updates'
    },
    {
      id: 'api',
      title: 'API Development',
      shortDesc: 'Robust backend solutions',
      description: 'Scalable APIs and backend solutions that power your applications and integrations.',
      icon: Server,
      color: 'from-indigo-500 to-blue-500',
      techStack: ['Node.js', 'GraphQL', 'REST', 'WebSocket'],
      features: ['RESTful APIs', 'GraphQL', 'Real-time Data', 'Third-party Integrations'],
      results: '99.9% uptime guaranteed'
    },
    {
      id: 'optimization',
      title: 'Performance',
      shortDesc: 'Speed & conversion optimization',
      description: 'Optimize your website for lightning-fast performance and maximum conversions.',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      techStack: ['Lighthouse', 'GTMetrix', 'Core Web Vitals', 'CDN'],
      features: ['Speed Optimization', 'Core Web Vitals', 'Conversion Tracking', 'A/B Testing'],
      results: '3x faster load times'
    }
  ];

  const featuredProjects = [
    {
      id: 1,
      title: "TechFlow SaaS Platform",
      brand: "TechFlow",
      industry: "SaaS",
      description: "AI-powered project management platform with real-time collaboration",
      image: "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Web Application",
      highlights: ["+150% user engagement", "0.8s load time", "Real-time collaboration"],
      techStack: ["Next.js", "TypeScript", "WebSocket", "PostgreSQL"],
      link: "/portfolio",
      featured: true
    },
    {
      id: 2,
      title: "EcoStore E-Commerce",
      brand: "EcoStore",
      industry: "E-Commerce",
      description: "Sustainable products marketplace with carbon footprint tracking",
      image: "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "E-Commerce",
      highlights: ["+200% conversion rate", "Mobile-first design", "Eco-tracking features"],
      techStack: ["Shopify", "React", "Stripe", "Analytics"],
      link: "/portfolio",
      featured: true
    },
    {
      id: 3,
      title: "FinanceAI Dashboard",
      brand: "FinanceAI",
      industry: "Fintech",
      description: "Advanced financial analytics dashboard with AI insights",
      image: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Web Application",
      highlights: ["Real-time analytics", "AI predictions", "Bank-grade security"],
      techStack: ["React", "D3.js", "Python", "AWS"],
      link: "/portfolio",
      featured: true
    },
    {
      id: 4,
      title: "HealthCare Portal",
      brand: "MedConnect",
      industry: "Healthcare",
      description: "Patient management system with telemedicine capabilities",
      image: "https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      category: "Web Application",
      highlights: ["HIPAA compliant", "Video consultations", "Patient records"],
      techStack: ["React", "Node.js", "WebRTC", "MongoDB"],
      link: "/portfolio",
      featured: false
    }
  ];

  const whyChooseUsData = [
    {
      id: 'speed',
      icon: Zap,
      title: 'Built for Speed',
      tagline: 'Lightning-Fast Performance',
      description: 'Optimized for Core Web Vitals and conversion',
      metric: '3x',
      metricLabel: 'Faster Load Times',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: 'conversion',
      icon: Target,
      title: 'Design That Converts',
      tagline: 'Results-Driven Design',
      description: 'Every pixel optimized for user engagement',
      metric: '+40%',
      metricLabel: 'Avg. Conversion Boost',
      color: 'from-green-400 to-emerald-500'
    },
    {
      id: 'expertise',
      icon: Brain,
      title: 'Expert Team',
      tagline: 'Senior-Level Talent',
      description: '10+ years average experience per developer',
      metric: '50+',
      metricLabel: 'Projects Delivered',
      color: 'from-blue-400 to-purple-500'
    },
    {
      id: 'support',
      icon: Coffee,
      title: 'Always Available',
      tagline: '24/7 Support',
      description: 'Round-the-clock support and maintenance',
      metric: '99.9%',
      metricLabel: 'Uptime Guarantee',
      color: 'from-pink-400 to-red-500'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "CEO",
      company: "TechFlow",
      industry: "SaaS",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
      quote: "Pixeloria transformed our vision into a stunning reality. The attention to detail and technical expertise exceeded our expectations.",
      fullQuote: "Working with Pixeloria was a game-changer for our business. They didn't just build us a website; they created a digital experience that our users love. The team's attention to detail, technical expertise, and commitment to our success exceeded all expectations. Our conversion rates increased by 150% within the first month of launch.",
      rating: 5,
      projectType: "SaaS Platform",
      results: "+150% conversion rate",
      featured: true
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Founder",
      company: "EcoStore",
      industry: "E-Commerce",
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
      quote: "The e-commerce platform they built for us is not just beautiful, but incredibly functional. Sales increased by 200% in the first quarter.",
      fullQuote: "The team at Pixeloria understood our mission to create a sustainable e-commerce platform from day one. They built us a beautiful, fast, and feature-rich store that perfectly represents our brand values. The carbon footprint tracking feature they suggested has become one of our most loved features by customers.",
      rating: 5,
      projectType: "E-Commerce Store",
      results: "+200% sales increase",
      featured: true
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "CTO",
      company: "FinanceAI",
      industry: "Fintech",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
      quote: "Their technical expertise in building our AI-powered dashboard was exceptional. The real-time analytics are exactly what we needed.",
      fullQuote: "Building a fintech product requires the highest standards of security and performance. Pixeloria delivered on both fronts while creating an intuitive user experience that our clients love. The real-time analytics dashboard they built has become the cornerstone of our platform.",
      rating: 5,
      projectType: "Fintech Dashboard",
      results: "Bank-grade security",
      featured: true
    },
    {
      id: 4,
      name: "David Kim",
      role: "Director",
      company: "MedConnect",
      industry: "Healthcare",
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
      quote: "HIPAA-compliant development with excellent UX. The telemedicine features work flawlessly across all devices.",
      fullQuote: "Healthcare technology demands perfection, and Pixeloria delivered exactly that. The patient portal they built is not only HIPAA-compliant but also incredibly user-friendly. The telemedicine integration has revolutionized how we connect with our patients.",
      rating: 5,
      projectType: "Healthcare Portal",
      results: "HIPAA compliant",
      featured: false
    }
  ];

  const trustMetrics = [
    { number: 50, label: "Projects Delivered", suffix: "+" },
    { number: 4.9, label: "Average Rating", suffix: "/5" },
    { number: 99, label: "Project Success Rate", suffix: "%" },
    { number: 24, label: "Support Hours", suffix: "/7" }
  ];

  const clientLogos = [
    { name: "TechFlow", logo: "🚀" },
    { name: "EcoStore", logo: "🌱" },
    { name: "FinanceAI", logo: "💰" },
    { name: "MedConnect", logo: "🏥" },
    { name: "EduPlatform", logo: "📚" },
    { name: "FoodieApp", logo: "🍕" }
  ];

  // Count-up animation
  const [counts, setCounts] = useState(trustMetrics.map(() => 0));

  useEffect(() => {
    if (statsInView && !countsStarted) {
      setCountsStarted(true);
      trustMetrics.forEach((metric, index) => {
        let start = 0;
        const end = metric.number;
        const duration = 2000;
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCounts(prev => {
              const newCounts = [...prev];
              newCounts[index] = end;
              return newCounts;
            });
            clearInterval(timer);
          } else {
            setCounts(prev => {
              const newCounts = [...prev];
              newCounts[index] = start;
              return newCounts;
            });
          }
        }, 16);
      });
    }
  }, [statsInView, countsStarted]);

  // Project carousel navigation
  const nextProject = () => {
    setCurrentProject((prev) => (prev + 1) % featuredProjects.length);
  };

  const prevProject = () => {
    setCurrentProject((prev) => (prev - 1 + featuredProjects.length) % featuredProjects.length);
  };

  // Testimonial navigation
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        setDataError(null);
        
        const [portfolioResponse, servicesResponse] = await Promise.all([
          portfolioApi.getAll({ limit: 4 }),
          servicesApi.getAll()
        ]);
        
        if (portfolioResponse.success && portfolioResponse.data) {
          setApiProjects(portfolioResponse.data.projects || []);
        }
        
        if (servicesResponse.success && servicesResponse.data) {
          setApiServices(servicesResponse.data.services || []);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setDataError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const filteredProjects = projectFilter === 'All' 
    ? featuredProjects 
    : featuredProjects.filter(project => project.category === projectFilter);

  const filteredTestimonials = testimonialFilter === 'All'
    ? testimonials
    : testimonials.filter(testimonial => testimonial.industry === testimonialFilter);

  return (
    <>
      {/* Data Error Banner */}
      {dataError && (
        <div className="bg-yellow-600/20 border-l-4 border-yellow-400 p-4">
          <div className="container-custom">
            <p className="text-yellow-200 text-sm">
              <strong>Notice:</strong> {dataError}. Showing sample content.
            </p>
          </div>
        </div>
      )}

      <Hero
        title="Crafting Digital Experiences That Grow Your Business"
        subtitle="We build beautiful, responsive websites that help businesses thrive in the digital world."
        buttonText="Get Started"
        buttonLink="/contact"
      />

      {/* Our Expertise - Interactive Hub */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-white via-blue-50 to-purple-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-purple-100/40 to-transparent"></div>
        
        <div className="container-custom relative z-10">
          <SectionHeader
            title="Our Expertise"
            subtitle="Interactive solutions tailored to your business needs. Explore our core services and discover how we can help you succeed."
          />
          
          {!isLoadingData && apiServices.length > 0 && (
            <div className="text-center mb-8">
              <p className="text-blue-600 text-sm font-medium">
                ✨ {apiServices.length} services loaded from our API
              </p>
            </div>
          )}
          
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
                  className={`relative h-full bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden cursor-pointer transition-all duration-500 ${
                    selectedService === service.id ? 'scale-105 shadow-2xl' : 'hover:scale-102 hover:shadow-xl'
                  }`}
                  onHoverStart={() => setHoveredService(service.id)}
                  onHoverEnd={() => setHoveredService(null)}
                  onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Floating Particles */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`absolute w-2 h-2 bg-gradient-to-r ${service.color} rounded-full opacity-20`}
                        animate={{
                          x: [0, 100, 0],
                          y: [0, -50, 0],
                          scale: [1, 1.5, 1]
                        }}
                        transition={{
                          duration: 4 + i,
                          repeat: Infinity,
                          delay: i * 0.5
                        }}
                        style={{
                          left: `${20 + i * 30}%`,
                          top: `${30 + i * 20}%`
                        }}
                      />
                    ))}
                  </div>

                  <div className="relative p-8 h-full flex flex-col">
                    {/* Icon */}
                    <motion.div 
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} p-4 mb-6 shadow-lg`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <service.icon className="w-full h-full text-white" />
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 flex-grow">
                      {selectedService === service.id ? service.description : service.shortDesc}
                    </p>

                    {/* Tech Stack Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.techStack.slice(0, selectedService === service.id ? 4 : 2).map((tech, techIndex) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: techIndex * 0.1 }}
                          className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${service.color} text-white font-medium`}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {selectedService === service.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200 pt-4 mt-4"
                        >
                          <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                          <ul className="space-y-1 mb-4">
                            {service.features.map((feature, featureIndex) => (
                              <motion.li
                                key={feature}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: featureIndex * 0.1 }}
                                className="flex items-center text-sm text-gray-600"
                              >
                                <CheckCircle size={14} className="text-green-500 mr-2 flex-shrink-0" />
                                {feature}
                              </motion.li>
                            ))}
                          </ul>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-600">{service.results}</span>
                            <Link
                              to="/contact"
                              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
                            >
                              Get Quote <ArrowRight size={14} className="ml-1" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Hover Indicator */}
                    <motion.div
                      className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      animate={hoveredService === service.id ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      <MousePointer size={16} className="text-gray-400" />
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects - Case Study Carousel */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <SectionHeader
              title="Case Study Showcase"
              subtitle="Explore our featured projects and the results we've achieved for our clients."
              centered={false}
            />
            
            {!isLoadingData && apiProjects.length > 0 && (
              <div className="text-center mb-8">
                <p className="text-blue-600 text-sm font-medium">
                  ✨ {apiProjects.length} projects loaded from our API
                </p>
              </div>
            )}
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-gray-400" />
                <select
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Projects</option>
                  <option value="Web Application">Web Apps</option>
                  <option value="E-Commerce">E-Commerce</option>
                </select>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={prevProject}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextProject}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <motion.div
                className="flex"
                animate={{ x: `-${currentProject * 100}%` }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                {filteredProjects.map((project, index) => (
                  <div key={project.id} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      {/* Project Image */}
                      <motion.div
                        className="relative aspect-video rounded-xl overflow-hidden group"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Play Button Overlay */}
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          whileHover={{ scale: 1.1 }}
                        >
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <Play className="w-6 h-6 text-white ml-1" />
                          </div>
                        </motion.div>

                        {/* Industry Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                            {project.industry}
                          </span>
                        </div>
                      </motion.div>

                      {/* Project Details */}
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-3xl font-bold text-gray-900">{project.brand}</h3>
                            {project.featured && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex items-center">
                                <Star size={12} className="mr-1" />
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-lg">{project.description}</p>
                        </div>

                        {/* Key Highlights */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Key Highlights:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {project.highlights.map((highlight, highlightIndex) => (
                              <motion.div
                                key={highlightIndex}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: highlightIndex * 0.1 }}
                                className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100"
                              >
                                <div className="text-sm font-medium text-blue-600">{highlight}</div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Tech Stack */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Technology Stack:</h4>
                          <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech, techIndex) => (
                              <span
                                key={tech}
                                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="flex space-x-4">
                          <Link
                            to={project.link}
                            className="btn-primary group flex items-center"
                          >
                            View Full Case
                            <ExternalLink className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                          </Link>
                          <Link
                            to="/contact"
                            className="btn-outline group flex items-center"
                          >
                            Similar Project
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Project Indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {filteredProjects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentProject(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentProject ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Pixeloria Edge */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-purple-50/50 to-transparent"></div>
        
        <div className="container-custom relative z-10">
          <SectionHeader
            title="The Pixeloria Edge"
            subtitle="What sets us apart in the competitive world of web development."
          />

          {/* Trust Metrics */}
          <motion.div
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            {trustMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <motion.div
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
                  animate={{ scale: statsInView ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  {metric.suffix === "/5" ? counts[index].toFixed(1) : Math.round(counts[index])}{metric.suffix}
                </motion.div>
                <div className="text-gray-600 font-medium">{metric.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Value Propositions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {whyChooseUsData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <motion.div
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full relative overflow-hidden cursor-pointer"
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Animated Icon */}
                  <motion.div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} p-4 mb-6 shadow-lg relative z-10`}
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <item.icon className="w-full h-full text-white" />
                  </motion.div>

                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{item.title}</h3>
                    <p className={`text-lg font-semibold mb-2 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                      {item.tagline}
                    </p>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`text-2xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                          {item.metric}
                        </div>
                        <div className="text-sm text-gray-500">{item.metricLabel}</div>
                      </div>
                      
                      <motion.div
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.2 }}
                      >
                        <ArrowRight size={20} className="text-gray-400" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Hover Effect Particles */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`absolute w-1 h-1 bg-gradient-to-r ${item.color} rounded-full opacity-0 group-hover:opacity-60`}
                        animate={{
                          x: [0, 50, 0],
                          y: [0, -30, 0],
                          scale: [1, 1.5, 1]
                        }}
                        transition={{
                          duration: 2 + i,
                          repeat: Infinity,
                          delay: i * 0.3
                        }}
                        style={{
                          left: `${20 + i * 25}%`,
                          top: `${30 + i * 15}%`
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Client Logos */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-8">Trusted by innovative companies</h3>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {clientLogos.map((client, index) => (
                <motion.div
                  key={client.name}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  <span className="text-2xl">{client.logo}</span>
                  <span className="font-medium">{client.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Voices That Trust - Enhanced Testimonials */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <SectionHeader
              title="Voices That Trust"
              subtitle="Real feedback from real clients who've experienced the Pixeloria difference."
              centered={false}
            />
            
            <div className="flex items-center space-x-4">
              <select
                value={testimonialFilter}
                onChange={(e) => setTestimonialFilter(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Industries</option>
                <option value="SaaS">SaaS</option>
                <option value="E-Commerce">E-Commerce</option>
                <option value="Fintech">Fintech</option>
                <option value="Healthcare">Healthcare</option>
              </select>
              
              <div className="flex space-x-2">
                <button
                  onClick={prevTestimonial}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {/* Main Testimonial */}
                <div className="lg:col-span-2">
                  <motion.div
                    className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100 relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Quote Icon */}
                    <Quote className="absolute top-6 right-6 w-12 h-12 text-blue-200" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center mb-6">
                        <img
                          src={filteredTestimonials[currentTestimonial]?.image}
                          alt={filteredTestimonials[currentTestimonial]?.name}
                          className="w-16 h-16 rounded-full object-cover mr-4 border-4 border-white shadow-lg"
                        />
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">
                            {filteredTestimonials[currentTestimonial]?.name}
                          </h4>
                          <p className="text-gray-600">
                            {filteredTestimonials[currentTestimonial]?.role} at {filteredTestimonials[currentTestimonial]?.company}
                          </p>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={`${
                                  i < (filteredTestimonials[currentTestimonial]?.rating || 0)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed">
                        "{filteredTestimonials[currentTestimonial]?.fullQuote}"
                      </blockquote>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                            {filteredTestimonials[currentTestimonial]?.projectType}
                          </span>
                          <span className="text-green-600 font-medium text-sm">
                            {filteredTestimonials[currentTestimonial]?.results}
                          </span>
                        </div>
                        
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                          See Full Feedback
                          <ExternalLink size={14} className="ml-1" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Testimonial Grid */}
                <div className="space-y-4">
                  {filteredTestimonials.slice(0, 3).map((testimonial, index) => (
                    <motion.div
                      key={testimonial.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                        index === currentTestimonial
                          ? 'bg-blue-50 border-blue-200 shadow-md'
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                      onClick={() => setCurrentTestimonial(index)}
                    >
                      <div className="flex items-center mb-3">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                        <div>
                          <h5 className="font-semibold text-gray-900 text-sm">{testimonial.name}</h5>
                          <p className="text-gray-600 text-xs">{testimonial.company}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm line-clamp-2">
                        "{testimonial.quote}"
                      </p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={`${
                                i < testimonial.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{testimonial.industry}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial Indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {filteredTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
        
        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Project?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Let's create something extraordinary together. Join the growing list of successful businesses we've helped transform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/contact"
                  className="inline-flex items-center px-8 py-4 rounded-full bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors shadow-lg"
                >
                  <Rocket className="mr-2" size={20} />
                  Get Started
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/cost-estimator"
                  className="inline-flex items-center px-8 py-4 rounded-full border-2 border-white text-white hover:bg-white/10 transition-colors"
                >
                  <Calculator className="mr-2" size={20} />
                  Estimate Cost
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;