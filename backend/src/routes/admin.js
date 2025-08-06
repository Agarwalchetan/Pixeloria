import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { uploadMiddleware } from '../utils/fileUpload.js';
import { validate, schemas } from '../middleware/validation.js';

// Import controllers
import {
  getDashboardOverview,
  getAnalytics,
  getContacts,
  updateContactStatus,
  getUsers,
  updateUser,
  deleteUser,
  getNewsletterSubscribers,
  sendNewsletter,
  deleteNewsletterSubscriber,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  bulkDelete
} from '../controllers/adminController.js';

import {
  getAllPortfolio,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio
} from '../controllers/portfolioController.js';

import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog
} from '../controllers/blogController.js';

import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from '../controllers/servicesController.js';

import {
  getAllLabs,
  getLabById,
  createLab,
  updateLab,
  deleteLab
} from '../controllers/labsController.js';

const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * @swagger
 * /api/admin/dashboard/overview:
 *   get:
 *     summary: Get admin dashboard overview
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard overview retrieved successfully
 */
router.get('/dashboard/overview', getDashboardOverview);

/**
 * @swagger
 * /api/admin/dashboard/analytics:
 *   get:
 *     summary: Get analytics data
 *     tags: [Admin Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 */
router.get('/dashboard/analytics', getAnalytics);

// Portfolio routes
router.get('/dashboard/portfolio', getAllPortfolio);
router.get('/dashboard/portfolio/:id', getPortfolioById);
router.post('/dashboard/portfolio', uploadMiddleware.multiple('images', 5), createPortfolio);
router.put('/dashboard/portfolio/:id', uploadMiddleware.multiple('images', 5), updatePortfolio);
router.delete('/dashboard/portfolio/:id', deletePortfolio);

// Blog routes
router.get('/dashboard/blog', getAllBlogs);
router.get('/dashboard/blog/:id', getBlogById);
router.post('/dashboard/blog', uploadMiddleware.single('image'), createBlog);
router.put('/dashboard/blog/:id', uploadMiddleware.single('image'), updateBlog);
router.delete('/dashboard/blog/:id', deleteBlog);

// Services routes
router.get('/dashboard/services', getAllServices);
router.get('/dashboard/services/:id', getServiceById);
router.post('/dashboard/services', validate(schemas.service), createService);
router.put('/dashboard/services/:id', updateService);
router.delete('/dashboard/services/:id', deleteService);

// Labs routes
router.get('/dashboard/labs', getAllLabs);
router.get('/dashboard/labs/:id', getLabById);
router.post('/dashboard/labs', uploadMiddleware.single('image'), createLab);
router.put('/dashboard/labs/:id', uploadMiddleware.single('image'), updateLab);
router.delete('/dashboard/labs/:id', deleteLab);

// Contact routes
router.get('/dashboard/contact-inquiries', getContacts);
router.patch('/dashboard/contact-inquiries/:id/status', updateContactStatus);

// Testimonials routes
router.get('/dashboard/testimonials', getTestimonials);
router.post('/dashboard/testimonials', validate(schemas.testimonial), createTestimonial);
router.put('/dashboard/testimonials/:id', updateTestimonial);
router.delete('/dashboard/testimonials/:id', deleteTestimonial);

// Newsletter routes
router.get('/dashboard/newsletter', getNewsletterSubscribers);
router.post('/dashboard/newsletter/send', sendNewsletter);
router.delete('/dashboard/newsletter/:id', deleteNewsletterSubscriber);

// Users routes
router.get('/dashboard/users', getUsers);
router.put('/dashboard/users/:id', updateUser);
router.delete('/dashboard/users/:id', deleteUser);

// Bulk operations
router.post('/dashboard/bulk-delete', bulkDelete);

export default router;