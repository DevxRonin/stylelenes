const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST /api/orders
router.post('/', orderController.createOrder);

// GET /api/orders
router.get('/', orderController.getOrders);

// GET /api/orders/:id
router.get('/:id', orderController.getOrderById);

module.exports = router;
