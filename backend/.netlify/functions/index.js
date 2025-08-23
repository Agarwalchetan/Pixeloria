// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import serverless from 'serverless-http';

// Utils & Middleware
import { logger } from '../../src/utils/logger.js';
import { errorHandler } from '../../src/middleware/errorHandler.js';
import { connectDB } from '../../src/database/connection.js';
import { initializeDatabase } from '../../src/database/migrate.js';

// Routes
import authRoutes from '../../src/routes/auth.js';
import portfolioRoutes from '../../src/routes/portfolio.js';
import blogRoutes from '../../src/routes/blog.js';
import contactRoutes from '../../src/routes/contact.js';
import servicesRoutes from '../../src/routes/services.js';
import labsRoutes from '../../src/routes/labs.js';
import estimateRoutes from '../../src/routes/estimate.js';
import adminRoutes from '../../src/routes/admin.js';

const app = express();

// Validate MongoDB URI presence
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!mongoUri) {
  console.error('❌ MongoDB URI not defined in environment variables.');
}

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pixeloria API',
      version: '1.0.0',
      description: 'Backend API for Pixeloria Web Development Agency',
    },
    servers: [
      {
        url: process.env.URL || 'https://pixeloria-backend.netlify.app',
        description: 'Production server',
      },
    ],
  },
  apis: ['../../src/routes/*.js'],
};

const specs = swaggerJsdoc(swaggerOptions);

// Rate limiter
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'https://pixeloria.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// Static file serving
app.use('/uploads', express.static('uploads'));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'production',
    database: 'connected'
  });
});

// Main API routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/labs', labsRoutes);
app.use('/api/estimate', estimateRoutes);
app.use('/api/admin', adminRoutes);

// 404 Not Found handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use(errorHandler);

// Initialize database connection
let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;
  
  try {
    await connectDB();
    await initializeDatabase();
    isConnected = true;
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

// Initialize database on startup
connectToDatabase();

// Export serverless handler
export const handler = serverless(app);
