const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { protect } = require("../middleware/auth"); // Phải có protect để lấy req.user.id

// Dòng 6 thường là dòng này:
router.get("/", protect, cartController.getCart);
router.post("/add", protect, cartController.addToCart);

module.exports = router;
