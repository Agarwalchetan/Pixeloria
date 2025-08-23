import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

console.log('=== ENV FILE DEBUG ===');
console.log('Current working directory:', process.cwd());

// Check if .env file exists
const envPath = '.env';
console.log('Checking .env file at:', path.resolve(envPath));
console.log('.env file exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('.env file content preview:');
  console.log(envContent.split('\n').slice(0, 20).join('\n'));
}

// Load dotenv
console.log('\n=== LOADING DOTENV ===');
const result = dotenv.config();
console.log('dotenv.config() result:', result);

console.log('\n=== ENVIRONMENT VARIABLES ===');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'SET' : 'NOT SET');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM);

// Test email configuration check
const isEmailConfigured = () => {
  return process.env.EMAIL_HOST && 
         process.env.EMAIL_USER && 
         process.env.EMAIL_PASSWORD &&
         process.env.EMAIL_USER !== 'your_email@gmail.com' &&
         process.env.EMAIL_PASSWORD !== 'your_app_password';
};

console.log('\n=== EMAIL CONFIG CHECK ===');
console.log('isEmailConfigured():', isEmailConfigured());
