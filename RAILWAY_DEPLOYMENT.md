# Railway Deployment Guide

Complete guide to deploy your Chinese Learning App to Railway with PostgreSQL database.

## Why Railway?

✅ **Easy PostgreSQL Setup** - One-click database provisioning  
✅ **Automatic Deployments** - Git-based deployments  
✅ **Built-in SSL** - HTTPS out of the box  
✅ **Environment Variables** - Secure config management  
✅ **Free Tier** - Great for getting started  

## Prerequisites

- GitHub account (to connect your repository)
- Railway account (free at [railway.app](https://railway.app))

## Step 1: Prepare Your Repository

1. **Push your code to GitHub** (if not already done):
```bash
git add .
git commit -m "Add Railway deployment configuration"
git push origin main
```

## Step 2: Set Up Railway Project

1. **Sign up/Login to Railway**: Go to [railway.app](https://railway.app)

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select your `learnchinese` repository

3. **Add PostgreSQL Database**:
   - In your Railway project dashboard
   - Click "New" → "Database" → "Add PostgreSQL"
   - Railway will automatically provision a PostgreSQL instance

## Step 3: Configure Backend Service

1. **Add Backend Service**:
   - Click "New" → "GitHub Repo" 
   - Select your repository again
   - Set **Root Directory** to: `backend`
   - Railway will automatically detect it's a Node.js app

2. **Set Environment Variables**:
   Go to your backend service → Variables tab and add:

   ```env
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long-change-this
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   
   # Database variables (Railway will auto-populate these):
   DB_HOST=${{Postgres.PGHOST}}
   DB_PORT=${{Postgres.PGPORT}}
   DB_NAME=${{Postgres.PGDATABASE}}
   DB_USER=${{Postgres.PGUSER}}
   DB_PASSWORD=${{Postgres.PGPASSWORD}}
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ```

   **Important**: Railway automatically creates database connection variables when you add PostgreSQL. Use the `${{Postgres.VARIABLE}}` syntax to reference them.

3. **Set Custom Start Command** (if needed):
   - Go to Settings → Deploy
   - Custom Start Command: `npm start`

## Step 4: Deploy Frontend to Vercel

1. **Install Vercel CLI** (optional):
```bash
npm i -g vercel
```

2. **Deploy to Vercel**:
```bash
cd chinese-learning-app
vercel
```

3. **Set Environment Variables in Vercel**:
   - Go to your Vercel project dashboard
   - Settings → Environment Variables
   - Add:
   ```env
   REACT_APP_API_URL=https://your-backend-service.railway.app/api
   REACT_APP_OPENAI_API_KEY=your-openai-key-here
   ```

   **Get your Railway backend URL**:
   - Go to your Railway backend service
   - Click "Settings" → "Domains"
   - Copy the generated Railway domain (like `chinese-learning-backend-production.up.railway.app`)

## Step 5: Test Your Deployment

1. **Check Backend Health**:
   Visit: `https://your-backend-service.railway.app/health`
   
   Should return:
   ```json
   {
     "status": "OK",
     "timestamp": "2024-01-01T00:00:00.000Z",
     "environment": "production"
   }
   ```

2. **Test Full App**:
   - Visit your Vercel frontend URL
   - Try registering a new user
   - Add some vocabulary words
   - Verify data persists after refresh

## Alternative: Deploy Frontend to Railway Too

If you prefer to keep everything on Railway:

1. **Add Frontend Service**:
   - New → GitHub Repo → Select your repo
   - Set Root Directory to: `chinese-learning-app`
   
2. **Environment Variables**:
   ```env
   REACT_APP_API_URL=https://${{backend-service.RAILWAY_PUBLIC_DOMAIN}}/api
   REACT_APP_OPENAI_API_KEY=your-openai-key-here
   ```

3. **Build Settings**:
   - Build Command: `npm run build`
   - Start Command: `npx serve -s build -p $PORT`

## Environment Variable Reference

### Backend Service
```env
NODE_ENV=production
JWT_SECRET=your-secret-key-32-chars-minimum
FRONTEND_URL=https://your-frontend-domain.com

# Database (auto-populated by Railway)
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_NAME=${{Postgres.PGDATABASE}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
```

### Frontend Service  
```env
REACT_APP_API_URL=https://your-backend.railway.app/api
REACT_APP_OPENAI_API_KEY=your-openai-key-here
```

## Troubleshooting

### Database Connection Issues
- Check that all database environment variables are set correctly
- Verify PostgreSQL service is running in Railway dashboard
- Check logs in Railway dashboard for connection errors

### CORS Issues
- Make sure `FRONTEND_URL` in backend matches your actual frontend domain
- Check that frontend is using correct API URL

### Build Failures
- Check Node.js version in `package.json` engines field
- Verify all dependencies are in `dependencies` not `devDependencies`
- Check Railway build logs for specific errors

### Environment Variables
- Use Railway's variable reference syntax: `${{service.VARIABLE}}`
- Don't hardcode URLs - use environment variables
- Make sure sensitive data like JWT_SECRET is secure

## Cost Optimization

**Railway Free Tier includes**:
- $5 credit per month
- Automatic sleep after 1 hour of inactivity
- 512MB RAM, 1GB disk per service

**For production**:
- Upgrade to Pro ($20/month) for always-on services
- Monitor usage in Railway dashboard
- Consider combining services if hitting limits

## Automatic Deployments

Railway automatically deploys when you push to your connected branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
# 🚀 Railway automatically deploys!
```

## Database Management

**Access PostgreSQL directly**:
1. Railway Dashboard → PostgreSQL service
2. Click "Connect" 
3. Copy connection string or use Railway CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and connect to database
railway login
railway connect postgresql
```

**Backup Database**:
```bash
railway run pg_dump $DATABASE_URL > backup.sql
```

Your Chinese Learning App is now live with persistent PostgreSQL storage! 🎉