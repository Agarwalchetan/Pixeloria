import dotenv from 'dotenv';
import { sendEmail } from './src/utils/email.js';

dotenv.config();

// Test the exact same email format as calculator submission
async function testCalculatorEmail() {
  try {
    console.log('Testing calculator submission email format...');
    
    const mockSubmission = {
      contactInfo: {
        name: 'Test User',
        email: 'chetanagarwal1302@gmail.com',
        company: 'Test Company'
      },
      estimate: {
        totalCost: 5000,
        timeline: '4-6 weeks',
        breakdown: [
          { label: 'Base Project', cost: 3000 },
          { label: 'Features', cost: 2000 }
        ]
      },
      projectType: 'Business Website',
      pages: 5,
      features: ['Contact Form', 'SEO'],
      designComplexity: 'Semi-Custom',
      timeline: 'Standard'
    };

    const emailOptions = {
      to: mockSubmission.contactInfo.email,
      subject: 'Your Detailed Project Quote - Pixeloria',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Your Project Quote</h2>
          <p>Hi ${mockSubmission.contactInfo.name},</p>
          <p>Thank you for using our project calculator!</p>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; font-size: 24px;">Total Project Cost</h3>
            <div style="font-size: 48px; font-weight: bold; margin: 10px 0;">$${mockSubmission.estimate.totalCost.toLocaleString()}</div>
            <p style="margin: 0; opacity: 0.9;">Estimated Timeline: ${mockSubmission.estimate.timeline}</p>
          </div>

          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Project Summary</h3>
            <p><strong>Project Type:</strong> ${mockSubmission.projectType}</p>
            <p><strong>Pages:</strong> ${mockSubmission.pages}</p>
            <p><strong>Features:</strong> ${mockSubmission.features.join(', ')}</p>
          </div>
        </div>
      `
    };

    const result = await sendEmail(emailOptions);
    console.log('✅ Calculator email format test successful:', result.messageId);

  } catch (error) {
    console.error('❌ Calculator email format test failed:', error.message);
    console.error('Full error:', error);
  }
}

testCalculatorEmail();
