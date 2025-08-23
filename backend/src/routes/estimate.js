import express from 'express';
import { validate, schemas } from '../middleware/validation.js';
import { sendEmail } from '../utils/email.js';
import { logger } from '../utils/logger.js';
import CalculatorSubmission from '../database/models/CalculatorSubmission.js';
import { generatePDF } from '../utils/pdfGenerator.js';

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
router.post('/calculator', async (req, res, next) => {
  try {
    logger.info('Calculator submission received:', {
      hasContactInfo: !!req.body.contactInfo,
      email: req.body.contactInfo?.email,
      projectType: req.body.projectType
    });

    const {
      projectType,
      pages,
      features,
      designComplexity,
      timeline,
      contactInfo,
      estimate
    } = req.body;

    if (!contactInfo || !contactInfo.email) {
      logger.warn('Calculator submission missing contact info');
      return res.status(400).json({
        success: false,
        message: 'Contact information is required'
      });
    }

    // Save submission to database
    const submission = new CalculatorSubmission({
      projectType,
      pages,
      features,
      designComplexity,
      timeline,
      contactInfo,
      estimate,
      status: 'new'
    });

    await submission.save();
    logger.info('Calculator submission saved to database:', submission._id);

    // Generate PDF
    let pdfPath = null;
    try {
      pdfPath = await generatePDF(submission);
    } catch (pdfError) {
      logger.error('PDF generation failed:', pdfError);
    }

    // Send email with PDF attachment
    if (contactInfo && contactInfo.email) {
      try {
        logger.info('Attempting to send calculator email to:', contactInfo.email);
        const emailOptions = {
          to: contactInfo.email,
          subject: 'Your Detailed Project Quote - Pixeloria',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Your Project Quote</h2>
              <p>Hi ${contactInfo.name},</p>
              <p>Thank you for using our project calculator! We've prepared a detailed quote for your project.</p>
              
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0; font-size: 24px;">Total Project Cost</h3>
                <div style="font-size: 48px; font-weight: bold; margin: 10px 0;">${estimate.totalCost.toLocaleString()}</div>
                <p style="margin: 0; opacity: 0.9;">Estimated Timeline: ${estimate.timeline}</p>
              </div>

              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e293b; margin-top: 0;">Project Summary</h3>
                <p><strong>Project Type:</strong> ${projectType}</p>
                <p><strong>Pages:</strong> ${pages}</p>
                <p><strong>Features:</strong> ${features.join(', ')}</p>
                <p><strong>Design Complexity:</strong> ${designComplexity}</p>
                <p><strong>Timeline:</strong> ${timeline}</p>
              </div>

              <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #065f46; margin-top: 0;">Cost Breakdown</h3>
                ${estimate.breakdown.map(item => `
                  <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                    <span>${item.label}:</span>
                    <strong>$${item.cost.toLocaleString()}</strong>
                  </div>
                `).join('')}
              </div>

              <p>This quote is valid for 30 days. We'd love to discuss your project in more detail!</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="mailto:hello@pixeloria.com" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Let's Discuss Your Project</a>
              </div>
              
              <p style="color: #64748b; font-size: 14px;">
                Best regards,<br>
                The Pixeloria Team<br>
                <a href="https://pixeloria.com">pixeloria.com</a>
              </p>
            </div>
          `
        };

        // Add PDF attachment if generated successfully
        if (pdfPath) {
          emailOptions.attachments = [{
            filename: `project-quote-${submission._id}.pdf`,
            path: pdfPath,
            contentType: 'application/pdf'
          }];
        }

        const emailResult = await sendEmail(emailOptions);
        logger.info('User email sent successfully:', emailResult.messageId);

        // Send notification to admin
        const adminEmailResult = await sendEmail({
          to: process.env.ADMIN_EMAIL || 'admin@pixeloria.com',
          subject: `New Calculator Submission from ${contactInfo.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #1e40af;">New Calculator Submission</h2>
              
              <h3>Contact Information:</h3>
              <p><strong>Name:</strong> ${contactInfo.name}</p>
              <p><strong>Email:</strong> ${contactInfo.email}</p>
              <p><strong>Phone:</strong> ${contactInfo.phone}</p>
              <p><strong>Company:</strong> ${contactInfo.company}</p>
              
              <h3>Project Details:</h3>
              <p><strong>Project Type:</strong> ${projectType}</p>
              <p><strong>Budget Range:</strong> ${req.body.budgetRange}</p>
              <p><strong>Timeline:</strong> ${timeline}</p>
              <p><strong>Description:</strong> ${req.body.description}</p>
              
              <h3>Selected Features:</h3>
              <ul>
                ${features.map(feature => `<li>${feature.name} - $${feature.price}</li>`).join('')}
              </ul>
              
              <h3>Total Estimate:</h3>
              <p style="font-size: 24px; font-weight: bold; color: #059669;">$${estimate.totalCost.toLocaleString()}</p>
              
              <p style="color: #64748b; font-size: 14px;">
                This submission was received on ${new Date().toLocaleString()}
              </p>
            </div>
          `,
          attachments: pdfPath ? [{
            filename: `project-quote-${submission._id}.pdf`,
            path: pdfPath,
            contentType: 'application/pdf'
          }] : []
        });
        logger.info('Admin email sent successfully:', adminEmailResult.messageId);

      } catch (emailError) {
        logger.error('Calculator email failed:', emailError);
        logger.error('Email error details:', emailError.stack);
      }
    }

    res.json({
      success: true,
      message: 'Quote generated and sent successfully',
      data: {
        submissionId: submission._id,
        pdfGenerated: !!pdfPath
      }
    });

  } catch (error) {
    logger.error('Calculator submission error:', error);
    next(error);
  }
});

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

    const projectTypes = [
      { id: 'landing-page', name: 'Landing Page', baseCost: 2000, description: 'Single page website for marketing' },
      { id: 'business-website', name: 'Business Website', baseCost: 5000, description: 'Multi-page corporate website' },
      { id: 'e-commerce', name: 'E-commerce Store', baseCost: 10000, description: 'Online store with shopping cart' },
      { id: 'web-app', name: 'Web Application', baseCost: 15000, description: 'Interactive web application' },
      { id: 'mobile-app', name: 'Mobile App', baseCost: 20000, description: 'Native or hybrid mobile application' },
      { id: 'custom-solution', name: 'Custom Solution', baseCost: 25000, description: 'Fully custom development project' },
    ];

    const timelines = [
      { id: 'rush-1-week', name: '1 Week (Rush)', multiplier: 2.0, description: 'Expedited delivery' },
      { id: 'urgent-2-weeks', name: '2 Weeks (Urgent)', multiplier: 1.5, description: 'Fast delivery' },
      { id: 'standard-1-month', name: '1 Month (Standard)', multiplier: 1.0, description: 'Standard timeline' },
      { id: 'relaxed-2-months', name: '2 Months (Relaxed)', multiplier: 0.9, description: 'Extended timeline' },
      { id: 'flexible-3-months', name: '3+ Months (Flexible)', multiplier: 0.8, description: 'Flexible timeline' },
    ];

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