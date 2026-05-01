const router = require("express").Router();
const authController = require("../controllers/auth.controller");

router.post("/user/register", authController.userRegister);
router.post("/user/login", authController.userLogin);

router.post("/seller/register", authController.sellerRegister);
router.post("/seller/login", authController.sellerLogin);

module.exports = router;