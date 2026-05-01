const router = require("express").Router();
const couponController = require("../controllers/coupon.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.get("/my-coupons", couponController.getUserCoupons);

module.exports = router;