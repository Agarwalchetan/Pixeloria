import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LucideProps,
  CheckCircle,
  ArrowRight,
  MousePointer,
} from "lucide-react";
import SectionHeader from "../SectionHeader";

// Define strong types for a service object
interface Service {
  id: string;
  title: string;
  shortDesc: string;
  description: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  color: string;
  techStack: string[];
  features: string[];
  results: string;
}

// Define the props that this component will accept
interface ServicesSectionProps {
  services: Service[];
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-white via-blue-50 to-purple-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-purple-100/40 to-transparent"></div>
      <div className="container-custom relative z-10">
        <SectionHeader
          title="Our Expertise"
          subtitle="Interactive solutions tailored to your business needs. Explore our core services and discover how we can help you succeed."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const isSelected = selectedService === service.id;
            const contentId = `service-content-${service.id}`;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative h-full"
              >
                <motion.div
                  // --- ACCESSIBILITY & LOGIC FIX ---
                  // Added ARIA attributes for screen readers and keyboard navigation.
                  // Corrected the conditional className logic.
                  role="button"
                  tabIndex={0}
                  aria-expanded={isSelected}
                  aria-controls={contentId}
                  className={`relative h-full bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg overflow-hidden cursor-pointer transition-all duration-500 ${
                    isSelected
                      ? "scale-105 shadow-2xl"
                      : "hover:scale-102 hover:shadow-xl"
                  }`}
                  onClick={() => setSelectedService(isSelected ? null : service.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedService(isSelected ? null : service.id);
                    }
                  }}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />
                  <div className="relative p-8 h-full flex flex-col">
                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} p-4 mb-6 shadow-lg`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <service.icon className="w-full h-full text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4 flex-grow">
                      {isSelected ? service.description : service.shortDesc}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.techStack
                        .slice(0, isSelected ? 4 : 2)
                        .map((tech) => (
                          <motion.span
                            key={tech}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: Math.random() * 0.2 }}
                            className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${service.color} text-white font-medium`}
                          >
                            {tech}
                          </motion.span>
                        ))}
                    </div>

                    {/* Collapsible Content */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          id={contentId}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="border-t border-gray-200 pt-4 mt-4 overflow-hidden"
                        >
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Key Features:
                          </h4>
                          <ul className="space-y-1 mb-4">
                            {service.features.map((feature, featureIndex) => (
                              <motion.li
                                key={feature}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: featureIndex * 0.1 }}
                                className="flex items-center text-sm text-gray-600"
                              >
                                <CheckCircle
                                  size={14}
                                  className="text-green-500 mr-2 flex-shrink-0"
                                />
                                {feature}
                              </motion.li>
                            ))}
                          </ul>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-600">
                              {service.results}
                            </span>
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
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MousePointer size={16} className="text-gray-400" />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};