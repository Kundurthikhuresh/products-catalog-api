const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.page) || 1;
    const limitNumber = parseInt(req.query.limit) || 5;

    const { search, category, price } = req.query;

    const matchStage = {};

    if (search) {
      matchStage.name = { $regex: search, $options: 'i' };
    }

    if (category) {
      matchStage.category = category;
    }

    if (price) {
      matchStage.price = Number(price);
    }

    const products = await Product.aggregate([
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
      { $skip: (pageNumber - 1) * limitNumber },
      { $limit: limitNumber }
    ]);

    res.json({
      page: pageNumber,
      limit: limitNumber,
      results: products.length,
      products
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    Object.assign(product, req.body);
    const updatedProduct = await product.save();

    res.json(updatedProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product removed successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
