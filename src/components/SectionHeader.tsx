import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  centered?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  subtitle,
  centered = true 
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div 
      ref={ref}
      className={`mb-12 md:mb-16 ${centered ? 'text-center' : 'text-left'}`}
    >
      <motion.h2 
        className="mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        {title}
      </motion.h2>
      <motion.div 
        className={`h-1 bg-gradient-to-r from-blue-500 to-purple-500 mb-6 ${centered ? 'mx-auto' : ''}`}
        style={{ width: '6rem' }}
        initial={{ opacity: 0, width: 0 }}
        animate={inView ? { opacity: 1, width: 96 } : { opacity: 0, width: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      ></motion.div>
      <motion.p 
        className="text-gray-400 text-lg max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {subtitle}
      </motion.p>
    </div>
  );
};

export default SectionHeader;