// src/hooks/useHomeData.ts
import { useState, useEffect } from "react";
import { portfolioApi, servicesApi, adminApi } from "../utils/api";

export const useHomeData = () => {
  const [homeSettings, setHomeSettings] = useState<any>(null);
  const [featuredCaseStudies, setFeaturedCaseStudies] = useState<any[]>([]);
  const [featuredTestimonials, setFeaturedTestimonials] = useState<any[]>([]);
  const [apiProjects, setApiProjects] = useState<any[]>([]);
  const [apiServices, setApiServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [portfolioResponse, servicesResponse, homeSettingsResponse] =
          await Promise.all([
            portfolioApi.getAll({ limit: 4 }).catch((e) => ({ success: false, error: e.message })),
            servicesApi.getAll().catch((e) => ({ success: false, error: e.message })),
            adminApi.getHomeSettings().catch((e) => ({ success: false, error: e.message })),
          ]);

        // Process portfolio data
        if (portfolioResponse.success && portfolioResponse.data?.projects) {
          const projects = portfolioResponse.data.projects;
          setApiProjects(projects);
          setFeaturedCaseStudies(projects.filter((p: any) => p.featured));
        }

        // Process services data
        if (servicesResponse.success && servicesResponse.data?.services) {
          setApiServices(servicesResponse.data.services);
        }

        // Process home settings data
        if (homeSettingsResponse.success && homeSettingsResponse.data) {
          const settings = homeSettingsResponse.data.homeSettings || homeSettingsResponse.data;
          setHomeSettings(settings);
          if (settings.featured_testimonials) {
            setFeaturedTestimonials(settings.featured_testimonials);
          }
          // Additional logic for matching featured_case_studies can be added here
        }

      } catch (err) {
        console.error("Error fetching home data:", err);
        setError(err instanceof Error ? err.message : "Failed to load dynamic content");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  return {
    homeSettings,
    featuredCaseStudies,
    featuredTestimonials,
    apiProjects,
    apiServices,
    isLoading,
    error,
  };
};