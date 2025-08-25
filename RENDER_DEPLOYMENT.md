# Render Deployment Guide

Complete deployment guide for Pixeloria on Render with both frontend and backend services.

## 🚀 Render Deployment Strategy

**Two Web Services Approach:**
- **Backend Service**: Node.js API server
- **Frontend Service**: Static site (built React app)

## 📋 Pre-Deployment Checklist

✅ `render.yaml` configuration created
✅ CORS updated for Render domains
✅ API configuration updated
✅ Package.json scripts added
✅ Environment variables configured

## 🔧 Step 1: Create Backend Service

### 1.1 Create New Web Service
1. Go to [render.com](https://render.com) and sign in
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure service:
   - **Name**: `pixeloria-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)

### 1.2 Build & Start Commands
```bash
# Build Command
cd backend && npm install

# Start Command  
cd backend && npm start
```

### 1.3 Environment Variables
Add these in Render dashboard:

```env
NODE_ENV=production
PORT=10000
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
FRONTEND_URL=https://pixeloria-frontend.onrender.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 1.4 Advanced Settings
- **Health Check Path**: `/health`
- **Auto-Deploy**: Yes

## 🌐 Step 2: Create Frontend Service

### 2.1 Create New Static Site
1. Click **"New"** → **"Static Site"**
2. Connect same GitHub repository
3. Configure service:
   - **Name**: `pixeloria-frontend`
   - **Branch**: `main`

### 2.2 Build Settings
```bash
# Build Command
npm install && npm run build

# Publish Directory
dist
```

### 2.3 Environment Variables
```env
VITE_API_URL=https://pixeloria-backend.onrender.com
VITE_ENVIRONMENT=production
```

### 2.4 Redirects & Rewrites
Add this to handle React Router:
```
/*    /index.html   200
```

## 🔄 Step 3: Update Cross-References

After both services are deployed:

1. **Update Backend FRONTEND_URL**:
   - Go to backend service settings
   - Update `FRONTEND_URL` to your actual frontend URL
   - Example: `https://pixeloria-frontend.onrender.com`

2. **Update Frontend VITE_API_URL**:
   - Go to frontend service settings  
   - Update `VITE_API_URL` to your actual backend URL
   - Example: `https://pixeloria-backend.onrender.com`

## ✅ Step 4: Test Deployment

### 4.1 Backend Health Check
Visit: `https://your-backend-url.onrender.com/health`

Should return:
```json
{
  "status": "OK",
  "timestamp": "2025-08-25T13:18:52.867Z",
  "uptime": 108.134405505,
  "environment": "production",
  "database": "connected"
}
```

### 4.2 Frontend Test
Visit: `https://your-frontend-url.onrender.com`

Test:
- ✅ Site loads properly
- ✅ Chat widget connects
- ✅ Admin dashboard accessible
- ✅ Contact form submits

## 🔧 Troubleshooting

### Common Issues:

**Build Failures:**
- Check build logs in Render dashboard
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

**CORS Errors:**
- Verify FRONTEND_URL matches exact frontend domain
- Check CORS configuration in server.js

**Database Connection:**
- Ensure MongoDB Atlas allows connections from 0.0.0.0/0
- Verify MONGODB_URI is correct

**Environment Variables:**
- Double-check all required env vars are set
- Restart services after updating env vars

### Render-Specific Notes:

- **Free Tier**: Services sleep after 15 minutes of inactivity
- **Cold Starts**: First request after sleep may be slow
- **Build Time**: Usually 2-5 minutes per service
- **Auto-Deploy**: Enabled by default on main branch

## 💰 Cost Estimation

**Render Free Tier:**
- 750 hours/month per service
- Automatic SSL certificates
- Custom domains supported
- Services sleep when inactive

Perfect for development and small production apps.

## 🔐 Security Checklist

- [ ] All sensitive data in environment variables
- [ ] CORS properly configured for production domains
- [ ] Rate limiting enabled
- [ ] HTTPS enforced (automatic on Render)
- [ ] MongoDB Atlas network access configured
- [ ] Admin credentials secured

## 🚀 Go Live!

Once both services show "Live" status in Render dashboard, your application is ready for production use!
