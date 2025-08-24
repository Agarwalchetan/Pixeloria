const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('Testing email with credentials:');
console.log('HOST:', process.env.EMAIL_HOST);
console.log('USER:', process.env.EMAIL_USER);
console.log('PASSWORD:', process.env.EMAIL_PASSWORD ? 'SET' : 'NOT SET');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'chetanagarwal1302@gmail.com',
    pass: 'doav cyar zpbn teso'
  }
});

transporter.sendMail({
  from: 'chetanagarwal1302@gmail.com',
  to: 'chetanagarwal1302@gmail.com',
  subject: 'Test Email',
  text: 'This is a test email'
}).then(info => {
  console.log('SUCCESS:', info.messageId);
}).catch(error => {
  console.log('ERROR:', error.message);
  console.log('CODE:', error.code);
});
