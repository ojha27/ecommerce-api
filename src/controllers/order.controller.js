const OrderService = require('../services/order.service');
const { placeOrderValidation, paymentStatusValidation } = require('../validations/auth.validation');

exports.calculateTotal = async (req, res) => {
  try {
    const { use_wallet_points = false, coupon_code } = req.body;
    
    const result = await OrderService.calculateTotal(
      req.user.id, use_wallet_points, coupon_code
    );

    res.json({
      success: true,
      message: 'Order total calculated successfully',
      data: {
        order_summary: {
          ...result,
          available_wallet_points: parseFloat(req.user.wallet_points)
        }
      }
    });
  } catch (error) {
    console.error('Calculate total error:', error);
    res.status(400).json({ 
      success: false,
      error: 'Failed to calculate order total',
      message: error.message
    });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const { error } = placeOrderValidation(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed',
        details: error.details[0].message 
      });
    }

    const order = await OrderService.placeOrder(req.user.id, req.body);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to place order',
      message: error.message
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const orders = await OrderService.getUserOrders(req.user.id, status);

    res.json({
      success: true,
      message: 'Orders retrieved successfully',
      data: orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to retrieve orders',
      message: error.message
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderService.getOrderById(id, req.user.id);

    res.json({
      success: true,
      message: 'Order retrieved successfully',
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(404).json({ 
      success: false,
      error: 'Order not found',
      message: error.message
    });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { error } = paymentStatusValidation(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed',
        details: error.details[0].message 
      });
    }

    const result = await OrderService.updatePaymentStatus(
      req.body.order_id, req.body.payment_status
    );

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update payment status',
      message: error.message
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const orders = await OrderService.getAllOrders(status);

    res.json({
      success: true,
      message: 'All orders retrieved successfully',
      data: orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to retrieve orders',
      message: error.message
    });
  }
};
