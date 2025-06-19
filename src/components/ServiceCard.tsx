import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon: Icon,
  features,
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      className="group relative h-full bg-white rounded-xl shadow-lg border border-gray-100 hover:border-blue-200 transition-all duration-500 hover:shadow-xl overflow-hidden"
      whileHover={{ y: -5 }}
    >
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-purple-50/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Glowing border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 -z-10"></div>
      
      <div className="relative p-6 z-10">
        <div className="flex items-center mb-4">
          <motion.div 
            className="bg-gradient-to-br from-blue-100 to-purple-100 p-4 rounded-xl"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Icon className="text-blue-600 group-hover:text-blue-700 transition-colors duration-500" size={24} />
          </motion.div>
        </div>
        
        <h3 className="text-xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-500">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-500">
          {description}
        </p>
        
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center text-gray-500 group-hover:text-gray-600 transition-colors duration-500"
            >
              <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-2"></span>
              {feature}
            </motion.li>
          ))}
        </ul>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;