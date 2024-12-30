// Import necessary modules and middleware
const express = require('express');
const router = express.Router();
const Cart = require('../Model/cart');
const User = require('../Model/user');
const Product = require('../Model/product');
const verifyAccessToken = require('../Middleware/verifyAuthAccess');
const verifyRefreshToken = require('../Middleware/verifyRefresh');
const validateAccessToken = require('../Middleware/arthorizeToken');

// Apply middleware for all cart routes
router.use(validateAccessToken);

// Create a new cart
router.post('/api/carts', async (req, res) => {
    try {
        const userId = req.user.id; // Access user ID from the verified token
        const cart = new Cart({ user: userId });
        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add an item to the cart
router.post('/api/carts/:cartId/items', async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cart = await Cart.findById(req.params.cartId);
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const existingItem = cart.items.find(item => item.product.toString() === productId);
        
        if (existingItem) {
            // Update quantity if item already exists
            existingItem.quantity += quantity;
        } else {
            // Add new item to the cart
            cart.items.push({ product: productId, quantity });
        }

        // Calculate total
        const product = await Product.findById(productId);
        cart.total += product.price * quantity;

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove an item from the cart
router.delete('/api/carts/:cartId/items/:itemId', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cartId);
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const itemIndex = cart.items.findIndex(item => item.id === req.params.itemId);
        if (itemIndex === -1) return res.status(404).json({ message: 'Item not found' });

        // Adjust the total before removing the item
        cart.total -= cart.items[itemIndex].quantity * (await Product.findById(cart.items[itemIndex].product)).price;

        cart.items.splice(itemIndex, 1);
        await cart.save();
        res.status(204).send(); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update item quantity in the cart
router.put('/api/carts/:cartId/items/:itemId', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findById(req.params.cartId);
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const item = cart.items.find(item => item.id === req.params.itemId);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        // Adjust total price before updating quantity
        const product = await Product.findById(item.product);
        cart.total -= item.quantity * product.price;
        
        item.quantity = quantity; // Update quantity
        cart.total += quantity * product.price; // Update total

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get cart details for a user
router.get('/api/carts/:cartId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;