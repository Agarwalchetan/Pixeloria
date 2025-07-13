import express from 'express';
import Blog from '../database/models/Blog.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
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

    const filter = { status };
    if (category) {
      filter.category = category;
    }

    const posts = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    res.json({
      success: true,
      data: {
        posts,
        total: posts.length,
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

    const post = await Blog.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    res.json({
      success: true,
      data: {
        post,
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

      const post = new Blog({
        title,
        excerpt,
        content,
        image_url: imageUrl,
        author,
        category,
        tags: parsedTags,
        read_time,
        status
      });

      await post.save();

      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: {
          post,
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
      const existingPost = await Blog.findById(id);
      if (!existingPost) {
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

      const post = await Blog.findByIdAndUpdate(id, updates, { new: true });

      res.json({
        success: true,
        message: 'Post updated successfully',
        data: {
          post,
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

    const post = await Blog.findByIdAndDelete(id);

    if (!post) {
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