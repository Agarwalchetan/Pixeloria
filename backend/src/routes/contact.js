import express from 'express';
import { query } from '../database/connection.js';
import { validate, schemas } from '../middleware/validation.js';
import { uploadMiddleware } from '../utils/fileUpload.js';
import { sendEmail, emailTemplates } from '../utils/email.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit contact form
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - message
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               company:
 *                 type: string
 *               phone:
 *                 type: string
 *               project_type:
 *                 type: string
 *               budget:
 *                 type: string
 *               message:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Contact form submitted successfully
 *       400:
 *         description: Validation error
 */
router.post('/', 
  uploadMiddleware.single('file'),
  async (req, res, next) => {
    try {
      const {
        first_name,
        last_name,
        email,
        company,
        phone,
        project_type,
        budget,
        message
      } = req.body;

      // Validate required fields
      if (!first_name || !last_name || !email || !message) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: first_name, last_name, email, message',
        });
      }

      // Handle file upload
      let fileUrl = null;
      if (req.file) {
        fileUrl = `/uploads/documents/${req.file.filename}`;
      }

      // Save to database
      const result = await query(
        `INSERT INTO contacts (first_name, last_name, email, company, phone, project_type, budget, message, file_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [first_name, last_name, email, company, phone, project_type, budget, message, fileUrl]
      );

      const contactData = result.rows[0];

      // Send notification email to admin
      try {
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          ...emailTemplates.contactForm(contactData),
        });
      } catch (emailError) {
        logger.error('Contact form notification email failed:', emailError);
      }

      // Send confirmation email to user
      try {
        await sendEmail({
          to: email,
          subject: 'Thank you for contacting Pixeloria',
          html: `
            <h2>Thank you for your inquiry!</h2>
            <p>Hi ${first_name},</p>
            <p>We've received your message and will get back to you within 24 hours.</p>
            <p>Here's a copy of your submission:</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Name:</strong> ${first_name} ${last_name}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
              ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
              ${project_type ? `<p><strong>Project Type:</strong> ${project_type}</p>` : ''}
              ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ''}
              <p><strong>Message:</strong></p>
              <p>${message}</p>
            </div>
            <p>Best regards,<br>The Pixeloria Team</p>
          `,
        });
      } catch (emailError) {
        logger.error('Contact form confirmation email failed:', emailError);
      }

      res.status(201).json({
        success: true,
        message: 'Contact form submitted successfully',
        data: {
          contact: {
            id: contactData.id,
            first_name: contactData.first_name,
            last_name: contactData.last_name,
            email: contactData.email,
            created_at: contactData.created_at,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/contact/newsletter:
 *   post:
 *     summary: Subscribe to newsletter
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Newsletter subscription successful
 *       400:
 *         description: Email already subscribed
 */
router.post('/newsletter', validate(schemas.newsletter), async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if email already exists
    const existingSubscriber = await query(
      'SELECT id FROM newsletter_subscribers WHERE email = $1',
      [email]
    );

    if (existingSubscriber.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already subscribed to newsletter',
      });
    }

    // Add to newsletter
    await query(
      'INSERT INTO newsletter_subscribers (email) VALUES ($1)',
      [email]
    );

    // Send welcome email
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to Pixeloria Newsletter!',
        html: `
          <h2>Welcome to our newsletter!</h2>
          <p>Thank you for subscribing to the Pixeloria newsletter.</p>
          <p>You'll receive updates about our latest projects, web development tips, and industry insights.</p>
          <p>Best regards,<br>The Pixeloria Team</p>
        `,
      });
    } catch (emailError) {
      logger.error('Newsletter welcome email failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Newsletter subscription successful',
    });
  } catch (error) {
    next(error);
  }
});

export default router;