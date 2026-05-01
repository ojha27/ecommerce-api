const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

const create = async (userData) => {
  const { name, email, password, phone } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password, phone, wallet_points) VALUES (?, ?, ?, ?, ?)',
    [name, email, hashedPassword, phone, 100]
  );
  
  return result.insertId;
};

const findByEmail = async (email) => {
  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return rows[0];
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id, name, email, phone, wallet_points, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
};

const updateWallet = async (userId, amount, type, description, referenceId = null) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const updateQuery = type === 'credit' 
      ? 'UPDATE users SET wallet_points = wallet_points + ? WHERE id = ?'
      : 'UPDATE users SET wallet_points = wallet_points - ? WHERE id = ?';
    
    await connection.execute(updateQuery, [amount, userId]);
    await connection.execute(
      'INSERT INTO wallet_transactions (user_id, type, amount, description, reference_id) VALUES (?, ?, ?, ?, ?)',
      [userId, type, amount, description, referenceId]
    );
    
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const assignWelcomeCoupons = async (userId) => {
  const coupons = await pool.execute(
    'SELECT id FROM coupons WHERE code IN (?, ?, ?) AND status = "active"',
    ['WELCOME10', 'FLAT50', 'SAVE20']
  );
  
  for (const coupon of coupons[0]) {
    await pool.execute(
      'INSERT INTO user_coupons (user_id, coupon_id) VALUES (?, ?)',
      [userId, coupon.id]
    );
  }
};

module.exports = { create, findByEmail, findById, updateWallet, assignWelcomeCoupons };