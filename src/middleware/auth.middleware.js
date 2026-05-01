const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required',
        message: 'Please provide a valid authentication token'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const [user] = await pool.execute(
      'SELECT id, name, email, wallet_points FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (user.length === 0) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid authentication',
        message: 'User account not found'
      });
    }

    req.user = user[0];
    console.log('User authenticated:', user[0].email);
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      success: false,
      error: 'Authentication failed',
      message: 'Invalid or expired token'
    });
  }
};

const sellerAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const [seller] = await pool.execute(
      'SELECT id, name, email, company_name FROM sellers WHERE id = ?',
      [decoded.sellerId]
    );

    if (seller.length === 0) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    req.seller = seller[0];
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = {authMiddleware,sellerAuthMiddleware};
