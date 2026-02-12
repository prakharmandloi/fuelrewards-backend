# 📚 FuelRewards API Documentation

Complete API reference for FuelRewards Petrol Pump Loyalty System.

## Base URL
```
http://localhost:3000/api
```

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### 1. Send OTP (Customer Login)
Send OTP to customer's mobile number.

**Endpoint:** `POST /auth/send-otp`

**Request Body:**
```json
{
  "mobile": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresIn": 300
}
```

**Errors:**
- `400` - Invalid mobile number
- `500` - Failed to send OTP

---

### 2. Verify OTP
Verify OTP and get authentication token.

**Endpoint:** `POST /auth/verify-otp`

**Request Body:**
```json
{
  "mobile": "9876543210",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "mobile": "9876543210",
    "role": "customer"
  }
}
```

**Errors:**
- `400` - Invalid or expired OTP
- `500` - Verification failed

---

### 3. Admin Login
Login for Admin and Sub-Admin users.

**Endpoint:** `POST /auth/admin-login`

**Request Body:**
```json
{
  "email": "admin@fuelrewards.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@fuelrewards.com",
    "role": "admin"
  }
}
```

**Errors:**
- `401` - Invalid credentials
- `500` - Login failed

---

## 🧾 Bill Management

### 1. Create Bill
Create new fuel purchase bill and assign reward points.

**Endpoint:** `POST /bills`  
**Auth Required:** Admin or Sub-Admin

**Request Body:**
```json
{
  "bill_no": "BILL001",
  "mobile": "9876543210",
  "fuel_type": "petrol",
  "quantity": 10.5,
  "amount": 1050,
  "fuel_density": 0.75
}
```

**Parameters:**
- `bill_no` (string, required) - Unique bill number
- `mobile` (string, required) - Customer mobile (10 digits)
- `fuel_type` (enum, required) - "petrol" or "diesel"
- `quantity` (decimal, optional) - Fuel quantity in liters
- `amount` (decimal, required) - Bill amount in ₹
- `fuel_density` (decimal, optional) - Fuel density for quality bonus

**Response:**
```json
{
  "success": true,
  "message": "Bill created successfully",
  "data": {
    "bill_no": "BILL001",
    "points_earned": 3,
    "total_points": 153
  }
}
```

**Errors:**
- `400` - Minimum purchase amount not met / Duplicate bill number
- `401` - Unauthorized
- `403` - Admin/Sub-admin access required
- `500` - Failed to create bill

---

### 2. Get Bill History
Retrieve customer's bill history with pagination.

**Endpoint:** `GET /bills/history/:mobile`  
**Auth Required:** Yes

**Query Parameters:**
- `page` (number, optional) - Page number (default: 1)
- `limit` (number, optional) - Items per page (default: 10)

**Example:**
```
GET /bills/history/9876543210?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "bill_no": "BILL001",
      "mobile": "9876543210",
      "fuel_type": "petrol",
      "quantity": 10.5,
      "amount": 1050,
      "points_earned": 3,
      "created_at": "2024-01-15T10:30:00Z",
      "customer_name": "John Doe"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```

---

## 🎁 Rewards Management

### 1. Get Customer Wallet
Retrieve customer's reward points balance.

**Endpoint:** `GET /rewards/wallet/:mobile`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 5,
    "total_points": 500,
    "redeemed_points": 150,
    "available_points": 350,
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### 2. Redeem Points for Fuel Discount
Redeem reward points for fuel discount.

**Endpoint:** `POST /rewards/redeem/fuel`  
**Auth Required:** Admin or Sub-Admin

**Request Body:**
```json
{
  "mobile": "9876543210",
  "bill_no": "BILL002",
  "fuel_amount": 500
}
```

**Response:**
```json
{
  "success": true,
  "message": "Points redeemed successfully",
  "data": {
    "points_used": 150,
    "discount_amount": 250,
    "remaining_points": 200
  }
}
```

**Business Logic:**
- Minimum 150 points required
- 50% discount on fuel amount
- Points deducted from wallet
- SMS notification sent

**Errors:**
- `400` - Insufficient points
- `404` - Customer not found

---

### 3. Redeem Points for Product
Redeem points for products from reward store.

**Endpoint:** `POST /rewards/redeem/product`  
**Auth Required:** Yes (Customer)

**Request Body:**
```json
{
  "product_id": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product redeemed successfully",
  "data": {
    "product_name": "Castrol Engine Oil 1L",
    "points_used": 200,
    "remaining_points": 150
  }
}
```

**Errors:**
- `400` - Insufficient points / Out of stock
- `404` - Product not found

---

### 4. Get Redemption History
Retrieve customer's redemption history.

**Endpoint:** `GET /rewards/history/:userId`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "redemption_type": "fuel_discount",
      "points_used": 150,
      "discount_amount": 250,
      "bill_no": "BILL002",
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "redemption_type": "product",
      "product_id": 1,
      "product_name": "Castrol Engine Oil",
      "category": "engine_oil",
      "points_used": 200,
      "created_at": "2024-01-14T15:20:00Z"
    }
  ]
}
```

---

## 👥 Customer Management

### 1. List All Customers
Get paginated list of all customers (Admin only).

**Endpoint:** `GET /customers`  
**Auth Required:** Admin

**Query Parameters:**
- `page` (number) - Page number
- `limit` (number) - Items per page
- `search` (string) - Search by mobile or name

**Example:**
```
GET /customers?page=1&limit=20&search=987
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "name": "John Doe",
      "mobile": "9876543210",
      "total_points": 500,
      "available_points": 350,
      "redeemed_points": 150,
      "total_purchases": 25,
      "total_spent": 12500,
      "last_purchase": "2024-01-15T10:30:00Z",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
```

---

### 2. Get Customer Profile
Get detailed customer profile.

**Endpoint:** `GET /customers/:id`  
**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "John Doe",
    "mobile": "9876543210",
    "total_points": 500,
    "available_points": 350,
    "redeemed_points": 150,
    "total_purchases": 25,
    "total_spent": 12500,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

## 🎛 Admin Dashboard

### 1. Get Dashboard Analytics
Comprehensive business analytics (Admin only).

**Endpoint:** `GET /admin/dashboard`  
**Auth Required:** Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "sales": {
      "total_sales": 125000,
      "total_bills": 450
    },
    "fuelSales": [
      {
        "fuel_type": "petrol",
        "total": 75000,
        "count": 280
      },
      {
        "fuel_type": "diesel",
        "total": 50000,
        "count": 170
      }
    ],
    "rewardStats": {
      "total_issued": 5000,
      "total_redeemed": 1500,
      "total_available": 3500
    },
    "activeCustomers": 120,
    "recentBills": [...],
    "monthlySales": [
      {
        "month": "2024-01",
        "total": 45000,
        "count": 150
      }
    ]
  }
}
```

---

### 2. Create Sub-Admin
Create new sub-admin user (Admin only).

**Endpoint:** `POST /admin/sub-admin`  
**Auth Required:** Admin

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "mobile": "9876543211",
  "password": "secure123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sub-admin created successfully"
}
```

**Errors:**
- `400` - Maximum sub-admin limit reached (2)

---

### 3. Get System Settings
Retrieve all system settings (Admin only).

**Endpoint:** `GET /admin/settings`  
**Auth Required:** Admin

**Response:**
```json
{
  "success": true,
  "data": {
    "min_purchase_amount": "300",
    "redemption_threshold": "150",
    "fuel_discount_percentage": "50",
    "points_per_300": "1",
    "max_sub_admins": "2"
  }
}
```

---

### 4. Update System Settings
Update system configuration (Admin only).

**Endpoint:** `PUT /admin/settings`  
**Auth Required:** Admin

**Request Body:**
```json
{
  "min_purchase_amount": "350",
  "redemption_threshold": "200",
  "fuel_discount_percentage": "60"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Settings updated successfully"
}
```

---

## 🛍 Product Management

### 1. List Products
Get all products from reward store.

**Endpoint:** `GET /products`  
**Auth Required:** Yes

**Query Parameters:**
- `category` (string, optional) - Filter by category
- `active` (boolean, optional) - Show only active products (default: true)

**Categories:**
- `engine_oil`
- `car_accessories`
- `bike_accessories`
- `cleaning`
- `coupons`
- `other`

**Example:**
```
GET /products?category=engine_oil&active=true
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Castrol Engine Oil 1L",
      "description": "Premium engine oil for better performance",
      "category": "engine_oil",
      "points_required": 200,
      "stock_quantity": 50,
      "is_active": true,
      "image_url": "https://example.com/image.jpg",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 2. Create Product
Add new product to reward store (Admin only).

**Endpoint:** `POST /products`  
**Auth Required:** Admin

**Request Body:**
```json
{
  "name": "Castrol Engine Oil 1L",
  "description": "Premium engine oil",
  "category": "engine_oil",
  "points_required": 200,
  "stock_quantity": 50,
  "image_url": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 1
  }
}
```

---

### 3. Update Product
Update existing product (Admin only).

**Endpoint:** `PUT /products/:id`  
**Auth Required:** Admin

**Request Body:**
```json
{
  "stock_quantity": 100,
  "points_required": 180,
  "is_active": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product updated successfully"
}
```

---

## 📊 Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## 🔄 Rate Limiting

Currently no rate limiting implemented. Recommended for production:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per user

---

## 📝 Notes

1. All timestamps are in ISO 8601 format (UTC)
2. Amounts are in Indian Rupees (₹)
3. Mobile numbers must be 10 digits
4. OTP expires in 5 minutes
5. JWT tokens expire in 30 days (customer) / 7 days (admin)

---

**Last Updated:** January 2024  
**API Version:** 1.0.0