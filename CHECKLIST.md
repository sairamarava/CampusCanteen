# 📋 Deployment Checklist for Campus Canteen

## ✅ Pre-Deployment Tasks

### Backend Preparation
- [ ] **.env file configured** with production values
- [ ] **MongoDB Atlas** connection string ready
- [ ] **JWT secret** generated and secure
- [ ] **CORS settings** configured for production
- [ ] **Package.json** has correct start script
- [ ] **Health check endpoint** added to server
- [ ] **Error handling** properly implemented

### Frontend Preparation
- [ ] **API URL** configured for production
- [ ] **Environment variables** set up
- [ ] **Build command** working locally
- [ ] **Netlify.toml** configuration added
- [ ] **Routes** properly configured for SPA
- [ ] **Production optimizations** enabled in Vite config

### Database Setup
- [ ] **MongoDB Atlas** cluster created
- [ ] **Database user** with proper permissions
- [ ] **IP whitelist** configured (0.0.0.0/0 for cloud deployment)
- [ ] **Sample data** seeded if needed

---

## 🚀 Deployment Steps

### 1. Backend Deployment (Render)
1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare backend for deployment"
   git push origin main
   ```

2. **Deploy to Render**
   - Create new Web Service
   - Connect GitHub repository
   - Set build and start commands
   - Configure environment variables
   - Deploy and wait for completion

3. **Test backend**
   - Visit: `https://your-app.onrender.com/health`
   - Verify API endpoints work

### 2. Frontend Deployment (Netlify)
1. **Update API URL in code**
   - Replace localhost with Render backend URL
   - Commit changes

2. **Deploy to Netlify**
   - Import from GitHub
   - Set build settings
   - Configure environment variables
   - Deploy

3. **Test frontend**
   - Visit Netlify URL
   - Test all features end-to-end

### 3. Final Configuration
1. **Update CORS in backend**
   - Set `FRONTEND_URL` to actual Netlify URL
   - Redeploy backend if needed

2. **SSL and Security**
   - Both platforms provide automatic HTTPS
   - Verify secure connections

---

## 🔧 Quick Commands

### Test Local Build
```bash
# Frontend
cd frontend
npm run build
npm run preview

# Backend
cd backend
npm install
npm start
```

### Environment Variables Format

**Backend (.env)**
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-canteen
JWT_SECRET=your-jwt-secret-here
FRONTEND_URL=https://your-app.netlify.app
COOKIE_EXPIRE=30
ADMIN_EMAIL=admin@campuscanteen.com
ADMIN_PASSWORD=admin123
PREPARATION_TIME=30
```

**Frontend (Netlify Environment)**
```
VITE_API_URL=https://your-backend.onrender.com/api
VITE_APP_NAME=Campus Canteen
VITE_NODE_ENV=production
```

---

## 🐛 Common Issues & Solutions

1. **CORS Error**
   - Check FRONTEND_URL matches exactly
   - Include https:// protocol

2. **Build Fails**
   - Verify Node.js versions
   - Check all dependencies installed

3. **API Not Connecting**
   - Verify backend URL in frontend
   - Check backend is running

4. **Database Connection**
   - Verify MongoDB URI
   - Check IP whitelist settings

---

## 📊 Post-Deployment

- [ ] **Functionality testing** complete
- [ ] **Performance monitoring** set up
- [ ] **Error tracking** configured
- [ ] **Analytics** implemented
- [ ] **Backup strategy** planned
- [ ] **Documentation** updated

---

## 🎉 Success!

When complete, you'll have:
- ✨ **Frontend** running on Netlify with automatic deployments
- 🚀 **Backend** running on Render with monitoring
- 📊 **Database** on MongoDB Atlas
- 🔒 **SSL** certificates and security headers
- 📈 **Monitoring** and logging in place

Your Campus Canteen app is now live! 🍕🎓