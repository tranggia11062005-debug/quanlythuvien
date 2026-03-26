const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET ALL CATEGORY
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.id, c.name, p.name AS parent_name
      FROM categories c
      LEFT JOIN categories p ON c.parent_id = p.id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi DB" });
  }
});

module.exports = router;
