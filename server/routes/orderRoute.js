const express = require('express');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const { createOrder, myOrders, getSingleOrder, getAllOrders, updateOrderStatus, deleteOrder } = require('../controllers/orderController');
const router = express.Router();

router.route('/order/new').post(isAuthenticatedUser, createOrder);
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);
router.route('/orders/me').get(isAuthenticatedUser, myOrders);
router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles("Admin"), getAllOrders);
router.route('/admin/order/:id').put(isAuthenticatedUser, authorizeRoles("Admin"), updateOrderStatus).delete(isAuthenticatedUser, authorizeRoles("Admin"), deleteOrder);

module.exports = router;