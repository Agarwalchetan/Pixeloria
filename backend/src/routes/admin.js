import express from 'express';
import { authenticateToken, requireAdmin, requireAuth } from '../middleware/auth.js';
import { requireFullAdmin, requireEditor } from '../middleware/auth.js';
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
  bulkDelete,
  updateSettings
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

import {
  getHomeSettings,
  updateHomeSettings,
  getAboutSettings,
  updateAboutSettings,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  createJourneyMilestone,
  updateJourneyMilestone,
  deleteJourneyMilestone
} from '../controllers/contentController.js';

import {
  getCalculatorSubmissions,
  viewCalculatorSubmission,
  updateCalculatorSubmissionStatus,
  getCalculatorConfig,
  createProjectType,
  updateProjectType,
  deleteProjectType,
  createFeature,
  updateFeature,
  deleteFeature,
  createDesignOption,
  updateDesignOption,
  deleteDesignOption,
  createTimelineOption,
  updateTimelineOption,
  deleteTimelineOption
} from '../controllers/calculatorController.js';
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
router.get('/dashboard/portfolio', getAllPortfolio); // All roles can view
router.get('/dashboard/portfolio/:id', getPortfolioById);
router.post('/dashboard/portfolio', requireEditor, uploadMiddleware.multiple('images', 5), createPortfolio);
router.put('/dashboard/portfolio/:id', requireEditor, uploadMiddleware.multiple('images', 5), updatePortfolio);
router.delete('/dashboard/portfolio/:id', requireEditor, deletePortfolio);

// Blog routes
router.get('/dashboard/blog', getAllBlogs); // All roles can view
router.get('/dashboard/blog/:id', getBlogById);
router.post('/dashboard/blog', requireEditor, uploadMiddleware.single('image'), createBlog);
router.put('/dashboard/blog/:id', requireEditor, uploadMiddleware.single('image'), updateBlog);
router.delete('/dashboard/blog/:id', requireEditor, deleteBlog);

// Services routes
router.get('/dashboard/services', getAllServices); // All roles can view
router.get('/dashboard/services/:id', getServiceById);
router.post('/dashboard/services', requireEditor, validate(schemas.service), createService);
router.put('/dashboard/services/:id', requireEditor, updateService);
router.delete('/dashboard/services/:id', requireEditor, deleteService);

// Labs routes
router.get('/dashboard/labs', getAllLabs); // All roles can view
router.get('/dashboard/labs/:id', getLabById);
router.post('/dashboard/labs', requireEditor, uploadMiddleware.single('image'), createLab);
router.put('/dashboard/labs/:id', requireEditor, uploadMiddleware.single('image'), updateLab);
router.delete('/dashboard/labs/:id', requireEditor, deleteLab);

// Contact routes
router.get('/dashboard/contact-inquiries', getContacts); // All roles can view
router.patch('/dashboard/contact-inquiries/:id/status', requireEditor, updateContactStatus);

// Testimonials routes
router.get('/dashboard/testimonials', getTestimonials); // All roles can view
router.post('/dashboard/testimonials', requireEditor, validate(schemas.testimonial), createTestimonial);
router.put('/dashboard/testimonials/:id', requireEditor, updateTestimonial);
router.delete('/dashboard/testimonials/:id', requireEditor, deleteTestimonial);

// Newsletter routes
router.get('/dashboard/newsletter', getNewsletterSubscribers); // All roles can view
router.post('/dashboard/newsletter/send', requireEditor, sendNewsletter);
router.delete('/dashboard/newsletter/:id', requireEditor, deleteNewsletterSubscriber);

// Settings routes
router.get('/dashboard/settings', (req, res) => {
  res.json({
    success: true,
    data: {
      general: {
        site_title: 'Pixeloria',
        site_description: 'Crafting Digital Experiences That Grow Your Business',
        contact_email: 'hello@pixeloria.com',
        contact_phone: '(415) 555-0123',
        office_address: '123 Web Dev Lane, San Francisco, CA 94103'
      }
    }
  });
});
router.put('/dashboard/settings', requireFullAdmin, updateSettings);

// Home Page Content Management
router.get('/dashboard/home-settings', getHomeSettings);
router.put('/dashboard/home-settings', requireEditor, updateHomeSettings);

// About Page Content Management
router.get('/dashboard/about-settings', getAboutSettings);
router.put('/dashboard/about-settings', requireEditor, updateAboutSettings);
router.post('/dashboard/about-settings/team', requireEditor, uploadMiddleware.single('image'), createTeamMember);
router.put('/dashboard/about-settings/team/:id', requireEditor, uploadMiddleware.single('image'), updateTeamMember);
router.delete('/dashboard/about-settings/team/:id', requireEditor, deleteTeamMember);
router.post('/dashboard/about-settings/journey', requireEditor, createJourneyMilestone);
router.put('/dashboard/about-settings/journey/:id', requireEditor, updateJourneyMilestone);
router.delete('/dashboard/about-settings/journey/:id', requireEditor, deleteJourneyMilestone);

// Calculator routes
router.get('/dashboard/calculator/submissions', getCalculatorSubmissions);
router.get('/dashboard/calculator/submissions/:id/view', authenticateToken, requireAdmin, viewCalculatorSubmission);
router.patch('/dashboard/calculator/submissions/:id/status', requireEditor, updateCalculatorSubmissionStatus);
router.get('/dashboard/calculator/config', getCalculatorConfig);

// Calculator configuration routes
router.get('/dashboard/calculator/project-types', requireEditor, async (req, res) => {
  try {
    const { ProjectType } = await import('../database/models/CalculatorConfig.js');
    const projectTypes = await ProjectType.find({ status: 'active' }).sort({ order: 1 });
    res.json({ success: true, data: { projectTypes } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.post('/dashboard/calculator/project-types', requireEditor, createProjectType);
router.put('/dashboard/calculator/project-types/:id', requireEditor, updateProjectType);
router.delete('/dashboard/calculator/project-types/:id', requireEditor, deleteProjectType);

router.get('/dashboard/calculator/features', requireEditor, async (req, res) => {
  try {
    const { Feature } = await import('../database/models/CalculatorConfig.js');
    const features = await Feature.find({ status: 'active' }).sort({ order: 1 });
    res.json({ success: true, data: { features } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.post('/dashboard/calculator/features', requireEditor, createFeature);
router.put('/dashboard/calculator/features/:id', requireEditor, updateFeature);
router.delete('/dashboard/calculator/features/:id', requireEditor, deleteFeature);

router.get('/dashboard/calculator/design-options', requireEditor, async (req, res) => {
  try {
    const { DesignOption } = await import('../database/models/CalculatorConfig.js');
    const designOptions = await DesignOption.find({ status: 'active' }).sort({ order: 1 });
    res.json({ success: true, data: { designOptions } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.post('/dashboard/calculator/design-options', requireEditor, createDesignOption);
router.put('/dashboard/calculator/design-options/:id', requireEditor, updateDesignOption);
router.delete('/dashboard/calculator/design-options/:id', requireEditor, deleteDesignOption);

router.get('/dashboard/calculator/timeline-options', requireEditor, async (req, res) => {
  try {
    const { TimelineOption } = await import('../database/models/CalculatorConfig.js');
    const timelineOptions = await TimelineOption.find({ status: 'active' }).sort({ order: 1 });
    res.json({ success: true, data: { timelineOptions } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.post('/dashboard/calculator/timeline-options', requireEditor, createTimelineOption);
router.put('/dashboard/calculator/timeline-options/:id', requireEditor, updateTimelineOption);
router.delete('/dashboard/calculator/timeline-options/:id', requireEditor, deleteTimelineOption);

// Users routes
router.get('/dashboard/users', requireEditor, getUsers); // Editors and admins can view users
router.put('/dashboard/users/:id', requireEditor, updateUser);
router.delete('/dashboard/users/:id', requireEditor, deleteUser);

// Bulk operations
router.post('/dashboard/bulk-delete', requireEditor, bulkDelete);

export default router;