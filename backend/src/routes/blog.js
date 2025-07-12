import express from 'express';
import { query } from '../database/connection.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';
import { uploadMiddleware, processImage } from '../utils/fileUpload.js';
import path from 'path';

const router = express.Router();

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Get all blog posts
 *     tags: [Blog]
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
 *         description: Number of posts to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Number of posts to skip
 *     responses:
 *       200:
 *         description: Blog posts retrieved successfully
 */
router.get('/', async (req, res, next) => {
  try {
    const { category, status = 'published', limit = 20, offset = 0 } = req.query;

    let queryText = 'SELECT * FROM blogs WHERE status = $1';
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
        posts: result.rows,
        total: result.rows.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/blogs/{id}:
 *   get:
 *     summary: Get single blog post
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *       404:
 *         description: Post not found
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query('SELECT * FROM blogs WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    res.json({
      success: true,
      data: {
        post: result.rows[0],
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/blogs:
 *   post:
 *     summary: Create new blog post
 *     tags: [Blog]
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
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               excerpt:
 *                 type: string
 *               content:
 *                 type: string
 *               author:
 *                 type: string
 *               category:
 *                 type: string
 *               read_time:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 */
router.post('/', 
  authenticateToken, 
  requireAdmin,
  uploadMiddleware.single('image'),
  async (req, res, next) => {
    try {
      const {
        title,
        excerpt,
        content,
        author,
        category,
        tags,
        read_time,
        status = 'published'
      } = req.body;

      // Process uploaded image
      let imageUrl = null;
      if (req.file) {
        const outputPath = path.join('uploads/images', `blog_${Date.now()}_${req.file.filename}`);
        await processImage(req.file.path, outputPath);
        imageUrl = `/uploads/images/${path.basename(outputPath)}`;
      }

      // Parse tags from form data
      const parsedTags = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [];

      const result = await query(
        `INSERT INTO blogs (title, excerpt, content, image_url, author, category, tags, read_time, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [title, excerpt, content, imageUrl, author, category, parsedTags, read_time, status]
      );

      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: {
          post: result.rows[0],
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/blogs/{id}:
 *   patch:
 *     summary: Update blog post
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       404:
 *         description: Post not found
 */
router.patch('/:id', 
  authenticateToken, 
  requireAdmin,
  uploadMiddleware.single('image'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const updates = { ...req.body };

      // Check if post exists
      const existingPost = await query('SELECT * FROM blogs WHERE id = $1', [id]);
      if (existingPost.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Post not found',
        });
      }

      // Process new image if uploaded
      if (req.file) {
        const outputPath = path.join('uploads/images', `blog_${Date.now()}_${req.file.filename}`);
        await processImage(req.file.path, outputPath);
        updates.image_url = `/uploads/images/${path.basename(outputPath)}`;
      }

      // Parse tags from form data
      if (updates.tags && typeof updates.tags === 'string') {
        updates.tags = updates.tags.split(',').map(t => t.trim());
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
        `UPDATE blogs SET ${updateFields.join(', ')} WHERE id = $${paramCount + 1} RETURNING *`,
        updateValues
      );

      res.json({
        success: true,
        message: 'Post updated successfully',
        data: {
          post: result.rows[0],
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/blogs/{id}:
 *   delete:
 *     summary: Delete blog post
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 */
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM blogs WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    res.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;