import express from 'express';
import { query } from '../database/connection.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *       403:
 *         description: Admin access required
 */
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    // Get various statistics
    const [
      portfolioCount,
      blogCount,
      contactCount,
      serviceCount,
      labCount,
      userCount,
      newsletterCount,
      testimonialCount,
      recentContacts,
      recentBlogs,
    ] = await Promise.all([
      query('SELECT COUNT(*) FROM portfolio'),
      query('SELECT COUNT(*) FROM blogs'),
      query('SELECT COUNT(*) FROM contacts'),
      query('SELECT COUNT(*) FROM services'),
      query('SELECT COUNT(*) FROM labs'),
      query('SELECT COUNT(*) FROM users'),
      query('SELECT COUNT(*) FROM newsletter_subscribers'),
      query('SELECT COUNT(*) FROM testimonials'),
      query('SELECT * FROM contacts ORDER BY created_at DESC LIMIT 5'),
      query('SELECT * FROM blogs ORDER BY created_at DESC LIMIT 5'),
    ]);

    // Get monthly contact submissions
    const monthlyContacts = await query(`
      SELECT 
        DATE_TRUNC('month', created_at) as month,
        COUNT(*) as count
      FROM contacts 
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
    `);

    // Get contact status distribution
    const contactStatus = await query(`
      SELECT status, COUNT(*) as count
      FROM contacts
      GROUP BY status
    `);

    res.json({
      success: true,
      data: {
        statistics: {
          portfolio: parseInt(portfolioCount.rows[0].count),
          blogs: parseInt(blogCount.rows[0].count),
          contacts: parseInt(contactCount.rows[0].count),
          services: parseInt(serviceCount.rows[0].count),
          labs: parseInt(labCount.rows[0].count),
          users: parseInt(userCount.rows[0].count),
          newsletter: parseInt(newsletterCount.rows[0].count),
          testimonials: parseInt(testimonialCount.rows[0].count),
        },
        charts: {
          monthlyContacts: monthlyContacts.rows,
          contactStatus: contactStatus.rows,
        },
        recent: {
          contacts: recentContacts.rows,
          blogs: recentBlogs.rows,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/admin/contacts:
 *   get:
 *     summary: Get all contact submissions for admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, replied, closed]
 *         description: Filter by status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of contacts to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Number of contacts to skip
 *     responses:
 *       200:
 *         description: Contact submissions retrieved successfully
 */
router.get('/contacts', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let queryText = 'SELECT * FROM contacts';
    let queryParams = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      queryText += ` WHERE status = $${paramCount}`;
      queryParams.push(status);
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
        contacts: result.rows,
        total: result.rows.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/admin/contacts/{id}/status:
 *   patch:
 *     summary: Update contact submission status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [new, replied, closed]
 *     responses:
 *       200:
 *         description: Contact status updated successfully
 *       404:
 *         description: Contact not found
 */
router.patch('/contacts/:id/status', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'replied', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: new, replied, closed',
      });
    }

    const result = await query(
      'UPDATE contacts SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    res.json({
      success: true,
      message: 'Contact status updated successfully',
      data: {
        contact: result.rows[0],
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users for admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
router.get('/users', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id, name, email, role, created_at, updated_at FROM users ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      data: {
        users: result.rows,
        total: result.rows.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/admin/users/{id}:
 *   patch:
 *     summary: Update user role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, client, guest]
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       404:
 *         description: User not found
 */
router.patch('/users/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'client', 'guest'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be one of: admin, client, guest',
      });
    }

    const result = await query(
      'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, email, role, updated_at',
      [role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: {
        user: result.rows[0],
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/admin/testimonials:
 *   get:
 *     summary: Get all testimonials for admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Testimonials retrieved successfully
 */
router.get('/testimonials', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM testimonials ORDER BY created_at DESC');

    res.json({
      success: true,
      data: {
        testimonials: result.rows,
        total: result.rows.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/admin/testimonials:
 *   post:
 *     summary: Create new testimonial
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - quote
 *             properties:
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *               company:
 *                 type: string
 *               industry:
 *                 type: string
 *               image_url:
 *                 type: string
 *               quote:
 *                 type: string
 *               full_quote:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               project_type:
 *                 type: string
 *               results:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *     responses:
 *       201:
 *         description: Testimonial created successfully
 */
router.post('/testimonials', authenticateToken, requireAdmin, validate(schemas.testimonial), async (req, res, next) => {
  try {
    const {
      name,
      role,
      company,
      industry,
      image_url,
      quote,
      full_quote,
      rating,
      project_type,
      results,
      status = 'published'
    } = req.body;

    const result = await query(
      `INSERT INTO testimonials (name, role, company, industry, image_url, quote, full_quote, rating, project_type, results, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [name, role, company, industry, image_url, quote, full_quote, rating, project_type, results, status]
    );

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: {
        testimonial: result.rows[0],
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/admin/newsletter:
 *   get:
 *     summary: Get newsletter subscribers
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Newsletter subscribers retrieved successfully
 */
router.get('/newsletter', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM newsletter_subscribers ORDER BY subscription_date DESC');

    res.json({
      success: true,
      data: {
        subscribers: result.rows,
        total: result.rows.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;