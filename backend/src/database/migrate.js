import { query } from './connection.js';
import { logger } from '../utils/logger.js';
import bcrypt from 'bcryptjs';

export const initializeDatabase = async () => {
  try {
    logger.info('Starting database migration...');

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'client' CHECK (role IN ('admin', 'client', 'guest')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create portfolio table
    await query(`
      CREATE TABLE IF NOT EXISTS portfolio (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        images TEXT[],
        category VARCHAR(100),
        tags TEXT[],
        tech_stack TEXT[],
        results TEXT[],
        link VARCHAR(500),
        status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create blogs table
    await query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        excerpt TEXT,
        content TEXT NOT NULL,
        image_url VARCHAR(500),
        author VARCHAR(255),
        category VARCHAR(100),
        tags TEXT[],
        read_time INTEGER,
        status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create contacts table
    await query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        phone VARCHAR(50),
        project_type VARCHAR(100),
        budget VARCHAR(100),
        message TEXT NOT NULL,
        file_url VARCHAR(500),
        status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'replied', 'closed')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create services table
    await query(`
      CREATE TABLE IF NOT EXISTS services (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        features TEXT[],
        price_range VARCHAR(100),
        duration VARCHAR(100),
        category VARCHAR(100),
        status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create labs table
    await query(`
      CREATE TABLE IF NOT EXISTS labs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        tags TEXT[],
        demo_url VARCHAR(500),
        source_url VARCHAR(500),
        image_url VARCHAR(500),
        status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create newsletter_subscribers table
    await query(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        subscription_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create testimonials table
    await query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        company VARCHAR(255),
        industry VARCHAR(100),
        image_url VARCHAR(500),
        quote TEXT NOT NULL,
        full_quote TEXT,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        project_type VARCHAR(100),
        results TEXT[],
        status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create admin user if not exists
    const adminExists = await query('SELECT id FROM users WHERE email = $1', [process.env.ADMIN_EMAIL]);
    
    if (adminExists.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
      await query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
        ['Admin User', process.env.ADMIN_EMAIL, hashedPassword, 'admin']
      );
      logger.info('Admin user created successfully');
    }

    logger.info('Database migration completed successfully');
  } catch (error) {
    logger.error('Database migration failed:', error);
    throw error;
  }
};