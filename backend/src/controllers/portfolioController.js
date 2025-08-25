import Portfolio from '../database/models/Portfolio.js';
import { processImage } from '../utils/fileUpload.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import path from 'path';
import fs from 'fs';

export const getAllPortfolio = async (req, res, next) => {
  try {
    const { category, status = 'published', limit = 50, offset = 0 } = req.query;

    const filter = { status };
    if (category) {
      filter.category = category;
    }

    let projects = await Portfolio.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    // If no projects exist, create sample ones
    if (projects.length === 0) {
      console.log('No portfolio projects found, creating sample projects...');
      const sampleProjects = [
        {
          title: "E-commerce Platform",
          description: "Modern e-commerce solution with advanced features",
          category: "Web Development",
          technologies: ["React", "Node.js", "MongoDB"],
          featured_image: "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800",
          status: "published",
          featured: true
        },
        {
          title: "Mobile Banking App",
          description: "Secure and user-friendly mobile banking application",
          category: "Mobile Development", 
          technologies: ["React Native", "Firebase", "Node.js"],
          featured_image: "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800",
          status: "published",
          featured: true
        },
        {
          title: "Corporate Website",
          description: "Professional corporate website with CMS",
          category: "Web Development",
          technologies: ["Next.js", "Tailwind CSS", "Strapi"],
          featured_image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800",
          status: "published",
          featured: false
        }
      ];
      
      try {
        projects = await Portfolio.insertMany(sampleProjects);
        console.log('Sample portfolio projects created:', projects.length);
      } catch (insertError) {
        console.error('Error creating sample projects:', insertError);
        projects = [];
      }
    }

    const total = await Portfolio.countDocuments(filter);

    res.json({
      success: true,
      data: {
        projects,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getPortfolioById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Portfolio.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.json({
      success: true,
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

export const createPortfolio = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      tags,
      tech_stack,
      results,
      link,
      status = 'published'
    } = req.body;

    // Upload images to Cloudinary
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      try {
        for (const file of req.files) {
          const cloudinaryResult = await uploadToCloudinary(file.path, 'pixeloria/portfolio');
          
          if (cloudinaryResult.success) {
            imageUrls.push(cloudinaryResult.url);
            // Clean up temporary file
            fs.unlinkSync(file.path);
          } else {
            throw new Error(`Image upload failed: ${cloudinaryResult.error}`);
          }
        }
      } catch (imageError) {
        console.error('Image upload error:', imageError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload images to Cloudinary'
        });
      }
    }

    // Parse arrays from form data
    const parsedTags = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [];
    const parsedTechStack = tech_stack ? (Array.isArray(tech_stack) ? tech_stack : tech_stack.split(',').map(t => t.trim())) : [];
    const parsedResults = results ? (Array.isArray(results) ? results : results.split(',').map(r => r.trim())) : [];

    const project = new Portfolio({
      title,
      description,
      images: imageUrls,
      category,
      tags: parsedTags,
      tech_stack: parsedTechStack,
      results: parsedResults,
      link,
      status
    });

    await project.save();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

export const updatePortfolio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Check if project exists
    const existingProject = await Portfolio.findById(id);
    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Upload new images to Cloudinary if provided
    if (req.files && req.files.length > 0) {
      const imageUrls = [];
      try {
        for (const file of req.files) {
          const cloudinaryResult = await uploadToCloudinary(file.path, 'pixeloria/portfolio');
          
          if (cloudinaryResult.success) {
            imageUrls.push(cloudinaryResult.url);
            // Clean up temporary file
            fs.unlinkSync(file.path);
          } else {
            throw new Error(`Image upload failed: ${cloudinaryResult.error}`);
          }
        }
        updates.images = [...(existingProject.images || []), ...imageUrls];
      } catch (imageError) {
        console.error('Image upload error:', imageError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload images to Cloudinary'
        });
      }
    }

    // Parse arrays from form data
    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map(t => t.trim());
    }
    if (updates.tech_stack && typeof updates.tech_stack === 'string') {
      updates.tech_stack = updates.tech_stack.split(',').map(t => t.trim());
    }
    if (updates.results && typeof updates.results === 'string') {
      updates.results = updates.results.split(',').map(r => r.trim());
    }

    const project = await Portfolio.findByIdAndUpdate(id, updates, { new: true });

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

export const deletePortfolio = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Portfolio.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};