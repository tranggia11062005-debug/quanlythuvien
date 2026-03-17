const productModel = require("../models/productModel");

exports.getProducts = async (req, res) => {
  const data = await productModel.getAll();
  res.json(data);
};
