import express from 'express';
import User from '../database/models/User.js';
import Portfolio from '../database/models/Portfolio.js';
import Blog from '../database/models/Blog.js';
import Contact from '../database/models/Contact.js';
import Service from '../database/models/Service.js';
import Lab from '../database/models/Lab.js';
import NewsletterSubscriber from '../database/models/NewsletterSubscriber.js';
import Testimonial from '../database/models/Testimonial.js';
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
      Portfolio.countDocuments(),
      Blog.countDocuments(),
      Contact.countDocuments(),
      Service.countDocuments(),
      Lab.countDocuments(),
      User.countDocuments(),
      NewsletterSubscriber.countDocuments(),
      Testimonial.countDocuments(),
      Contact.find().sort({ createdAt: -1 }).limit(5),
      Blog.find().sort({ createdAt: -1 }).limit(5),
    ]);

    // Get monthly contact submissions
    const monthlyContacts = await Contact.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);

    // Get contact status distribution
    const contactStatus = await Contact.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        statistics: {
          portfolio: portfolioCount,
          blogs: blogCount,
          contacts: contactCount,
          services: serviceCount,
          labs: labCount,
          users: userCount,
          newsletter: newsletterCount,
          testimonials: testimonialCount,
        },
        charts: {
          monthlyContacts,
          contactStatus,
        },
        recent: {
          contacts: recentContacts,
          blogs: recentBlogs,
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

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    res.json({
      success: true,
      data: {
        contacts,
        total: contacts.length,
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

    const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    res.json({
      success: true,
      message: 'Contact status updated successfully',
      data: {
        contact,
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
    const users = await User.find().select('-password_hash').sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        users,
        total: users.length,
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

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password_hash');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: {
        user,
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
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        testimonials,
        total: testimonials.length,
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

    const testimonial = new Testimonial({
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
      status
    });

    await testimonial.save();

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: {
        testimonial,
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
    const subscribers = await NewsletterSubscriber.find().sort({ subscription_date: -1 });

    res.json({
      success: true,
      data: {
        subscribers,
        total: subscribers.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;