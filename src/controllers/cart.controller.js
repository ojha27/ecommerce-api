const { getCart, addToCart, updateQuantity, removeFromCart, clearCart } = require('../services/cart.service');
const { addToCartValidation } = require('../validations/auth.validation');

exports.getCart = async (req, res) => {
  try {
    const result = await getCart(req.user.id);
    
    res.json({
      success: true,
      message: 'Cart retrieved successfully',
      data: result
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to retrieve cart',
      message: error.message
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { error } = addToCartValidation(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed',
        details: error.details[0].message 
      });
    }

    const { product_id, quantity } = req.body;

    const result = await addToCart(req.user.id, product_id, quantity);

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully',
      data: result
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(400).json({ 
      success: false,
      error: 'Failed to add to cart',
      message: error.message
    });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ 
        success: false,
        error: 'Quantity must be at least 1' 
      });
    }

    const result = await updateQuantity(req.user.id, product_id, quantity);
    
    res.json({
      success: true,
      message: 'Cart item updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(400).json({ 
      success: false,
      error: 'Failed to update cart item',
      message: error.message
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { product_id } = req.params;

    const result = await removeFromCart(req.user.id, product_id);
    
    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: result
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to remove item from cart',
      message: error.message
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const result = await clearCart(req.user.id);

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: result
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to clear cart',
      message: error.message
    });
  }
};
