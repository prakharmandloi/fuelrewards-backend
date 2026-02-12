# 🚀 Vercel Deployment Guide - FuelRewards

Complete guide to deploy FuelRewards backend to Vercel.

## ⚠️ Important Prerequisites

Vercel is serverless, so you need an **external MySQL database**. Choose one:

### Option 1: PlanetScale (Recommended - Free Tier)
- Visit: https://planetscale.com
- Create free MySQL database
- Get connection string

### Option 2: Railway MySQL
- Visit: https://railway.app
- Create MySQL database
- Get connection credentials

### Option 3: AWS RDS / DigitalOcean
- Managed MySQL service
- More control, paid

---

## 📋 Step-by-Step Deployment

### Step 1: Setup External Database

#### Using PlanetScale (Recommended):

1. **Create Account**
   - Go to https://planetscale.com
   - Sign up with GitHub

2. **Create Database**
   - Click "New database"
   - Name: `fuelrewards`
   - Region: Choose closest to you
   - Click "Create database"

3. **Get Connection String**
   - Click "Connect"
   - Select "Node.js"
   - Copy connection string
   - Example: `mysql://user:pass@host/fuelrewards?ssl={"rejectUnauthorized":true}`

4. **Import Schema**
   ```bash
   # Install PlanetScale CLI
   brew install planetscale/tap/pscale
   
   # Login
   pscale auth login
   
   # Connect to database
   pscale connect fuelrewards main --port 3309
   
   # In another terminal, import schema
   mysql -h 127.0.0.1 -P 3309 -u root < database/schema.sql
   ```

---

### Step 2: Deploy to Vercel

#### Method 1: Using Vercel Dashboard (Easiest)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign in with GitHub

2. **Import Repository**
   - Click "Add New..." → "Project"
   - Select `fuelrewards-backend` repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset:** Other
   - **Root Directory:** ./
   - **Build Command:** (leave empty)
   - **Output Directory:** (leave empty)
   - Click "Deploy"

4. **Add Environment Variables**
   After deployment, go to:
   - Project Settings → Environment Variables
   - Add these variables:

   ```env
   DB_HOST=your-planetscale-host.psdb.cloud
   DB_USER=your-username
   DB_PASSWORD=your-password
   DB_NAME=fuelrewards
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   FAST2SMS_API_KEY=your-fast2sms-key
   NODE_ENV=production
   ```

5. **Redeploy**
   - Go to "Deployments"
   - Click "..." on latest deployment
   - Click "Redeploy"

---

#### Method 2: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd fuelrewards-backend
   vercel
   ```

4. **Follow Prompts**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **fuelrewards-backend**
   - Directory? **./
   - Override settings? **N**

5. **Add Environment Variables**
   ```bash
   vercel env add DB_HOST
   # Enter value when prompted
   
   vercel env add DB_USER
   vercel env add DB_PASSWORD
   vercel env add DB_NAME
   vercel env add JWT_SECRET
   vercel env add FAST2SMS_API_KEY
   vercel env add NODE_ENV
   ```

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

---

### Step 3: Test Deployment

1. **Get Your URL**
   - Vercel will provide: `https://fuelrewards-backend.vercel.app`

2. **Test Health Endpoint**
   ```bash
   curl https://fuelrewards-backend.vercel.app/health
   ```

   Expected response:
   ```json
   {
     "status": "OK",
     "message": "FuelRewards API is running",
     "timestamp": "2024-01-15T10:30:00.000Z",
     "environment": "production"
   }
   ```

3. **Test API Endpoint**
   ```bash
   curl https://fuelrewards-backend.vercel.app/
   ```

---

## 🔧 Configuration Files

### vercel.json
Already created in your repository:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

---

## 🗄️ Database Connection for Vercel

### Update config/database.js for SSL (PlanetScale)

If using PlanetScale, update `config/database.js`:

```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: true
  }
});

module.exports = pool;
```

---

## 📊 Environment Variables Checklist

Make sure these are set in Vercel:

- [ ] `DB_HOST` - Database host
- [ ] `DB_USER` - Database username
- [ ] `DB_PASSWORD` - Database password
- [ ] `DB_NAME` - Database name (fuelrewards)
- [ ] `JWT_SECRET` - Secret key (min 32 characters)
- [ ] `FAST2SMS_API_KEY` - SMS API key (optional)
- [ ] `NODE_ENV` - Set to "production"

---

## 🎯 Post-Deployment Steps

### 1. Update Postman Collection
Update base URL in Postman:
```
https://fuelrewards-backend.vercel.app/api
```

### 2. Test All Endpoints
```bash
# Health check
curl https://your-app.vercel.app/health

# Send OTP
curl -X POST https://your-app.vercel.app/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9876543210"}'
```

### 3. Setup Custom Domain (Optional)
1. Go to Vercel Dashboard
2. Project Settings → Domains
3. Add your domain
4. Update DNS records

---

## 🔍 Troubleshooting

### Issue: Database Connection Failed

**Solution:**
1. Check environment variables in Vercel
2. Verify database credentials
3. Ensure database allows external connections
4. Check SSL configuration

```bash
# Test database connection
vercel logs
```

### Issue: 500 Internal Server Error

**Solution:**
1. Check Vercel logs:
   ```bash
   vercel logs --follow
   ```
2. Verify all environment variables are set
3. Check database schema is imported

### Issue: Function Timeout

**Solution:**
Vercel free tier has 10s timeout. For longer operations:
1. Upgrade to Pro plan
2. Optimize database queries
3. Add indexes to database

---

## 💰 Pricing

### Vercel
- **Free Tier:**
  - 100GB bandwidth/month
  - Serverless function execution
  - Automatic SSL
  - Good for testing

- **Pro ($20/month):**
  - Unlimited bandwidth
  - Longer function timeout
  - Better for production

### PlanetScale
- **Free Tier:**
  - 5GB storage
  - 1 billion row reads/month
  - Perfect for starting

- **Paid Plans:**
  - Start at $29/month
  - More storage & connections

---

## 🚀 Alternative: Railway (Recommended for MySQL Apps)

If you face issues with Vercel + external DB, Railway is better:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
railway init

# Add MySQL
railway add mysql

# Deploy
railway up
```

**Why Railway is better for this project:**
- ✅ Built-in MySQL database
- ✅ No serverless limitations
- ✅ Persistent connections
- ✅ Easier setup
- ✅ Free tier available

---

## 📝 Quick Commands

```bash
# Deploy to Vercel
vercel --prod

# View logs
vercel logs --follow

# List deployments
vercel ls

# Remove deployment
vercel remove fuelrewards-backend

# Add environment variable
vercel env add VARIABLE_NAME

# Pull environment variables locally
vercel env pull
```

---

## ✅ Deployment Checklist

- [ ] External MySQL database created
- [ ] Database schema imported
- [ ] Repository pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported to Vercel
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Health endpoint working
- [ ] API endpoints tested
- [ ] Postman collection updated
- [ ] Custom domain configured (optional)

---

## 🎉 Success!

Your FuelRewards API is now live on Vercel!

**Your API URL:**
```
https://fuelrewards-backend.vercel.app
```

**Next Steps:**
1. Test all endpoints
2. Build frontend application
3. Connect mobile app
4. Monitor with Vercel Analytics

---

## 📞 Support

- **Vercel Docs:** https://vercel.com/docs
- **PlanetScale Docs:** https://planetscale.com/docs
- **Issues:** Create GitHub issue
- **Email:** prakharmandloi22@gmail.com

---

**Happy Deploying! 🚀**