const db = require("../config/db");

const Product = {
  getAll: () => {
    return db.query(
      "SELECT * FROM products WHERE is_deleted = 0 ORDER BY created_at DESC",
    );
  },

  getById: (id) => {
    return db.query("SELECT * FROM products WHERE id = ?", [id]);
  },
  softDelete: (id) => {
    return db.query("UPDATE products SET is_deleted = 1 WHERE id = ?", [id]);
  },

  // ✅ Phải nằm TRONG object Product
  getAdminBooks: () => {
    const sql = `
      SELECT 
        p.id, p.name AS title, p.price, p.old_price, p.discount, 
        p.image, p.stock, b.author, b.publisher, b.translator, 
        b.language, b.pages, b.weight, b.size, b.cover_type, 
        b.tags, b.rating
      FROM products p
      INNER JOIN books b ON p.id = b.product_id
      WHERE p.is_deleted = 0
    `;
    return db.query(sql);
  },
  getDeletedBooks: () => {
    return db.query(`
      SELECT p.id, p.name AS title, p.image, b.author 
      FROM products p 
      INNER JOIN books b ON p.id = b.product_id 
      WHERE p.is_deleted = 1
    `);
  },

  restore: (ids) => {
    // Đảm bảo ids là mảng, nếu chỉ có 1 ID đơn lẻ thì bọc nó lại
    const queryIds = Array.isArray(ids) ? ids : [ids];
    return db.query("UPDATE products SET is_deleted = 0 WHERE id IN (?)", [
      queryIds,
    ]);
  },
}; // ✅ Đóng ngoặc ở cuối cùng này

module.exports = Product;
