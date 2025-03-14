// productRoutes.js
const express = require('express');
const router = express.Router();
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    addReviewToProduct,
    getProductReviews,
    updateSizeStock,
    getProductsByProductType,
    searchProducts,
} = require('../routesControllers/productController');
const arthorizeRole = require('../Middleware/arthorizeRole');
const validateAccessToken = require('../Middleware/arthorizeToken');

// Protect product routes with middleware if necessary
// router.use(validateAccessToken);
// router.use(arthorizeRole('admin', 'employee'));

// Define routes
router.post('/api/products', createProduct); // Create a new product
router.get('/api/products', getAllProducts); // Get all products
router.get('/api/products/:id', getProductById); // Get a product by ID
router.put('/api/products/:id', updateProduct); // Update a product
router.delete('/api/products/:id', deleteProduct); // Delete a product
router.post('/api/products/:id/reviews', addReviewToProduct); // Add a review to a product
router.get('/api/products/:id/reviews', getProductReviews); // Get all reviews of a product
router.put('/api/products/:id/sizeStock', updateSizeStock); // Add or update size stock
router.get('/api/product/:productType/products', getProductsByProductType); // Get all products of a product type
router.get('/api/product_search/search', searchProducts); // Search products
// Export the product routes
module.exports = router;