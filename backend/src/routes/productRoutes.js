const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/auth");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// 1. Route cố định - LUÔN ĐỂ TRÊN CÙNG
router.get(
  "/admin/books",
  protect,
  adminOnly,
  productController.getAllAdminBooks,
);
// Route chuẩn
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"), // Tên field ảnh từ Frontend gửi lên
  productController.createProduct,
);

// 2. Route cơ bản
router.get("/", productController.getAllProducts);

// 3. Route tham số - LUÔN ĐỂ DƯỚI CÙNG
router.get("/:id", productController.getProductById);

// 4. Các route POST/PUT/DELETE
// router.post("/", protect, adminOnly, productController.createProduct);
router.put("/:id", protect, adminOnly, productController.updateProduct);
router.delete("/:id", protect, adminOnly, productController.deleteProduct);

module.exports = router;
