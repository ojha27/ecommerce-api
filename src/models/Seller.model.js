const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

const create = async (sellerData) => {
  const { name, email, password, phone, company_name } = sellerData;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const [result] = await pool.execute(
    'INSERT INTO sellers (name, email, password, phone, company_name) VALUES (?, ?, ?, ?, ?)',
    [name, email, hashedPassword, phone, company_name]
  );
  
  return result.insertId;
};

const findByEmail = async (email) => {
  const [rows] = await pool.execute(
    'SELECT * FROM sellers WHERE email = ?',
    [email]
  );
  return rows[0];
};

const findById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id, name, email, phone, company_name, created_at FROM sellers WHERE id = ?',
    [id]
  );
  return rows[0];
};

module.exports = { create, findByEmail, findById };
