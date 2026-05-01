const Order = require('../models/Order.model');
const Cart = require('../models/Cart.model');
const Coupon = require('../models/Coupon.model');
const User = require('../models/User.model');
const Product = require('../models/Product.model');

const calculateTotal = async (userId, useWalletPoints = false, couponCode = null) => {
  const cartItems = await Cart.getCartItems(userId);
  const total = await Cart.getCartTotal(userId);

  if (cartItems.length === 0) throw new Error('Cart is empty');

  let discountAmount = 0;
  let walletPointsUsed = 0;
  let couponInfo = null;

  if (couponCode) {
    const coupon = await Coupon.validateCoupon(userId, couponCode, total);
    discountAmount = await Coupon.calculateDiscount(coupon, total);
    couponInfo = {
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      discount_amount: discountAmount
    };
  }

  let finalAmount = total - discountAmount;
  if (useWalletPoints) {
    const user = await User.findById(userId);
    if (user && user.wallet_points > 0) {
      const maxWalletDiscount = Math.min(user.wallet_points, finalAmount);
      walletPointsUsed = maxWalletDiscount;
      finalAmount -= maxWalletDiscount;
    }
  }

  return {
    subtotal: parseFloat(total),
    discount_amount: parseFloat(discountAmount),
    wallet_points_used: parseFloat(walletPointsUsed),
    final_amount: parseFloat(finalAmount),
    coupon_info: couponInfo,
    cart_items: cartItems
  };
};

const placeOrder = async (userId, orderData) => {
  const { use_wallet_points = false, coupon_code } = orderData;

  const cartItems = await Cart.getCartItems(userId);
  const total = await Cart.getCartTotal(userId);

  if (cartItems.length === 0) throw new Error('Cart is empty');

  let discountAmount = 0;
  let walletPointsUsed = 0;
  let usedCouponId = null;

  if (coupon_code) {
    const coupon = await Coupon.validateCoupon(userId, coupon_code, total);
    discountAmount = await Coupon.calculateDiscount(coupon, total);
    usedCouponId = coupon.id;
  }

  let finalAmount = total - discountAmount;
  if (use_wallet_points) {
    const user = await User.findById(userId);
    if (user && user.wallet_points > 0) {
      const maxWalletDiscount = Math.min(user.wallet_points, finalAmount);
      walletPointsUsed = maxWalletDiscount;
      finalAmount -= maxWalletDiscount;
    }
  }

  const orderItems = cartItems.map(item => ({
    product_id: item.id,
    quantity: item.quantity,
    price_per_unit: item.price,
    total_price: item.subtotal
  }));

  const orderDataObj = {
    total_amount: total,
    discount_amount: discountAmount,
    wallet_points_used: walletPointsUsed,
    final_amount: finalAmount,
    items: orderItems
  };

  const orderId = await Order.create(orderDataObj, userId);

  if (usedCouponId) {
    await Coupon.markAsUsed(userId, usedCouponId);
  }

  if (walletPointsUsed > 0) {
    await User.updateWallet(userId, walletPointsUsed, 'debit', `Used for order ${orderId}`, orderId.toString());
  }

  await Cart.clearCart(userId);

  const order = await Order.findById(orderId);
  return order;
};

const getUserOrders = async (userId, status = null) => {
  const orders = await Order.findByUser(userId, status);
  return orders;
};

const getOrderById = async (orderId, userId = null) => {
  const order = await Order.findById(orderId, userId);
  if (!order) throw new Error('Order not found');
  return order;
};

const updatePaymentStatus = async (orderId, paymentStatus) => {
  const updated = await Order.updatePaymentStatus(orderId, paymentStatus);
  if (!updated) throw new Error('Order not found');

  if (paymentStatus === 'failed') {
    const order = await Order.findById(orderId);
    if (order) {
      for (const item of order.items) {
        await Product.updateStock(item.product_id, -item.quantity);
      }
      if (order.wallet_points_used > 0) {
        await User.updateWallet(order.user_id, order.wallet_points_used, 'credit', `Refund for failed order ${orderId}`, orderId.toString());
      }
    }
  }
  return { message: 'Payment status updated successfully' };
};

const getAllOrders = async (status = null) => {
  const orders = await Order.getAllOrders(status);
  return orders;
};

module.exports = { calculateTotal, placeOrder, getUserOrders, getOrderById, updatePaymentStatus, getAllOrders };
