const { pool } = require('../config/database');

const create = async (productData, sellerId) => {
  try {
    const { name, description, price, stock_quantity, category_id, image_url, status } = productData;
    
    if (!name || !price || !stock_quantity || !category_id) {
      throw new Error('Missing required fields: name, price, stock_quantity, category_id');
    }
    if (price <= 0 || stock_quantity < 0) {
      throw new Error('Price must be positive and stock cannot be negative');
    }
    
    const [result] = await pool.execute(
      'INSERT INTO products (seller_id, category_id, name, description, price, stock_quantity, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [sellerId, category_id, name, description || null, price, stock_quantity, image_url || null, status || 'active']
    );
    
    return result.insertId;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

const findById = async (id) => {
  try {
    if (!id || id <= 0) {
      throw new Error('Invalid product ID');
    }
    
    const [rows] = await pool.execute(
      `SELECT p.*, c.name as category_name, s.name as seller_name, s.email as seller_email
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN sellers s ON p.seller_id = s.id 
       WHERE p.id = ?`,
      [id]
    );
    
    if (rows.length === 0) {
      return null;
    }
    
    return rows[0];
  } catch (error) {
    console.error('Error finding product:', error);
    throw error;
  }
};

const findBySeller = async (sellerId) => {
  try {
    if (!sellerId || sellerId <= 0) {
      throw new Error('Invalid seller ID');
    }
    
    const [rows] = await pool.execute(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.seller_id = ? 
       ORDER BY p.created_at DESC`,
      [sellerId]
    );
    
    return rows;
  } catch (error) {
    console.error('Error finding seller products:', error);
    throw error;
  }
};

const findAll = async (activeOnly = true) => {
  try {
    console.log('Finding all products, activeOnly:', activeOnly);
    
    const query = activeOnly 
      ? `SELECT p.*, c.name as category_name, s.name as seller_name 
         FROM products p 
         LEFT JOIN categories c ON p.category_id = c.id 
         LEFT JOIN sellers s ON p.seller_id = s.id 
         WHERE p.status = 'active'`
      : `SELECT p.*, c.name as category_name, s.name as seller_name 
         FROM products p 
         LEFT JOIN categories c ON p.category_id = c.id 
         LEFT JOIN sellers s ON p.seller_id = s.id`;
    
    console.log('Executing query:', query);
    const [rows] = await pool.execute(query);
    console.log('Products found:', rows.length);
    return rows;
  } catch (error) {
    console.error('Error in findAll:', error);
    return [];
  }
};

const updateStock = async (productId, quantity) => {
  const [result] = await pool.execute(
    'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ? AND stock_quantity >= ?',
    [quantity, productId, quantity]
  );
  
  return result.affectedRows > 0;
};

const update = async (productId, productData, sellerId) => {
  const { name, description, price, stock_quantity, category_id, image_url, status } = productData;
  
  const [result] = await pool.execute(
    'UPDATE products SET name = ?, description = ?, price = ?, stock_quantity = ?, category_id = ?, image_url = ?, status = ? WHERE id = ? AND seller_id = ?',
    [name, description, price, stock_quantity, category_id, image_url, status, productId, sellerId]
  );
  
  return result.affectedRows > 0;
};

const deleteProduct = async (productId, sellerId) => {
  const [result] = await pool.execute(
    'DELETE FROM products WHERE id = ? AND seller_id = ?',
    [productId, sellerId]
  );
  
  return result.affectedRows > 0;
};

module.exports = { create, findById, findBySeller, findAll, updateStock, update, delete: deleteProduct };
