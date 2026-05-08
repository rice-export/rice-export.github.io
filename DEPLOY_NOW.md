# 🚀 Deploy to rice-export.github.io

Complete step-by-step guide to deploy the Oriza Platform to GitHub Pages.

---

## ✅ Pre-Deployment Checklist

- [x] All backend controllers created (7 files)
- [x] All routes connected to controllers
- [x] All frontend scripts created (7 files)
- [x] API client fully configured
- [x] GitHub repository: rice-export/rice-export.github.io
- [x] Environment configuration ready

---

## 🎯 Deployment in 3 Steps

### Step 1: Push Code to GitHub (2 minutes)

Open PowerShell and run:

```powershell
cd C:\Users\GuruTeja\Desktop\kishore

# Stage all files
git add .

# Create commit with message
git commit -m "🚀 feat: Deploy complete Oriza Platform - all controllers & frontend wiring complete"

# Push to GitHub
git push origin main
```

**Expected Output:**
```
Enumerating objects: ...
Writing objects: ...
✓ main -> main
```

### Step 2: Monitor GitHub Actions (2-3 minutes)

1. Go to: **https://github.com/rice-export/rice-export.github.io**
2. Click: **Actions** tab (top navigation)
3. Watch the workflow run:
   - 🔵 **In progress** (yellow dot)
   - 🟢 **Successful** (green checkmark)
   - 🔴 **Failed** (red X - check logs)

**Timeline:**
- Seconds 0-10: Checkout repository
- Seconds 10-30: Install dependencies
- Seconds 30-60: Build frontend
- Seconds 60-120: Deploy to GitHub Pages
- Seconds 120+: Site goes live ✅

### Step 3: Verify Live Deployment (1 minute)

#### Frontend (Static Site)
Visit: **https://rice-export.github.io**

Should show:
- ✅ Homepage with hero section
- ✅ Navigation menu
- ✅ Product catalog
- ✅ All CSS styling applied
- ✅ No JavaScript errors (check F12 → Console)

#### Backend API (Separate Service)

Currently running locally only. To use live API:

**Option A: Keep API Local (Development)**
- Run `npm run dev` in backend folder
- Frontend will call `http://localhost:5000/api`
- Only works on your computer

**Option B: Deploy Backend to Cloud** ⭐ **RECOMMENDED**
- Follow [Backend Deployment Guide](#backend-deployment) below
- Frontend will call live API
- Anyone can use the platform

---

## ⚙️ Backend Deployment Guide

Your backend API needs separate deployment (GitHub Pages only hosts static files).

### Option 1: Deploy to Render.com (FREE - Recommended)

#### 1.1 Create Render Account
```
Visit: https://render.com
Click: "Sign up"
Connect: GitHub account
Verify: Email
```

#### 1.2 Deploy Backend Service

```
1. Go to Render Dashboard
2. Click: "+ New" → "Web Service"
3. Select: rice-export/rice-export.github.io repository
4. Configure:
   - Name: oriza-backend (or any name)
   - Environment: Node
   - Build Command: cd backend && npm install
   - Start Command: node backend/server.js
   - Plan: Free (to start)
5. Click: "Create Web Service"
6. Wait: 3-5 minutes for deployment
7. Copy: Your service URL (looks like: https://oriza-backend-abc123.onrender.com)
```

#### 1.3 Add Environment Variables

In Render Dashboard → Your Service → Environment:

```
MONGODB_URI = mongodb+srv://your-user:your-pass@cluster.mongodb.net/oriza
JWT_SECRET = your-super-secret-key-change-this
NODE_ENV = production
CORS_ORIGIN = https://rice-export.github.io
PORT = 3000
```

#### 1.4 Get MongoDB Connection String

```
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create new cluster (M0 Free tier)
4. Click: "Connect"
5. Select: "Drivers" → "Node.js"
6. Copy: Connection string
7. Replace: <password> with your MongoDB password
```

### Option 2: Deploy to Railway.app (FREE)

```
1. Visit: https://railway.app
2. Sign up with GitHub
3. New Project → GitHub Repo
4. Select: rice-export/rice-export.github.io
5. Add: Node service
6. Add environment variables
7. Deploy automatically!
```

### Option 3: Deploy to Vercel (FREE)

```
1. Visit: https://vercel.com
2. Import: rice-export/rice-export.github.io
3. Configure: Root Directory = backend
4. Deploy!
```

---

## 🔗 Connect Frontend to Live Backend

Once backend is deployed, update the API URL:

### Edit: `frontend/src/config.js`

Find this line:
```javascript
return 'https://oriza-backend.onrender.com/api';
```

Replace with your actual backend URL:
```javascript
return 'https://your-service-name.onrender.com/api';
```

Then push to GitHub:
```powershell
git add frontend/src/config.js
git commit -m "chore: Update backend API URL for production"
git push origin main
```

GitHub Pages will automatically redeploy! ✅

---

## 🧪 Test Everything

### Test 1: Frontend Loads
```
Visit: https://rice-export.github.io
Expected: Homepage loads, no errors in F12 console
```

### Test 2: Backend API Responds
```
Visit: https://your-backend-url/api/products
Expected: JSON with products list
```

### Test 3: End-to-End Flow
```
1. Go to https://rice-export.github.io
2. Click "Login" → Create account (test@example.com / password123)
3. Browse products
4. Add to cart
5. Checkout
6. Check browser console (F12) for errors
```

---

## 📊 Deployment Architecture

```
┌─────────────────────────────────────────┐
│    rice-export.github.io (Frontend)     │
│    ✅ GitHub Pages - Static Files       │
│    • HTML, CSS, JavaScript              │
│    • Product pages, checkout flow       │
│    • Hosted FREE at GitHub              │
└─────────────────────────────────────────┘
                    ↓ API Calls
        ┌───────────────────────────┐
        │   Backend API (Cloud)     │
        │   ✅ Render/Railway/etc   │
        │   • 7 Controllers         │
        │   • 56+ Endpoints         │
        │   • Node.js + Express     │
        └───────────────────────────┘
                    ↓
        ┌───────────────────────────┐
        │    MongoDB Atlas          │
        │    ✅ Cloud Database      │
        │    • Users, Products      │
        │    • Orders, Cart         │
        │    • FREE (M0 Tier)       │
        └───────────────────────────┘
```

---

## 💰 Cost Analysis (Monthly)

| Service | Tier | Cost | Notes |
|---------|------|------|-------|
| GitHub Pages | Public Repo | FREE | Unlimited static hosting |
| Render Backend | Free | FREE | Goes to sleep after 15 min inactivity |
| Railway Backend | Free | FREE | Limited resources |
| MongoDB Atlas | M0 | FREE | 512MB storage |
| **Total** | | **FREE** | ✅ Zero cost! |

---

## 🔑 Important Configuration Files

After deployment, keep these updated:

### `frontend/src/config.js`
- API base URL for production
- Environment detection
- Logging configuration

### `backend/.env`
- MONGODB_URI
- JWT_SECRET
- CORS_ORIGIN

### `.github/workflows/deploy.yml`
- GitHub Actions workflow
- Automatic deployment trigger
- Build configuration

---

## 📱 Monitor Deployments

### GitHub Pages Status
**URL:** https://github.com/rice-export/rice-export.github.io/settings/pages
- Current deployment status
- Latest deployment time
- Domain configuration

### GitHub Actions Logs
**URL:** https://github.com/rice-export/rice-exchange.github.io/actions
- Build output
- Deployment logs
- Error messages (if any)

### Render Service Logs
**URL:** https://dashboard.render.com
- Backend uptime
- Error logs
- Performance metrics

---

## 🆘 Troubleshooting

### Frontend not loading
```
1. Check: https://github.com/rice-export/rice-export.github.io/actions
2. Look for: Red X on latest workflow
3. Click: Workflow run
4. Check: Build logs for errors
```

### API returns 404
```
1. Verify backend URL in frontend/src/config.js
2. Check backend service is running (Render dashboard)
3. Verify CORS_ORIGIN matches https://rice-export.github.io
```

### Cannot login
```
1. Check backend logs in Render dashboard
2. Verify JWT_SECRET is set
3. Check MongoDB connection in logs
4. Verify user exists in database
```

### Slow performance
```
1. Check if Render backend is sleeping (free tier)
2. Upgrade to paid plan if needed
3. Check MongoDB query performance
4. Check network tab in F12 for slow requests
```

---

## 🎉 Success Checklist

- [ ] Code pushed to GitHub
- [ ] GitHub Actions workflow completed (green checkmark)
- [ ] Frontend loads at https://rice-export.github.io
- [ ] Backend deployed to Render/Railway/Vercel
- [ ] Backend API responding at /api/products
- [ ] Frontend connected to backend (API calls working)
- [ ] Can login and browse products
- [ ] Can add to cart and checkout
- [ ] No errors in browser console (F12)

---

## 📞 Next Steps

1. **Test the platform** - Make sure everything works
2. **Customize domain** - Add custom domain if needed
3. **Monitor performance** - Set up uptime alerts
4. **Scale as needed** - Upgrade plans when necessary
5. **Add features** - Expand platform based on feedback

---

## 📚 Reference Links

- [GitHub Pages Documentation](https://docs.github.com/pages)
- [Render.com Documentation](https://render.com/docs)
- [Railway.app Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)

---

**🚀 Your platform is ready to deploy!**

Run these commands now:
```powershell
cd C:\Users\GuruTeja\Desktop\kishore
git add .
git commit -m "🚀 Deploy Oriza Platform"
git push origin main
```

Then monitor at: **https://github.com/rice-export/rice-export.github.io/actions**

Live site will be at: **https://rice-export.github.io** ✅
