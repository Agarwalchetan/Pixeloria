# Pixeloria Deployment Guide

Complete deployment instructions for the Pixeloria digital solutions platform.

## 🚀 Deployment Overview

Pixeloria consists of two main components:
- **Frontend**: React/TypeScript application (Vite) with real-time chat widget
- **Backend**: Node.js/Express API with MongoDB, real-time chat system, and AI integrations

## 📋 Prerequisites

### System Requirements
- **Node.js**: 18.x or higher
- **MongoDB**: 5.x or higher (Atlas recommended for production)
- **Git**: For version control and deployment
- **Domain**: Custom domain for production (optional)

### Required Accounts
- **MongoDB Atlas**: Database hosting
- **Gmail**: SMTP email services
- **Deployment Platform**: Choose one:
  - Netlify (Frontend) + Railway (Backend)
  - Vercel (Frontend) + Heroku (Backend)
  - DigitalOcean App Platform (Full-stack)

## 🔧 Environment Configuration

### Backend Environment Variables
Create `.env` file in `/backend/`:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pixeloria
MONGODB_URI_LOCAL=mongodb://localhost:27017/pixeloria

# JWT Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRES_IN=24h

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@pixeloria.com

# Admin Account
ADMIN_EMAIL=admin@pixeloria.com
ADMIN_PASSWORD=secure-admin-password

# Frontend URL
FRONTEND_URL=https://pixeloria.netlify.app

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### Frontend Environment Variables
Create `.env` file in root directory:

```env
# API Configuration
VITE_API_URL=https://your-backend-domain.com/api

# Optional: Analytics
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

## 🗄️ Database Setup

### MongoDB Atlas Setup
1. **Create Account**: Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create Cluster**: Choose free tier for development
3. **Configure Network Access**: Add your deployment platform IPs
4. **Create Database User**: With read/write permissions
5. **Get Connection String**: Copy the connection URI

### Local MongoDB (Development)
```bash
# Install MongoDB locally
# macOS
brew install mongodb-community

# Ubuntu
sudo apt-get install mongodb

# Windows
# Download from MongoDB website

# Start MongoDB service
mongod --dbpath /path/to/data/directory
```

## 📧 Email Configuration

### Gmail App Password Setup
1. **Enable 2FA**: On your Gmail account
2. **Generate App Password**: 
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Use App Password**: In `EMAIL_PASSWORD` environment variable

### Alternative Email Providers
```env
# SendGrid
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key

# Mailgun
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=your-mailgun-username
EMAIL_PASSWORD=your-mailgun-password
```

## 🌐 Frontend Deployment

### Option 1: Netlify (Recommended)

#### Automatic Deployment
1. **Connect Repository**: Link your GitHub repo to Netlify
2. **Build Settings**:
   ```
   Build command: npm run build
   Publish directory: dist
   ```
3. **Environment Variables**: Add `VITE_API_URL` in Netlify dashboard
4. **Deploy**: Automatic deployment on git push

#### Manual Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

### Option 2: Vercel

#### Automatic Deployment
1. **Import Project**: Connect GitHub repo to Vercel
2. **Framework Preset**: Vite
3. **Environment Variables**: Add `VITE_API_URL`
4. **Deploy**: Automatic deployment on git push

#### Manual Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Build and deploy
vercel --prod
```

### Option 3: GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts
"homepage": "https://yourusername.github.io/pixeloria",
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

## 🖥️ Backend Deployment

### Option 1: Railway (Recommended)

#### Setup
1. **Create Account**: Sign up at [Railway](https://railway.app)
2. **New Project**: Create from GitHub repo
3. **Environment Variables**: Add all backend env vars
4. **Deploy**: Automatic deployment

#### Configuration
```json
// railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### Option 2: Heroku

#### Setup
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create pixeloria-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
# ... add all other env vars

# Deploy
git push heroku main
```

#### Procfile
```
web: npm start
```

### Option 3: DigitalOcean App Platform

#### App Spec Configuration
```yaml
name: pixeloria-backend
services:
- name: api
  source_dir: /backend
  github:
    repo: yourusername/pixeloria
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGODB_URI
    value: your-mongodb-uri
    type: SECRET
  # ... other environment variables
```

## 🔒 SSL/HTTPS Setup

### Automatic SSL (Recommended)
- **Netlify**: Automatic SSL with Let's Encrypt
- **Vercel**: Automatic SSL included
- **Railway**: Automatic SSL for custom domains
- **Heroku**: Automatic SSL on paid plans

### Custom Domain Setup
1. **Purchase Domain**: From registrar (Namecheap, GoDaddy, etc.)
2. **DNS Configuration**:
   ```
   # Frontend (Netlify/Vercel)
   CNAME www your-app.netlify.app
   A @ 104.198.14.52 (Netlify) or 76.76.19.61 (Vercel)
   
   # Backend (Railway/Heroku)
   CNAME api your-backend.railway.app
   ```
3. **Platform Configuration**: Add custom domain in platform dashboard

## 📊 Monitoring & Analytics

### Application Monitoring
```bash
# Add monitoring packages
npm install --save express-rate-limit helmet morgan winston

# Basic monitoring setup
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');

app.use(helmet());
app.use(morgan('combined'));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
```

### Error Tracking
```bash
# Install Sentry for error tracking
npm install @sentry/node @sentry/integrations

# Configure Sentry
const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'YOUR_SENTRY_DSN' });
```

### Performance Monitoring
- **Frontend**: Web Vitals, Lighthouse CI
- **Backend**: Response times, database queries
- **Infrastructure**: CPU, memory, disk usage

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm install
    - name: Build
      run: npm run build
      env:
        VITE_API_URL: ${{ secrets.VITE_API_URL }}
    - name: Deploy to Netlify
      uses: netlify/actions/cli@master
      with:
        args: deploy --dir=dist --prod
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to Railway
      uses: bervProject/railway-deploy@v1.0.0
      with:
        railway_token: ${{ secrets.RAILWAY_TOKEN }}
        service: pixeloria-backend
```

## 🧪 Testing Before Deployment

### Pre-deployment Checklist
```bash
# Frontend tests
npm run lint
npm run type-check
npm run build
npm run preview

# Backend tests
cd backend
npm run lint
npm test
npm start # Test locally
```

### Smoke Tests
```bash
# Test API endpoints
curl https://your-api-domain.com/api/health
curl https://your-api-domain.com/api/calculator/config

# Test frontend
curl https://your-frontend-domain.com
```

## 🔧 Production Optimizations

### Frontend Optimizations
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          admin: ['./src/admin/index.tsx']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
```

### Backend Optimizations
```javascript
// Production middleware
if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  app.use(helmet());
  app.use(morgan('combined'));
}

// Database connection pooling
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

## 🔄 Backup Strategy

### Database Backups
```bash
# MongoDB Atlas automatic backups (recommended)
# Manual backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/pixeloria"

# Restore backup
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/pixeloria" dump/
```

### File Backups
```bash
# Backup uploads directory
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/

# Sync to cloud storage
aws s3 sync uploads/ s3://pixeloria-backups/uploads/
```

## 🚨 Troubleshooting

### Common Deployment Issues

**Build Failures**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version
npm --version
```

**Environment Variable Issues**
```bash
# Verify environment variables
echo $VITE_API_URL
printenv | grep VITE_

# Test API connectivity
curl -I https://your-api-domain.com/api/health
```

**Database Connection Issues**
```bash
# Test MongoDB connection
mongosh "mongodb+srv://cluster.mongodb.net/pixeloria" --username your-username

# Check network access in MongoDB Atlas
# Verify IP whitelist includes deployment platform IPs
```

**CORS Issues**
```javascript
// Update CORS configuration
app.use(cors({
  origin: [
    'https://pixeloria.netlify.app',
    'https://www.pixeloria.com',
    'http://localhost:5173' // development
  ],
  credentials: true
}));
```

### Performance Issues
```bash
# Monitor application performance
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s https://your-api-domain.com/api/health

# Monitor database performance
# Use MongoDB Atlas performance advisor
# Check slow query logs
```

## 📈 Scaling Considerations

### Horizontal Scaling
- **Load Balancers**: Distribute traffic across multiple instances
- **CDN**: Use CloudFlare or AWS CloudFront for static assets
- **Database Scaling**: MongoDB Atlas auto-scaling
- **Caching**: Redis for session storage and caching

### Vertical Scaling
- **Instance Upgrades**: Increase CPU/memory as needed
- **Database Optimization**: Index optimization, query performance
- **Code Optimization**: Bundle splitting, lazy loading

## 📞 Support & Maintenance

### Monitoring Alerts
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Error Tracking**: Sentry, Rollbar
- **Performance**: New Relic, DataDog
- **Security**: Snyk, OWASP dependency check

### Regular Maintenance
- **Security Updates**: Monthly dependency updates
- **Database Maintenance**: Index optimization, cleanup
- **Performance Review**: Monthly performance audits
- **Backup Verification**: Weekly backup restoration tests

### Emergency Procedures
- **Rollback Plan**: Keep previous deployment ready
- **Database Recovery**: Automated backup restoration
- **Incident Response**: Clear escalation procedures
- **Communication Plan**: Status page updates

---

**🎉 Congratulations! Your Pixeloria platform is now deployed and ready for production use.**

For deployment support:
- **Email**: devops@pixeloria.com
- **Documentation**: Check platform-specific docs
- **Community**: GitHub Discussions
