# 🚀 Deployment Guide - FuelRewards

Complete deployment guide for various platforms.

## 📋 Pre-Deployment Checklist

- [ ] Database schema imported
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] API tested locally
- [ ] SMS service configured (optional)
- [ ] Admin account created

---

## 🌐 Option 1: Railway Deployment

Railway offers free tier with MySQL database included.

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway
```bash
railway login
```

### Step 3: Initialize Project
```bash
railway init
```

### Step 4: Add MySQL Database
```bash
railway add mysql
```

### Step 5: Set Environment Variables
```bash
railway variables set JWT_SECRET=your_secret_key
railway variables set FAST2SMS_API_KEY=your_api_key
railway variables set NODE_ENV=production
```

### Step 6: Deploy
```bash
railway up
```

### Step 7: Import Database Schema
```bash
# Get database credentials
railway variables

# Connect and import
mysql -h <host> -u <user> -p<password> <database> < database/schema.sql
```

### Step 8: Get Deployment URL
```bash
railway domain
```

**Cost:** Free tier available  
**Database:** MySQL included  
**SSL:** Automatic

---

## 🎨 Option 2: Render Deployment

Render offers free tier with PostgreSQL (can use MySQL with paid plan).

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Create Render Account
Visit [render.com](https://render.com) and sign up.

### Step 3: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name:** fuelrewards-api
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

### Step 4: Add Environment Variables
In Render dashboard, add:
```
DB_HOST=<your_mysql_host>
DB_USER=<your_mysql_user>
DB_PASSWORD=<your_mysql_password>
DB_NAME=fuelrewards
JWT_SECRET=<your_secret>
FAST2SMS_API_KEY=<your_key>
NODE_ENV=production
PORT=3000
```

### Step 5: Deploy
Click "Create Web Service" - automatic deployment starts.

### Step 6: Setup Database
Use external MySQL service (PlanetScale, AWS RDS, etc.)

**Cost:** Free tier available  
**Auto-deploy:** On git push  
**SSL:** Automatic

---

## ☁️ Option 3: AWS EC2 Deployment

Full control with AWS infrastructure.

### Step 1: Launch EC2 Instance
1. Login to AWS Console
2. Launch Ubuntu 22.04 LTS instance
3. Configure security group:
   - Port 22 (SSH)
   - Port 3000 (API)
   - Port 3306 (MySQL)

### Step 2: Connect to Instance
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### Step 3: Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server

# Install PM2
sudo npm install -g pm2
```

### Step 4: Setup MySQL
```bash
sudo mysql_secure_installation

# Create database
sudo mysql -u root -p
CREATE DATABASE fuelrewards;
CREATE USER 'fueluser'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON fuelrewards.* TO 'fueluser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 5: Clone Repository
```bash
cd /var/www
sudo git clone https://github.com/prakharmandloi/fuelrewards-backend.git
cd fuelrewards-backend
sudo npm install
```

### Step 6: Configure Environment
```bash
sudo nano .env
```

Add your configuration:
```env
DB_HOST=localhost
DB_USER=fueluser
DB_PASSWORD=secure_password
DB_NAME=fuelrewards
JWT_SECRET=your_secret_key
FAST2SMS_API_KEY=your_api_key
PORT=3000
NODE_ENV=production
```

### Step 7: Import Database
```bash
mysql -u fueluser -p fuelrewards < database/schema.sql
```

### Step 8: Start with PM2
```bash
pm2 start server.js --name fuelrewards
pm2 save
pm2 startup
```

### Step 9: Setup Nginx (Optional)
```bash
sudo apt install -y nginx

sudo nano /etc/nginx/sites-available/fuelrewards
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/fuelrewards /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Cost:** ~$5-10/month  
**Control:** Full  
**Scalability:** High

---

## 🐳 Option 4: Docker Deployment

Containerized deployment for any platform.

### Step 1: Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Step 2: Create docker-compose.yml
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=mysql
      - DB_USER=root
      - DB_PASSWORD=rootpassword
      - DB_NAME=fuelrewards
      - JWT_SECRET=your_secret_key
      - NODE_ENV=production
    depends_on:
      - mysql
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
      - MYSQL_DATABASE=fuelrewards
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    ports:
      - "3306:3306"
    restart: unless-stopped

volumes:
  mysql_data:
```

### Step 3: Build and Run
```bash
docker-compose up -d
```

### Step 4: View Logs
```bash
docker-compose logs -f
```

**Portability:** Excellent  
**Consistency:** High  
**Deployment:** Any platform

---

## 🌍 Option 5: DigitalOcean App Platform

Simple deployment with managed database.

### Step 1: Create Account
Visit [digitalocean.com](https://digitalocean.com)

### Step 2: Create App
1. Click "Create" → "Apps"
2. Connect GitHub repository
3. Configure:
   - **Type:** Web Service
   - **Branch:** main
   - **Build Command:** `npm install`
   - **Run Command:** `npm start`

### Step 3: Add Database
1. Add "Database" component
2. Select MySQL
3. Note credentials

### Step 4: Set Environment Variables
Add in App Platform dashboard:
```
DB_HOST=<from_database_component>
DB_USER=<from_database_component>
DB_PASSWORD=<from_database_component>
DB_NAME=fuelrewards
JWT_SECRET=your_secret_key
FAST2SMS_API_KEY=your_api_key
NODE_ENV=production
```

### Step 5: Deploy
Click "Create Resources"

**Cost:** $5/month (basic)  
**Database:** Managed MySQL  
**SSL:** Automatic

---

## 🔒 Production Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Regular database backups
- [ ] Monitor error logs
- [ ] Keep dependencies updated
- [ ] Use environment variables (never commit .env)

---

## 📊 Monitoring & Maintenance

### PM2 Monitoring
```bash
pm2 monit
pm2 logs fuelrewards
pm2 restart fuelrewards
```

### Database Backup
```bash
# Backup
mysqldump -u root -p fuelrewards > backup_$(date +%Y%m%d).sql

# Restore
mysql -u root -p fuelrewards < backup_20240115.sql
```

### Update Application
```bash
git pull origin main
npm install
pm2 restart fuelrewards
```

---

## 🆘 Troubleshooting

### Database Connection Failed
```bash
# Check MySQL status
sudo systemctl status mysql

# Restart MySQL
sudo systemctl restart mysql

# Check credentials in .env
```

### Port Already in Use
```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>
```

### PM2 Not Starting
```bash
# Check logs
pm2 logs fuelrewards --lines 100

# Delete and restart
pm2 delete fuelrewards
pm2 start server.js --name fuelrewards
```

---

## 📞 Support

For deployment issues:
- Check logs first
- Review environment variables
- Verify database connection
- Contact: prakharmandloi22@gmail.com

---

**Happy Deploying! 🚀**