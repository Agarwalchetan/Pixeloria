import express from 'express';
import { validate, schemas } from '../middleware/validation.js';
import { sendEmail } from '../utils/email.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Cost calculation logic
const calculateProjectCost = (projectData) => {
  const {
    project_type,
    features,
    timeline,
    budget_range,
    additional_requirements
  } = projectData;

  let baseCost = 0;
  let timelineMultiplier = 1;
  let complexityMultiplier = 1;

  // Base cost by project type
  const projectTypeCosts = {
    'landing-page': 2000,
    'business-website': 5000,
    'e-commerce': 10000,
    'web-app': 15000,
    'mobile-app': 20000,
    'custom-solution': 25000,
  };

  baseCost = projectTypeCosts[project_type] || 5000;

  // Feature-based cost additions
  const featureCosts = {
    'responsive-design': 500,
    'cms-integration': 1500,
    'payment-gateway': 2000,
    'user-authentication': 1000,
    'api-integration': 1500,
    'seo-optimization': 800,
    'analytics-setup': 500,
    'social-media-integration': 300,
    'multi-language': 1200,
    'advanced-animations': 1000,
    'database-design': 2000,
    'admin-dashboard': 2500,
    'real-time-features': 3000,
    'third-party-integrations': 1500,
  };

  const featureCost = features.reduce((total, feature) => {
    return total + (featureCosts[feature] || 0);
  }, 0);

  // Timeline multiplier
  const timelineMultipliers = {
    'rush-1-week': 2.0,
    'urgent-2-weeks': 1.5,
    'standard-1-month': 1.0,
    'relaxed-2-months': 0.9,
    'flexible-3-months': 0.8,
  };

  timelineMultiplier = timelineMultipliers[timeline] || 1.0;

  // Additional requirements complexity
  if (additional_requirements && additional_requirements.length > 100) {
    complexityMultiplier = 1.2;
  }

  const totalCost = (baseCost + featureCost) * timelineMultiplier * complexityMultiplier;

  // Calculate timeline in weeks
  const timelineWeeks = {
    'rush-1-week': 1,
    'urgent-2-weeks': 2,
    'standard-1-month': 4,
    'relaxed-2-months': 8,
    'flexible-3-months': 12,
  };

  return {
    baseCost,
    featureCost,
    timelineMultiplier,
    complexityMultiplier,
    totalCost: Math.round(totalCost),
    estimatedWeeks: timelineWeeks[timeline] || 4,
    breakdown: {
      projectType: baseCost,
      features: featureCost,
      timelineAdjustment: Math.round((baseCost + featureCost) * (timelineMultiplier - 1)),
      complexityAdjustment: Math.round((baseCost + featureCost) * timelineMultiplier * (complexityMultiplier - 1)),
    },
  };
};

/**
 * @swagger
 * /api/estimate:
 *   post:
 *     summary: Calculate project cost estimate
 *     tags: [Estimate]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - project_type
 *               - features
 *               - timeline
 *               - budget_range
 *             properties:
 *               project_type:
 *                 type: string
 *                 enum: [landing-page, business-website, e-commerce, web-app, mobile-app, custom-solution]
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               timeline:
 *                 type: string
 *                 enum: [rush-1-week, urgent-2-weeks, standard-1-month, relaxed-2-months, flexible-3-months]
 *               budget_range:
 *                 type: string
 *                 enum: [under-5k, 5k-10k, 10k-25k, 25k-50k, 50k-plus]
 *               additional_requirements:
 *                 type: string
 *               contact_info:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   company:
 *                     type: string
 *     responses:
 *       200:
 *         description: Cost estimate calculated successfully
 *       400:
 *         description: Validation error
 */
router.post('/', validate(schemas.estimate), async (req, res, next) => {
  try {
    const projectData = req.body;
    const estimate = calculateProjectCost(projectData);

    // If contact info provided, send detailed quote via email
    if (projectData.contact_info && projectData.contact_info.email) {
      const { name, email, company } = projectData.contact_info;

      try {
        await sendEmail({
          to: email,
          subject: 'Your Project Cost Estimate - Pixeloria',
          html: `
            <h2>Project Cost Estimate</h2>
            <p>Hi ${name},</p>
            <p>Thank you for your interest in working with Pixeloria. Here's your detailed project estimate:</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Project Details</h3>
              <p><strong>Project Type:</strong> ${projectData.project_type.replace('-', ' ').toUpperCase()}</p>
              <p><strong>Timeline:</strong> ${projectData.timeline.replace('-', ' ').toUpperCase()}</p>
              <p><strong>Features:</strong> ${projectData.features.join(', ')}</p>
              ${projectData.additional_requirements ? `<p><strong>Additional Requirements:</strong> ${projectData.additional_requirements}</p>` : ''}
            </div>

            <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Cost Breakdown</h3>
              <p><strong>Base Project Cost:</strong> $${estimate.breakdown.projectType.toLocaleString()}</p>
              <p><strong>Features Cost:</strong> $${estimate.breakdown.features.toLocaleString()}</p>
              ${estimate.breakdown.timelineAdjustment !== 0 ? `<p><strong>Timeline Adjustment:</strong> $${estimate.breakdown.timelineAdjustment.toLocaleString()}</p>` : ''}
              ${estimate.breakdown.complexityAdjustment !== 0 ? `<p><strong>Complexity Adjustment:</strong> $${estimate.breakdown.complexityAdjustment.toLocaleString()}</p>` : ''}
              <hr style="margin: 15px 0;">
              <p style="font-size: 18px; font-weight: bold;"><strong>Total Estimated Cost: $${estimate.totalCost.toLocaleString()}</strong></p>
              <p><strong>Estimated Timeline:</strong> ${estimate.estimatedWeeks} weeks</p>
            </div>

            <p>This estimate is based on the information provided and may vary depending on specific requirements and project scope.</p>
            <p>We'd love to discuss your project in more detail. Please reply to this email or contact us to schedule a consultation.</p>
            
            <p>Best regards,<br>The Pixeloria Team</p>
          `,
        });

        // Send notification to admin
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: `New Project Estimate Request from ${name}`,
          html: `
            <h2>New Project Estimate Request</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
            <p><strong>Estimated Cost:</strong> $${estimate.totalCost.toLocaleString()}</p>
            <p><strong>Project Type:</strong> ${projectData.project_type}</p>
            <p><strong>Timeline:</strong> ${projectData.timeline}</p>
            <p><strong>Features:</strong> ${projectData.features.join(', ')}</p>
            ${projectData.additional_requirements ? `<p><strong>Additional Requirements:</strong> ${projectData.additional_requirements}</p>` : ''}
          `,
        });
      } catch (emailError) {
        logger.error('Estimate email failed:', emailError);
      }
    }

    res.json({
      success: true,
      message: 'Cost estimate calculated successfully',
      data: {
        estimate,
        projectData: {
          project_type: projectData.project_type,
          features: projectData.features,
          timeline: projectData.timeline,
          budget_range: projectData.budget_range,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/estimate/features:
 *   get:
 *     summary: Get available features and their costs
 *     tags: [Estimate]
 *     responses:
 *       200:
 *         description: Available features retrieved successfully
 */
router.get('/features', async (req, res, next) => {
  try {
    const features = [
      { id: 'responsive-design', name: 'Responsive Design', cost: 500, description: 'Mobile-friendly design that works on all devices' },
      { id: 'cms-integration', name: 'CMS Integration', cost: 1500, description: 'Content management system for easy updates' },
      { id: 'payment-gateway', name: 'Payment Gateway', cost: 2000, description: 'Secure online payment processing' },
      { id: 'user-authentication', name: 'User Authentication', cost: 1000, description: 'User login and registration system' },
      { id: 'api-integration', name: 'API Integration', cost: 1500, description: 'Third-party service integrations' },
      { id: 'seo-optimization', name: 'SEO Optimization', cost: 800, description: 'Search engine optimization setup' },
      { id: 'analytics-setup', name: 'Analytics Setup', cost: 500, description: 'Google Analytics and tracking setup' },
      { id: 'social-media-integration', name: 'Social Media Integration', cost: 300, description: 'Social media sharing and feeds' },
      { id: 'multi-language', name: 'Multi-language Support', cost: 1200, description: 'Multiple language versions' },
      { id: 'advanced-animations', name: 'Advanced Animations', cost: 1000, description: 'Custom animations and interactions' },
      { id: 'database-design', name: 'Database Design', cost: 2000, description: 'Custom database architecture' },
      { id: 'admin-dashboard', name: 'Admin Dashboard', cost: 2500, description: 'Administrative control panel' },
      { id: 'real-time-features', name: 'Real-time Features', cost: 3000, description: 'Live chat, notifications, etc.' },
      { id: 'third-party-integrations', name: 'Third-party Integrations', cost: 1500, description: 'External service connections' },
      ];

      projectTypes = [
      { id: 'landing-page', name: 'Landing Page', baseCost: 2000, description: 'Single page website for marketing' },
      { id: 'business-website', name: 'Business Website', baseCost: 5000, description: 'Multi-page corporate website' },
      { id: 'e-commerce', name: 'E-commerce Store', baseCost: 10000, description: 'Online store with shopping cart' },
      { id: 'web-app', name: 'Web Application', baseCost: 15000, description: 'Interactive web application' },
      { id: 'mobile-app', name: 'Mobile App', baseCost: 20000, description: 'Native or hybrid mobile application' },
      { id: 'custom-solution', name: 'Custom Solution', baseCost: 25000, description: 'Fully custom development project' },
      ];

      timelines = [
      { id: 'rush-1-week', name: '1 Week (Rush)', multiplier: 2.0, description: 'Expedited delivery' },
      { id: 'urgent-2-weeks', name: '2 Weeks (Urgent)', multiplier: 1.5, description: 'Fast delivery' },
      { id: 'standard-1-month', name: '1 Month (Standard)', multiplier: 1.0, description: 'Standard timeline' },
      { id: 'relaxed-2-months', name: '2 Months (Relaxed)', multiplier: 0.9, description: 'Extended timeline' },
      { id: 'flexible-3-months', name: '3+ Months (Flexible)', multiplier: 0.8, description: 'Flexible timeline' },
      ];
    }

    res.json({
      success: true,
      data: {
        features,
        projectTypes,
        timelines,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;