const router = require("express").Router();
const productController = require("../controllers/product.controller");
const { sellerAuthMiddleware } = require("../middleware/auth.middleware");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

router.use(sellerAuthMiddleware);
router.post("/", productController.addProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.get("/seller/my-products", productController.getSellerProducts);

module.exports = router;
