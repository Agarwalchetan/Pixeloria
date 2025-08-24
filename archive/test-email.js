import dotenv from 'dotenv';
import { sendEmail } from './src/utils/email.js';

dotenv.config();

async function testEmail() {
  try {
    console.log('Testing email configuration...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
    console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
    
    const result = await sendEmail({
      to: 'chetanagarwal1302@gmail.com',
      subject: 'Test Email - Pixeloria Calculator',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email to verify the email configuration is working.</p>
        <p>If you receive this, the email setup is successful!</p>
      `
    });
    
    console.log('Email sent successfully:', result);
  } catch (error) {
    console.error('Email test failed:', error);
  }
}

testEmail();
