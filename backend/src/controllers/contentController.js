import HomeSettings from '../database/models/HomeSettings.js';
import AboutSettings from '../database/models/AboutSettings.js';
import Portfolio from '../database/models/Portfolio.js';
import Testimonial from '../database/models/Testimonial.js';
import { processImage } from '../utils/fileUpload.js';
import path from 'path';

// HOME SETTINGS CONTROLLERS
export const getHomeSettings = async (req, res, next) => {
  try {
    let homeSettings = await HomeSettings.findOne().populate('featured_case_studies.portfolio_id');
    
    if (!homeSettings) {
      // Create default home settings
      homeSettings = new HomeSettings({
        edge_numbers: {
          projects_delivered: 50,
          client_satisfaction: 100,
          users_reached: "1M+",
          support_hours: "24/7"
        },
        featured_case_studies: []
      });
      await homeSettings.save();
    }

    // Get all portfolio projects for case study selection
    const portfolioProjects = await Portfolio.find({ status: 'published' }).select('title _id category');
    
    // Get featured testimonials for "Voices that Trust"
    const featuredTestimonials = await Testimonial.find({ status: 'published' }).limit(10);

    res.json({
      success: true,
      data: {
        homeSettings,
        availableProjects: portfolioProjects,
        featuredTestimonials
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateHomeSettings = async (req, res, next) => {
  try {
    const { edge_numbers, featured_case_studies } = req.body;
    
    let homeSettings = await HomeSettings.findOne();
    
    if (!homeSettings) {
      homeSettings = new HomeSettings();
    }
    
    if (edge_numbers) {
      homeSettings.edge_numbers = { ...homeSettings.edge_numbers, ...edge_numbers };
    }
    
    if (featured_case_studies) {
      homeSettings.featured_case_studies = featured_case_studies;
    }
    
    homeSettings.last_updated = new Date();
    homeSettings.updated_by = req.user._id;
    
    await homeSettings.save();
    await homeSettings.populate('featured_case_studies.portfolio_id');

    res.json({
      success: true,
      message: 'Home settings updated successfully',
      data: { homeSettings }
    });
  } catch (error) {
    next(error);
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
    
    // Process uploaded image
    let imageUrl = null;
    if (req.file) {
      const outputPath = path.join('uploads/images', `team_${Date.now()}_${req.file.filename}`);
      await processImage(req.file.path, outputPath);
      imageUrl = `/uploads/images/${path.basename(outputPath)}`;
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

    // Process new image if uploaded
    let imageUrl = aboutSettings.team_members[teamMemberIndex].image;
    if (req.file) {
      const outputPath = path.join('uploads/images', `team_${Date.now()}_${req.file.filename}`);
      await processImage(req.file.path, outputPath);
      imageUrl = `/uploads/images/${path.basename(outputPath)}`;
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