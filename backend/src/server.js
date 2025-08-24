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
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Utils & Middleware
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { connectDB } from './database/connection.js';
import { initializeDatabase } from './database/migrate.js';

// Routes
import authRoutes from './routes/auth.js';
import portfolioRoutes from './routes/portfolio.js';
import blogRoutes from './routes/blog.js';
import contactRoutes from './routes/contact.js';
import servicesRoutes from './routes/services.js';
import labsRoutes from './routes/labs.js';
import estimateRoutes from './routes/estimate.js';
import adminRoutes from './routes/admin.js';
import chatRoutes from './routes/chat.js';

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment variables already loaded at top
console.log('🔍 Debug: Email config loaded:', {
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? 'SET' : 'NOT SET',
  EMAIL_FROM: process.env.EMAIL_FROM
});

// Validate MongoDB URI presence
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!mongoUri) {
  console.error('❌ MongoDB URI not defined in .env file. Please set MONGODB_URI or MONGO_URI.');
  console.log('Available environment variables:', Object.keys(process.env).filter(key => key.includes('MONGO')));
  process.exit(1);
}

const app = express();
const BASE_PORT = process.env.PORT || 5000;

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
        url: `http://localhost:${BASE_PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Ensure this matches the route files path
};

const specs = swaggerJsdoc(swaggerOptions);

// Rate limiter
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
}));
app.use(morgan('combined', {
  stream: { write: message => logger.info(message.trim()) },
}));
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
    environment: process.env.NODE_ENV || 'development',
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
app.use('/api/chat', chatRoutes);

// 404 Not Found handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use(errorHandler);

// Function to find available port
function findAvailablePort(startPort, maxAttempts = 10) {
  return new Promise((resolve, reject) => {
    let currentPort = startPort;
    let attempts = 0;

    function tryPort() {
      if (attempts >= maxAttempts) {
        reject(new Error(`No available port found after ${maxAttempts} attempts starting from ${startPort}`));
        return;
      }

      const testServer = app.listen(currentPort)
        .on('listening', () => {
          testServer.close(() => {
            resolve(currentPort);
          });
        })
        .on('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            logger.warn(`⚠️ Port ${currentPort} is occupied, trying port ${currentPort + 1}`);
            currentPort++;
            attempts++;
            tryPort();
          } else {
            reject(err);
          }
        });
    }

    tryPort();
  });
}

// Bootstrapping the server
async function startServer() {
  try {
    await connectDB();
    await initializeDatabase();

    // Find available port starting from BASE_PORT
    const availablePort = await findAvailablePort(BASE_PORT);
    
    if (availablePort !== BASE_PORT) {
      logger.info(`🔄 Port ${BASE_PORT} was occupied, shifted to port ${availablePort}`);
    }

    const server = app.listen(availablePort, () => {
      logger.info(`🚀 Server running on http://localhost:${availablePort}`);
      logger.info(`📘 API docs available at /api-docs`);
      
      // Write the actual port to a file for frontend to read
      fs.writeFileSync(path.join(__dirname, '../../port.json'), JSON.stringify({ port: availablePort }));
    });

    server.on('error', (error) => {
      logger.error('❌ Server error:', error);
      process.exit(1);
    });

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
