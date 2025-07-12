import express from 'express';
import { query } from '../database/connection.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';
import { uploadMiddleware, processImage } from '../utils/fileUpload.js';
import path from 'path';

const router = express.Router();

/**
 * @swagger
 * /api/portfolio:
 *   get:
 *     summary: Get all portfolio projects
 *     tags: [Portfolio]
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
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of projects to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Number of projects to skip
 *     responses:
 *       200:
 *         description: Portfolio projects retrieved successfully
 */
router.get('/', async (req, res, next) => {
  try {
    const { category, status = 'published', limit = 50, offset = 0 } = req.query;

    let queryText = 'SELECT * FROM portfolio WHERE status = $1';
    let queryParams = [status];
    let paramCount = 1;

    if (category) {
      paramCount++;
      queryText += ` AND category = $${paramCount}`;
      queryParams.push(category);
    }

    queryText += ' ORDER BY created_at DESC';

    if (limit) {
      paramCount++;
      queryText += ` LIMIT $${paramCount}`;
      queryParams.push(parseInt(limit));
    }

    if (offset) {
      paramCount++;
      queryText += ` OFFSET $${paramCount}`;
      queryParams.push(parseInt(offset));
    }

    const result = await query(queryText, queryParams);

    res.json({
      success: true,
      data: {
        projects: result.rows,
        total: result.rows.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/portfolio/{id}:
 *   get:
 *     summary: Get single portfolio project
 *     tags: [Portfolio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 *       404:
 *         description: Project not found
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query('SELECT * FROM portfolio WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.json({
      success: true,
      data: {
        project: result.rows[0],
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/portfolio:
 *   post:
 *     summary: Create new portfolio project
 *     tags: [Portfolio]
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
 *               link:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Project created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post('/', 
  authenticateToken, 
  requireAdmin, 
  uploadMiddleware.multiple('images', 5),
  async (req, res, next) => {
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

      const result = await query(
        `INSERT INTO portfolio (title, description, images, category, tags, tech_stack, results, link, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [title, description, imageUrls, category, parsedTags, parsedTechStack, parsedResults, link, status]
      );

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: {
          project: result.rows[0],
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/portfolio/{id}:
 *   patch:
 *     summary: Update portfolio project
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       404:
 *         description: Project not found
 */
router.patch('/:id', 
  authenticateToken, 
  requireAdmin,
  uploadMiddleware.multiple('images', 5),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const updates = { ...req.body };

      // Check if project exists
      const existingProject = await query('SELECT * FROM portfolio WHERE id = $1', [id]);
      if (existingProject.rows.length === 0) {
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
        updates.images = [...(existingProject.rows[0].images || []), ...imageUrls];
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

      // Build update query
      const updateFields = [];
      const updateValues = [];
      let paramCount = 0;

      Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined) {
          paramCount++;
          updateFields.push(`${key} = $${paramCount}`);
          updateValues.push(updates[key]);
        }
      });

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid fields to update',
        });
      }

      updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
      updateValues.push(id);

      const result = await query(
        `UPDATE portfolio SET ${updateFields.join(', ')} WHERE id = $${paramCount + 1} RETURNING *`,
        updateValues
      );

      res.json({
        success: true,
        message: 'Project updated successfully',
        data: {
          project: result.rows[0],
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/portfolio/{id}:
 *   delete:
 *     summary: Delete portfolio project
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       404:
 *         description: Project not found
 */
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM portfolio WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
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
});

export default router;