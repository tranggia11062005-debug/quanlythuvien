const cartModel = require("../models/cartModel");

exports.getCart = async (req, res) => {
  const data = await cartModel.getCart(req.user.id);
  res.json(data);
};

exports.addToCart = async (req, res) => {
  const { productId } = req.body;

  await cartModel.addItem(req.user.id, productId);

  res.json({ message: "Đã thêm vào giỏ" });
};
