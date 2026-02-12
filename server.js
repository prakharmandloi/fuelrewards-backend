const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const billRoutes = require('./routes/bills');
const rewardRoutes = require('./routes/rewards');
const customerRoutes = require('./routes/customers');
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/products');

app.use('/api/auth', authRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'FuelRewards API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.json({
    name: 'FuelRewards API',
    version: '1.0.0',
    description: 'Petrol Pump Loyalty Management System',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      bills: '/api/bills',
      rewards: '/api/rewards',
      customers: '/api/customers',
      admin: '/api/admin',
      products: '/api/products'
    },
    documentation: 'https://github.com/prakharmandloi/fuelrewards-backend'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Only start server if not in Vercel serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 FuelRewards API running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
module.exports = app;