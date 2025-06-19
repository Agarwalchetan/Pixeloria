import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Search, Palette, Code, TestTube, Rocket } from 'lucide-react';

const ProcessTimeline: React.FC = () => {
  const steps = [
    {
      icon: Search,
      title: 'Discover',
      description: 'Deep dive into your goals and requirements',
      gradient: 'from-blue-400 to-cyan-400'
    },
    {
      icon: Palette,
      title: 'Design',
      description: 'Create wireframes, prototypes & UI designs',
      gradient: 'from-cyan-400 to-teal-400'
    },
    {
      icon: Code,
      title: 'Develop',
      description: 'Build with clean, scalable, modular code',
      gradient: 'from-teal-400 to-green-400'
    },
    {
      icon: TestTube,
      title: 'Test & Refine',
      description: 'QA, performance, and browser testing',
      gradient: 'from-green-400 to-emerald-400'
    },
    {
      icon: Rocket,
      title: 'Launch & Support',
      description: 'Deployment and post-launch assistance',
      gradient: 'from-emerald-400 to-blue-400'
    }
  ];

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/50"></div>
      <div className="container-custom relative z-10">
        <motion.h2 
          className="text-3xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Our Development Process
        </motion.h2>
        <motion.div 
          className="max-w-2xl mx-auto text-center mb-12 text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          We follow a proven methodology to ensure your project is delivered on time and exceeds expectations.
        </motion.div>
        
        <div ref={ref} className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-100 to-purple-100">
            <motion.div
              className="h-full bg-gradient-to-b from-blue-500 to-purple-500"
              initial={{ height: '0%' }}
              animate={inView ? { height: '100%' } : { height: '0%' }}
              transition={{ duration: 1.5 }}
            />
          </div>

          {/* Timeline Steps */}
          <div className="relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  className={`flex items-center mb-12 ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                    <h3 className={`text-xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${step.gradient}`}>
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  <motion.div 
                    className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${step.gradient} opacity-20`}></div>
                    <Icon className={`w-6 h-6 bg-clip-text text-transparent bg-gradient-to-r ${step.gradient}`} />
                  </motion.div>
                  <div className="w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessTimeline;