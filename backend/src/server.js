const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/order", require("./routes/orderRoutes"));
const db = require("./config/db");

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
