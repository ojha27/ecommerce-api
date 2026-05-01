const { pool } = require('../config/database');

const findByCode = async (code) => {
  const [rows] = await pool.execute(
    'SELECT * FROM coupons WHERE code = ? AND status = "active"',
    [code]
  );
  return rows[0];
};

const validateCoupon = async (userId, couponCode, orderAmount) => {
  const coupon = await findByCode(couponCode);
  
  if (!coupon) {
    throw new Error('Invalid coupon code');
  }
  
  if (coupon.valid_to && new Date() > new Date(coupon.valid_to)) {
    throw new Error('Coupon has expired');
  }
  
  if (orderAmount < coupon.min_order_amount) {
    throw new Error(`Minimum order amount of ${coupon.min_order_amount} required`);
  }
  
  const [userCoupon] = await pool.execute(
    'SELECT * FROM user_coupons WHERE user_id = ? AND coupon_id = ? AND status = "used"',
    [userId, coupon.id]
  );
  
  if (userCoupon.length > 0) {
    throw new Error('Coupon already used');
  }
  
  const [assignedCoupon] = await pool.execute(
    'SELECT * FROM user_coupons WHERE user_id = ? AND coupon_id = ? AND status = "assigned"',
    [userId, coupon.id]
  );
  
  if (assignedCoupon.length === 0) {
    throw new Error('Coupon not assigned to user');
  }
  
  if (coupon.used_count >= coupon.usage_limit) {
    throw new Error('Coupon usage limit reached');
  }
  
  return coupon;
};

const calculateDiscount = async (coupon, orderAmount) => {
  let discount = 0;
  
  if (coupon.discount_type === 'percentage') {
    discount = (orderAmount * coupon.discount_value) / 100;
  } else {
    discount = coupon.discount_value;
  }
  
  if (coupon.max_discount_amount && discount > coupon.max_discount_amount) {
    discount = coupon.max_discount_amount;
  }
  
  return discount;
};

const markAsUsed = async (userId, couponId) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    await connection.execute(
      'UPDATE user_coupons SET status = "used", used_at = NOW() WHERE user_id = ? AND coupon_id = ?',
      [userId, couponId]
    );
    
    await connection.execute(
      'UPDATE coupons SET used_count = used_count + 1 WHERE id = ?',
      [couponId]
    );
    
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const getUserCoupons = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT uc.*, c.code, c.discount_type, c.discount_value, c.min_order_amount, 
     c.valid_to, c.max_discount_amount
     FROM user_coupons uc 
     JOIN coupons c ON uc.coupon_id = c.id 
     WHERE uc.user_id = ? AND uc.status = "assigned" AND c.status = "active" 
     AND (c.valid_to IS NULL OR c.valid_to > NOW())`,
    [userId]
  );
  
  return rows;
};

module.exports = { findByCode, validateCoupon, calculateDiscount, markAsUsed, getUserCoupons };
