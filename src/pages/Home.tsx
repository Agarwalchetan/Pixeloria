import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Hero from '../components/Hero';
import SectionHeader from '../components/SectionHeader';
import { 
  Code, 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  Clock, 
  TrendingUp,
  Zap,
  Shield,
  Globe,
  Award,
  Target,
  Sparkles,
  Coffee,
  Heart,
  Brain
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminApi, portfolioApi } from '../utils/api';

// Type definitions
interface HomeSettings {
  edge_numbers?: {
    projects_delivered: number;
    client_satisfaction: number;
    users_reached: string;
    support_hours: string;
  };
  featured_case_studies?: Array<{
    portfolio_id: {
      _id: string;
      title: string;
      description: string;
      category: string;
      images: string[];
      tech_stack: string[];
      results: string[];
      link: string;
    };
    order: number;
  }>;
}

interface CaseStudy {
  _id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  tech_stack: string[];
  results: string[];
  link: string;
}

const Home: React.FC = () => {
  // State for dynamic content
  const [homeSettings, setHomeSettings] = useState<HomeSettings | null>(null);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isLoadingCaseStudies, setIsLoadingCaseStudies] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Intersection observer for animations
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Fetch home settings from admin
  useEffect(() => {
    const fetchHomeSettings = async () => {
      try {
        console.log('Fetching home settings...');
        setError(null);
        const response = await adminApi.getHomeSettings();
        console.log('Home settings response:', response);
        
        if (response.success && response.data) {
          setHomeSettings(response.data.homeSettings);
          console.log('Home settings loaded:', response.data.homeSettings);
        } else {
          console.error('Failed to fetch home settings:', response);
          setError('Failed to load home settings');
        }
      } catch (error) {
        console.error('Error fetching home settings:', error);
        setError('Failed to load home settings');
      } finally {
        setIsLoadingSettings(false);
      }
    };

    fetchHomeSettings();
  }, []);

  // Fetch case studies
  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        console.log('Fetching case studies...');
        
        // First try to get featured case studies from home settings
        if (homeSettings?.featured_case_studies && homeSettings.featured_case_studies.length > 0) {
          const featuredProjects = homeSettings.featured_case_studies
            .sort((a, b) => a.order - b.order)
            .map(cs => cs.portfolio_id)
            .filter(project => project && project._id);
          
          setCaseStudies(featuredProjects);
          console.log('Featured case studies loaded:', featuredProjects);
        } else {
          // Fallback: get latest portfolio projects
          const response = await portfolioApi.getAll({ limit: 4 });
          if (response.success && response.data) {
            setCaseStudies(response.data.projects.slice(0, 4));
            console.log('Fallback case studies loaded:', response.data.projects.slice(0, 4));
          }
        }
      } catch (error) {
        console.error('Error fetching case studies:', error);
        // Use fallback data
        setCaseStudies(fallbackCaseStudies);
      } finally {
        setIsLoadingCaseStudies(false);
      }
    };

    // Only fetch case studies after home settings are loaded
    if (!isLoadingSettings) {
      fetchCaseStudies();
    }
  }, [homeSettings, isLoadingSettings]);

  // Fallback data
  const fallbackStats = [
    { number: "50+", label: "Projects Delivered", icon: CheckCircle },
    { number: "100%", label: "Client Satisfaction", icon: Star },
    { number: "1M+", label: "Users Reached", icon: Users },
    { number: "24/7", label: "Support", icon: Clock }
  ];

  const fallbackCaseStudies: CaseStudy[] = [
    {
      _id: "fallback-1",
      title: "E-Commerce Platform Revolution",
      description: "Transformed a traditional retail business into a thriving online marketplace with advanced features and seamless user experience.",
      category: "E-Commerce",
      images: ["https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"],
      tech_stack: ["React", "Node.js", "MongoDB", "Stripe"],
      results: ["300% increase in online sales", "50% faster checkout process", "99.9% uptime"],
      link: "#"
    },
    {
      _id: "fallback-2",
      title: "SaaS Analytics Dashboard",
      description: "Built a comprehensive analytics platform that processes millions of data points in real-time for business intelligence.",
      category: "Web Application",
      images: ["https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"],
      tech_stack: ["Next.js", "TypeScript", "PostgreSQL", "Redis"],
      results: ["1M+ data points processed daily", "Real-time analytics", "Custom reporting"],
      link: "#"
    },
    {
      _id: "fallback-3",
      title: "AI-Powered Learning Platform",
      description: "Developed an innovative educational platform with AI-driven personalized learning paths and interactive content.",
      category: "EdTech",
      images: ["https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"],
      tech_stack: ["React", "Python", "TensorFlow", "AWS"],
      results: ["50k+ active learners", "95% completion rate", "AI-powered recommendations"],
      link: "#"
    },
    {
      _id: "fallback-4",
      title: "FinTech Mobile Solution",
      description: "Created a secure mobile banking application with advanced security features and intuitive user interface.",
      category: "FinTech",
      images: ["https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"],
      tech_stack: ["React Native", "Node.js", "PostgreSQL", "Blockchain"],
      results: ["Bank-grade security", "2M+ transactions processed", "4.9/5 user rating"],
      link: "#"
    }
  ];

  // Use admin settings or fallback to default stats
  const stats = homeSettings?.edge_numbers ? [
    { 
      number: `${homeSettings.edge_numbers.projects_delivered}+`, 
      label: "Projects Delivered", 
      icon: CheckCircle,
      color: "from-blue-500 to-blue-600"
    },
    { 
      number: `${homeSettings.edge_numbers.client_satisfaction}%`, 
      label: "Client Satisfaction", 
      icon: Star,
      color: "from-green-500 to-green-600"
    },
    { 
      number: homeSettings.edge_numbers.users_reached, 
      label: "Users Reached", 
      icon: Users,
      color: "from-purple-500 to-purple-600"
    },
    { 
      number: homeSettings.edge_numbers.support_hours, 
      label: "Support", 
      icon: Clock,
      color: "from-orange-500 to-orange-600"
    }
  ] : fallbackStats.map(stat => ({ ...stat, color: "from-blue-500 to-blue-600" }));

  // Display case studies (from admin settings or fallback)
  const displayCaseStudies = caseStudies.length > 0 ? caseStudies : fallbackCaseStudies;

  const services = [
    {
      icon: Globe,
      title: "Web Development",
      description: "Custom websites and web applications built with modern technologies",
      features: ["Responsive Design", "SEO Optimized", "Fast Loading"],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "E-Commerce Solutions",
      description: "Powerful online stores that convert visitors into customers",
      features: ["Secure Payments", "Inventory Management", "Analytics"],
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Zap,
      title: "Performance Optimization",
      description: "Speed up your website and improve user experience",
      features: ["Core Web Vitals", "CDN Setup", "Image Optimization"],
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO",
      company: "TechFlow",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
      quote: "Pixeloria transformed our vision into reality. The team's expertise and attention to detail exceeded our expectations.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Founder",
      company: "EcoStore",
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
      quote: "Outstanding e-commerce platform that boosted our sales by 200%. Highly recommended!",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "CTO",
      company: "DataViz",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
      quote: "The web application they built handles millions of data points seamlessly. Incredible work!",
      rating: 5
    }
  ];

  // Loading state
  if (isLoadingSettings) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900">
      {/* Debug Info */}
      {error && (
        <div className="bg-yellow-600/20 border-l-4 border-yellow-400 p-4">
          <div className="container-custom">
            <p className="text-yellow-200 text-sm">
              <strong>Notice:</strong> {error}. Using fallback content.
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <Hero
        title="Crafting Digital Experiences That Grow Your Business"
        subtitle="We build stunning websites, powerful web applications, and innovative digital solutions that drive real results for forward-thinking companies."
        buttonText="Start Your Project"
        buttonLink="/contact"
        backgroundImage="https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />

      {/* Stats Section - The Pixeloria Edge */}
      <section className="py-12 relative -mt-20 z-10">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-2">The Pixeloria Edge</h2>
            <p className="text-gray-400">Numbers that speak for our excellence</p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-effect rounded-xl p-6 text-center hover:bg-gray-800/50 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <motion.h3 
                  className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {stat.number}
                </motion.h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-transparent"></div>
        <div className="container-custom relative z-10">
          <SectionHeader
            title="What We Do Best"
            subtitle="Comprehensive digital solutions tailored to your business needs"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card group p-8 hover:bg-gray-800/50 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${service.gradient} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 mb-6 group-hover:text-gray-300 transition-colors">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-400 group-hover:text-gray-300 transition-colors">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/services"
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium group/link"
                >
                  Learn More
                  <ArrowRight className="ml-2 group-hover/link:translate-x-1 transition-transform" size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container-custom relative z-10">
          <SectionHeader
            title="Success Stories"
            subtitle="Real projects, real results. See how we've helped businesses transform their digital presence."
          />
          
          {isLoadingCaseStudies ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading case studies...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {displayCaseStudies.slice(0, 4).map((study, index) => (
                <motion.div
                  key={study._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card group overflow-hidden hover:bg-gray-800/50 transition-all duration-300"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={study.images?.[0] || 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
                      alt={study.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="p-6">
                    <span className="text-sm text-blue-400 mb-2 block">{study.category}</span>
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
                      {study.title}
                    </h3>
                    <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors">
                      {study.description}
                    </p>
                    
                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {study.tech_stack?.slice(0, 3).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Results */}
                    <div className="space-y-1 mb-4">
                      {study.results?.slice(0, 2).map((result, resultIndex) => (
                        <div key={resultIndex} className="flex items-center text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2"></span>
                          {result}
                        </div>
                      ))}
                    </div>

                    <Link
                      to="/portfolio"
                      className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium group/link"
                    >
                      View Case Study
                      <ArrowRight className="ml-2 group-hover/link:translate-x-1 transition-transform" size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/portfolio"
              className="btn-outline group"
            >
              View All Projects
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Voices that Trust */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-transparent"></div>
        <div className="container-custom relative z-10">
          <SectionHeader
            title="Voices that Trust"
            subtitle="Don't just take our word for it. Here's what our clients say about working with us."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-8 group hover:bg-gray-800/50 transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <blockquote className="text-gray-300 mb-6 group-hover:text-gray-200 transition-colors">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container-custom relative z-10">
          <SectionHeader
            title="Why Choose Pixeloria?"
            subtitle="We combine technical expertise with creative innovation to deliver exceptional results"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Target,
                title: "Results-Driven",
                description: "Every project is designed to achieve your specific business goals",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Optimized for speed and performance across all devices",
                gradient: "from-yellow-500 to-orange-500"
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                description: "Built with security best practices and 99.9% uptime",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: Heart,
                title: "Passionate Team",
                description: "Dedicated professionals who care about your success",
                gradient: "from-pink-500 to-red-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${feature.gradient} p-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
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
              Ready to Transform Your Digital Presence?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Let's work together to create something extraordinary. Our team is ready to bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/contact"
                  className="btn-primary group relative overflow-hidden inline-flex items-center text-lg px-8 py-4"
                >
                  <span className="relative z-10 flex items-center">
                    Start Your Project
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:scale-110 transition-transform duration-500"></div>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/cost-estimator"
                  className="btn-outline group text-lg px-8 py-4"
                >
                  Get Free Estimate
                  <Sparkles className="ml-2 group-hover:rotate-12 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;