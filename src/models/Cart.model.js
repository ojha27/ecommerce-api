const { pool } = require('../config/database');

const addToCart = async (userId, productId, quantity) => {
  const [product] = await pool.execute(
    'SELECT stock_quantity FROM products WHERE id = ? AND status = "active"',
    [productId]
  );
  
  if (product.length === 0) {
    throw new Error('Product not found or inactive');
  }
  
  if (product[0].stock_quantity < quantity) {
    throw new Error('Insufficient stock');
  }

  const [existing] = await pool.execute(
    'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
    [userId, productId]
  );

  if (existing.length > 0) {
    const newQuantity = existing[0].quantity + quantity;
    if (product[0].stock_quantity < newQuantity) {
      throw new Error('Insufficient stock for requested quantity');
    }
    
    await pool.execute(
      'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
      [newQuantity, userId, productId]
    );
  } else {
    await pool.execute(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
      [userId, productId, quantity]
    );
  }
};

const getCartItems = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT c.id as cart_id, c.quantity, p.id, p.name, p.price, p.image_url, 
     (p.price * c.quantity) as subtotal,
     p.stock_quantity
     FROM cart c 
     JOIN products p ON c.product_id = p.id 
     WHERE c.user_id = ? AND p.status = 'active'`,
    [userId]
  );
  return rows;
};

const updateQuantity = async (userId, productId, quantity) => {
  const [product] = await pool.execute(
    'SELECT stock_quantity FROM products WHERE id = ? AND status = "active"',
    [productId]
  );
  
  if (product.length === 0) {
    throw new Error('Product not found or inactive');
  }
  
  if (product[0].stock_quantity < quantity) {
    throw new Error('Insufficient stock');
  }

  const [result] = await pool.execute(
    'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
    [quantity, userId, productId]
  );
  
  return result.affectedRows > 0;
};

const removeFromCart = async (userId, productId) => {
  const [result] = await pool.execute(
    'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
    [userId, productId]
  );
  
  return result.affectedRows > 0;
};

const clearCart = async (userId) => {
  await pool.execute(
    'DELETE FROM cart WHERE user_id = ?',
    [userId]
  );
};

const getCartTotal = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT SUM(p.price * c.quantity) as total 
     FROM cart c 
     JOIN products p ON c.product_id = p.id 
     WHERE c.user_id = ? AND p.status = 'active'`,
    [userId]
  );
  
  return rows[0].total || 0;
};

module.exports = { addToCart, getCartItems, updateQuantity, removeFromCart, clearCart, getCartTotal };
