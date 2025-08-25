# Deployment Guide: Vercel + Railway

This guide walks you through deploying your Pixeloria application with frontend on Vercel and backend on Railway.

## 🚀 Quick Overview

- **Frontend**: Vercel (React/Vite app)
- **Backend**: Railway (Node.js/Express API)
- **Database**: MongoDB Atlas (already configured)

## 📋 Prerequisites

1. GitHub account with your code pushed
2. Vercel account (free tier available)
3. Railway account (free tier available)
4. MongoDB Atlas database (already set up)

## 🔧 Step 1: Deploy Backend to Railway

### 1.1 Create Railway Project
1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your Pixeloria repository
4. Choose the `backend` folder as the root directory

### 1.2 Configure Environment Variables
In Railway dashboard, go to Variables tab and add:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://agarwalchetan1302:TARqFk31oonyjn2v@cluster0.owtsdga.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_here_pixeloria_2025
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=chetanagarwal1302@gmail.com
EMAIL_PASSWORD=doavcyarzpbnteso
EMAIL_FROM=chetanagarwal1302@gmail.com
UPLOAD_PATH=uploads
MAX_FILE_SIZE=5242880
ADMIN_EMAIL=chetanagarwal1302@gmail.com
ADMIN_PASSWORD=admin123
FRONTEND_URL=https://your-vercel-domain.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 1.3 Deploy
1. Railway will automatically detect your Node.js app
2. It will use the `railway.json` configuration we created
3. Deployment should complete in 2-3 minutes
4. Note your Railway domain (e.g., `https://your-app.railway.app`)

## 🌐 Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Project
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project" → Import from GitHub
3. Select your Pixeloria repository
4. Vercel will auto-detect it's a Vite app

### 2.2 Configure Build Settings
- **Framework Preset**: Vite
- **Root Directory**: `.` (root of repo)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 2.3 Configure Environment Variables
In Vercel dashboard, go to Settings → Environment Variables:

```env
VITE_API_URL=https://your-railway-domain.railway.app
VITE_ENVIRONMENT=production
```

### 2.4 Deploy
1. Click "Deploy"
2. Vercel will build and deploy your app
3. Note your Vercel domain (e.g., `https://your-app.vercel.app`)

## 🔄 Step 3: Update Cross-Origin Configuration

### 3.1 Update Backend CORS
Update your Railway environment variables:
```env
FRONTEND_URL=https://your-vercel-domain.vercel.app
```

### 3.2 Redeploy Backend
Railway will automatically redeploy when you update environment variables.

## ✅ Step 4: Test Your Deployment

1. Visit your Vercel domain
2. Test the chat functionality
3. Check admin dashboard
4. Verify contact form submission
5. Monitor Railway logs for any errors

## 🔧 Troubleshooting

### Common Issues:

**CORS Errors:**
- Ensure `FRONTEND_URL` in Railway matches your Vercel domain exactly
- Check that both domains use HTTPS in production

**API Connection Issues:**
- Verify `VITE_API_URL` in Vercel points to your Railway domain
- Check Railway logs for backend errors

**Database Connection:**
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Verify `MONGODB_URI` is correct in Railway

### Useful Commands:

```bash
# Test local build before deployment
npm run build
npm run preview

# Check Railway logs
railway logs

# Test API endpoints
curl https://your-railway-domain.railway.app/health
```

## 📊 Monitoring

- **Vercel**: Analytics tab shows deployment and performance metrics
- **Railway**: Metrics tab shows resource usage and logs
- **MongoDB Atlas**: Monitor database performance and connections

## 🔄 Continuous Deployment

Both platforms support automatic deployments:
- **Vercel**: Deploys on every push to main branch
- **Railway**: Deploys on every push to connected branch

## 🔐 Security Checklist

- [ ] All sensitive data in environment variables
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] HTTPS enforced on both domains
- [ ] MongoDB Atlas network access configured
- [ ] Admin credentials secured

## 💰 Cost Estimation

**Free Tier Limits:**
- **Vercel**: 100GB bandwidth, 6,000 build minutes/month
- **Railway**: $5 credit/month, 500 hours runtime
- **MongoDB Atlas**: 512MB storage, shared clusters

Both services offer generous free tiers perfect for development and small production apps.
