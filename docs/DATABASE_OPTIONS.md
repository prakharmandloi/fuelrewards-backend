# 🗄️ Database Setup Options - Choose What Works for You

Can't get PlanetScale credentials? No problem! Here are **5 easy alternatives**.

---

## 🏆 **Option 1: Railway MySQL (RECOMMENDED)**

**Best for:** Complete beginners, fastest setup

### Why Railway?
✅ **All-in-one** - Database + API hosting together  
✅ **Free tier** - $5 credit/month  
✅ **Easiest** - No external database needed  
✅ **Auto-deploy** - GitHub integration  

### Quick Setup (3 minutes):

1. **Go to Railway**
   ```
   https://railway.app
   ```

2. **Login with GitHub**

3. **New Project → Deploy from GitHub**
   - Select `fuelrewards-backend`

4. **Add MySQL**
   - Click "New" → "Database" → "MySQL"

5. **Add Environment Variables**
   ```env
   DB_HOST=${{MySQL.MYSQLHOST}}
   DB_USER=${{MySQL.MYSQLUSER}}
   DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   DB_NAME=${{MySQL.MYSQLDATABASE}}
   JWT_SECRET=your_secret_key_here
   NODE_ENV=production
   ```

6. **Import Schema**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login
   railway login
   
   # Connect to MySQL
   railway connect MySQL
   
   # Import schema
   source database/schema.sql
   ```

**Done!** Your API is live with database! 🎉

📖 **Full Guide:** [docs/RAILWAY_SETUP.md](RAILWAY_SETUP.md)

---

## 💻 **Option 2: Local MySQL (For Development)**

**Best for:** Testing locally before deploying

### Setup:

#### On Mac:
```bash
# Install MySQL
brew install mysql

# Start MySQL
brew services start mysql

# Secure installation
mysql_secure_installation

# Create database
mysql -u root -p
CREATE DATABASE fuelrewards;
exit

# Import schema
mysql -u root -p fuelrewards < database/schema.sql
```

#### On Windows:
1. Download MySQL from https://dev.mysql.com/downloads/installer/
2. Install and set root password
3. Open MySQL Workbench
4. Create database: `CREATE DATABASE fuelrewards;`
5. File → Run SQL Script → Select `database/schema.sql`

#### On Linux:
```bash
# Install MySQL
sudo apt update
sudo apt install mysql-server

# Secure installation
sudo mysql_secure_installation

# Create database
sudo mysql
CREATE DATABASE fuelrewards;
CREATE USER 'fueluser'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON fuelrewards.* TO 'fueluser'@'localhost';
FLUSH PRIVILEGES;
exit

# Import schema
mysql -u fueluser -p fuelrewards < database/schema.sql
```

### Configure .env:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=fuelrewards
JWT_SECRET=your_secret_key
PORT=3000
```

### Run:
```bash
npm install
npm run dev
```

**Your API runs at:** `http://localhost:3000`

---

## ☁️ **Option 3: Aiven MySQL (Free Tier)**

**Best for:** Free cloud MySQL without credit card

### Setup:

1. **Create Account**
   ```
   https://aiven.io
   ```

2. **Create MySQL Service**
   - Click "Create Service"
   - Select "MySQL"
   - Choose free tier (Hobbyist)
   - Select region closest to you
   - Click "Create Service"

3. **Wait for Provisioning** (~2 minutes)

4. **Get Credentials**
   - Click on your MySQL service
   - Go to "Overview"
   - Copy connection details:
     - Host
     - Port
     - User
     - Password
     - Database

5. **Import Schema**
   ```bash
   mysql -h <host> -P <port> -u <user> -p<password> <database> < database/schema.sql
   ```

6. **Use with Vercel/Railway**
   - Add credentials as environment variables

**Free Tier:** 1 CPU, 1GB RAM, 5GB storage

---

## 🐘 **Option 4: ElephantSQL (PostgreSQL Alternative)**

**Note:** This requires converting MySQL to PostgreSQL

**Best for:** If you prefer PostgreSQL

### Setup:

1. **Create Account**
   ```
   https://www.elephantsql.com
   ```

2. **Create Instance**
   - Click "Create New Instance"
   - Name: `fuelrewards`
   - Plan: Tiny Turtle (Free)
   - Region: Choose closest
   - Click "Create"

3. **Get Connection URL**
   - Click on your instance
   - Copy "URL"

4. **Convert Schema** (MySQL → PostgreSQL)
   - Replace `AUTO_INCREMENT` with `SERIAL`
   - Replace `ENUM` with `VARCHAR` + CHECK constraints
   - Adjust data types

5. **Import Schema**
   ```bash
   psql <your-connection-url> < database/schema_postgres.sql
   ```

**Free Tier:** 20MB storage, 5 concurrent connections

---

## 🌊 **Option 5: Supabase (PostgreSQL + More)**

**Best for:** PostgreSQL with built-in features

### Setup:

1. **Create Account**
   ```
   https://supabase.com
   ```

2. **Create Project**
   - Click "New Project"
   - Name: `fuelrewards`
   - Database Password: (set strong password)
   - Region: Choose closest
   - Click "Create"

3. **Get Connection Details**
   - Go to Settings → Database
   - Copy connection string

4. **Import Schema**
   - Go to SQL Editor
   - Paste converted PostgreSQL schema
   - Run

**Free Tier:** 500MB database, 2GB bandwidth

---

## 📊 **Comparison Table**

| Option | Type | Free Tier | Setup Time | Best For |
|--------|------|-----------|------------|----------|
| **Railway** | MySQL | $5 credit/mo | 3 min | ⭐ Beginners |
| **Local MySQL** | MySQL | Unlimited | 5 min | Development |
| **Aiven** | MySQL | 5GB storage | 5 min | Cloud MySQL |
| **ElephantSQL** | PostgreSQL | 20MB | 10 min | PostgreSQL fans |
| **Supabase** | PostgreSQL | 500MB | 5 min | Extra features |

---

## 🎯 **My Recommendation**

### For Deployment:
**Use Railway** - It's the easiest and includes everything!

### For Local Development:
**Use Local MySQL** - Fast and no internet needed

### Workflow:
1. **Develop locally** with Local MySQL
2. **Deploy to Railway** for production
3. **Test with Postman** on both environments

---

## 🔧 **Quick Setup Commands**

### Railway (Recommended):
```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway init
railway add mysql
railway up
```

### Local MySQL:
```bash
# Mac
brew install mysql
brew services start mysql
mysql -u root -p fuelrewards < database/schema.sql

# Linux
sudo apt install mysql-server
mysql -u root -p fuelrewards < database/schema.sql
```

---

## 🆘 **Still Having Issues?**

### Can't install MySQL locally?
→ Use **Railway** (no local installation needed)

### Don't have credit card for cloud services?
→ Use **Aiven** (free without credit card)

### Want PostgreSQL instead?
→ Use **Supabase** or **ElephantSQL**

### Need help?
→ Create [GitHub Issue](https://github.com/prakharmandloi/fuelrewards-backend/issues)

---

## 📱 **Next Steps After Database Setup**

1. ✅ **Import schema** using one of the methods above
2. ✅ **Configure environment variables** in your deployment platform
3. ✅ **Test connection** with health endpoint
4. ✅ **Start building** your frontend!

---

## 💡 **Pro Tips**

1. **Start with Railway** - Easiest for beginners
2. **Use local MySQL** for development
3. **Keep credentials secure** - Never commit .env
4. **Backup regularly** - Export database periodically
5. **Monitor usage** - Check free tier limits

---

**Choose the option that works best for you and get started! 🚀**