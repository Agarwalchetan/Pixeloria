# Pixeloria Backend - Vercel Deployment Guide

## Prerequisites
- Vercel CLI installed (`npm i -g vercel`)
- MongoDB Atlas database (already configured)
- Environment variables ready

## Deployment Steps

### 1. Environment Variables Setup
Set these environment variables in your Vercel dashboard:

```bash
# Database
MONGODB_URI=mongodb+srv://agarwalchetan1302:TARqFk31oonyjn2v@cluster0.owtsdga.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_pixeloria_2025
JWT_EXPIRES_IN=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=chetanagarwal1302@gmail.com
EMAIL_PASSWORD=doavcyarzpbnteso
EMAIL_FROM=chetanagarwal1302@gmail.com

# Admin Configuration
ADMIN_EMAIL=chetanagarwal1302@gmail.com
ADMIN_PASSWORD=admin123

# Frontend URL (update with your actual frontend URL)
FRONTEND_URL=https://pixeloria.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
UPLOAD_PATH=uploads
MAX_FILE_SIZE=5242880

# Environment
NODE_ENV=production
```

### 2. Deploy to Vercel
```bash
cd backend
vercel --prod
```

### 3. Update Frontend API URL
After deployment, update your frontend to use the new backend URL:
- Replace `http://localhost:3001` with your Vercel backend URL
- Update CORS settings if needed

## File Structure Changes Made
- Created `api/index.js` - Vercel serverless function entry point
- Created `vercel.json` - Vercel deployment configuration
- Modified server setup for serverless compatibility

## Important Notes
- File uploads will need special handling in serverless environment
- Database connections are optimized for serverless functions
- Static files should be served through Vercel's CDN

## Testing
After deployment, test these endpoints:
- `GET /health` - Health check
- `GET /api-docs` - API documentation
- `POST /api/contact` - Contact form
- `GET /api/portfolio` - Portfolio data

## Troubleshooting
- Check Vercel function logs for errors
- Verify environment variables are set correctly
- Ensure MongoDB Atlas allows connections from all IPs (0.0.0.0/0)
