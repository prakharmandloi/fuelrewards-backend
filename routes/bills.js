const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, isAdminOrSubAdmin } = require('../middleware/auth');
const { calculatePoints } = require('../utils/rewards');
const { sendNotification } = require('../utils/notifications');

// Create new bill
router.post('/', authenticateToken, isAdminOrSubAdmin, async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { bill_no, mobile, fuel_type, quantity, amount, fuel_density } = req.body;

    // Validate minimum purchase
    const [settings] = await connection.query(
      'SELECT setting_value FROM system_settings WHERE setting_key = "min_purchase_amount"'
    );
    const minAmount = parseFloat(settings[0].setting_value);

    if (amount < minAmount) {
      return res.status(400).json({ 
        error: `Minimum purchase amount is ₹${minAmount}` 
      });
    }

    await connection.beginTransaction();

    // Get or create customer
    let [users] = await connection.query(
      'SELECT id FROM users WHERE mobile = ?',
      [mobile]
    );

    let userId;
    if (users.length === 0) {
      const [result] = await connection.query(
        'INSERT INTO users (mobile, role) VALUES (?, "customer")',
        [mobile]
      );
      userId = result.insertId;

      // Create wallet for new customer
      await connection.query(
        'INSERT INTO reward_wallet (user_id) VALUES (?)',
        [userId]
      );
    } else {
      userId = users[0].id;
    }

    // Calculate reward points
    const points = calculatePoints(amount, fuel_type, fuel_density);

    // Insert bill
    await connection.query(
      `INSERT INTO bills (bill_no, user_id, mobile, fuel_type, quantity, amount, fuel_density, points_earned, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [bill_no, userId, mobile, fuel_type, quantity, amount, fuel_density, points, req.user.userId]
    );

    // Update reward wallet
    await connection.query(
      `UPDATE reward_wallet 
       SET total_points = total_points + ?, 
           available_points = available_points + ? 
       WHERE user_id = ?`,
      [points, points, userId]
    );

    // Get updated wallet
    const [wallet] = await connection.query(
      'SELECT available_points FROM reward_wallet WHERE user_id = ?',
      [userId]
    );

    await connection.commit();

    // Send notification
    const message = `You have earned ${points} reward points. Total balance: ${wallet[0].available_points} points`;
    await sendNotification(userId, message, 'points_earned');

    res.json({
      success: true,
      message: 'Bill created successfully',
      data: {
        bill_no,
        points_earned: points,
        total_points: wallet[0].available_points
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Create bill error:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Bill number already exists' });
    }
    
    res.status(500).json({ error: 'Failed to create bill' });
  } finally {
    connection.release();
  }
});

// Get bill history
router.get('/history/:mobile', authenticateToken, async (req, res) => {
  try {
    const { mobile } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const [bills] = await db.query(
      `SELECT b.*, u.name as customer_name 
       FROM bills b
       LEFT JOIN users u ON b.user_id = u.id
       WHERE b.mobile = ?
       ORDER BY b.created_at DESC
       LIMIT ? OFFSET ?`,
      [mobile, parseInt(limit), offset]
    );

    const [total] = await db.query(
      'SELECT COUNT(*) as count FROM bills WHERE mobile = ?',
      [mobile]
    );

    res.json({
      success: true,
      data: bills,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total[0].count
      }
    });
  } catch (error) {
    console.error('Get bill history error:', error);
    res.status(500).json({ error: 'Failed to fetch bill history' });
  }
});

module.exports = router;