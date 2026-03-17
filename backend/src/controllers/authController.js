const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// SECRET KEY (nên để .env sau này)
const SECRET_KEY = "mysecretkey";

// ================= REGISTER =================
const register = async (req, res) => {
  try {
    const { username, email, password, firstname, lastname } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Thiếu thông tin bắt buộc",
      });
    }

    const [existingUser] = await db.query(
      "SELECT id FROM users WHERE username = ?",
      [username],
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "Username đã tồn tại",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users 
      (username, email, password, firstname, lastname) 
      VALUES (?, ?, ?, ?, ?)`,
      [username, email, hashedPassword, firstname, lastname],
    );

    return res.status(201).json({
      message: "Đăng ký thành công",
    });
  } catch (err) {
    console.error(err);

    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Username đã tồn tại",
      });
    }

    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

// ================= LOGIN =================
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Validate
    if (!username || !password) {
      return res.status(400).json({
        message: "Thiếu username hoặc password",
      });
    }

    // 2. Check user
    const [users] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (users.length === 0) {
      return res.status(400).json({
        message: "Tài khoản không tồn tại",
      });
    }

    const user = users[0];

    // 3. So sánh password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Sai mật khẩu",
      });
    }

    // 4. Tạo token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role || "USER",
      },
      SECRET_KEY,
      { expiresIn: "1d" },
    );

    // 5. Trả về
    return res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Lỗi server",
    });
  }
};

module.exports = {
  register,
  login,
};
