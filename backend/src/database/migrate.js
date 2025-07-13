import bcrypt from 'bcryptjs';
import { connectDB } from './connection.js';
import User from './models/User.js';
import { logger } from '../utils/logger.js';

export const initializeDatabase = async () => {
  try {
    logger.info('Starting database initialization...');

    // Connect to MongoDB
    await connectDB();

    // Create admin user if not exists
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
      
      const adminUser = new User({
        name: 'Admin User',
        email: process.env.ADMIN_EMAIL,
        password_hash: hashedPassword,
        role: 'admin'
      });

      await adminUser.save();
      logger.info('Admin user created successfully');
    } else {
      logger.info('Admin user already exists');
    }

    logger.info('Database initialization completed successfully');
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
};