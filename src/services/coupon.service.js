const Coupon = require('../models/Coupon.model');

const getUserCoupons = async (userId) => {
  const coupons = await Coupon.getUserCoupons(userId);
  return coupons;
};

const validateCoupon = async (userId, couponCode, orderAmount) => {
  const coupon = await Coupon.validateCoupon(userId, couponCode, orderAmount);
  return coupon;
};

const calculateDiscount = async (coupon, orderAmount) => {
  const discount = await Coupon.calculateDiscount(coupon, orderAmount);
  return discount;
};

const markAsUsed = async (userId, couponId) => {
  await Coupon.markAsUsed(userId, couponId);
  return { message: 'Coupon marked as used successfully' };
};

module.exports = {
  getUserCoupons,
  validateCoupon,
  calculateDiscount,
  markAsUsed
};
