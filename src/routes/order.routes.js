const router = require("express").Router();
const orderController = require("../controllers/order.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.post("/calculate-total", orderController.calculateTotal);
router.post("/place", orderController.placeOrder);
router.get("/my-orders", orderController.getUserOrders);
router.get("/:id", orderController.getOrderById);

router.put("/payment-status", orderController.updatePaymentStatus);

router.get("/admin/all-orders", orderController.getAllOrders);

module.exports = router;
