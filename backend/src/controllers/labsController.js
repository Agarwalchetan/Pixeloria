import Lab from '../database/models/Lab.js';
import { processImage } from '../utils/fileUpload.js';
import path from 'path';

export const getAllLabs = async (req, res, next) => {
  try {
    const { category, status = 'published' } = req.query;

    const filter = { status };
    if (category) {
      filter.category = category;
    }

    const labs = await Lab.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        labs,
        total: labs.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getLabById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lab = await Lab.findById(id);

    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Lab project not found',
      });
    }

    res.json({
      success: true,
      data: { lab },
    });
  } catch (error) {
    next(error);
  }
};

export const createLab = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      tags,
      demo_url,
      source_url,
      status = 'published'
    } = req.body;

    // Process uploaded image
    let imageUrl = null;
    if (req.file) {
      const outputPath = path.join('uploads/images', `lab_${Date.now()}_${req.file.filename}`);
      await processImage(req.file.path, outputPath);
      imageUrl = `/uploads/images/${path.basename(outputPath)}`;
    }

    // Parse tags from form data
    const parsedTags = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [];

    const lab = new Lab({
      title,
      description,
      category,
      tags: parsedTags,
      demo_url,
      source_url,
      image_url: imageUrl,
      status
    });

    await lab.save();

    res.status(201).json({
      success: true,
      message: 'Lab project created successfully',
      data: { lab },
    });
  } catch (error) {
    next(error);
  }
};

export const updateLab = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // Check if lab project exists
    const existingLab = await Lab.findById(id);
    if (!existingLab) {
      return res.status(404).json({
        success: false,
        message: 'Lab project not found',
      });
    }

    // Process new image if uploaded
    if (req.file) {
      const outputPath = path.join('uploads/images', `lab_${Date.now()}_${req.file.filename}`);
      await processImage(req.file.path, outputPath);
      updates.image_url = `/uploads/images/${path.basename(outputPath)}`;
    }

    // Parse tags from form data
    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map(t => t.trim());
    }

    const lab = await Lab.findByIdAndUpdate(id, updates, { new: true });

    res.json({
      success: true,
      message: 'Lab project updated successfully',
      data: { lab },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLab = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lab = await Lab.findByIdAndDelete(id);

    if (!lab) {
      return res.status(404).json({
        success: false,
        message: 'Lab project not found',
      });
    }

    res.json({
      success: true,
      message: 'Lab project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};