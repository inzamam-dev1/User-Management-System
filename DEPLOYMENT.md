# 🚀 DEPLOYMENT GUIDE

Deploy your User Management System and get **live links** for both frontend and backend!

---

## 📋 Deployment Strategy

```
Frontend (React/Vite)  →  Vercel      (https://your-app.vercel.app)
Backend (Node/Express) →  Railway     (https://your-api.railway.app)
Database (MongoDB)     →  Atlas       (Already cloud-hosted ✓)
```

---

## ✅ STEP 1: Prepare Your Project

### 1.1 Clean Up Environment Variables

**Frontend: Remove sensitive data**
```bash
# frontend/.env should NOT exist in GitHub
# (only .env.example)
```

Create `frontend/.env.example`:
```
VITE_API_URL=http://localhost:3000
```

**Backend: Add .env.example**

Create `backend/.env.example`:
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development

JWT_ACCESS_SECRET=your_access_secret_key
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES=7d
```

### 1.2 Update .gitignore

Make sure your `.gitignore` has:
```
# Environment variables
.env
.env.local
.env.*.local

# Dependencies
node_modules/
dist/
build/

# Logs
*.log
npm-debug.log*
```

### 1.3 Verify package.json

**Backend package.json** should have:
```json
{
  "name": "user-management-system-backend",
  "version": "1.0.0",
  "description": "User Management System Backend",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node config/seed.js"
  },
  "engines": {
    "node": "18.x"
  }
}
```

**Frontend package.json** should have:
```json
{
  "name": "user-management-system-frontend",
  "version": "1.0.0",
  "description": "User Management System Frontend",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 🎯 STEP 2: Deploy Backend (Railway)

Railway is perfect for Node.js apps with free tier!

### 2.1 Create Railway Account

1. Go to **https://railway.app**
2. Click **"Start Project"**
3. Sign up with GitHub (easiest)
4. Authorize Railway to access GitHub

### 2.2 Push Code to GitHub

```bash
cd user-management-system
git init
git add .
git commit -m "Initial commit - User Management System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/user-management-system.git
git push -u origin main
```

### 2.3 Connect GitHub to Railway

1. On Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose **"user-management-system"** repository
4. Select **"backend"** as root directory
   - (Railway will auto-detect it)

### 2.4 Add Environment Variables

In Railway dashboard:

1. Go to your project
2. Click **"Variables"** tab
3. Add each variable:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/user-management
JWT_ACCESS_SECRET = your_access_token_secret_key_12345
JWT_ACCESS_EXPIRES = 15m
JWT_REFRESH_SECRET = your_refresh_token_secret_key_67890
JWT_REFRESH_EXPIRES = 7d
NODE_ENV = production
```

### 2.5 Wait for Deployment

- Railway will auto-build and deploy
- Check **"Deployments"** tab
- Wait for green checkmark ✅

### 2.6 Get Your Backend URL

```
In Railway Dashboard → Project → Service (backend)
Copy the "Public URL" 
Example: https://user-management-backend-production.up.railway.app
```

**Save this URL!** You'll need it for frontend.

---

## 🎯 STEP 3: Deploy Frontend (Vercel)

Vercel is perfect for React/Vite apps!

### 3.1 Create Vercel Account

1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Sign up with GitHub
4. Authorize Vercel

### 3.2 Import Your Project

1. On Vercel dashboard, click **"Add New"** → **"Project"**
2. Select your **"user-management-system"** GitHub repo
3. Click **"Import"**

### 3.3 Configure Build Settings

Vercel will auto-detect, but verify:

```
Framework Preset: Vite
Root Directory: ./frontend
Build Command: npm run build
Output Directory: dist
```

### 3.4 Add Environment Variables

1. Click **"Environment Variables"**
2. Add:
```
VITE_API_URL = https://your-backend-url.railway.app
```

Example:
```
VITE_API_URL = https://user-management-backend-production.up.railway.app
```

### 3.5 Deploy

- Click **"Deploy"**
- Wait for deployment to complete
- Get your **Frontend URL**

Example:
```
https://user-management-system.vercel.app
```

---

## ✅ STEP 4: Update Frontend API Configuration

### 4.1 Update axios.config.js

```javascript
// frontend/src/api/axios.config.js

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ... rest of your code
```

### 4.2 Redeploy Frontend

Vercel will auto-redeploy when you push to GitHub:

```bash
git add frontend/src/api/axios.config.js
git commit -m "Update API URL for production"
git push origin main
```

---

## 🧪 STEP 5: Test Your Live App

### 5.1 Test Frontend
1. Open: `https://your-app.vercel.app`
2. Should see login page ✅

### 5.2 Test Login
1. Email: `admin@ums.com`
2. Password: `Admin@1234`
3. Should login successfully ✅

### 5.3 Test Backend API

Open browser console and test:
```javascript
fetch('https://your-backend-url.railway.app/api/health')
  .then(r => r.json())
  .then(console.log)
```

Should see:
```json
{ "status": "ok" }
```

### 5.4 Common Issues

**Frontend shows blank page?**
- Check browser console for API errors
- Verify `VITE_API_URL` is set correctly
- Check CORS isn't blocking requests

**Login fails?**
- Check backend is running (check Railway dashboard)
- Verify MongoDB connection
- Check JWT secrets match

**API returns 404?**
- Verify backend URL in frontend
- Check Railway deployment succeeded
- Look at Railway logs

---

## 🔗 YOUR LIVE LINKS

Once deployed, you'll have:

```
🌐 Frontend (User-Facing)
   https://your-app.vercel.app

🔌 Backend API
   https://your-api.railway.app

📊 Database (MongoDB Atlas)
   Already hosted in cloud ✓
```

**Share these links with:**
- Recruiters/Interviewers
- Friends for testing
- Your portfolio

---

## 📝 Deployment Checklist

### Before Frontend Deployment
- [ ] Update .env.example (no real secrets)
- [ ] Set VITE_API_URL in Vercel
- [ ] Test locally: `npm run build && npm run preview`
- [ ] Push to GitHub

### Before Backend Deployment
- [ ] Add all environment variables to Railway
- [ ] Test locally: `npm start`
- [ ] Push to GitHub
- [ ] Check Railway deployment status

### After Deployment
- [ ] Test login on live site
- [ ] Test user CRUD operations
- [ ] Test role-based features
- [ ] Check console for errors
- [ ] Verify API responses

---

## 🆘 Troubleshooting

### Issue: CORS Error in Frontend
**Solution:** Add to backend `server.js`:
```javascript
import cors from "cors";

app.use(cors({
  origin: "https://your-app.vercel.app",
  credentials: true,
}));
```

Then redeploy backend.

### Issue: MongoDB Connection Error
**Solution:** 
- Check MongoDB Atlas IP whitelist
- Add `0.0.0.0/0` to allow all IPs
- Verify connection string in Railway

### Issue: API returns 503 Service Unavailable
**Solution:**
- Wait 2-3 minutes for Railway to fully boot
- Check Railway logs for errors
- Restart deployment in Railway dashboard

### Issue: Environmental Variables Not Working
**Solution:**
- Redeploy after adding variables
- Use `process.env.VAR_NAME` (backend)
- Use `import.meta.env.VITE_API_URL` (frontend)

---

## 📊 Monitoring Your Deployment

### Railway Dashboard
- Check **Deployments** → Green means running ✅
- View **Logs** to debug issues
- Monitor **Metrics** for performance

### Vercel Dashboard
- Check **Deployments** → Green means running ✅
- View **Logs** for build issues
- Monitor **Analytics** for traffic

---

## 💡 Interview Talking Points

> "I deployed my MERN app on Vercel (frontend) and Railway (backend). The frontend is a React app built with Vite, optimized for production. The backend is a Node.js/Express API with JWT authentication. MongoDB Atlas hosts the database. The entire stack is cloud-hosted and accessible via live links. I implemented proper environment variable management and CORS configuration for production."

---

## 🎯 Optional: Custom Domain

### Vercel Custom Domain
1. Buy domain from **Namecheap** or **GoDaddy**
2. Add to Vercel: **Settings** → **Domains**
3. Point DNS to Vercel nameservers
4. Example: `app.yourname.com`

### Railway Custom Domain
1. Add domain in Railway: **Settings** → **Domains**
2. Point DNS to Railway
3. Example: `api.yourname.com`

---

## ✨ You're Live! 🎉

Your app is now deployed and accessible worldwide!

**Share your live links:**
- Portfolio: Link to live app
- GitHub: Link to repo
- Interview: "https://your-app.vercel.app"

---

## 📚 Quick Reference

| Service | Purpose | Free Tier | URL |
|---------|---------|-----------|-----|
| Vercel | Frontend hosting | Yes (limited) | vercel.com |
| Railway | Backend hosting | Yes ($5/month) | railway.app |
| MongoDB Atlas | Database hosting | Yes (512MB) | mongodb.com/atlas |

---

## 🚀 What's Next?

- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel
- [ ] Test live app
- [ ] Share links with recruiters
- [ ] Update portfolio with live link
- [ ] Add to GitHub profile

---

## 🎊 Congratulations!

Your User Management System is now:
✅ Developed
✅ Tested
✅ Documented
✅ **DEPLOYED & LIVE** 🌐

Perfect for showcasing in interviews! Good luck! 🚀
