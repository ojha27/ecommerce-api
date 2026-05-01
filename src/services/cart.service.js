const Cart = require('../models/Cart.model');

const getCart = async (userId) => {
  const cartItems = await Cart.getCartItems(userId);
  const total = await Cart.getCartTotal(userId);
  return { cartItems, total: parseFloat(total) };
};

const addToCart = async (userId, productId, quantity) => {
  await Cart.addToCart(userId, productId, quantity);
  return { message: 'Item added to cart successfully' };
};

const updateQuantity = async (userId, productId, quantity) => {
  const updated = await Cart.updateQuantity(userId, productId, quantity);
  if (!updated) throw new Error('Item not found in cart');
  return { message: 'Cart item updated successfully' };
};

const removeFromCart = async (userId, productId) => {
  const removed = await Cart.removeFromCart(userId, productId);
  if (!removed) throw new Error('Item not found in cart');
  return { message: 'Item removed from cart successfully' };
};

const clearCart = async (userId) => {
  await Cart.clearCart(userId);
  return { message: 'Cart cleared successfully' };
};

module.exports = { getCart, addToCart, updateQuantity, removeFromCart, clearCart };
