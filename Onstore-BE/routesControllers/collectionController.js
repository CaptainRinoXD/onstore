// collectionController.js

const Collection = require('../Model/collection');

// Create a new collection
const createCollection = async (req, res) => {
    try {
        const newCollection = new Collection(req.body);
        await newCollection.save();
        res.status(201).json(newCollection);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all collections
const getAllCollections = async (req, res) => {
    try {
        const collections = await Collection.find();
        res.status(200).json(collections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a collection by ID
const getCollectionById = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);
        if (!collection) return res.status(404).json({ message: 'Collection not found' });
        res.status(200).json(collection);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a collection
const updateCollection = async (req, res) => {
    try {
        const updatedCollection = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCollection) return res.status(404).json({ message: 'Collection not found' });
        res.status(200).json(updatedCollection);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a collection
const deleteCollection = async (req, res) => {
    try {
        const collection = await Collection.findByIdAndDelete(req.params.id);
        if (!collection) return res.status(404).json({ message: 'Collection not found' });
        res.status(204).send(); // No content to send
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all products in a collection by collection ID
const getProductsInCollection = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id).populate('products'); 
        if (!collection) return res.status(404).json({ message: 'Collection not found' });
        res.status(200).json(collection.products); // Return products associated with the collection
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getNewestCollections = async (req, res) => {
    try {
        const collections = await Collection.find()
            .sort({ createdAt: -1 }) // Sort by creation date, newest first
            .limit(4); // Limit to 4 collections
        res.status(200).json(collections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Export controller functions
module.exports = {
    createCollection,
    getAllCollections,
    getCollectionById,
    updateCollection,
    deleteCollection,
    getProductsInCollection,
    getNewestCollections,
};