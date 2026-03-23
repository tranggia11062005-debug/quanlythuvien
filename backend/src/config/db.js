const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Agia123456789@",
  database: "QuanLyBanSach",
});
db.getConnection()
  .then((connection) => {
    console.log("✅ Kết nối Database thành công!");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ Kết nối Database thất bại:", err.message);
  });

module.exports = db;
