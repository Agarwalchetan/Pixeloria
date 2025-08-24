import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from './src/database/models/User.js';

// Load environment variables
dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const adminEmail = process.env.ADMIN_EMAIL || 'chetanagarwal1302@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', adminEmail);
      console.log('Admin role:', existingAdmin.role);
      
      // Update role to admin if it's not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('Updated user role to admin');
      }
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      
      const adminUser = new User({
        name: 'Admin User',
        email: adminEmail,
        password_hash: hashedPassword,
        role: 'admin'
      });

      await adminUser.save();
      console.log('Admin user created successfully!');
      console.log('Email:', adminEmail);
      console.log('Password:', adminPassword);
    }

    console.log('\n✅ Admin setup completed!');
    console.log('You can now login with:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createAdminUser();
