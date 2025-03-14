// collectionRoutes.js
const express = require('express');
const router = express.Router();
const {
    createCollection,
    getAllCollections,
    getCollectionById,
    updateCollection,
    deleteCollection,
    getProductsInCollection,
    getNewestCollections,
} = require('../routesControllers/collectionController');
const arthorizeRole = require('../Middleware/arthorizeRole');
const validateAccessToken = require('../Middleware/arthorizeToken');

// Protect routes with middleware if necessary
// router.use(validateAccessToken);
// router.use(arthorizeRole('admin', 'employee'));

// Define routes
router.post('/api/collections', createCollection); // Create a new collection
router.get('/api/collections', getAllCollections); // Get all collections
router.get('/api/collections/:id', getCollectionById); // Get collection by ID
router.put('/api/collections/:id', updateCollection); // Update a collection
router.delete('/api/collections/:id', deleteCollection); // Delete a collection
router.get('/api/collections/:id/products', getProductsInCollection); // Get products in a collection
router.get('/api/newest-collections', getNewestCollections); // Get 4 newest collections

// Export the collection routes
module.exports = router;