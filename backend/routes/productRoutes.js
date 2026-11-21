const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products
router.get('/', productController.getProducts);

// GET /api/products/categories/all
router.get('/categories/all', productController.getCategories);

// GET /api/products/:id
router.get('/:id', productController.getProductById);

module.exports = router;
