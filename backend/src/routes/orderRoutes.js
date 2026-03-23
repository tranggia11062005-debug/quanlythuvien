const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController"); // Đổi tên từ 'order' thành 'orderController' cho rõ ràng
const { protect } = require("../middleware/auth"); // ✅ Lấy đúng hàm protect ra

// Sửa dòng số 6:
router.post("/checkout", protect, orderController.checkout);

module.exports = router;
