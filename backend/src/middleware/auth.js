const jwt = require("jsonwebtoken");

// Middleware xác thực Token (để biết ai đang đăng nhập)
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Không có quyền truy cập" });

  try {
    // ✅ Dùng chung 1 nguồn JWT_SECRET từ .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// Middleware kiểm tra quyền ADMIN
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next(); // Nếu là ADMIN thì cho đi tiếp
  } else {
    res
      .status(403)
      .json({ message: "Chỉ ADMIN mới có quyền thực hiện hành động này" });
  }
};

module.exports = { protect, adminOnly };
