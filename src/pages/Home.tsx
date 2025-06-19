import React from 'react';
import Hero from '../components/Hero';
import SectionHeader from '../components/SectionHeader';
import ServiceCard from '../components/ServiceCard';
import { Code, ShoppingCart, Laptop, Database, Settings, LineChart, Star, Zap, Users, Clock, CheckCircle, ArrowRight, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const services = [
    {
      title: 'Web Design',
      description: 'Beautiful, responsive websites that engage your audience and drive results.',
      icon: Code,
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
    }
  ];

  const featuredProjects = [
    {
      title: "E-Commerce Platform",
      description: "A full-featured online store with real-time inventory.",
      image: "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      link: "/portfolio"
    },
    {
      title: "SaaS Dashboard",
      description: "Modern analytics dashboard with real-time data visualization.",
      image: "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      link: "/portfolio"
    },
    {
      title: "Restaurant Website",
      description: "Responsive website with online ordering system.",
      image: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      link: "/portfolio"
    }
  ];

  const techStack = [
    { name: 'React', icon: '/tech/react.svg' },
    { name: 'TypeScript', icon: '/tech/typescript.svg' },
    { name: 'Node.js', icon: '/tech/nodejs.svg' },
    { name: 'Next.js', icon: '/tech/nextjs.svg' },
    { name: 'Tailwind CSS', icon: '/tech/tailwind.svg' }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechStart",
      content: "Working with Pixeloria was a game-changer for our business. They delivered a beautiful, high-performing website that exceeded our expectations.",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      name: "Michael Chen",
      role: "Founder, GrowthLabs",
      content: "The team's attention to detail and technical expertise helped us create a website that truly stands out in our industry.",
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
  ];

  return (
    <>
      <Hero
        title="Crafting Digital Experiences That Grow Your Business"
        subtitle="We build beautiful, responsive websites that help businesses thrive in the digital world."
        buttonText="Get Started"
        buttonLink="/contact"
      />

      {/* Cost Calculator Teaser */}
      {/* <section className="py-12 relative -mt-20 z-10">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center shadow-2xl"
          >
            <div className="flex items-center justify-center mb-4">
              <Calculator className="w-8 h-8 mr-3" />
              <h3 className="text-2xl font-bold">🧮 Estimate your site's cost in under 60 seconds</h3>
            </div>
            <p className="text-blue-100 mb-6 text-lg">
              Get an instant, detailed estimate for your website project with our interactive calculator
            </p>
            <Link
              to="/cost-estimator"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors text-lg"
            >
              Try Calculator Now
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </motion.div>
        </div>
      </section> */}

      {/* What We Build Section */}
      <section className="section relative overflow-hidden bg-gradient-to-b from-white via-blue-50 to-purple-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-purple-100/40 to-transparent"></div>
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-200/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-purple-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '-1.5s' }}></div>
        </div>

        <div className="container-custom relative z-10">
          <SectionHeader
            title="What We Build"
            subtitle="Explore our comprehensive suite of web development services designed to help your business succeed online."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="group h-full">
                  <ServiceCard {...service} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section bg-white">
        <div className="container-custom">
          <SectionHeader
            title="Featured Projects"
            subtitle="Take a look at some of our recent work and see how we've helped businesses achieve their goals."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-xl shadow-lg"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-200 mb-4">{project.description}</p>
                    <Link
                      to={project.link}
                      className="inline-flex items-center text-white hover:text-blue-400 transition-colors"
                    >
                      View Project <ArrowRight className="ml-2" size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section bg-gradient-to-b from-blue-50 to-white">
        <div className="container-custom">
          <SectionHeader
            title="Why Choose Us"
            subtitle="We combine technical expertise with creative innovation to deliver exceptional results."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Star, title: "Expert Team", description: "Skilled developers and designers" },
              { icon: Zap, title: "Fast Delivery", description: "Quick turnaround times" },
              { icon: Users, title: "Client Focus", description: "Your success is our priority" },
              { icon: CheckCircle, title: "Quality First", description: "Exceptional standards" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-4">
                  <item.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-white">
        <div className="container-custom">
          <SectionHeader
            title="Client Testimonials"
            subtitle="Don't just take our word for it - hear what our clients have to say about working with us."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-xl text-blue-100 mb-8">Let's create something amazing together.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 rounded-full bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
            >
              Get Started
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link
              to="/cost-estimator"
              className="inline-flex items-center px-8 py-4 rounded-full border-2 border-white text-white hover:bg-white/10 transition-colors"
            >
              <Calculator className="mr-2" size={20} />
              Estimate Cost
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;