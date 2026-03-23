const db = require("../config/db");

const checkout = async (req, res) => {
  try {
    const userId = req.user.id;

    const [items] = await db.query(
      "SELECT * FROM cart_items WHERE cart_id = ?",
      [userId],
    );

    if (items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    let total = 0;
    for (let item of items) {
      const [product] = await db.query(
        "SELECT price FROM products WHERE id = ?",
        [item.product_id],
      );
      total += product[0].price * item.quantity;
    }

    const [orderResult] = await db.query(
      "INSERT INTO orders (user_id, total_price) VALUES (?, ?)",
      [userId, total],
    );

    const orderId = orderResult.insertId;

    for (let item of items) {
      await db.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.product_id, item.quantity, 0],
      );
    }

    await db.query("DELETE FROM cart_items WHERE cart_id = ?", [userId]);

    res.json({ message: "Đặt hàng thành công", orderId });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Lỗi khi thanh toán", error: error.message });
  }
};

// ✅ Xuất bản chuẩn
module.exports = {
  checkout,
};
