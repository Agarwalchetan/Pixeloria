import express from 'express';
import Lab from '../database/models/Lab.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { uploadMiddleware, processImage } from '../utils/fileUpload.js';
import path from 'path';

const router = express.Router();

/**
 * @swagger
 * /api/labs:
 *   get:
 *     summary: Get all lab projects
 *     tags: [Labs]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Lab projects retrieved successfully
 */
router.get('/', async (req, res, next) => {
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
});

/**
 * @swagger
 * /api/labs/{id}:
 *   get:
 *     summary: Get single lab project
 *     tags: [Labs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lab project ID
 *     responses:
 *       200:
 *         description: Lab project retrieved successfully
 *       404:
 *         description: Lab project not found
 */
router.get('/:id', async (req, res, next) => {
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
      data: {
        lab,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/labs:
 *   post:
 *     summary: Create new lab project
 *     tags: [Labs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               demo_url:
 *                 type: string
 *               source_url:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Lab project created successfully
 */
router.post('/', 
  authenticateToken, 
  requireAdmin,
  uploadMiddleware.single('image'),
  async (req, res, next) => {
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
        data: {
          lab,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/labs/{id}:
 *   patch:
 *     summary: Update lab project
 *     tags: [Labs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lab project ID
 *     responses:
 *       200:
 *         description: Lab project updated successfully
 *       404:
 *         description: Lab project not found
 */
router.patch('/:id', 
  authenticateToken, 
  requireAdmin,
  uploadMiddleware.single('image'),
  async (req, res, next) => {
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
        data: {
          lab,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/labs/{id}:
 *   delete:
 *     summary: Delete lab project
 *     tags: [Labs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lab project ID
 *     responses:
 *       200:
 *         description: Lab project deleted successfully
 *       404:
 *         description: Lab project not found
 */
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
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
});

export default router;