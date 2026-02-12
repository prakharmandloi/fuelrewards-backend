const jwt = require('jsonwebtoken');

// Authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fuelrewards_secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Check if user is admin or sub-admin
const isAdminOrSubAdmin = (req, res, next) => {
  if (!['admin', 'sub_admin'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Admin or Sub-admin access required' });
  }
  next();
};

module.exports = {
  authenticateToken,
  isAdmin,
  isAdminOrSubAdmin
};