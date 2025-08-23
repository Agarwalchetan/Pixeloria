import dotenv from 'dotenv';
import { createTransport } from 'nodemailer';

dotenv.config();

console.log('=== EMAIL DEBUG ===');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'SET' : 'NOT SET');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM);

async function testEmailConnection() {
  try {
    const transporter = createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    console.log('\n=== TESTING CONNECTION ===');
    await transporter.verify();
    console.log('✅ Email connection successful');

    console.log('\n=== SENDING TEST EMAIL ===');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER,
      subject: 'Test Email - Pixeloria',
      text: 'This is a test email to verify configuration.',
      html: '<h2>Test Email</h2><p>This is a test email to verify configuration.</p>'
    });

    console.log('✅ Email sent successfully:', info.messageId);
    console.log('Response:', info.response);

  } catch (error) {
    console.error('❌ Email error:', error.message);
    console.error('Full error:', error);
  }
}

testEmailConnection();
