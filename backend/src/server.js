import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Validate MongoDB URI presence
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!mongoUri) {
  console.error('❌ MongoDB URI not defined in .env file. Please set MONGODB_URI or MONGO_URI.');
  console.log('Available environment variables:', Object.keys(process.env).filter(key => key.includes('MONGO')));
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

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
        url: `http://localhost:${PORT}`,
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

// 404 Not Found handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use(errorHandler);

// Bootstrapping the server
async function startServer() {
  try {
    await connectDB();
    await initializeDatabase();

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
      logger.info(`📘 API docs available at /api-docs`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
