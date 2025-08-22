import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Star,
  ExternalLink,
  ArrowRight,
  Play,
} from "lucide-react";
import SectionHeader from "../SectionHeader"; // Assuming SectionHeader is in ../components

// Define a strong type for a project object for better code quality
interface Project {
  id: number | string;
  title: string;
  brand: string;
  industry: string;
  description: string;
  image: string;
  category: string;
  highlights: string[];
  techStack: string[];
  link: string;
  featured?: boolean;
}

// Define the props that this component will accept
interface ProjectsCarouselProps {
  projects: Project[];
  filter: string;
  onFilterChange: (newFilter: string) => void;
  apiProjectCount: number;
  isLoading: boolean;
}

export const ProjectsCarousel: React.FC<ProjectsCarouselProps> = ({
  projects,
  filter,
  onFilterChange,
  apiProjectCount,
  isLoading,
}) => {
  const [current, setCurrent] = useState(0);

  // Reset the carousel to the first slide if the number of projects changes (e.g., due to filtering)
  useEffect(() => {
    setCurrent(0);
  }, [projects.length]);

  // Use useCallback to memoize these functions so they aren't recreated on every render
  const nextProject = useCallback(() => {
    if (projects.length === 0) return;
    setCurrent((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  const prevProject = useCallback(() => {
    if (projects.length === 0) return;
    setCurrent((prev) => (prev - 1 + projects.length) % projects.length);
  }, [projects.length]);

  // Render a loading or empty state if there are no projects
  if (projects.length === 0 && !isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="container-custom text-center">
          <SectionHeader
            title="Case Study Showcase"
            subtitle="Explore our featured projects and the results we've achieved."
          />
          <p className="text-gray-600 mt-4">
            No projects found for the selected filter.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
          <SectionHeader
            title="Case Study Showcase"
            subtitle="Explore our featured projects and the results we've achieved for our clients."
            centered={false}
          />

          <div className="flex items-center space-x-4 flex-shrink-0">
            {!isLoading && apiProjectCount > 0 && (
              <p className="text-blue-600 text-sm font-medium hidden lg:block">
                ✨ {apiProjectCount} projects loaded
              </p>
            )}
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => onFilterChange(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Projects</option>
                <option value="Web Application">Web Apps</option>
                <option value="E-Commerce">E-Commerce</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={prevProject}
                aria-label="Previous project"
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                disabled={projects.length <= 1}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextProject}
                aria-label="Next project"
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                disabled={projects.length <= 1}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <motion.div
              className="flex"
              // The 'key' prop is important here to force a re-render if the projects list changes, avoiding glitches
              key={projects.length}
              animate={{ x: `-${current * 100}%` }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {projects.map((project) => (
                <div key={project.id} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <motion.div
                      className="relative aspect-video rounded-xl overflow-hidden group shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Link to={project.link} className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer">
                           <Play className="w-6 h-6 text-white ml-1" />
                        </Link>
                      </motion.div>
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                          {project.industry}
                        </span>
                      </div>
                    </motion.div>
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-3xl font-bold text-gray-900">
                            {project.brand}
                          </h3>
                          {project.featured && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex items-center">
                              <Star size={12} className="mr-1" />
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-lg">
                          {project.description}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Key Highlights:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {project.highlights.map(
                            (highlight, highlightIndex) => (
                              <motion.div
                                key={highlightIndex}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: highlightIndex * 0.1 }}
                                className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100"
                              >
                                <div className="text-sm font-medium text-blue-600">
                                  {highlight}
                                </div>
                              </motion.div>
                            )
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Technology Stack:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-4 pt-2">
                        <Link
                          to={project.link}
                          className="btn-primary group flex items-center"
                        >
                          View Full Case
                          <ExternalLink
                            className="ml-2 group-hover:translate-x-1 transition-transform"
                            size={16}
                          />
                        </Link>
                        <Link
                          to="/contact"
                          className="btn-outline group flex items-center"
                        >
                          Similar Project
                          <ArrowRight
                            className="ml-2 group-hover:translate-x-1 transition-transform"
                            size={16}
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
          {projects.length > 1 && (
            <div className="flex justify-center space-x-2 mt-8">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  aria-label={`Go to project ${index + 1}`}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === current ? "bg-blue-600" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};