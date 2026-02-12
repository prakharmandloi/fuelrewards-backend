const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Get dashboard analytics
router.get('/dashboard', authenticateToken, isAdmin, async (req, res) => {
  try {
    // Total sales
    const [sales] = await db.query(
      'SELECT SUM(amount) as total_sales, COUNT(*) as total_bills FROM bills'
    );

    // Sales by fuel type
    const [fuelSales] = await db.query(
      'SELECT fuel_type, SUM(amount) as total, COUNT(*) as count FROM bills GROUP BY fuel_type'
    );

    // Reward stats
    const [rewardStats] = await db.query(
      'SELECT SUM(total_points) as total_issued, SUM(redeemed_points) as total_redeemed, SUM(available_points) as total_available FROM reward_wallet'
    );

    // Active customers
    const [activeCustomers] = await db.query(
      'SELECT COUNT(DISTINCT user_id) as count FROM bills WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
    );

    // Recent transactions
    const [recentBills] = await db.query(
      `SELECT b.*, u.name, u.mobile 
       FROM bills b
       LEFT JOIN users u ON b.user_id = u.id
       ORDER BY b.created_at DESC
       LIMIT 10`
    );

    // Monthly sales trend
    const [monthlySales] = await db.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, 
              SUM(amount) as total,
              COUNT(*) as count
       FROM bills
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY month
       ORDER BY month`
    );

    res.json({
      success: true,
      data: {
        sales: sales[0],
        fuelSales,
        rewardStats: rewardStats[0],
        activeCustomers: activeCustomers[0].count,
        recentBills,
        monthlySales
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Create sub-admin
router.post('/sub-admin', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    // Check max sub-admins limit
    const [count] = await db.query(
      'SELECT COUNT(*) as count FROM users WHERE role = "sub_admin"'
    );

    const [settings] = await db.query(
      'SELECT setting_value FROM system_settings WHERE setting_key = "max_sub_admins"'
    );

    if (count[0].count >= parseInt(settings[0].setting_value)) {
      return res.status(400).json({ error: 'Maximum sub-admin limit reached' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create sub-admin
    await db.query(
      'INSERT INTO users (name, email, mobile, password, role) VALUES (?, ?, ?, ?, "sub_admin")',
      [name, email, mobile, hashedPassword]
    );

    res.json({
      success: true,
      message: 'Sub-admin created successfully'
    });
  } catch (error) {
    console.error('Create sub-admin error:', error);
    res.status(500).json({ error: 'Failed to create sub-admin' });
  }
});

// Update system settings
router.put('/settings', authenticateToken, isAdmin, async (req, res) => {
  try {
    const settings = req.body; // { setting_key: setting_value }

    for (const [key, value] of Object.entries(settings)) {
      await db.query(
        'UPDATE system_settings SET setting_value = ? WHERE setting_key = ?',
        [value, key]
      );
    }

    res.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Get system settings
router.get('/settings', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [settings] = await db.query('SELECT * FROM system_settings');

    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.setting_key] = s.setting_value;
    });

    res.json({
      success: true,
      data: settingsObj
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

module.exports = router;