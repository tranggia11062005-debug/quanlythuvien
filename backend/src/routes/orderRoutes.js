const express = require("express");
const router = express.Router();
const order = require("../controllers/orderController");
const auth = require("../middleware/auth");

router.post("/checkout", auth, order.checkout);

module.exports = router;
