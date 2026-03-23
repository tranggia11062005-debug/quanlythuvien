const cartModel = require("../models/cartModel");

const getCart = async (req, res) => {
  try {
    const data = await cartModel.getCart(req.user.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy giỏ hàng" });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    await cartModel.addItem(req.user.id, productId);
    res.json({ message: "Đã thêm vào giỏ" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi thêm vào giỏ" });
  }
};

// Đảm bảo export đúng như thế này
module.exports = {
  getCart,
  addToCart,
};
