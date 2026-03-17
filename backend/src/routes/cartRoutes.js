const express = require("express");
const router = express.Router();
const cart = require("../controllers/cartController");
const auth = require("../middleware/auth");

router.get("/", auth, cart.getCart);
router.post("/", auth, cart.addToCart);

module.exports = router;
