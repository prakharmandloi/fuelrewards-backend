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

## 📦 Installation

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

#### Get Bill History
```http
GET /api/bills/history/9876543210?page=1&limit=10
Authorization: Bearer <token>
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

#### Redeem for Product
```http
POST /api/rewards/redeem/product
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_id": 1
}
```

### Admin

#### Dashboard Analytics
```http
GET /api/admin/dashboard
Authorization: Bearer <token>
```

#### Create Sub-Admin
```http
POST /api/admin/sub-admin
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "password": "secure123"
}
```

#### Get/Update Settings
```http
GET /api/admin/settings
Authorization: Bearer <token>

PUT /api/admin/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "min_purchase_amount": "300",
  "redemption_threshold": "150"
}
```

### Products

#### List Products
```http
GET /api/products?category=engine_oil&active=true
Authorization: Bearer <token>
```

#### Create Product
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Castrol Engine Oil",
  "description": "Premium engine oil",
  "category": "engine_oil",
  "points_required": 200,
  "stock_quantity": 50
}
```

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

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Password hashing with bcrypt
- ✅ OTP verification (5-minute expiry)
- ✅ Transaction logging
- ✅ Admin activity tracking

## 📱 SMS Integration

### Fast2SMS Setup
1. Get API key from [Fast2SMS](https://www.fast2sms.com/)
2. Add to `.env`: `FAST2SMS_API_KEY=your_key`
3. Uncomment SMS code in:
   - `utils/otp.js`
   - `utils/notifications.js`

## 🚀 Deployment

### Option 1: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Option 2: Render
1. Push to GitHub
2. Connect repository on Render
3. Add environment variables
4. Deploy

### Option 3: AWS/DigitalOcean
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name fuelrewards

# Save PM2 config
pm2 save
pm2 startup
```

## 📈 Future Enhancements

- [ ] QR code billing
- [ ] Mobile app (React Native)
- [ ] AI-based customer offers
- [ ] Dynamic reward rules
- [ ] Multi-pump support
- [ ] Advanced analytics
- [ ] Email notifications
- [ ] Loyalty tiers (Bronze, Silver, Gold)

## 🧪 Testing

```bash
# Install testing dependencies
npm install --save-dev jest supertest

# Run tests
npm test
```

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "error": "Error message here"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Prakhar Mandloi**
- GitHub: [@prakharmandloi](https://github.com/prakharmandloi)
- Email: prakharmandloi22@gmail.com

## 🙏 Acknowledgments

- Express.js team for the amazing framework
- MySQL community for robust database
- Fast2SMS for SMS services

---

**Built with ❤️ for modern petrol pump management**

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Email: prakharmandloi22@gmail.com

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
```

🎉 **Your FuelRewards API is ready!**