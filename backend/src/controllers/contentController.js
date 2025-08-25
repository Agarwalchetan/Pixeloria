import HomeSettings from '../database/models/HomeSettings.js';
import AboutSettings from '../database/models/AboutSettings.js';
import Portfolio from '../database/models/Portfolio.js';
import Testimonial from '../database/models/Testimonial.js';
import { logger } from '../utils/logger.js';
import path from 'path';
import fs from 'fs';
import { processImage } from '../utils/fileUpload.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// HOME SETTINGS CONTROLLERS
export const getHomeSettings = async (req, res, next) => {
  try {
    console.log('Getting home settings...');
    let homeSettings = await HomeSettings.findOne()
      .populate('featured_case_studies.portfolio_id')
      .populate('featured_testimonials.testimonial_id');
    
    if (!homeSettings) {
      console.log('No home settings found, creating default...');
      // Create default home settings
      homeSettings = new HomeSettings({
        edge_numbers: {
          projects_delivered: 50,
          client_satisfaction: 100,
          users_reached: "1M+",
          support_hours: "24/7"
        },
        featured_case_studies: [],
        featured_testimonials: []
      });
      await homeSettings.save();
      console.log('Default home settings created:', homeSettings);
    }

    console.log('Home settings found:', homeSettings);
    
    // Get all portfolio projects for case study selection
    const portfolioProjects = await Portfolio.find({ status: 'published' }).select('title _id category');
    console.log('Portfolio projects found:', portfolioProjects.length);
    
    // Get all testimonials for "Voices that Trust" selection
    let allTestimonials = await Testimonial.find({ status: 'published' });
    console.log('All testimonials found:', allTestimonials.length);
    
    // If no testimonials exist, create some sample ones
    if (allTestimonials.length === 0) {
      console.log('No testimonials found, creating sample testimonials...');
      const sampleTestimonials = [
        {
          name: "Sarah Johnson",
          role: "CEO",
          company: "TechStart Inc.",
          quote: "Pixeloria transformed our digital presence completely. The team's attention to detail exceeded our expectations.",
          rating: 5,
          status: "published",
          image_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
        },
        {
          name: "Michael Chen", 
          role: "Marketing Director",
          company: "GrowthCorp",
          quote: "The e-commerce platform they built for us is phenomenal. Sales increased by 250% in just 3 months.",
          rating: 5,
          status: "published",
          image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        },
        {
          name: "Emily Rodriguez",
          role: "Founder", 
          company: "Creative Studio",
          quote: "Outstanding work! They brought our creative vision to life with pixel-perfect precision.",
          rating: 5,
          status: "published",
          image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
        },
        {
          name: "David Kim",
          role: "CTO", 
          company: "InnovateTech",
          quote: "Their technical expertise and innovative solutions helped us scale our platform to millions of users.",
          rating: 5,
          status: "published",
          image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        },
        {
          name: "Lisa Thompson",
          role: "Product Manager",
          company: "StartupHub",
          quote: "Amazing collaboration and results. They delivered exactly what we envisioned and more.",
          rating: 5,
          status: "published",
          image_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
        }
      ];
      
      try {
        allTestimonials = await Testimonial.insertMany(sampleTestimonials);
        console.log('Sample testimonials created:', allTestimonials.length);
      } catch (insertError) {
        console.error('Error creating sample testimonials:', insertError);
        allTestimonials = [];
      }
    }

    console.log('Sending response with home settings...');
    res.json({
      success: true,
      data: {
        homeSettings,
        availableProjects: portfolioProjects,
        featuredTestimonials: allTestimonials
      }
    });
  } catch (error) {
    console.error('Error in getHomeSettings:', error);
    next(error);
  }
};

export const updateHomeSettings = async (req, res, next) => {
  try {
    console.log('=== Updating home settings ===');
    console.log('Request body:', req.body);
    
    const { edge_numbers, featured_case_studies, featured_testimonials } = req.body;
    
    let homeSettings = await HomeSettings.findOne();
    
    if (!homeSettings) {
      console.log('Creating new home settings document...');
      homeSettings = new HomeSettings();
    }
    
    if (edge_numbers) {
      console.log('Updating edge numbers from:', homeSettings.edge_numbers, 'to:', edge_numbers);
      homeSettings.edge_numbers = { ...homeSettings.edge_numbers, ...edge_numbers };
    }
    
    if (featured_case_studies) {
      console.log('Updating featured case studies:', featured_case_studies.length, 'items');
      homeSettings.featured_case_studies = featured_case_studies;
    }
    
    if (featured_testimonials) {
      console.log('Updating featured testimonials:', featured_testimonials.length, 'items');
      homeSettings.featured_testimonials = featured_testimonials;
    }
    
    homeSettings.last_updated = new Date();
    if (req.user && req.user._id) {
      homeSettings.updated_by = req.user._id;
    }
    
    await homeSettings.save();
    console.log('Home settings saved successfully');
    console.log('Updated edge numbers:', homeSettings.edge_numbers);
    
    // Manually populate the featured case studies and testimonials
    if (homeSettings.featured_case_studies && homeSettings.featured_case_studies.length > 0) {
      console.log('Populating featured case studies after save...');
      for (let i = 0; i < homeSettings.featured_case_studies.length; i++) {
        const caseStudy = homeSettings.featured_case_studies[i];
        if (caseStudy.portfolio_id) {
          try {
            const project = await Portfolio.findById(caseStudy.portfolio_id).lean();
            if (project) {
              homeSettings.featured_case_studies[i] = {
                ...caseStudy,
                portfolio_id: project
              };
            }
          } catch (populateError) {
            console.error('Error populating case study after save:', populateError);
          }
        }
      }
    }

    if (homeSettings.featured_testimonials && homeSettings.featured_testimonials.length > 0) {
      console.log('Populating featured testimonials after save...');
      for (let i = 0; i < homeSettings.featured_testimonials.length; i++) {
        const testimonial = homeSettings.featured_testimonials[i];
        if (testimonial.testimonial_id) {
          try {
            const testimonialData = await Testimonial.findById(testimonial.testimonial_id).lean();
            if (testimonialData) {
              homeSettings.featured_testimonials[i] = {
                ...testimonial,
                testimonial_id: testimonialData
              };
            }
          } catch (populateError) {
            console.error('Error populating testimonial after save:', populateError);
          }
        }
      }
    }

    console.log('=== Sending success response ===');
    res.json({
      success: true,
      message: 'Home settings updated successfully',
      data: { homeSettings }
    });
  } catch (error) {
    console.error('=== Error in updateHomeSettings ===', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update home settings',
      message: 'Internal server error while updating home settings'
    });
  }
};

// ABOUT SETTINGS CONTROLLERS
export const getAboutSettings = async (req, res, next) => {
  try {
    let aboutSettings = await AboutSettings.findOne();
    
    if (!aboutSettings) {
      // Create default about settings
      aboutSettings = new AboutSettings({
        about_numbers: {
          projects_completed: "50+",
          client_satisfaction: "100%",
          support_availability: "24/7",
          team_members: "10+"
        },
        team_members: [
          {
            name: "Sarah Johnson",
            role: "Founder & Lead Developer",
            image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            bio: "Full-stack developer with 10+ years of experience in building scalable web applications.",
            fun_fact: "Can code faster with coffee than without ☕",
            skills: ["React", "Node.js", "AWS"],
            social: {
              github: "#",
              linkedin: "#",
              twitter: "#"
            },
            order: 1,
            status: 'active'
          },
          {
            name: "Michael Chen",
            role: "UI/UX Designer",
            image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            bio: "Passionate about creating beautiful and intuitive user experiences.",
            fun_fact: "Draws inspiration from nature walks 🌿",
            skills: ["Figma", "Adobe XD", "Prototyping"],
            social: {
              github: "#",
              linkedin: "#",
              twitter: "#"
            },
            order: 2,
            status: 'active'
          },
          {
            name: "Emily Rodriguez",
            role: "Technical Lead",
            image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            bio: "Architecture expert specializing in scalable solutions.",
            fun_fact: "Builds mechanical keyboards for fun ⌨️",
            skills: ["System Design", "Cloud Architecture", "DevOps"],
            social: {
              github: "#",
              linkedin: "#",
              twitter: "#"
            },
            order: 3,
            status: 'active'
          }
        ],
        journey_milestones: [
          {
            year: "2020",
            title: "Founded Pixeloria",
            description: "Started with a vision to create exceptional digital experiences.",
            icon: "Rocket",
            order: 1,
            status: 'active'
          },
          {
            year: "2021",
            title: "Team Growth",
            description: "Expanded to a team of 10 talented developers and designers.",
            icon: "Users",
            order: 2,
            status: 'active'
          },
          {
            year: "2022",
            title: "50+ Projects",
            description: "Successfully delivered over 50 projects for clients worldwide.",
            icon: "CheckCircle",
            order: 3,
            status: 'active'
          },
          {
            year: "2023",
            title: "Innovation Award",
            description: "Recognized for excellence in web development and design.",
            icon: "Star",
            order: 4,
            status: 'active'
          }
        ]
      });
      await aboutSettings.save();
    }

    res.json({
      success: true,
      data: { aboutSettings }
    });
  } catch (error) {
    next(error);
  }
};

export const updateAboutSettings = async (req, res, next) => {
  try {
    const { about_numbers } = req.body;
    
    let aboutSettings = await AboutSettings.findOne();
    
    if (!aboutSettings) {
      aboutSettings = new AboutSettings();
    }
    
    if (about_numbers) {
      aboutSettings.about_numbers = { ...aboutSettings.about_numbers, ...about_numbers };
    }
    
    aboutSettings.last_updated = new Date();
    aboutSettings.updated_by = req.user._id;
    
    await aboutSettings.save();

    res.json({
      success: true,
      message: 'About settings updated successfully',
      data: { aboutSettings }
    });
  } catch (error) {
    next(error);
  }
};

// TEAM MEMBER CONTROLLERS
export const createTeamMember = async (req, res, next) => {
  try {
    const { name, role, bio, fun_fact, skills, social, order } = req.body;
    
    // Upload image to Cloudinary
    let imageUrl = null;
    if (req.file) {
      const cloudinaryResult = await uploadToCloudinary(req.file.path, 'pixeloria/team');
      
      if (cloudinaryResult.success) {
        imageUrl = cloudinaryResult.url;
        // Clean up temporary file
        fs.unlinkSync(req.file.path);
      } else {
        throw new Error(`Image upload failed: ${cloudinaryResult.error}`);
      }
    }

    let aboutSettings = await AboutSettings.findOne();
    if (!aboutSettings) {
      aboutSettings = new AboutSettings();
    }

    const newTeamMember = {
      name,
      role,
      image: imageUrl || req.body.image,
      bio,
      fun_fact,
      skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()),
      social: typeof social === 'string' ? JSON.parse(social) : social,
      order: parseInt(order) || aboutSettings.team_members.length + 1,
      status: 'active'
    };

    aboutSettings.team_members.push(newTeamMember);
    aboutSettings.last_updated = new Date();
    aboutSettings.updated_by = req.user._id;
    
    await aboutSettings.save();

    res.status(201).json({
      success: true,
      message: 'Team member created successfully',
      data: { aboutSettings }
    });
  } catch (error) {
    next(error);
  }
};

export const updateTeamMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, role, bio, fun_fact, skills, social, order, status } = req.body;
    
    let aboutSettings = await AboutSettings.findOne();
    if (!aboutSettings) {
      return res.status(404).json({
        success: false,
        message: 'About settings not found'
      });
    }

    const teamMemberIndex = aboutSettings.team_members.findIndex(member => member._id.toString() === id);
    if (teamMemberIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Upload new image to Cloudinary if provided
    let imageUrl = aboutSettings.team_members[teamMemberIndex].image;
    if (req.file) {
      const cloudinaryResult = await uploadToCloudinary(req.file.path, 'pixeloria/team');
      
      if (cloudinaryResult.success) {
        imageUrl = cloudinaryResult.url;
        // Clean up temporary file
        fs.unlinkSync(req.file.path);
      } else {
        throw new Error(`Image upload failed: ${cloudinaryResult.error}`);
      }
    }

    // Update team member
    aboutSettings.team_members[teamMemberIndex] = {
      ...aboutSettings.team_members[teamMemberIndex],
      name: name || aboutSettings.team_members[teamMemberIndex].name,
      role: role || aboutSettings.team_members[teamMemberIndex].role,
      image: imageUrl,
      bio: bio || aboutSettings.team_members[teamMemberIndex].bio,
      fun_fact: fun_fact || aboutSettings.team_members[teamMemberIndex].fun_fact,
      skills: skills ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())) : aboutSettings.team_members[teamMemberIndex].skills,
      social: social ? (typeof social === 'string' ? JSON.parse(social) : social) : aboutSettings.team_members[teamMemberIndex].social,
      order: order ? parseInt(order) : aboutSettings.team_members[teamMemberIndex].order,
      status: status || aboutSettings.team_members[teamMemberIndex].status
    };

    aboutSettings.last_updated = new Date();
    aboutSettings.updated_by = req.user._id;
    
    await aboutSettings.save();

    res.json({
      success: true,
      message: 'Team member updated successfully',
      data: { aboutSettings }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTeamMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    let aboutSettings = await AboutSettings.findOne();
    if (!aboutSettings) {
      return res.status(404).json({
        success: false,
        message: 'About settings not found'
      });
    }

    aboutSettings.team_members = aboutSettings.team_members.filter(member => member._id.toString() !== id);
    aboutSettings.last_updated = new Date();
    aboutSettings.updated_by = req.user._id;
    
    await aboutSettings.save();

    res.json({
      success: true,
      message: 'Team member deleted successfully',
      data: { aboutSettings }
    });
  } catch (error) {
    next(error);
  }
};

// JOURNEY MILESTONE CONTROLLERS
export const createJourneyMilestone = async (req, res, next) => {
  try {
    const { year, title, description, icon, order } = req.body;
    
    let aboutSettings = await AboutSettings.findOne();
    if (!aboutSettings) {
      aboutSettings = new AboutSettings();
    }

    const newMilestone = {
      year,
      title,
      description,
      icon: icon || 'Rocket',
      order: parseInt(order) || aboutSettings.journey_milestones.length + 1,
      status: 'active'
    };

    aboutSettings.journey_milestones.push(newMilestone);
    aboutSettings.last_updated = new Date();
    aboutSettings.updated_by = req.user._id;
    
    await aboutSettings.save();

    res.status(201).json({
      success: true,
      message: 'Journey milestone created successfully',
      data: { aboutSettings }
    });
  } catch (error) {
    next(error);
  }
};

export const updateJourneyMilestone = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { year, title, description, icon, order, status } = req.body;
    
    let aboutSettings = await AboutSettings.findOne();
    if (!aboutSettings) {
      return res.status(404).json({
        success: false,
        message: 'About settings not found'
      });
    }

    const milestoneIndex = aboutSettings.journey_milestones.findIndex(milestone => milestone._id.toString() === id);
    if (milestoneIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Journey milestone not found'
      });
    }

    // Update milestone
    aboutSettings.journey_milestones[milestoneIndex] = {
      ...aboutSettings.journey_milestones[milestoneIndex],
      year: year || aboutSettings.journey_milestones[milestoneIndex].year,
      title: title || aboutSettings.journey_milestones[milestoneIndex].title,
      description: description || aboutSettings.journey_milestones[milestoneIndex].description,
      icon: icon || aboutSettings.journey_milestones[milestoneIndex].icon,
      order: order ? parseInt(order) : aboutSettings.journey_milestones[milestoneIndex].order,
      status: status || aboutSettings.journey_milestones[milestoneIndex].status
    };

    aboutSettings.last_updated = new Date();
    aboutSettings.updated_by = req.user._id;
    
    await aboutSettings.save();

    res.json({
      success: true,
      message: 'Journey milestone updated successfully',
      data: { aboutSettings }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJourneyMilestone = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    let aboutSettings = await AboutSettings.findOne();
    if (!aboutSettings) {
      return res.status(404).json({
        success: false,
        message: 'About settings not found'
      });
    }

    aboutSettings.journey_milestones = aboutSettings.journey_milestones.filter(milestone => milestone._id.toString() !== id);
    aboutSettings.last_updated = new Date();
    aboutSettings.updated_by = req.user._id;
    
    await aboutSettings.save();

    res.json({
      success: true,
      message: 'Journey milestone deleted successfully',
      data: { aboutSettings }
    });
  } catch (error) {
    next(error);
  }
};