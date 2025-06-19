import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import ProjectCalculator from '../components/ProjectCalculator';
import ProcessTimeline from '../components/ProcessTimeline';
import TechStack from '../components/TechStack';
import FAQ from '../components/FAQ';
import { Code, ShoppingCart, Laptop, Database, Settings, LineChart, Palette, Globe, Rocket, Server, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services: React.FC = () => {
  const services = [
    {
      title: 'Web Design',
      description: 'Beautiful, responsive websites that engage your audience and drive results.',
      icon: Palette,
      features: ['Custom Design', 'Mobile-First Approach', 'SEO Optimization']
    },
    {
      title: 'eCommerce Development',
      description: 'Powerful online stores that convert visitors into customers.',
      icon: ShoppingCart,
      features: ['Secure Checkout', 'Inventory Management', 'Payment Integration']
    },
    {
      title: 'Web Applications',
      description: 'Custom web applications that streamline your business processes.',
      icon: Laptop,
      features: ['User Authentication', 'Real-time Updates', 'Cloud Integration']
    },
    {
      title: 'CMS Integration',
      description: 'Easy-to-use content management systems for your team.',
      icon: Database,
      features: ['Content Workflow', 'User Roles', 'Media Management']
    },
    {
      title: 'API Development',
      description: 'Robust and scalable APIs that power your applications.',
      icon: Server,
      features: ['RESTful APIs', 'GraphQL', 'WebSocket Integration']
    },
    {
      title: 'Performance Optimization',
      description: 'Optimize your website for speed and conversion.',
      icon: Zap,
      features: ['Speed Optimization', 'Core Web Vitals', 'Conversion Tracking']
    }
  ];

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="bg-white">
      <Hero
        title="Full-Stack Expertise. Tailored Solutions."
        subtitle="From concept to clean, scalable code — we build digital products designed to grow with you."
        buttonText="Explore Our Services"
        buttonLink="#services"
        backgroundImage="https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />

      {/* Services Grid */}
      <section id="services" className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 via-purple-50/50 to-transparent"></div>
        <div className="container-custom relative z-10">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Timeline */}
      <ProcessTimeline />

      {/* Tech Stack */}
      <TechStack />

      {/* Project Calculator */}
      <section id="calculator" className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-50/30 via-blue-50/30 to-transparent"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <ProjectCalculator />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <FAQ />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
        <motion.div 
          className="container-custom relative z-10 text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6">Ready to Build Something Amazing?</h2>
          <p className="text-xl mb-8 text-blue-100">Let's talk about your project goals.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors duration-300"
            >
              Book Free Consultation
            </Link>
            <a 
              href="#calculator" 
              className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-white text-white hover:bg-white/10 transition-colors duration-300"
            >
              See Pricing
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Services;