import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
  ExternalLink,
} from "lucide-react";
import SectionHeader from "../SectionHeader";

// --- Types ---
interface Testimonial {
  id: number | string;
  name: string;
  role: string;
  company: string;
  industry: string;
  image: string;
  quote: string;
  fullQuote: string;
  rating: number;
  projectType: string;
  results: string;
}

interface TestimonialsSliderProps {
  testimonials: Testimonial[];
  filter: string;
  onFilterChange: (newFilter: string) => void;
}

export const TestimonialsSlider: React.FC<TestimonialsSliderProps> = ({
  testimonials,
  filter,
  onFilterChange,
}) => {
  const [current, setCurrent] = useState(0);
  
  // Reset slider if filters change
  useEffect(() => {
    setCurrent(0);
  }, [testimonials.length]);

  const nextTestimonial = useCallback(() => {
    if (testimonials.length === 0) return;
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevTestimonial = useCallback(() => {
    if (testimonials.length === 0) return;
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);
  
  // Auto-advance testimonials
  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(nextTestimonial, 5000);
      return () => clearInterval(interval);
    }
  }, [nextTestimonial, testimonials.length]);

  const activeTestimonial = testimonials[current];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-12">
          <SectionHeader
            title="Voices That Trust"
            subtitle="Real feedback from real clients who've experienced the Pixeloria difference."
            centered={false}
          />
          <div className="flex items-center space-x-4">
            <select
              value={filter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Industries</option>
              <option value="SaaS">SaaS</option>
              <option value="E-Commerce">E-Commerce</option>
              <option value="Fintech">Fintech</option>
              <option value="Healthcare">Healthcare</option>
            </select>
            <div className="flex space-x-2">
              <button onClick={prevTestimonial} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" disabled={testimonials.length <= 1}>
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextTestimonial} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" disabled={testimonials.length <= 1}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="relative min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTestimonial ? (
              <motion.div
                key={activeTestimonial.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100 relative overflow-hidden h-full">
                    <Quote className="absolute top-6 right-6 w-12 h-12 text-blue-200" />
                    <div className="relative z-10">
                       <div className="flex items-center mb-6">
                        <img src={activeTestimonial.image} alt={activeTestimonial.name} className="w-16 h-16 rounded-full object-cover mr-4 border-4 border-white shadow-lg" />
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">{activeTestimonial.name}</h4>
                          <p className="text-gray-600">{activeTestimonial.role} at {activeTestimonial.company}</p>
                        </div>
                      </div>
                      <blockquote className="text-lg text-gray-700 mb-6 leading-relaxed">
                        "{activeTestimonial.fullQuote}"
                      </blockquote>
                      <div className="flex items-center justify-between">
                         <div className="flex items-center space-x-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">{activeTestimonial.projectType}</span>
                            <span className="text-green-600 font-medium text-sm">{activeTestimonial.results}</span>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {testimonials.slice(0, 3).map((testimonial, index) => (
                    <motion.div
                      key={testimonial.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                        index === current
                          ? "bg-blue-50 border-blue-200 shadow-md"
                          : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                      onClick={() => setCurrent(index)}
                    >
                      <div className="flex items-center mb-3">
                        <img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover mr-3" />
                        <div>
                          <h5 className="font-semibold text-gray-900 text-sm">{testimonial.name}</h5>
                          <p className="text-gray-600 text-xs">{testimonial.company}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm line-clamp-2">"{testimonial.quote}"</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-600">No testimonials available for this industry.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
         {testimonials.length > 1 && (
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === current ? "bg-blue-600" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
      </div>
    </section>
  );
};