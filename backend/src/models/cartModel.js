const db = require("../config/db");

exports.getCart = async (userId) => {
  const [rows] = await db.query(
    `SELECT ci.id, p.name, p.price, ci.quantity
     FROM cart_items ci
     JOIN products p ON ci.product_id = p.id
     WHERE ci.cart_id = ?`,
    [userId],
  );
  return rows;
};

exports.addItem = async (userId, productId) => {
  await db.query(
    "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, 1)",
    [userId, productId],
  );
};
