const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');
const { validateOrder } = require('../middleware/validation');

router.post('/', authenticate, validateOrder, orderController.createOrder);
router.post('/:id/verify-payment', authenticate, orderController.verifyOrderPayment);
router.get('/', authenticate, orderController.getUserOrders);
router.get('/:id', authenticate, orderController.getOrderById);

module.exports = router;
