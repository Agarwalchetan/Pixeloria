import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const TechStack: React.FC = () => {
  const technologies = {
    Frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    Backend: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB'],
    DevOps: ['Docker', 'AWS', 'Vercel', 'GitHub Actions'],
    CMS: ['Strapi', 'Sanity', 'WordPress', 'Contentful'],
    Tools: ['Figma', 'Postman', 'VS Code', 'Git']
  };

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <h2 className="text-3xl font-bold text-center mb-12">Our Tech Stack</h2>
        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          {Object.entries(technologies).map(([category, techs], index) => (
            <motion.div
              key={category}
              className="bg-white rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-blue-600">{category}</h3>
              <ul className="space-y-2">
                {techs.map((tech) => (
                  <li key={tech} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {tech}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;