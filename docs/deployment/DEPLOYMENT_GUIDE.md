# VSC OPS Tracker - Deployment Guide

**Version:** v1.8  
**Author:** Charlie Payne @cp5337  
**Date:** 2025-01-27

## 🚀 Deployment Overview

This guide covers deploying the VSC OPS Tracker application to various hosting platforms. The application is built as a Progressive Web App (PWA) and can be deployed to any static hosting service.

## 📋 Prerequisites

### Development Environment
- Node.js 18+ 
- npm or yarn
- Git

### Production Requirements
- Static hosting service (Vercel, Netlify, GitHub Pages, AWS S3)
- Domain name (optional)
- SSL certificate (usually provided by hosting service)

## 🔧 Build Process

### 1. Environment Setup
```bash
# Clone the repository
git clone https://github.com/cp5337/vsc-sop-mobile.git
cd vsc-sop-mobile

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your OpenWeatherMap API key
```

### 2. Production Build
```bash
# Create production build
npm run build

# The build output will be in the 'build' directory
ls -la build/
```

### 3. Build Verification
```bash
# Test the production build locally
npx serve -s build -l 3000

# Verify the application works correctly
# Check all features: camera, QR scanning, task management, etc.
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides excellent performance and easy deployment for React applications.

#### Setup
1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   # From the project root
   vercel

   # Follow the prompts:
   # - Link to existing project or create new
   # - Set build command: npm run build
   # - Set output directory: build
   ```

3. **Environment Variables**
   ```bash
   # Set environment variables in Vercel dashboard
   vercel env add REACT_APP_OPENWEATHER_API_KEY
   ```

4. **Custom Domain (Optional)**
   - Add domain in Vercel dashboard
   - Update DNS records as instructed

#### Configuration
Create `vercel.json` in project root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Option 2: Netlify

Netlify offers excellent static site hosting with continuous deployment.

#### Setup
1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: build
   ```

3. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add `REACT_APP_OPENWEATHER_API_KEY`

4. **Custom Domain (Optional)**
   - Go to Domain settings
   - Add custom domain
   - Update DNS records

#### Configuration
Create `netlify.toml` in project root:
```toml
[build]
  command = "npm run build"
  publish = "build"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: GitHub Pages

Free hosting for public repositories.

#### Setup
1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "homepage": "https://cp5337.github.io/vsc-sop-mobile",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

4. **Environment Variables**
   - GitHub Pages doesn't support environment variables
   - Use build-time environment variables or hardcode API keys

### Option 4: AWS S3 + CloudFront

Enterprise-grade hosting with global CDN.

#### Setup
1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://vsc-ops-tracker
   ```

2. **Upload Build**
   ```bash
   aws s3 sync build/ s3://vsc-ops-tracker --delete
   ```

3. **Configure Static Website**
   ```bash
   aws s3 website s3://vsc-ops-tracker --index-document index.html --error-document index.html
   ```

4. **Set Bucket Policy**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::vsc-ops-tracker/*"
       }
     ]
   }
   ```

5. **CloudFront Distribution**
   - Create CloudFront distribution
   - Set origin to S3 bucket
   - Configure custom error pages for SPA routing

## 🔒 Security Considerations

### Environment Variables
- Never commit API keys to version control
- Use environment variables for sensitive data
- Rotate API keys regularly

### HTTPS
- Ensure all deployments use HTTPS
- Most hosting services provide SSL certificates
- Update any hardcoded HTTP URLs

### Content Security Policy
Add CSP headers to prevent XSS attacks:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: blob:;
               connect-src 'self' https://api.openweathermap.org;">
```

## 📊 Performance Optimization

### Build Optimization
```bash
# Analyze bundle size
npm run build
npx serve -s build
# Use browser dev tools to analyze bundle
```

### Caching Strategy
- Static assets: 1 year cache
- HTML files: No cache
- API responses: Appropriate cache headers

### Compression
- Enable gzip compression on server
- Use Brotli compression if available
- Optimize images before deployment

## 🔄 Continuous Deployment

### GitHub Actions (Vercel/Netlify)
```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run deploy
```

### Manual Deployment
```bash
# Build and deploy manually
npm run build
# Upload build/ directory to hosting service
```

## 🧪 Testing Deployment

### Pre-Deployment Checklist
- [ ] Application builds without errors
- [ ] All features work in production build
- [ ] Environment variables are set correctly
- [ ] HTTPS is enabled
- [ ] Custom domain is configured (if applicable)
- [ ] Analytics/tracking is working (if applicable)

### Post-Deployment Testing
- [ ] Application loads correctly
- [ ] Camera functionality works
- [ ] QR code scanning works
- [ ] Task management works
- [ ] Offline functionality works
- [ ] Weather integration works
- [ ] All navigation works
- [ ] Mobile responsiveness is correct

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Environment Variables Not Working
- Check variable names (must start with REACT_APP_)
- Verify variables are set in hosting service
- Restart deployment after adding variables

#### Routing Issues (404 on refresh)
- Ensure SPA routing is configured
- Check redirect rules in hosting configuration
- Verify index.html is served for all routes

#### Camera Not Working
- Check HTTPS requirement
- Verify camera permissions
- Test on different devices/browsers

### Performance Issues
- Check bundle size
- Optimize images
- Enable compression
- Use CDN for static assets

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review hosting service documentation
3. Check application logs
4. Contact hosting service support
5. Create an issue in the repository

---

*This deployment guide is maintained as part of the VSC OPS Tracker project and is updated with each major release.*
