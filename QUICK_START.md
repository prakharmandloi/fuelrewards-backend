# ⚡ Quick Start - Deploy in 5 Minutes

## 🚀 Deploy to Vercel (Fastest)

### Step 1: Fork/Clone Repository ✅
Already done! You have: `prakharmandloi/fuelrewards-backend`

### Step 2: Setup Database (2 minutes)

#### Option A: PlanetScale (Recommended - Free)
1. Go to https://planetscale.com
2. Sign up with GitHub
3. Create database: `fuelrewards`
4. Click "Connect" → Copy credentials
5. Keep this tab open!

#### Option B: Railway MySQL
1. Go to https://railway.app
2. New Project → Add MySQL
3. Copy credentials

### Step 3: Deploy to Vercel (1 minute)

#### Method 1: One-Click Deploy
1. Click this button:
   
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/prakharmandloi/fuelrewards-backend)

2. Sign in with GitHub
3. Click "Deploy"

#### Method 2: Vercel Dashboard
1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Import `fuelrewards-backend`
5. Click "Deploy"

### Step 4: Add Environment Variables (2 minutes)

In Vercel Dashboard → Your Project → Settings → Environment Variables

Add these:

```
DB_HOST=<from-planetscale>
DB_USER=<from-planetscale>
DB_PASSWORD=<from-planetscale>
DB_NAME=fuelrewards
JWT_SECRET=fuelrewards_super_secret_key_2024_min_32_characters
NODE_ENV=production
```

**Click "Save"**

### Step 5: Import Database Schema

#### Using PlanetScale CLI:
```bash
# Install
brew install planetscale/tap/pscale

# Login
pscale auth login

# Connect
pscale connect fuelrewards main --port 3309

# In new terminal, import
mysql -h 127.0.0.1 -P 3309 -u root < database/schema.sql
```

#### Using MySQL Workbench:
1. Connect to your database
2. File → Run SQL Script
3. Select `database/schema.sql`
4. Execute

### Step 6: Redeploy (30 seconds)

In Vercel Dashboard:
1. Go to "Deployments"
2. Click "..." on latest
3. Click "Redeploy"

### Step 7: Test! 🎉

Your API is live at: `https://your-project.vercel.app`

Test it:
```bash
curl https://your-project.vercel.app/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "FuelRewards API is running"
}
```

---

## 🎯 What You Get

✅ **Live API** at `https://your-project.vercel.app`  
✅ **Automatic HTTPS** - Secure by default  
✅ **Auto-deploy** - Push to GitHub = Auto deploy  
✅ **Free hosting** - Vercel free tier  
✅ **Global CDN** - Fast worldwide  

---

## 📱 Next Steps

### 1. Test Your API

Import Postman collection:
- File: `postman/FuelRewards_API.postman_collection.json`
- Update base URL to: `https://your-project.vercel.app/api`

### 2. Create Admin Account

The default admin is already in database:
- Email: `admin@fuelrewards.com`
- Password: `admin123` (change this!)

Login:
```bash
curl -X POST https://your-project.vercel.app/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fuelrewards.com","password":"admin123"}'
```

### 3. Test Customer Flow

Send OTP:
```bash
curl -X POST https://your-project.vercel.app/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9876543210"}'
```

### 4. Build Frontend

Now that backend is live, build:
- React Admin Dashboard
- Customer Mobile App
- Sub-Admin Panel

---

## 🔧 Troubleshooting

### Database Connection Failed?
1. Check environment variables in Vercel
2. Verify database credentials
3. Ensure database schema is imported

### 500 Error?
```bash
# Check logs
vercel logs --follow
```

### Need Help?
- 📖 Read: [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md)
- 🐛 Create: [GitHub Issue](https://github.com/prakharmandloi/fuelrewards-backend/issues)
- 📧 Email: prakharmandloi22@gmail.com

---

## 💡 Pro Tips

1. **Custom Domain**: Add in Vercel → Settings → Domains
2. **Monitor**: Use Vercel Analytics (free)
3. **Logs**: `vercel logs --follow` for real-time logs
4. **Rollback**: Easy rollback to previous deployment
5. **Preview**: Every PR gets preview URL

---

## 🎉 You're Live!

Your FuelRewards API is now:
- ✅ Deployed on Vercel
- ✅ Connected to database
- ✅ Secured with HTTPS
- ✅ Ready for production

**Share your API URL and start building! 🚀**

---

## 📊 Free Tier Limits

**Vercel Free:**
- 100GB bandwidth/month
- Unlimited deployments
- Automatic SSL
- Perfect for testing & small projects

**PlanetScale Free:**
- 5GB storage
- 1 billion row reads/month
- Great for starting

**Need more?** Upgrade when you grow! 📈

---

**Total Time: ~5 minutes** ⚡  
**Cost: $0** 💰  
**Difficulty: Easy** 😊