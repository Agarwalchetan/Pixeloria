import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import SectionHeader from '../components/SectionHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, ArrowRight } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  link: string;
  techStack: string[];
  results: string[];
}

const projects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A full-featured online store built with React and Shopify, featuring real-time inventory management and seamless checkout.",
    image: "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "E-Commerce",
    link: "#",
    techStack: ["React", "Shopify", "Node.js", "MongoDB"],
    results: ["50% faster load times", "35% increase in conversions", "99.9% uptime"]
  },
  {
    id: 2,
    title: "SaaS Dashboard",
    description: "Modern analytics dashboard with real-time data visualization and customizable widgets.",
    image: "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Web Application",
    link: "#",
    techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    results: ["1M+ data points processed", "Real-time updates", "Custom analytics"]
  },
  {
    id: 3,
    title: "Restaurant Website",
    description: "Responsive website with online ordering system and table reservations.",
    image: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Website",
    link: "#",
    techStack: ["React", "Stripe", "Firebase", "Google Maps API"],
    results: ["40% increase in online orders", "4.9/5 user rating", "Mobile-first design"]
  },
  {
    id: 4,
    title: "Fitness App",
    description: "Mobile-first web application for tracking workouts and nutrition with progress visualization.",
    image: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Web Application",
    link: "#",
    techStack: ["React Native", "GraphQL", "Node.js", "MongoDB"],
    results: ["100k+ active users", "4.8 App Store rating", "Featured by Apple"]
  },
  {
    id: 5,
    title: "Real Estate Platform",
    description: "Property listing website with advanced search filters and virtual tour integration.",
    image: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Website",
    link: "#",
    techStack: ["Next.js", "Three.js", "Prisma", "PostgreSQL"],
    results: ["2M+ property views", "360° virtual tours", "AI-powered search"]
  },
  {
    id: 6,
    title: "Educational Platform",
    description: "Online learning platform with course management and interactive content delivery.",
    image: "https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "E-Learning",
    link: "#",
    techStack: ["React", "Node.js", "Socket.io", "AWS"],
    results: ["50k+ students", "95% completion rate", "Live collaboration"]
  }
];

const Portfolio: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', ...new Set(projects.map(project => project.category))];
  
  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="bg-gray-900">
      <Hero
        title="Our Work Speaks Louder Than Words"
        subtitle="Explore some of the projects we've built — from sleek business websites to complex web apps."
        buttonText="Book a Free Consultation"
        buttonLink="/contact"
        backgroundImage="https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      />

      {/* Stats Section */}
      <section className="py-12 relative -mt-20 z-10">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "50+", label: "Projects Delivered" },
              { number: "100%", label: "Client Satisfaction" },
              { number: "1M+", label: "Users Reached" },
              { number: "24/7", label: "Support" }
            ].map((stat, index) => (
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

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container-custom">
          <SectionHeader
            title="Featured Projects"
            subtitle="Browse through our collection of successful projects that showcase our expertise."
          />

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map(category => (
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

          {/* Projects Grid */}
          <AnimatePresence mode="wait">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-800/50 rounded-xl overflow-hidden group hover:bg-gray-800 transition-all duration-300"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="p-6">
                    <motion.div 
                      className="mb-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span className="text-sm text-blue-400">{project.category}</span>
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 mb-4">{project.description}</p>
                    
                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack.map((tech, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>

                    {/* Results */}
                    <div className="space-y-2 mb-4">
                      {project.results.map((result, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center text-sm text-gray-400"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></span>
                          {result}
                        </motion.div>
                      ))}
                    </div>

                    <Link
                      to={project.link}
                      className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium group/link"
                    >
                      View Project 
                      <ExternalLink size={18} className="ml-2 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h3 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Ready to Build Something Extraordinary?
            </h3>
            <p className="text-gray-300 mb-8">
              Let's discuss how we can help bring your vision to life with our expertise in web development and design.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/contact" 
                  className="btn-primary group relative overflow-hidden inline-flex items-center"
                >
                  <span className="relative z-10 flex items-center">
                    Book a Free Call
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
                  to="/contact" 
                  className="btn-outline group"
                >
                  Send Your Idea
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;