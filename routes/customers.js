const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Get all customers
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT u.*, 
             rw.total_points, rw.available_points, rw.redeemed_points,
             COUNT(DISTINCT b.id) as total_purchases,
             SUM(b.amount) as total_spent,
             MAX(b.created_at) as last_purchase
      FROM users u
      LEFT JOIN reward_wallet rw ON u.id = rw.user_id
      LEFT JOIN bills b ON u.id = b.user_id
      WHERE u.role = 'customer'
    `;

    const params = [];

    if (search) {
      query += ' AND (u.mobile LIKE ? OR u.name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' GROUP BY u.id ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [customers] = await db.query(query, params);

    const [total] = await db.query(
      'SELECT COUNT(*) as count FROM users WHERE role = "customer"'
    );

    res.json({
      success: true,
      data: customers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total[0].count
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get customer profile
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [customers] = await db.query(
      `SELECT u.*, 
              rw.total_points, rw.available_points, rw.redeemed_points,
              COUNT(DISTINCT b.id) as total_purchases,
              SUM(b.amount) as total_spent
       FROM users u
       LEFT JOIN reward_wallet rw ON u.id = rw.user_id
       LEFT JOIN bills b ON u.id = b.user_id
       WHERE u.id = ? AND u.role = 'customer'
       GROUP BY u.id`,
      [id]
    );

    if (customers.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({
      success: true,
      data: customers[0]
    });
  } catch (error) {
    console.error('Get customer profile error:', error);
    res.status(500).json({ error: 'Failed to fetch customer profile' });
  }
});

module.exports = router;