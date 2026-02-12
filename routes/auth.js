const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { generateOTP, sendOTP } = require('../utils/otp');

// Generate OTP for customer login
router.post('/send-otp', async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile || mobile.length !== 10) {
      return res.status(400).json({ error: 'Valid 10-digit mobile number required' });
    }

    // Generate 6-digit OTP
    const otp = generateOTP();
    const expiryTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Check if user exists, if not create customer account
    const [users] = await db.query('SELECT id FROM users WHERE mobile = ?', [mobile]);
    
    if (users.length === 0) {
      await db.query(
        'INSERT INTO users (mobile, role) VALUES (?, ?)',
        [mobile, 'customer']
      );
    }

    // Store OTP
    await db.query(
      'INSERT INTO otp_logs (mobile, otp, expiry_time) VALUES (?, ?, ?)',
      [mobile, otp, expiryTime]
    );

    // Send OTP via SMS
    await sendOTP(mobile, otp);

    res.json({ 
      success: true, 
      message: 'OTP sent successfully',
      expiresIn: 300 // seconds
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Verify OTP and login
router.post('/verify-otp', async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    // Verify OTP
    const [otpLogs] = await db.query(
      'SELECT * FROM otp_logs WHERE mobile = ? AND otp = ? AND expiry_time > NOW() AND is_verified = FALSE ORDER BY created_at DESC LIMIT 1',
      [mobile, otp]
    );

    if (otpLogs.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Mark OTP as verified
    await db.query(
      'UPDATE otp_logs SET is_verified = TRUE WHERE id = ?',
      [otpLogs[0].id]
    );

    // Get user details
    const [users] = await db.query(
      'SELECT id, name, mobile, role FROM users WHERE mobile = ?',
      [mobile]
    );

    const user = users[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, mobile: user.mobile, role: user.role },
      process.env.JWT_SECRET || 'fuelrewards_secret_key',
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        mobile: user.mobile,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Admin/Sub-Admin login with email & password
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get admin user
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ? AND role IN ("admin", "sub_admin")',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fuelrewards_secret_key',
      { expiresIn: '7d' }
    );

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (user_id, action, details) VALUES (?, ?, ?)',
      [user.id, 'LOGIN', `Admin login from ${req.ip}`]
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

module.exports = router;