const Product = require("../models/productModel");
const db = require("../config/db");

const getAllProducts = async (req, res) => {
  try {
    const [rows] = await Product.getAll();
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: "Lỗi cơ sở dữ liệu", error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await Product.getById(id);
    if (rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy" });
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Lỗi hệ thống", error: err.message });
  }
};
const getAllAdminBooks = async (req, res) => {
  try {
    const [rows] = await Product.getAdminBooks(); // Đã chuyển sang dùng Promise cho đồng bộ
    res.status(200).json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi lấy dữ liệu sách admin", error: err.message });
  }
};
const createProduct = async (req, res) => {
  const conn = await db.getConnection();
  try {
    // 1. Lấy dữ liệu (Đã loại bỏ category_id)
    const {
      name,
      language,
      author,
      publisher,
      translator,
      size,
      pages,
      weight,
      cover_type,
      price,
      description,
      tags,
    } = req.body;

    const image = req.file
      ? `http://localhost:8080/uploads/${req.file.filename}`
      : null;

    await conn.beginTransaction();

    // 2. Chèn vào bảng products (Khớp chính xác cột trong DB của bạn)
    const [productResult] = await conn.query(
      `INSERT INTO products (name, price, description, image, stock, is_deleted) 
       VALUES (?, ?, ?, ?, ?, 0)`,
      [name, price || 0, description, image, 100], // Mặc định stock là 100
    );

    const productId = productResult.insertId;

    // 3. Chèn vào bảng books (Khớp chính xác cột: author, publisher là VARCHAR)
    await conn.query(
      `INSERT INTO books (product_id, author, publisher, translator, language, pages, weight, size, cover_type, tags) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productId,
        author,
        publisher,
        translator,
        language,
        pages,
        weight,
        size,
        cover_type,
        tags,
      ],
    );

    await conn.commit();
    res
      .status(201)
      .json({ success: true, message: "Thêm sách thành convention!" });
  } catch (err) {
    await conn.rollback();
    console.error("LỖI TẠI BACKEND:", err.message);
    res.status(500).json({ success: false, message: "Lỗi DB: " + err.message });
  } finally {
    conn.release();
  }
};
const updateProduct = async (req, res) => {
  res.json({ msg: "Chưa viết logic sửa" });
};
const deleteProduct = async (req, res) => {
  const { ids } = req.body; // Client gửi lên mảng ID: [1, 2, 5]

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "Không có sản phẩm nào được chọn" });
  }

  try {
    // Cập nhật is_deleted = 1 cho tất cả ID trong mảng
    const [result] = await db.query(
      "UPDATE products SET is_deleted = 1 WHERE id IN (?)",
      [ids],
    );

    res.status(200).json({
      success: true,
      message: `Đã chuyển ${result.affectedRows} sản phẩm vào thùng rác`,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi DB", error: err.message });
  }
};
const getTrashBooks = async (req, res) => {
  try {
    const [rows] = await Product.getDeletedBooks();
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy thùng rác", error: err.message });
  }
};

const restoreProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    await Product.restore(ids);
    res.status(200).json({ success: true, message: "Khôi phục thành công!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khôi phục", error: err.message });
  }
};
module.exports = {
  getAllProducts,
  getProductById,
  getAllAdminBooks,
  createProduct,
  updateProduct,
  deleteProduct,
  getTrashBooks,
  restoreProducts,
};
