const { pool } = require('../config/database');

const create = async (orderData, userId) => {
  const { total_amount, discount_amount, wallet_points_used, final_amount, items } = orderData;
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    const orderNumber = 'ORD' + Date.now();
    
    const [orderResult] = await connection.execute(
      `INSERT INTO orders (user_id, order_number, total_amount, discount_amount, wallet_points_used, final_amount, payment_status, order_status) 
       VALUES (?, ?, ?, ?, ?, ?, 'pending', 'pending')`,
      [userId, orderNumber, total_amount, discount_amount, wallet_points_used, final_amount]
    );
    
    const orderId = orderResult.insertId;
    for (const item of items) {
      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price_per_unit, total_price) VALUES (?, ?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price_per_unit, item.total_price]
      );
       await connection.execute(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }
    
    await connection.commit();
    return orderId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const findById = async (orderId, userId = null) => {
  const query = userId 
    ? `SELECT o.*, u.name as user_name, u.email as user_email 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       WHERE o.id = ? AND o.user_id = ?`
    : `SELECT o.*, u.name as user_name, u.email as user_email 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       WHERE o.id = ?`;
  
  const params = userId ? [orderId, userId] : [orderId];
  const [rows] = await pool.execute(query, params);
  
  if (rows.length === 0) return null;
  
  const order = rows[0];
  
  const [items] = await pool.execute(
    `SELECT oi.*, p.name as product_name 
     FROM order_items oi 
     JOIN products p ON oi.product_id = p.id 
     WHERE oi.order_id = ?`,
    [orderId]
  );
  
  order.items = items;
  return order;
};

const findByUser = async (userId, status = null) => {
  let query = `SELECT o.*, COUNT(oi.id) as item_count 
               FROM orders o 
               LEFT JOIN order_items oi ON o.id = oi.order_id 
               WHERE o.user_id = ?`;
  const params = [userId];
  
  if (status) {
    query += ' AND o.order_status = ?';
    params.push(status);
  }
  
  query += ' GROUP BY o.id ORDER BY o.created_at DESC';
  
  const [rows] = await pool.execute(query, params);
  return rows;
};

const updatePaymentStatus = async (orderId, paymentStatus) => {
  const [result] = await pool.execute(
    'UPDATE orders SET payment_status = ? WHERE id = ?',
    [paymentStatus, orderId]
  );
  
  return result.affectedRows > 0;
};

const updateOrderStatus = async (orderId, orderStatus) => {
  const [result] = await pool.execute(
    'UPDATE orders SET order_status = ? WHERE id = ?',
    [orderStatus, orderId]
  );
  
  return result.affectedRows > 0;
};

const getAllOrders = async (status = null) => {
  let query = `SELECT o.*, u.name as user_name, u.email as user_email, COUNT(oi.id) as item_count 
               FROM orders o 
               JOIN users u ON o.user_id = u.id 
               LEFT JOIN order_items oi ON o.id = oi.order_id`;
  
  const params = [];
  if (status) {
    query += ' WHERE o.order_status = ?';
    params.push(status);
  }
  
  query += ' GROUP BY o.id ORDER BY o.created_at DESC';
  
  const [rows] = await pool.execute(query, params);
  return rows;
};

module.exports = { create, findById, findByUser, updatePaymentStatus, updateOrderStatus, getAllOrders };
