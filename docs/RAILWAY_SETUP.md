# 🚂 Railway Deployment - Complete Guide

Railway is **BETTER than Vercel** for this project because it includes MySQL database!

## Why Railway?

✅ **Built-in MySQL** - No external database needed  
✅ **Free tier** - $5 free credit monthly  
✅ **Easier setup** - Database + API in one place  
✅ **No serverless limits** - Full Node.js support  
✅ **Auto-deploy** - GitHub integration  

---

## 🚀 Deploy to Railway (5 Minutes)

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Click "Login with GitHub"
3. Authorize Railway

### Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `fuelrewards-backend`
4. Click "Deploy Now"

### Step 3: Add MySQL Database

1. In your project, click "New"
2. Select "Database"
3. Choose "Add MySQL"
4. Wait for database to provision (~30 seconds)

### Step 4: Get Database Credentials

1. Click on the **MySQL** service
2. Go to "Variables" tab
3. You'll see:
   ```
   MYSQL_URL=mysql://root:password@host:port/railway
   MYSQLHOST=containers-us-west-xxx.railway.app
   MYSQLPORT=6379
   MYSQLUSER=root
   MYSQLPASSWORD=xxxxx
   MYSQLDATABASE=railway
   ```

### Step 5: Add Environment Variables

1. Click on your **fuelrewards-backend** service (not MySQL)
2. Go to "Variables" tab
3. Click "New Variable"
4. Add these one by one:

```env
DB_HOST=${{MySQL.MYSQLHOST}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
DB_PORT=${{MySQL.MYSQLPORT}}
JWT_SECRET=fuelrewards_super_secret_key_2024_minimum_32_characters
NODE_ENV=production
PORT=3000
```

**Note:** Railway auto-fills `${{MySQL.VARIABLE}}` references!

### Step 6: Import Database Schema

#### Method A: Using Railway CLI (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Connect to MySQL
railway connect MySQL

# You're now in MySQL shell, run:
source database/schema.sql
exit
```

#### Method B: Using MySQL Workbench

1. Get credentials from Railway MySQL Variables
2. Open MySQL Workbench
3. New Connection:
   - **Host**: `MYSQLHOST` value
   - **Port**: `MYSQLPORT` value
   - **Username**: `MYSQLUSER` value
   - **Password**: `MYSQLPASSWORD` value
4. Connect
5. File → Run SQL Script → Select `database/schema.sql`
6. Execute

#### Method C: Using Railway Web Terminal

1. Click on MySQL service
2. Click "Data" tab
3. Click "Query"
4. Copy-paste contents of `database/schema.sql`
5. Click "Run"

### Step 7: Deploy!

Railway auto-deploys when you push to GitHub!

Your API will be live at:
```
https://fuelrewards-backend-production.up.railway.app
```

---

## ✅ Test Your Deployment

```bash
# Health check
curl https://your-app.up.railway.app/health

# Send OTP
curl -X POST https://your-app.up.railway.app/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9876543210"}'
```

---

## 🔧 Railway CLI Commands

```bash
# Install
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# View logs
railway logs

# Connect to MySQL
railway connect MySQL

# Run locally with Railway env
railway run npm start

# Deploy manually
railway up
```

---

## 💰 Pricing

**Free Tier:**
- $5 credit per month
- ~500 hours of usage
- Perfect for development & small projects

**Pro Plan ($20/month):**
- $20 credit included
- Pay only for what you use
- Better for production

---

## 🎯 Advantages Over Vercel

| Feature | Railway | Vercel |
|---------|---------|--------|
| MySQL Included | ✅ Yes | ❌ No (need external) |
| Setup Complexity | ⭐ Easy | ⭐⭐ Medium |
| Serverless Limits | ✅ None | ⚠️ 10s timeout |
| Database Connection | ✅ Persistent | ⚠️ Pooling needed |
| Free Tier | ✅ $5/month | ✅ 100GB bandwidth |
| Best For | Full-stack apps | Frontend/Serverless |

---

## 🔄 Auto-Deploy Setup

Railway automatically deploys when you push to GitHub!

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Railway auto-deploys! 🚀
```

---

## 📊 Monitor Your App

### View Logs
```bash
railway logs --follow
```

### View Metrics
1. Go to Railway dashboard
2. Click your service
3. See CPU, Memory, Network usage

### Database Metrics
1. Click MySQL service
2. View connections, queries, storage

---

## 🆘 Troubleshooting

### Database Connection Failed

**Check environment variables:**
```bash
railway variables
```

**Test database connection:**
```bash
railway connect MySQL
# If connects, database is fine
```

### App Not Starting

**View logs:**
```bash
railway logs
```

**Common issues:**
- Missing environment variables
- Database schema not imported
- Port configuration (Railway auto-assigns)

### Import Schema Failed

**Try Railway CLI method:**
```bash
railway connect MySQL
source database/schema.sql
```

---

## 🎉 You're Live!

Your FuelRewards API is now running on Railway with:
- ✅ MySQL database included
- ✅ Auto-deploy from GitHub
- ✅ HTTPS enabled
- ✅ Environment variables configured
- ✅ Logs and monitoring

**API URL:** `https://your-app.up.railway.app`

---

## 📱 Next Steps

1. **Test all endpoints** with Postman
2. **Change admin password**
3. **Add SMS API key** (optional)
4. **Build frontend** applications
5. **Monitor usage** in Railway dashboard

---

## 💡 Pro Tips

1. **Custom Domain**: Add in Railway Settings → Domains
2. **Database Backups**: Railway Pro includes automated backups
3. **Scaling**: Railway auto-scales based on usage
4. **Logs**: Keep logs tab open during development
5. **Local Development**: Use `railway run npm start` to test with production env

---

## 🔗 Useful Links

- **Railway Dashboard**: https://railway.app/dashboard
- **Railway Docs**: https://docs.railway.app
- **Railway CLI**: https://docs.railway.app/develop/cli
- **Support**: https://railway.app/help

---

**Railway is the BEST choice for FuelRewards! 🚂**