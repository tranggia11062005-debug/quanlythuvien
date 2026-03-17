const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Agia123456789@",
  database: "QuanLyBanSach",
});

module.exports = db;
