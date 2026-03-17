const db = require("../config/db");

exports.checkout = async (req, res) => {
  const userId = req.user.id;

  const [items] = await db.query("SELECT * FROM cart_items WHERE cart_id = ?", [
    userId,
  ]);

  let total = 0;

  for (let item of items) {
    const [product] = await db.query(
      "SELECT price FROM products WHERE id = ?",
      [item.product_id],
    );

    total += product[0].price * item.quantity;
  }

  const [order] = await db.query(
    "INSERT INTO orders (user_id, total_price) VALUES (?, ?)",
    [userId, total],
  );

  for (let item of items) {
    await db.query(
      "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
      [order.insertId, item.product_id, item.quantity, 0],
    );
  }

  await db.query("DELETE FROM cart_items WHERE cart_id = ?", [userId]);

  res.json({ message: "Đặt hàng thành công" });
};
