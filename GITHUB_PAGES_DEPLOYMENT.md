# GitHub Pages Deployment Guide - rice-export.github.io

Complete deployment guide for the Oriza Rice Marketplace Platform to GitHub Pages.

---

## 📋 Deployment Strategy

Your **rice-export.github.io** is a **User Pages Repository** (not a Project repository).

### Architecture:
- **Frontend**: Deploys to GitHub Pages (rice-export.github.io) ✅
- **Backend API**: Deploys separately to cloud service (Heroku, Render, Railway, Vercel) ⚙️
- **Database**: MongoDB Atlas (cloud) 🗄️

---

## Phase 1: Frontend Deployment to GitHub Pages

### Step 1: Push Code to GitHub

```powershell
cd C:\Users\GuruTeja\Desktop\kishore
git add .
git commit -m "feat: Complete Oriza Platform with all controllers and frontend wiring"
git push origin main
```

### Step 2: Configure GitHub Pages

1. Go to **github.com/rice-export/rice-export.github.io**
2. Click **Settings** → **Pages**
3. Configure:
   - **Source**: Deploy from a branch
   - **Branch**: `main`
   - **Folder**: `/ (root)`
4. Click **Save**

### Step 3: Wait for Deployment

GitHub Actions will automatically:
- Run the workflow in `.github/workflows/deploy.yml`
- Build and optimize frontend files
- Deploy to **https://rice-export.github.io** ✅

**Status Check:**
- Go to **Actions** tab in your repository
- Look for the latest workflow run
- When green checkmark appears ✅ - site is live!

### Step 4: Verify Live Site

Visit: **https://rice-export.github.io**

---

## Phase 2: Backend Deployment (CRITICAL)

**Important**: GitHub Pages only serves static files. Your backend API must deploy separately.

### Option A: Deploy to Render.com (Recommended - Free Tier)

#### 1. Create Render Account
```
1. Go to render.com
2. Sign up with GitHub account (easier!)
3. Verify email
```

#### 2. Deploy Backend

```
1. In Render Dashboard: Click "New +" → "Web Service"
2. Connect GitHub repository: rice-export/rice-export.github.io
3. Configure:
   - Name: "oriza-backend" or "rice-api"
   - Environment: "Node"
   - Build Command: cd backend && npm install
   - Start Command: node backend/server.js
   - Add Environment Variables (see below)
4. Select "Free" plan
5. Click "Deploy Web Service"
```

#### 3. Environment Variables

In Render Dashboard, add these:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/oriza
JWT_SECRET=your-super-secret-key-change-this
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://rice-export.github.io
```

#### 4. MongoDB Atlas Setup

```
1. Go to mongodb.com/cloud/atlas
2. Create free account
3. Create new cluster (free tier)
4. Get connection string
5. Replace in MONGODB_URI above
```

#### 5. Update Frontend API URL

In `frontend/src/utils/api.js`, change:
```javascript
const BASE_URL = process.env.API_BASE_URL || 'https://your-render-service.onrender.com/api';
```

Replace `your-render-service.onrender.com` with your Render service URL.

### Option B: Deploy to Railway.app

```
1. Go to railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select rice-export.github.io repo
5. Add service: select "Node"
6. Add environment variables
7. Deploy!
```

### Option C: Deploy to Heroku (Paid, but most reliable)

```
1. Go to heroku.com
2. Sign up
3. Create new app
4. Connect GitHub repo
5. Enable automatic deploys from main branch
6. Add buildpacks: Node.js
7. Add Config Vars (environment variables)
8. Deploy!
```

---

## Phase 3: Connect Frontend to Live Backend

### Step 1: Update API Client

Edit: `frontend/src/utils/api.js`

```javascript
// Change from localhost to production URL
const BASE_URL = process.env.API_BASE_URL || 'https://your-backend-service.onrender.com/api';

// Or use environment variable:
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-service.onrender.com/api'
  : 'http://localhost:5000/api';
```

### Step 2: Update CORS in Backend

Edit: `backend/server.js`

```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? 'https://rice-export.github.io'
    : 'http://localhost:8000',
  credentials: true,
  optionsSuccessStatus: 200
};
```

### Step 3: Push Changes

```powershell
git add .
git commit -m "chore: Update API URLs for production deployment"
git push origin main
```

Both sites will redeploy automatically!

---

## 🧪 Post-Deployment Verification

### Frontend (https://rice-export.github.io)

- [ ] Homepage loads
- [ ] Navigation works
- [ ] Product catalog displays
- [ ] No JavaScript errors (F12 → Console)

### Backend (https://your-backend-service.onrender.com)

- [ ] API responds to health check:
  ```
  https://your-backend-service.onrender.com/api/products
  ```
- [ ] Authentication works
- [ ] Database connected

### End-to-End Test

1. Open https://rice-export.github.io
2. Login (or register)
3. Browse products
4. Add to cart
5. Proceed to checkout
6. Check browser console for errors

---

## 📊 Deployment Checklist

### GitHub Pages (Frontend)
- [ ] Repository: rice-export/rice-export.github.io
- [ ] Branch: main
- [ ] Pages source: / (root)
- [ ] Custom domain: rice-export.github.io
- [ ] Site building status: ✅ (green)

### Backend Service (Choose One)
- [ ] Render, Railway, or Heroku account created
- [ ] Backend service deployed
- [ ] Environment variables set
- [ ] MongoDB connected
- [ ] Health check working

### Configuration
- [ ] API_BASE_URL updated in frontend
- [ ] CORS_ORIGIN updated in backend
- [ ] JWT_SECRET configured
- [ ] Database connection verified

### Testing
- [ ] Frontend loads
- [ ] API responds
- [ ] Authentication works
- [ ] Full order flow tested

---

## 🔑 Production Secrets Management

**NEVER commit these to GitHub:**
```
.env
.env.local
.env.production.local
JWT_SECRET
MONGODB_URI
API_KEYS
```

**Use these services for secrets:**
- ✅ Render: Environment Variables tab
- ✅ Railway: Variables section
- ✅ Heroku: Config Vars
- ✅ GitHub: Secrets & Variables (for Actions)

---

## 🚀 Quick Start Commands

```powershell
# Test locally before deploying
cd backend
npm install
npm run dev

# In another terminal:
cd frontend
npm install
npm start

# When ready to deploy:
cd C:\Users\GuruTeja\Desktop\kishore
git add .
git commit -m "Deployment ready"
git push origin main
```

---

## 📱 Monitoring & Logs

### GitHub Pages
- **Dashboard**: github.com/rice-export/rice-export.github.io/settings/pages
- **Actions**: github.com/rice-export/rice-export.github.io/actions
- **Status**: Automatic deployment status shown on repo main page

### Render/Railway/Heroku
- Check service dashboard for logs
- Look for deployment errors
- Monitor uptime and performance

---

## ⚠️ Common Issues & Solutions

### "API returning 404"
- Check backend service URL is correct
- Verify CORS_ORIGIN in backend matches frontend URL
- Restart backend service

### "MongoDB connection failed"
- Verify connection string in MONGODB_URI
- Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for development)
- Ensure MongoDB cluster is running

### "Authentication not working"
- Check JWT_SECRET is same on backend and frontend
- Verify token is being stored in localStorage
- Check API response headers for Set-Cookie

### "Deployment hangs"
- Check build logs in Actions tab
- Verify all dependencies in package.json
- Ensure Node version 18+ is specified

---

## 📞 Support Resources

- GitHub Pages Docs: https://docs.github.com/pages
- Render Docs: https://render.com/docs
- Railway Docs: https://docs.railway.app
- MongoDB Atlas: https://docs.atlas.mongodb.com

---

## 🎯 Next Steps After Deployment

1. **Custom Domain** (Optional)
   - Purchase domain: namecheap.com, godaddy.com
   - Point DNS to GitHub Pages
   - Update CNAME in repository

2. **SSL/TLS Certificate**
   - Automatic via GitHub Pages ✅
   - Automatic via Render/Railway ✅

3. **Performance Optimization**
   - Enable CDN caching
   - Optimize images
   - Minify CSS/JS

4. **Monitoring & Alerts**
   - Set up error tracking (Sentry)
   - Monitor API performance (New Relic)
   - Setup uptime monitoring (UptimeRobot)

---

**Your site will be live at: https://rice-export.github.io** 🎉

Questions? Check the GitHub Actions logs for deployment errors!
