# 🚀 Campus Canteen - Deployment Guide

This guide will walk you through deploying the Campus Canteen application with the frontend on Netlify and backend on Render.

## 📋 Prerequisites

1. **GitHub Repository**: Push your code to GitHub
2. **MongoDB Atlas**: Ensure your database is set up
3. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
4. **Render Account**: Sign up at [render.com](https://render.com)

---

## 🎯 Part 1: Backend Deployment on Render

### Step 1: Prepare Backend for Deployment

1. **Update Environment Variables**

   - Ensure your `.env` file has all required variables
   - Note: Don't commit the actual `.env` file to GitHub

2. **Verify Package.json Scripts**
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js",
       "seed": "node seeds/seed.js"
     }
   }
   ```

### Step 2: Deploy to Render

1. **Login to Render**

   - Go to [render.com](https://render.com)
   - Sign in with GitHub

2. **Create New Web Service**

   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder (or root if backend is in root)

3. **Configure Service Settings**

   ```
   Name: campus-canteen-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Set Environment Variables**
   In Render dashboard, add these environment variables:

   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/campus-canteen?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-here
   FRONTEND_URL=https://your-netlify-app-name.netlify.app
   COOKIE_EXPIRE=30
   ADMIN_EMAIL=admin@campuscanteen.com
   ADMIN_PASSWORD=admin123
   PREPARATION_TIME=30
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL: `https://your-app-name.onrender.com`

---

## 🌐 Part 2: Frontend Deployment on Netlify

### Step 1: Update API Configuration

1. **Update API URL in Frontend**
   - The `api.js` file has been configured to use environment variables
   - Update the production URL with your Render backend URL

### Step 2: Deploy to Netlify

1. **Login to Netlify**

   - Go to [netlify.com](https://netlify.com)
   - Sign in with GitHub

2. **Create New Site**

   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Choose the repository

3. **Configure Build Settings**

   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

4. **Set Environment Variables**
   In Netlify dashboard → Site settings → Environment variables:

   ```
   VITE_API_URL=https://your-backend-app.onrender.com/api
   VITE_APP_NAME=Campus Canteen
   VITE_NODE_ENV=production
   ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for deployment to complete
   - Note your frontend URL: `https://your-app-name.netlify.app`

### Step 3: Update CORS Configuration

Go back to your backend on Render and update the `FRONTEND_URL` environment variable with your actual Netlify URL.

---

## ⚙️ Part 3: Final Configuration

### Step 1: Update Backend CORS

Update your backend's `FRONTEND_URL` environment variable on Render with the actual Netlify URL.

### Step 2: Update Frontend API URL

Update the production API URL in your frontend code with the actual Render backend URL.

### Step 3: Test the Application

1. Visit your Netlify URL
2. Test all functionality:
   - User registration/login
   - Menu browsing
   - Cart operations
   - Order placement
   - Admin functions

---

## 🔧 Troubleshooting

### Common Issues:

1. **CORS Errors**

   - Ensure `FRONTEND_URL` in backend matches your Netlify URL exactly
   - Include protocol (https://)

2. **API Connection Failed**

   - Verify the API URL in frontend matches your Render backend URL
   - Check if backend service is running on Render

3. **Build Failures**

   - Check Node.js versions match
   - Ensure all dependencies are in package.json
   - Review build logs for specific errors

4. **Database Connection Issues**
   - Verify MongoDB URI is correct
   - Ensure IP whitelist includes 0.0.0.0/0 for Render

### Performance Optimization:

1. **Backend (Render)**

   - Use environment variables properly
   - Enable gzip compression
   - Implement proper error handling

2. **Frontend (Netlify)**
   - Enable automatic deployments from GitHub
   - Configure caching headers
   - Use CDN for static assets

---

## 📊 Monitoring

1. **Render Dashboard**: Monitor backend performance and logs
2. **Netlify Analytics**: Track frontend performance and usage
3. **MongoDB Atlas**: Monitor database performance

---

## 🔒 Security Checklist

- [ ] Strong JWT secret in production
- [ ] Proper CORS configuration
- [ ] Environment variables secured
- [ ] MongoDB IP whitelist configured
- [ ] HTTPS enabled (automatic on both platforms)

---

## 🚀 Deployment URLs

After successful deployment, you'll have:

- **Frontend**: `https://your-app-name.netlify.app`
- **Backend**: `https://your-app-name.onrender.com`
- **Database**: MongoDB Atlas

Remember to update these URLs in your respective environment configurations!

---

## 📝 Notes

- Render free tier may have cold starts (initial request might be slow)
- Netlify provides automatic HTTPS and CDN
- Both platforms offer automatic deployments from GitHub
- Consider upgrading to paid plans for production use

Happy deploying! 🎉
