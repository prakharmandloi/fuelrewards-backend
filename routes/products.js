const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Get all products
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category, active = 'true' } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (active === 'true') {
      query += ' AND is_active = TRUE';
    }

    query += ' ORDER BY category, name';

    const [products] = await db.query(query, params);

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create product (Admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, description, category, points_required, stock_quantity, image_url } = req.body;

    const [result] = await db.query(
      `INSERT INTO products (name, description, category, points_required, stock_quantity, image_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, category, points_required, stock_quantity, image_url]
    );

    res.json({
      success: true,
      message: 'Product created successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (Admin only)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const fields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
      fields.push(`${key} = ?`);
      values.push(updates[key]);
    });

    values.push(id);

    await db.query(
      `UPDATE products SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    res.json({
      success: true,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

module.exports = router;