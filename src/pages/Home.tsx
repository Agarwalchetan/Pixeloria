import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Code, 
  Zap, 
  Users, 
  Star, 
  CheckCircle, 
  Globe, 
  Rocket,
  TrendingUp,
  Award,
  Eye,
  ExternalLink,
  Quote
} from 'lucide-react';
import { adminApi } from '../utils/api';

const Home: React.FC = () => {
  // State for admin-managed content
  const [homeSettings, setHomeSettings] = useState<any>(null);
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [featuredTestimonials, setFeaturedTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default fallback data
  const defaultStats = [
    { number: "50+", label: "Projects Delivered" },
    { number: "100%", label: "Client Satisfaction" },
    { number: "1M+", label: "Users Reached" },
    { number: "24/7", label: "Support" }
  ];

  const defaultTestimonials = [
    {
      _id: "default-1",
      name: "Sarah Johnson",
      role: "CEO",
      company: "TechFlow",
      image_url: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
      quote: "Pixeloria transformed our vision into reality with exceptional expertise and dedication.",
      rating: 5
    },
    {
      _id: "default-2", 
      name: "Michael Chen",
      role: "Founder",
      company: "EcoStore",
      image_url: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
      quote: "Outstanding e-commerce platform that boosted our sales by 200%.",
      rating: 5
    },
    {
      _id: "default-3",
      name: "Emily Rodriguez",
      role: "CTO",
      company: "DataFlow",
      image_url: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
      quote: "The team delivered a scalable solution that exceeded our expectations.",
      rating: 5
    }
  ];

  const defaultFeaturedProjects = [
    {
      _id: "default-1",
      title: "E-Commerce Platform",
      description: "Modern online store with advanced features and seamless user experience.",
      category: "E-Commerce",
      images: ["https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800"],
      tech_stack: ["React", "Node.js", "Stripe", "MongoDB"],
      results: ["50% increase in sales", "99.9% uptime", "Mobile-first design"]
    },
    {
      _id: "default-2",
      title: "SaaS Dashboard",
      description: "Analytics dashboard with real-time data visualization and custom reporting.",
      category: "Web Application",
      images: ["https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800"],
      tech_stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
      results: ["Real-time analytics", "Custom reporting", "1M+ data points"]
    },
    {
      _id: "default-3",
      title: "Restaurant Website",
      description: "Beautiful restaurant website with online ordering and reservation system.",
      category: "Website",
      images: ["https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800"],
      tech_stack: ["React", "Stripe", "Firebase", "Google Maps"],
      results: ["40% increase in orders", "4.9/5 rating", "Mobile optimization"]
    }
  ];

  // Fetch home settings from admin
  useEffect(() => {
    const fetchHomeSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await adminApi.getHomeSettings();
        
        if (response.success && response.data) {
          setHomeSettings(response.data.homeSettings);
          
          // Set featured projects from admin selection
          if (response.data.homeSettings?.featured_case_studies?.length > 0) {
            const adminFeaturedProjects = response.data.homeSettings.featured_case_studies
              .map((cs: any) => cs.portfolio_id)
              .filter((project: any) => project) // Filter out null/undefined
              .slice(0, 4); // Limit to 4
            setFeaturedProjects(adminFeaturedProjects);
          } else {
            setFeaturedProjects(defaultFeaturedProjects);
          }
          
          // Set testimonials
          if (response.data.featuredTestimonials?.length > 0) {
            setFeaturedTestimonials(response.data.featuredTestimonials.slice(0, 6));
          } else {
            setFeaturedTestimonials(defaultTestimonials);
          }
        } else {
          throw new Error('Failed to fetch home settings');
        }
      } catch (err) {
        console.error('Error fetching home settings:', err);
        setError(err instanceof Error ? err.message : 'Failed to load home settings');
        
        // Use fallback data
        setFeaturedProjects(defaultFeaturedProjects);
        setFeaturedTestimonials(defaultTestimonials);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeSettings();
  }, []);

  // Get stats from admin settings or use defaults
  const stats = homeSettings?.edge_numbers ? [
    { number: `${homeSettings.edge_numbers.projects_delivered}+`, label: "Projects Delivered" },
    { number: `${homeSettings.edge_numbers.client_satisfaction}%`, label: "Client Satisfaction" },
    { number: homeSettings.edge_numbers.users_reached, label: "Users Reached" },
    { number: homeSettings.edge_numbers.support_hours, label: "Support" }
  ] : defaultStats;

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="bg-gray-900">
      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-600/20 border-l-4 border-yellow-400 p-4">
          <div className="container-custom">
            <p className="text-yellow-200 text-sm">
              <strong>Notice:</strong> {error}. Showing default content.
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-purple-500/10 to-transparent"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
          <div className="max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
            >
              Crafting Digital Experiences That Grow Your Business
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl"
            >
              We build stunning websites, powerful web applications, and innovative digital solutions that drive results.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/contact"
                className="btn-primary group relative overflow-hidden inline-flex items-center"
              >
                <span className="relative z-10 flex items-center">
                  Start Your Project
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:scale-110 transition-transform duration-500"></div>
              </Link>
              <Link
                to="/portfolio"
                className="btn-outline group"
              >
                View Our Work
                <Eye className="ml-2 group-hover:scale-110 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pixeloria Edge Numbers (Admin Controlled) */}
      <section className="py-12 relative -mt-20 z-10">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-effect rounded-xl p-6 text-center hover:bg-gray-800/50 transition-colors duration-300"
              >
                <motion.h3 
                  className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {stat.number}
                </motion.h3>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Case Studies (Admin Controlled) */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-transparent"></div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Featured Case Studies
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover how we've helped businesses transform their digital presence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.slice(0, 3).map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card group overflow-hidden hover:bg-gray-800/50 transition-all duration-300"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={project.images?.[0] || 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="p-6">
                  <span className="text-sm text-blue-400 font-medium">{project.category}</span>
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech_stack?.slice(0, 3).map((tech: string, techIndex: number) => (
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
                    {project.results?.slice(0, 2).map((result: string, resultIndex: number) => (
                      <div key={resultIndex} className="flex items-center text-sm text-gray-400">
                        <CheckCircle size={12} className="text-green-400 mr-2" />
                        {result}
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/portfolio"
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium group/link"
                  >
                    View Project
                    <ExternalLink size={16} className="ml-2 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

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

      {/* Services Preview */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              What We Do Best
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From concept to launch, we provide comprehensive digital solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "Web Development",
                description: "Custom websites and web applications built with modern technologies",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Code,
                title: "E-Commerce Solutions",
                description: "Powerful online stores that convert visitors into customers",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: Rocket,
                title: "Digital Strategy",
                description: "Comprehensive digital transformation and growth strategies",
                gradient: "from-purple-500 to-pink-500"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card group p-8 hover:bg-gray-800/50 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.gradient} p-4 mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="btn-primary group"
            >
              Explore All Services
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Voices that Trust (Admin Controlled Testimonials) */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-transparent"></div>
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Voices that Trust
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Hear from our clients about their experience working with us
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTestimonials.slice(0, 6).map((testimonial, index) => (
              <motion.div
                key={testimonial._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card group p-6 hover:bg-gray-800/50 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                
                <blockquote className="text-gray-300 mb-6 group-hover:text-gray-200 transition-colors">
                  <Quote className="w-6 h-6 text-blue-400 mb-2" />
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="flex items-center">
                  <img
                    src={testimonial.image_url}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }}
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/contact"
              className="btn-primary group"
            >
              Join Our Success Stories
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
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
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Ready to Transform Your Digital Presence?
            </h2>
            <p className="text-gray-300 mb-8">
              Let's work together to create something extraordinary that drives real business results.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/contact"
                className="btn-primary group"
              >
                Get Started Today
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/cost-estimator"
                className="btn-outline group"
              >
                Calculate Project Cost
                <TrendingUp className="ml-2 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;