# Deployment Guide - Chinese Learning App

This guide provides multiple deployment options for the Chinese Learning App.

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git for version control

## Build the Application

Before deploying, ensure the application builds successfully:

```bash
npm install
npm run build
```

The built files will be in the `build/` directory.

## Deployment Options

### 1. Netlify Deployment

#### Manual Deployment
1. Create a [Netlify](https://netlify.com) account
2. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```
3. Login to Netlify:
   ```bash
   netlify login
   ```
4. Deploy:
   ```bash
   npm run deploy:netlify
   ```

#### Automatic Deployment via Git
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Enable auto-deployment on push to main branch

### 2. Vercel Deployment

#### Manual Deployment
1. Create a [Vercel](https://vercel.com) account
2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Login to Vercel:
   ```bash
   vercel login
   ```
4. Deploy:
   ```bash
   npm run deploy:vercel
   ```

#### Automatic Deployment via Git
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect it's a React app and configure deployment
3. Enable auto-deployment on push to main branch

### 3. GitHub Pages

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```
2. Add to package.json scripts:
   ```json
   "homepage": "https://yourusername.github.io/chinese-learning-app",
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```
3. Deploy:
   ```bash
   npm run deploy
   ```

### 4. Docker Deployment

#### Build Docker Image
```bash
docker build -t chinese-learning-app .
```

#### Run Container
```bash
docker run -p 80:80 chinese-learning-app
```

#### Docker Compose (Optional)
Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

### 5. AWS S3 + CloudFront

1. Create S3 bucket and enable static website hosting
2. Upload build files to S3:
   ```bash
   aws s3 sync build/ s3://your-bucket-name --delete
   ```
3. Create CloudFront distribution pointing to S3 bucket
4. Configure custom error pages to redirect to `index.html` for SPA routing

### 6. Local Server Deployment

For local testing or development server:

```bash
# Using serve
npm install -g serve
npm run deploy

# Using Python (if available)
cd build
python -m http.server 3000

# Using Node.js http-server
npm install -g http-server
http-server build -p 3000
```

## Environment Variables

The app currently uses localStorage for demo purposes. For production:

1. Set up proper authentication backend
2. Configure API endpoints
3. Set environment variables:
   ```bash
   REACT_APP_API_URL=https://your-api.com
   REACT_APP_AUTH_DOMAIN=your-auth-domain.com
   ```

## CI/CD Pipeline

The included GitHub Actions workflow (`.github/workflows/deploy.yml`) provides:

- Automated testing on pull requests
- Automatic deployment to Netlify/Vercel on main branch push
- Docker image building
- Security and dependency scanning

### Required Secrets

Add these secrets to your GitHub repository:

- `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token
- `NETLIFY_SITE_ID`: Your Netlify site ID
- `VERCEL_TOKEN`: Your Vercel token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

## Performance Optimizations

The app includes several performance optimizations:

- Code splitting with React.lazy()
- Service worker for caching
- Gzip compression (nginx)
- CDN-friendly static asset caching
- Optimized bundle sizes

## Security Considerations

- Enable HTTPS in production
- Configure proper CORS headers
- Use secure authentication providers
- Regularly update dependencies
- Implement proper rate limiting

## Monitoring and Analytics

Consider adding:

- Google Analytics or similar
- Error tracking (Sentry)
- Performance monitoring
- User behavior analytics

## Support

For deployment issues:

1. Check build logs for errors
2. Verify all dependencies are installed
3. Ensure Node.js version compatibility
4. Check browser console for client-side errors
5. Review network requests for API issues

## Version Updates

To update the application:

1. Update version in `package.json`
2. Run tests: `npm test`
3. Build and verify: `npm run build`
4. Deploy using chosen method above
5. Test deployed version thoroughly

The app is designed to be deployable on any static hosting platform that supports single-page applications (SPAs).