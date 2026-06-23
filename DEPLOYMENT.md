# Deployment & Configuration Guide

Step-by-step instructions for setting up required services and deploying the AI Travel Planner.

## 📦 Prerequisites Installation

### Node.js Setup (All Platforms)

1. **Download Node.js:**
   - Visit https://nodejs.org/
   - Download LTS version (18.x or 20.x)
   - Run installer and follow prompts
   - Accept default settings

2. **Verify Installation:**
   ```bash
   node --version    # Should show v18.x or v20.x
   npm --version     # Should show 9.x or 10.x
   ```

## 🗄️ MongoDB Atlas Setup

### Create Free MongoDB Cluster

1. **Sign Up:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Click "Register" or sign in with Google
   - Verify email address

2. **Create Organization & Project:**
   - Create new organization (or use default)
   - Create new project: "ai-travel-planner"
   - Click "Create a Deployment"

3. **Create Free Cluster:**
   - Select "Shared" (free tier)
   - Choose any region (US East recommended for lowest latency)
   - Click "Create"
   - Wait 2-3 minutes for cluster to be ready

4. **Create Database User:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username: `aitravel`
   - Create password: `YourSecurePassword123!`
   - Keep role as "readWriteAnyDatabase"
   - Click "Add User"

5. **Get Connection String:**
   - Go to "Database"
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Select "Node.js" driver
   - Copy connection string:
     ```
     mongodb+srv://aitravel:YourSecurePassword123!@cluster0.mongodb.net/ai_travel_planner?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password

6. **Allow All IPs (Development Only):**
   - Go to "Network Access"
   - Click "ADD IP ADDRESS"
   - Click "ALLOW ACCESS FROM ANYWHERE" 
   - Confirm (for production, use specific IPs only)

### Test Connection

```bash
# In backend directory
echo "MONGO_URI=mongodb+srv://aitravel:password@cluster0.mongodb.net/ai_travel_planner?retryWrites=true&w=majority" > .env

# Try starting backend
npm run dev
# Should log: "✓ MongoDB Connected: cluster0.mongodb.net"
```

## 🤖 Google Gemini API Setup

### Get Free API Key

1. **Visit Google AI Studio:**
   - Go to https://ai.google.dev/tutorials/setup
   - Click "Get API Key"
   - Sign in with Google account

2. **Create API Key:**
   - Click "Create API Key"
   - Select or create a Google Cloud project
   - API key is generated (keep it secret!)

3. **Enable API (if prompted):**
   - Go to Google Cloud Console
   - Enable "Generative Language API"
   - Wait 30 seconds for changes to propagate

4. **Check Quota:**
   - Free tier includes:
     - 60 requests per minute
     - 1,500 requests per day
     - Sufficient for testing

5. **Add to Backend:**
   ```bash
   # In backend/.env
   GEMINI_API_KEY=AIza_your_key_here
   ```

### Test API Connection

```bash
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Say hello"
      }]
    }]
  }'
```

Should receive a JSON response with generated text.

## 🚀 Render.com Backend Deployment

### Prerequisites
- GitHub account with code pushed
- All environment variables ready

### Deploy Steps

1. **Prepare Repository:**
   ```bash
   cd your-project-root
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Go to Render:**
   - Visit https://render.com
   - Sign up or login with GitHub

3. **Create Web Service:**
   - Click "New" in top navbar
   - Select "Web Service"
   - Authorize GitHub access
   - Select your repository
   - Set configuration:
     - **Name:** `ai-travel-planner-api`
     - **Root Directory:** `backend`
     - **Runtime:** `Node`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`

4. **Add Environment Variables:**
   - In "Environment" section, add:
     ```
     MONGO_URI=mongodb+srv://aitravel:password@cluster0.mongodb.net/ai_travel_planner?retryWrites=true&w=majority
     JWT_SECRET=your_super_secure_random_string_here
     GEMINI_API_KEY=AIza_your_key_here
     NODE_ENV=production
     PORT=5000
     FRONTEND_URL=https://your-frontend-url.vercel.app
     ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Copy URL: `https://ai-travel-planner-api.onrender.com`

6. **Monitor Deployment:**
   - Watch logs for errors
   - Verify endpoint: `https://ai-travel-planner-api.onrender.com/api/health`

### Prevent Free Tier Sleep

Render free tier spins down after 15 minutes of inactivity.

**Solution 1: Free Tier Limits**
- Acknowledge that service may sleep
- Add loading message to frontend

**Solution 2: Monitor (Paid)**
- Use uptime monitoring service
- Call health endpoint every 10 minutes

**Solution 3: Use Paid Tier**
- Upgrade to Starter tier ($7/month)
- No sleep, always running

## 🌐 Vercel Frontend Deployment

### Prerequisites
- GitHub account with code pushed
- Backend URL ready

### Deploy Steps

1. **Push Frontend to GitHub:**
   ```bash
   cd frontend
   git add .
   git commit -m "Frontend ready for deployment"
   git push origin main
   ```

2. **Go to Vercel:**
   - Visit https://vercel.com
   - Sign up or login with GitHub

3. **Import Project:**
   - Click "Add New" → "Project"
   - Click "Import Git Repository"
   - Select your repository

4. **Configure Project:**
   - **Framework Preset:** Select "Next.js"
   - **Root Directory:** `frontend`
   - Under "Environment Variables":
     ```
     NEXT_PUBLIC_API_URL=https://ai-travel-planner-api.onrender.com
     ```

5. **Deploy:**
   - Click "Deploy"
   - Wait 3-5 minutes
   - Copy URL: `https://ai-travel-planner.vercel.app`

6. **Update Backend URL:**
   - Go to Render dashboard
   - Update `FRONTEND_URL` to Vercel URL
   - Redeploy backend

### Verify Deployment

```bash
# Check frontend loads
curl https://ai-travel-planner.vercel.app

# Check API connection from frontend works
# (Open browser DevTools, Network tab, and test signup)
```

## 🔒 Production Security Checklist

### Environment Variables
- [ ] `JWT_SECRET` is random 32+ character string
- [ ] `GEMINI_API_KEY` not committed to git
- [ ] No test/dummy keys in production
- [ ] All URLs use HTTPS

### Database
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Strong passwords for DB users
- [ ] Read-only user for backups (if applicable)
- [ ] Regular backups enabled

### API Security
- [ ] CORS origin matches frontend domain exactly
- [ ] Rate limiting implemented (future enhancement)
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info

### Monitoring
- [ ] Check Render/backend logs regularly
- [ ] Monitor Vercel deployment metrics
- [ ] Alert on API errors

## 📊 Expected Performance

### Local Development
- Backend startup: < 2 seconds
- Frontend build: 10-20 seconds
- Trip generation: 10-15 seconds

### Production
- Backend response: < 200ms
- Trip generation: 15-30 seconds (API dependent)
- Frontend: < 3 second page load

## 🆘 Common Deployment Issues

### Render: "Cannot find module"
**Solution:** Ensure Node version is set. Add to `build command`:
```
npm install --legacy-peer-deps
```

### Vercel: API calls fail from frontend
**Solution:** Check `NEXT_PUBLIC_API_URL` matches exact backend URL:
```bash
# Both should work
curl https://ai-travel-planner-api.onrender.com/api/health
```

### Render: MongoDB connection timeout
**Solution:**
- Check connection string has correct password
- Add IP `0.0.0.0/0` to MongoDB Atlas network access
- Wait 1-2 minutes for changes to propagate

### CORS errors
**Solution:** Backend `.env` must have exact frontend URL:
```env
# Correct
FRONTEND_URL=https://ai-travel-planner.vercel.app

# Wrong (will cause CORS error)
FRONTEND_URL=https://ai-travel-planner.vercel.app/
FRONTEND_URL=http://ai-travel-planner.vercel.app
```

## 🔄 Continuous Deployment

Both Render and Vercel auto-deploy on push to main branch.

**Workflow:**
1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub
4. Render auto-deploys backend (within 1-2 min)
5. Vercel auto-deploys frontend (within 3-5 min)
6. Check deployment status in respective dashboards

## 💾 Backup & Maintenance

### MongoDB Backups
- Render free tier: Atlas auto-backups every 12 hours
- For production: enable continuous backups

### Monitoring
- Render: Check logs daily
- Vercel: Monitor error rate
- Set up alerts if available

### Updates
- Node.js: Check for security updates monthly
- Dependencies: Review for vulnerabilities
  ```bash
  npm audit
  npm audit fix
  ```

## 🎯 Cost Breakdown (Monthly)

- **MongoDB Atlas**: Free (5GB storage)
- **Render**: Free (may sleep) or $7/month (no sleep)
- **Vercel**: Free
- **Google Gemini API**: Free (60 req/min, 1500/day limit)
- **Domain** (optional): $10-15/year

**Total**: $0-7/month for basic setup

---

**Setup complete!** Your AI Travel Planner is now deployed and ready for production use.
