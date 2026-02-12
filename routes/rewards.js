const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, isAdminOrSubAdmin } = require('../middleware/auth');
const { sendNotification } = require('../utils/notifications');

// Get customer wallet
router.get('/wallet/:mobile', authenticateToken, async (req, res) => {
  try {
    const { mobile } = req.params;

    const [users] = await db.query('SELECT id FROM users WHERE mobile = ?', [mobile]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const [wallet] = await db.query(
      'SELECT * FROM reward_wallet WHERE user_id = ?',
      [users[0].id]
    );

    res.json({
      success: true,
      data: wallet[0] || { total_points: 0, redeemed_points: 0, available_points: 0 }
    });
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ error: 'Failed to fetch wallet' });
  }
});

// Redeem points for fuel discount
router.post('/redeem/fuel', authenticateToken, isAdminOrSubAdmin, async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { mobile, bill_no, fuel_amount } = req.body;

    await connection.beginTransaction();

    // Get customer and wallet
    const [users] = await connection.query('SELECT id FROM users WHERE mobile = ?', [mobile]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    const userId = users[0].id;

    const [wallet] = await connection.query(
      'SELECT available_points FROM reward_wallet WHERE user_id = ?',
      [userId]
    );

    // Check redemption threshold
    const [settings] = await connection.query(
      'SELECT setting_value FROM system_settings WHERE setting_key IN ("redemption_threshold", "fuel_discount_percentage")'
    );
    
    const threshold = parseInt(settings.find(s => s.setting_key === 'redemption_threshold').setting_value);
    const discountPercent = parseInt(settings.find(s => s.setting_key === 'fuel_discount_percentage').setting_value);

    if (wallet[0].available_points < threshold) {
      return res.status(400).json({ 
        error: `Minimum ${threshold} points required for redemption` 
      });
    }

    // Calculate discount
    const discountAmount = (fuel_amount * discountPercent) / 100;
    const pointsToDeduct = threshold;

    // Update wallet
    await connection.query(
      `UPDATE reward_wallet 
       SET redeemed_points = redeemed_points + ?,
           available_points = available_points - ?
       WHERE user_id = ?`,
      [pointsToDeduct, pointsToDeduct, userId]
    );

    // Record redemption
    await connection.query(
      `INSERT INTO redemptions (user_id, redemption_type, points_used, discount_amount, bill_no, created_by)
       VALUES (?, 'fuel_discount', ?, ?, ?, ?)`,
      [userId, pointsToDeduct, discountAmount, bill_no, req.user.userId]
    );

    await connection.commit();

    // Send notification
    const message = `You redeemed ${pointsToDeduct} points for ₹${discountAmount.toFixed(2)} discount on fuel!`;
    await sendNotification(userId, message, 'redemption');

    res.json({
      success: true,
      message: 'Points redeemed successfully',
      data: {
        points_used: pointsToDeduct,
        discount_amount: discountAmount,
        remaining_points: wallet[0].available_points - pointsToDeduct
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Redeem fuel error:', error);
    res.status(500).json({ error: 'Failed to redeem points' });
  } finally {
    connection.release();
  }
});

// Redeem points for product
router.post('/redeem/product', authenticateToken, async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { product_id } = req.body;
    const userId = req.user.userId;

    await connection.beginTransaction();

    // Get product details
    const [products] = await connection.query(
      'SELECT * FROM products WHERE id = ? AND is_active = TRUE',
      [product_id]
    );

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found or unavailable' });
    }

    const product = products[0];

    if (product.stock_quantity <= 0) {
      return res.status(400).json({ error: 'Product out of stock' });
    }

    // Check wallet
    const [wallet] = await connection.query(
      'SELECT available_points FROM reward_wallet WHERE user_id = ?',
      [userId]
    );

    if (wallet[0].available_points < product.points_required) {
      return res.status(400).json({ 
        error: `Insufficient points. Required: ${product.points_required}, Available: ${wallet[0].available_points}` 
      });
    }

    // Update wallet
    await connection.query(
      `UPDATE reward_wallet 
       SET redeemed_points = redeemed_points + ?,
           available_points = available_points - ?
       WHERE user_id = ?`,
      [product.points_required, product.points_required, userId]
    );

    // Update product stock
    await connection.query(
      'UPDATE products SET stock_quantity = stock_quantity - 1 WHERE id = ?',
      [product_id]
    );

    // Record redemption
    await connection.query(
      `INSERT INTO redemptions (user_id, redemption_type, product_id, points_used, created_by)
       VALUES (?, 'product', ?, ?, ?)`,
      [userId, product_id, product.points_required, userId]
    );

    await connection.commit();

    // Send notification
    const message = `You redeemed ${product.points_required} points for ${product.name}!`;
    await sendNotification(userId, message, 'redemption');

    res.json({
      success: true,
      message: 'Product redeemed successfully',
      data: {
        product_name: product.name,
        points_used: product.points_required,
        remaining_points: wallet[0].available_points - product.points_required
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Redeem product error:', error);
    res.status(500).json({ error: 'Failed to redeem product' });
  } finally {
    connection.release();
  }
});

// Get redemption history
router.get('/history/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const [redemptions] = await db.query(
      `SELECT r.*, p.name as product_name, p.category
       FROM redemptions r
       LEFT JOIN products p ON r.product_id = p.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: redemptions
    });
  } catch (error) {
    console.error('Get redemption history error:', error);
    res.status(500).json({ error: 'Failed to fetch redemption history' });
  }
});

module.exports = router;