# 🚀 Quick Railway Deployment Guide

**Super simple steps to get your Chinese Learning App live with PostgreSQL!**

## What You'll Get
- ✅ Live web app with user accounts
- ✅ PostgreSQL database for persistent data  
- ✅ HTTPS and professional URLs
- ✅ Automatic deployments from Git

---

## Step 1: Push to GitHub (2 minutes)

```bash
# In your project root
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

---

## Step 2: Deploy Backend to Railway (5 minutes)

1. **Go to [railway.app](https://railway.app)** and sign up/login

2. **Create New Project** → "Deploy from GitHub repo"
   - Connect GitHub and select your `learnchinese` repository

3. **Add PostgreSQL Database**
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway automatically provisions a database

4. **Configure Backend Service**
   - Click "New" → "GitHub Repo" → Select your repo
   - Set **Root Directory**: `backend`
   - Go to Variables tab and add:

   ```env
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
   
   # Database (Railway auto-fills these)
   DB_HOST=${{Postgres.PGHOST}}
   DB_PORT=${{Postgres.PGPORT}}  
   DB_NAME=${{Postgres.PGDATABASE}}
   DB_USER=${{Postgres.PGUSER}}
   DB_PASSWORD=${{Postgres.PGPASSWORD}}
   ```

5. **Get Your API URL**
   - Go to backend service → Settings → Domains
   - Copy the Railway domain (like `backend-production.up.railway.app`)

---

## Step 3: Deploy Frontend to Vercel (3 minutes)

1. **Go to [vercel.com](https://vercel.com)** and sign up/login

2. **New Project** → Import your GitHub repo
   - Set **Root Directory**: `chinese-learning-app`

3. **Add Environment Variables**:
   ```env
   REACT_APP_API_URL=https://your-backend-domain.railway.app/api
   ```
   *(Replace with your actual Railway backend URL from Step 2)*

4. **Deploy** - Vercel automatically builds and deploys

---

## Step 4: Update CORS (1 minute)

1. **Go back to Railway** → Backend service → Variables
2. **Add**:
   ```env
   FRONTEND_URL=https://your-app.vercel.app
   ```
   *(Replace with your actual Vercel domain)*

---

## Step 5: Test (1 minute)

1. **Visit your Vercel URL**
2. **Register a new account**
3. **Add some vocabulary words**
4. **Refresh page** - data should persist!

---

## 🎉 You're Live!

Your app now has:
- **Professional URLs** (both frontend and backend)
- **PostgreSQL database** with user accounts
- **Automatic deployments** when you push to Git
- **HTTPS/SSL** built-in

## Quick Commands

**Update your app:**
```bash
git add .
git commit -m "Your changes"
git push origin main
# Both Railway and Vercel auto-deploy!
```

**Check if backend is working:**
Visit: `https://your-backend.railway.app/health`

## Troubleshooting

**"Can't connect to API"**
- Check `REACT_APP_API_URL` in Vercel environment variables
- Make sure Railway backend is running (check Railway dashboard)

**"CORS error"**  
- Update `FRONTEND_URL` in Railway backend variables
- Make sure it matches your Vercel domain exactly

**"Database connection failed"**
- Check Railway PostgreSQL service is running
- Verify database environment variables in Railway

---

**Total time: ~15 minutes to go from code to live app! 🚀**