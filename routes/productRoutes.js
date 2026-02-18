const express = require('express');
const { body } = require('express-validator');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(
    protect,
    [
      body('name').notEmpty().withMessage('Product name is required'),
      body('category').notEmpty().withMessage('Category is required'),
      body('price').isNumeric().withMessage('Price must be a number'),
      body('stock')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Stock must be a positive number')
    ],
    validate,
    createProduct
  );

router.route('/:id')
  .get(getProductById)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
