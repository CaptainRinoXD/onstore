// productController.js

const Product = require('../Model/product');

// Create a new product
const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a product
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(204).send(); // No content to send
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a review to a product
const addReviewToProduct = async (req, res) => {
    try {
        const { username, rating, text } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const review = { username, rating, text };
        product.reviews.push(review);
        await product.save();

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all reviews of a product
const getProductReviews = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).select('reviews');
        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json(product.reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add or update size stock for a product
const updateSizeStock = async (req, res) => {
    const { size, quantity } = req.body;
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Check if the size already exists in the sizeStock
        const sizeStock = product.sizeStock.find(item => item.size === size);

        if (sizeStock) {
            // Update existing size stock
            sizeStock.quantity = quantity;
        } else {
            // Add new size stock
            product.sizeStock.push({ size, quantity });
        }

        await product.save(); // Save the updated product
        res.status(200).json(product.sizeStock); // Optionally return the entire product or just the updated sizeStock
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProductsByProductType = async (req, res) => {
    try {
        const { productType } = req.params;
        const products = await Product.find({ type: productType }).populate('type');
        res.status(200).json(products);
    } catch (error) {
       res.status(500).json({ error: error.message });
   }
};

const searchProducts = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
           return res.status(400).json({message: 'Please provide a search query' });
        }
        
        const products = await Product.find({
            name: { $regex: query, $options: 'i' } // 'i' for case-insensitive search
        }).limit(10); // Limit to top 10 results (for performance)

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Export controller functions
module.exports = {
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
};