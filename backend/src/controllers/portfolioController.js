import Portfolio from '../database/models/Portfolio.js';
import { processImage } from '../utils/fileUpload.js';
import path from 'path';

export const getAllPortfolio = async (req, res, next) => {
  try {
    const { category, status = 'published', limit = 50, offset = 0 } = req.query;

    const filter = { status };
    if (category) {
      filter.category = category;
    }

    const projects = await Portfolio.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

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

    // Process uploaded images
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const outputPath = path.join('uploads/images', `portfolio_${Date.now()}_${file.filename}`);
        await processImage(file.path, outputPath);
        imageUrls.push(`/uploads/images/${path.basename(outputPath)}`);
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

    // Process new images if uploaded
    if (req.files && req.files.length > 0) {
      const imageUrls = [];
      for (const file of req.files) {
        const outputPath = path.join('uploads/images', `portfolio_${Date.now()}_${file.filename}`);
        await processImage(file.path, outputPath);
        imageUrls.push(`/uploads/images/${path.basename(outputPath)}`);
      }
      updates.images = [...(existingProject.images || []), ...imageUrls];
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