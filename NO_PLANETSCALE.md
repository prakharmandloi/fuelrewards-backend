# ⚡ Can't Get PlanetScale? Use Railway Instead!

## 🚂 Railway is BETTER for This Project!

Railway includes **MySQL database** with your app - no external setup needed!

---

## 🚀 Deploy to Railway (3 Minutes)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Click "Login with GitHub"
3. Authorize Railway

### Step 2: Deploy Your App
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `fuelrewards-backend`
4. Click "Deploy Now"

### Step 3: Add MySQL Database
1. In your project, click "New"
2. Select "Database"
3. Choose "Add MySQL"
4. Wait 30 seconds for provisioning

### Step 4: Connect Database to App
1. Click on **fuelrewards-backend** service (not MySQL)
2. Go to "Variables" tab
3. Add these variables:

```env
DB_HOST=${{MySQL.MYSQLHOST}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
JWT_SECRET=fuelrewards_super_secret_key_2024_minimum_32_characters
NODE_ENV=production
```

**Railway auto-fills the MySQL variables!** ✨

### Step 5: Import Database Schema

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Connect to MySQL
railway connect MySQL

# Import schema (you're now in MySQL shell)
source database/schema.sql
exit
```

### Step 6: Done! 🎉

Your API is live at:
```
https://fuelrewards-backend-production.up.railway.app
```

Test it:
```bash
curl https://your-app.up.railway.app/health
```

---

## ✅ Why Railway is Better

| Feature | Railway | Vercel + PlanetScale |
|---------|---------|---------------------|
| Setup Steps | 3 | 5+ |
| Database Included | ✅ Yes | ❌ No (external) |
| Free Tier | $5 credit/month | Need both services |
| Complexity | ⭐ Easy | ⭐⭐⭐ Complex |
| MySQL Connection | ✅ Direct | ⚠️ Needs pooling |
| Best For | Full-stack apps | Serverless |

---

## 💰 Pricing

**Railway Free Tier:**
- $5 credit per month
- ~500 hours of usage
- MySQL database included
- Perfect for development & small projects

**When you need more:**
- Pro plan: $20/month
- Pay only for what you use

---

## 🔧 Alternative: Local MySQL

For local development:

### Mac:
```bash
brew install mysql
brew services start mysql
mysql -u root -p fuelrewards < database/schema.sql
```

### Windows:
1. Download from https://dev.mysql.com/downloads/installer/
2. Install MySQL
3. Import schema using MySQL Workbench

### Linux:
```bash
sudo apt install mysql-server
mysql -u root -p fuelrewards < database/schema.sql
```

---

## 📚 More Options

See **[docs/DATABASE_OPTIONS.md](docs/DATABASE_OPTIONS.md)** for:
- Aiven MySQL (free tier)
- Supabase (PostgreSQL)
- ElephantSQL (PostgreSQL)
- And more!

---

## 🆘 Need Help?

1. **Railway Guide**: [docs/RAILWAY_SETUP.md](docs/RAILWAY_SETUP.md)
2. **Database Options**: [docs/DATABASE_OPTIONS.md](docs/DATABASE_OPTIONS.md)
3. **Create Issue**: https://github.com/prakharmandloi/fuelrewards-backend/issues
4. **Email**: prakharmandloi22@gmail.com

---

## 🎯 Recommended Path

1. **Start with Railway** - Easiest setup
2. **Test locally** with Local MySQL (optional)
3. **Deploy to production** on Railway
4. **Build frontend** and connect to your API

---

**Railway makes it simple - database + app in one place! 🚂**