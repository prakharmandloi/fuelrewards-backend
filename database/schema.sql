-- FuelRewards Database Schema
-- Complete database structure for Petrol Pump Loyalty System

-- Create database
CREATE DATABASE IF NOT EXISTS fuelrewards;
USE fuelrewards;

-- Users Table (Admin, Sub-Admin, Customer)
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  mobile VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(100),
  password VARCHAR(255),
  role ENUM('admin', 'sub_admin', 'customer') DEFAULT 'customer',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_mobile (mobile),
  INDEX idx_role (role),
  INDEX idx_email (email)
);

-- OTP Logs Table
CREATE TABLE IF NOT EXISTS otp_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  mobile VARCHAR(15) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expiry_time TIMESTAMP NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_mobile_expiry (mobile, expiry_time)
);

-- Bills Table
CREATE TABLE IF NOT EXISTS bills (
  id INT PRIMARY KEY AUTO_INCREMENT,
  bill_no VARCHAR(50) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  mobile VARCHAR(15) NOT NULL,
  fuel_type ENUM('petrol', 'diesel') NOT NULL,
  quantity DECIMAL(10, 2),
  amount DECIMAL(10, 2) NOT NULL,
  fuel_density DECIMAL(5, 2),
  points_earned INT DEFAULT 0,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_bill_no (bill_no),
  INDEX idx_mobile (mobile),
  INDEX idx_created_at (created_at),
  INDEX idx_user_id (user_id)
);

-- Reward Wallet Table
CREATE TABLE IF NOT EXISTS reward_wallet (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL,
  total_points INT DEFAULT 0,
  redeemed_points INT DEFAULT 0,
  available_points INT DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_id (user_id)
);

-- Products Table (Reward Store)
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category ENUM('engine_oil', 'car_accessories', 'bike_accessories', 'cleaning', 'coupons', 'other') NOT NULL,
  points_required INT NOT NULL,
  stock_quantity INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_active (is_active)
);

-- Redemption History Table
CREATE TABLE IF NOT EXISTS redemptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  redemption_type ENUM('fuel_discount', 'product') NOT NULL,
  product_id INT,
  points_used INT NOT NULL,
  discount_amount DECIMAL(10, 2),
  bill_no VARCHAR(50),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);

-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(50) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  type ENUM('points_earned', 'redemption', 'threshold_reached', 'general') NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  sent_via ENUM('sms', 'app', 'both') DEFAULT 'both',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read)
);

-- Activity Logs Table (Admin tracking)
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  details TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);

-- Insert Default System Settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('min_purchase_amount', '300', 'Minimum purchase amount to earn points'),
('redemption_threshold', '150', 'Minimum points required for redemption'),
('fuel_discount_percentage', '50', 'Discount percentage on fuel redemption'),
('points_per_300', '1', 'Base points for ₹300 purchase'),
('max_sub_admins', '2', 'Maximum number of sub-admins allowed')
ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value);

-- Insert Default Admin User (password: admin123)
INSERT INTO users (name, mobile, email, password, role) VALUES
('Admin', '9999999999', 'admin@fuelrewards.com', '$2a$10$YourHashedPasswordHere', 'admin')
ON DUPLICATE KEY UPDATE role='admin';

-- Insert Sample Products
INSERT INTO products (name, description, category, points_required, stock_quantity, is_active) VALUES
('Castrol Engine Oil 1L', 'Premium engine oil for better performance', 'engine_oil', 200, 50, TRUE),
('Car Air Freshener', 'Long-lasting car fragrance', 'car_accessories', 50, 100, TRUE),
('Bike Chain Lubricant', 'High-quality chain lube', 'bike_accessories', 75, 80, TRUE),
('Car Wash Shampoo', 'Professional car cleaning solution', 'cleaning', 100, 60, TRUE),
('₹500 Fuel Coupon', 'Discount coupon for fuel purchase', 'coupons', 300, 20, TRUE)
ON DUPLICATE KEY UPDATE name=VALUES(name);