const express = require("express");
const cors = require("cors");
require("dotenv").config();
console.log("Kiem tra JWT_SECRET:", process.env.JWT_SECRET);
const app = express();
const db = require("./config/db");

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

console.log("--- KIỂM TRA BIẾN MÔI TRƯỜNG ---");
console.log("JWT_SECRET từ .env:", process.env.JWT_SECRET);
console.log("DB_NAME từ .env:", process.env.DB_NAME);
console.log("--------------------------------");

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/order", require("./routes/orderRoutes"));
// app.get("/api/products", productController.getAllProducts);
// app.get("/api/products/:id", productController.getProductById);

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT NOW()");
    res.json({
      status: "OK",
      time: rows[0],
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
app.listen(8080, () => {
  console.log("Server chạy tại http://localhost:8080");
});
