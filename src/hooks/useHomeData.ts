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

        console.log('Fetching home data...');

        const [portfolioResponse, servicesResponse, homeSettingsResponse] =
          await Promise.all([
            portfolioApi.getAll({ limit: 4 }).catch((e) => {
              console.error('Portfolio API error:', e);
              return { success: false, error: e.message };
            }),
            servicesApi.getAll().catch((e) => {
              console.error('Services API error:', e);
              return { success: false, error: e.message };
            }),
            adminApi.getHomeSettings().catch((e) => {
              console.error('Home settings API error:', e);
              return { success: false, error: e.message };
            }),
          ]);

        console.log('API Responses:', {
          portfolio: portfolioResponse,
          services: servicesResponse,
          homeSettings: homeSettingsResponse
        });

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
          
          // Get testimonials from the API response - they're at the root level
          if (homeSettingsResponse.data.featuredTestimonials) {
            setFeaturedTestimonials(homeSettingsResponse.data.featuredTestimonials);
          } else if (settings.featured_testimonials) {
            setFeaturedTestimonials(settings.featured_testimonials);
          }
          
          console.log('Featured testimonials set:', homeSettingsResponse.data.featuredTestimonials?.length || 0);
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