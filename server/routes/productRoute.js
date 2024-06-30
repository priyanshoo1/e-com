const express = require('express');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getAllReviews, deleteReview } = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/products/new").post(isAuthenticatedUser, authorizeRoles("Admin"), createProduct);
router.route("/admin/products/:id").put(isAuthenticatedUser, authorizeRoles("Admin"), updateProduct).delete(isAuthenticatedUser, authorizeRoles("Admin"), deleteProduct);
router.route("/products/:id").get(getProductDetails);
router.route("/review").put(isAuthenticatedUser, createProductReview);
router.route("/product/reviews").get(getAllReviews).delete(isAuthenticatedUser, deleteReview);

module.exports = router;