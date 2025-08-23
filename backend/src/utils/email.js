import { createTransport } from 'nodemailer';
import { logger } from './logger.js';

// Check if email configuration is properly set
const isEmailConfigured = () => {
  return process.env.EMAIL_HOST && 
         process.env.EMAIL_USER && 
         process.env.EMAIL_PASSWORD &&
         process.env.EMAIL_USER !== 'your_email@gmail.com' &&
         process.env.EMAIL_PASSWORD !== 'your_app_password';
};

let transporter = null;

// Initialize transporter lazily when first needed
const getTransporter = () => {
  if (transporter === null) {
    if (isEmailConfigured()) {
      try {
        transporter = createTransport({
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT) || 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
        logger.info('Email transporter configured successfully');
      } catch (error) {
        logger.error('Failed to create email transporter:', error);
        transporter = false; // Mark as failed
      }
    } else {
      logger.warn('Email configuration not properly set. Email functionality will be disabled.');
      logger.warn('Current config:', {
        host: process.env.EMAIL_HOST,
        user: process.env.EMAIL_USER,
        hasPassword: !!process.env.EMAIL_PASSWORD
      });
      transporter = false; // Mark as not configured
    }
  }
  return transporter;
};

export const sendEmail = async (options) => {
  const currentTransporter = getTransporter();
  
  if (!currentTransporter) {
    logger.warn('Email not configured. Skipping email send to:', options.to);
    logger.info('Email content that would have been sent:', {
      to: options.to,
      subject: options.subject,
      html: options.html?.substring(0, 200) + '...'
    });
    return { messageId: 'email-not-configured' };
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments
    };

    const info = await currentTransporter.sendMail(mailOptions);
    logger.info('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    logger.error('Email sending failed:', error);
    throw error;
  }
};

export const emailTemplates = {
  contactForm: (data) => ({
    subject: `New Contact Form Submission from ${data.first_name} ${data.last_name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.first_name} ${data.last_name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
      <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
      <p><strong>Project Type:</strong> ${data.project_type || 'Not specified'}</p>
      <p><strong>Budget:</strong> ${data.budget || 'Not specified'}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message}</p>
      ${data.file_url ? `<p><strong>Attachment:</strong> <a href="${data.file_url}">View File</a></p>` : ''}
    `,
  }),

  passwordReset: (resetUrl) => ({
    subject: 'Password Reset Request - Pixeloria',
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your Pixeloria account.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  }),

  welcomeEmail: (name) => ({
    subject: 'Welcome to Pixeloria!',
    html: `
      <h2>Welcome to Pixeloria, ${name}!</h2>
      <p>Thank you for joining our community. We're excited to have you on board!</p>
      <p>Explore our portfolio, read our latest blog posts, and don't hesitate to reach out if you have any questions.</p>
      <p>Best regards,<br>The Pixeloria Team</p>
    `,
  }),
};