const CouponService = require('../services/coupon.service');

exports.getUserCoupons = async (req, res) => {
  try {
    const coupons = await CouponService.getUserCoupons(req.user.id);

    res.json({
      success: true,
      message: 'User coupons retrieved successfully',
      data: coupons
    });
  } catch (error) {
    console.error('Get user coupons error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to retrieve coupons',
      message: error.message
    });
  }
};
