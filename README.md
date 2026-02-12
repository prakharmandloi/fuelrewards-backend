# 🚀 FuelRewards - Petrol Pump Loyalty System

A complete loyalty management system for petrol pumps with billing, rewards, and customer engagement.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![MySQL](https://img.shields.io/badge/mysql-%3E%3D8.0-orange.svg)

## ✨ Features

### 🎯 Core Functionality
- ✅ **OTP-based Customer Login** - Secure, password-less authentication
- ✅ **Admin/Sub-Admin Management** - Role-based access control
- ✅ **Fuel Billing System** - Track petrol & diesel sales
- ✅ **Automatic Reward Points** - Smart calculation based on purchase
- ✅ **Customer Reward Wallet** - Digital points management
- ✅ **SMS Notifications** - Real-time customer updates
- ✅ **Product Redemption Store** - Redeem points for products
- ✅ **Fuel Discount Redemption** - 50% discount on fuel
- ✅ **Analytics Dashboard** - Comprehensive business insights
- ✅ **Transaction History** - Complete audit trail

### 👥 User Roles

| Role | Access Level | Capabilities |
|------|-------------|--------------|
| **Admin** | Full Control | All system operations, analytics, settings |
| **Sub-Admin** | Limited (Max 2) | Add bills, assign points, view history |
| **Customer** | Personal Only | View points, redeem rewards, transaction history |

## 🛠 Tech Stack

- **Backend**: Node.js + Express.js
- **Database**: MySQL 8.0+
- **Authentication**: JWT + OTP
- **SMS**: Fast2SMS / MSG91 (configurable)
- **Security**: bcrypt password hashing
- **Deployment**: Vercel / Railway / AWS

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/prakharmandloi/fuelrewards-backend)

### One-Click Deployment Steps:

1. **Click the button above**
2. **Sign in to Vercel** with GitHub
3. **Create external MySQL database** (PlanetScale recommended)
4. **Add environment variables** in Vercel:
   ```
   DB_HOST=your-database-host
   DB_USER=your-database-user
   DB_PASSWORD=your-database-password
   DB_NAME=fuelrewards
   JWT_SECRET=your-secret-key-min-32-chars
   NODE_ENV=production
   ```
5. **Deploy!** 🎉

📖 **Detailed Guide:** [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md)

---

## 📦 Local Installation

### Prerequisites
- Node.js >= 14.0.0
- MySQL >= 8.0
- npm or yarn

### Step 1: Clone Repository
```bash
git clone https://github.com/prakharmandloi/fuelrewards-backend.git
cd fuelrewards-backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=fuelrewards
JWT_SECRET=your_secret_key_here
FAST2SMS_API_KEY=your_api_key
PORT=3000
```

### Step 4: Setup Database
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE fuelrewards;

# Import schema
mysql -u root -p fuelrewards < database/schema.sql
```

### Step 5: Start Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will run at: `http://localhost:3000`

---

## 🌐 Deployment Options

### Option 1: Vercel (Serverless)
**Best for:** Quick deployment, automatic scaling
```bash
npm install -g vercel
vercel login
vercel
```
📖 [Complete Vercel Guide](docs/VERCEL_DEPLOYMENT.md)

### Option 2: Railway (Recommended for MySQL)
**Best for:** Full-stack apps with database
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```
📖 [Railway Deployment Guide](docs/DEPLOYMENT.md#option-1-railway-deployment)

### Option 3: AWS EC2
**Best for:** Full control, custom configuration
📖 [AWS Deployment Guide](docs/DEPLOYMENT.md#option-3-aws-ec2-deployment)

### Option 4: Docker
**Best for:** Containerized deployment
```bash
docker-compose up -d
```
📖 [Docker Guide](docs/DEPLOYMENT.md#option-4-docker-deployment)

---

## 🔌 API Endpoints

### Authentication

#### Send OTP
```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "mobile": "9876543210"
}
```

#### Verify OTP & Login
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "mobile": "9876543210",
  "otp": "123456"
}
```

#### Admin Login
```http
POST /api/auth/admin-login
Content-Type: application/json

{
  "email": "admin@fuelrewards.com",
  "password": "admin123"
}
```

### Bills

#### Create Bill
```http
POST /api/bills
Authorization: Bearer <token>
Content-Type: application/json

{
  "bill_no": "BILL001",
  "mobile": "9876543210",
  "fuel_type": "petrol",
  "quantity": 10,
  "amount": 1000,
  "fuel_density": 0.75
}
```

### Rewards

#### Get Wallet
```http
GET /api/rewards/wallet/9876543210
Authorization: Bearer <token>
```

#### Redeem for Fuel Discount
```http
POST /api/rewards/redeem/fuel
Authorization: Bearer <token>
Content-Type: application/json

{
  "mobile": "9876543210",
  "bill_no": "BILL002",
  "fuel_amount": 500
}
```

📖 **Complete API Documentation:** [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)

---

## 🎯 Reward Logic

### Points Calculation
- **Base Rule**: ₹300 = 1 point
- **Petrol Bonus**: +20% for high-quality fuel (density ≥ 0.75)
- **Diesel Bonus**: +2 points for purchases ≥ ₹500
- **Minimum**: ₹300 purchase required

### Redemption Rules
- **Threshold**: 150 points minimum
- **Fuel Discount**: 50% off on fuel purchase
- **Products**: Various items with different point values

---

## 📊 Database Schema

### Core Tables
- `users` - Customer, Admin, Sub-Admin accounts
- `bills` - Fuel purchase transactions
- `reward_wallet` - Customer points balance
- `products` - Reward store items
- `redemptions` - Redemption history
- `otp_logs` - OTP verification records
- `notifications` - Customer notifications
- `activity_logs` - Admin activity tracking
- `system_settings` - Configurable parameters

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Password hashing with bcrypt
- ✅ OTP verification (5-minute expiry)
- ✅ Transaction logging
- ✅ Admin activity tracking

---

## 📱 SMS Integration

### Fast2SMS Setup
1. Get API key from [Fast2SMS](https://www.fast2sms.com/)
2. Add to `.env`: `FAST2SMS_API_KEY=your_key`
3. Uncomment SMS code in:
   - `utils/otp.js`
   - `utils/notifications.js`

---

## 🧪 Testing

### Using Postman
1. Import collection: `postman/FuelRewards_API.postman_collection.json`
2. Set base URL: `http://localhost:3000/api`
3. Test all endpoints

### Manual Testing
```bash
# Health check
curl http://localhost:3000/health

# Send OTP
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile":"9876543210"}'
```

---

## 📈 Future Enhancements

- [ ] QR code billing
- [ ] Mobile app (React Native)
- [ ] AI-based customer offers
- [ ] Dynamic reward rules
- [ ] Multi-pump support
- [ ] Advanced analytics
- [ ] Email notifications
- [ ] Loyalty tiers (Bronze, Silver, Gold)

---

## 📚 Documentation

- **[API Documentation](docs/API_DOCUMENTATION.md)** - Complete API reference
- **[Vercel Deployment](docs/VERCEL_DEPLOYMENT.md)** - Deploy to Vercel
- **[General Deployment](docs/DEPLOYMENT.md)** - Railway, AWS, Docker guides
- **[Postman Collection](postman/)** - Ready-to-use API tests

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Prakhar Mandloi**
- GitHub: [@prakharmandloi](https://github.com/prakharmandloi)
- Email: prakharmandloi22@gmail.com

---

## 🙏 Acknowledgments

- Express.js team for the amazing framework
- MySQL community for robust database
- Fast2SMS for SMS services
- Vercel for serverless deployment

---

## 📞 Support

For issues and questions:
- 📖 Check [Documentation](docs/)
- 🐛 Create [GitHub Issue](https://github.com/prakharmandloi/fuelrewards-backend/issues)
- 📧 Email: prakharmandloi22@gmail.com

---

### Quick Start Commands

```bash
# Clone & Install
git clone https://github.com/prakharmandloi/fuelrewards-backend.git
cd fuelrewards-backend
npm install

# Setup Database
mysql -u root -p fuelrewards < database/schema.sql

# Configure
cp .env.example .env
# Edit .env with your settings

# Run
npm run dev

# Deploy to Vercel
vercel
```

---

## 🎉 Live Demo

**API Base URL:** `https://fuelrewards-backend.vercel.app`

**Test Endpoints:**
- Health: `https://fuelrewards-backend.vercel.app/health`
- API Info: `https://fuelrewards-backend.vercel.app/`

---

**Built with ❤️ for modern petrol pump management**