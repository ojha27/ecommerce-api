const router = require("express").Router();
const cartController = require("../controllers/cart.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.get("/", cartController.getCart);
router.post("/", cartController.addToCart);
router.put("/update/:product_id", cartController.updateCartItem);
router.delete("/remove/:product_id", cartController.removeFromCart);
router.delete("/clear", cartController.clearCart);

module.exports = router;
