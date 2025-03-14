// cartController.js

const Cart = require('../Model/cart');
const Product = require('../Model/product');

// Create a new cart
const createCart = async (req, res) => {
    try {
        let cart;
        if (req.user) {
            cart = new Cart({ user: req.user.id });
        } else if(req.guestId){
          cart = new Cart({ guestID: req.guestId })
        }else{
            return res.status(400).json({ message: 'User or guest ID not found.' });
        }
        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add an item to the cart
const addItemToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        let cart;

        if (req.user) {
            cart = await Cart.findOne({ user: req.user.id });
             if (!cart) {
                cart = new Cart({ user: req.user.id });
            }
        } else if (req.guestId) {
            cart = await Cart.findOne({ guestID: req.guestId });
             if (!cart) {
                cart = new Cart({ guestID: req.guestId });
            }
        }

        if (!cart) return res.status(404).json({ message: 'Cart could not be created or found.' });
        
        if (!cart.items) {
            cart.items = [];
        }

        const existingItem = cart.items.find(item => item.product.toString() === productId);
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }


        if (existingItem) {
             // Update quantity if item already exists
             // Update the total by removing the old quantity and adding the new quantity
             cart.total -= existingItem.quantity * existingItem.price
             existingItem.quantity += quantity;
             cart.total += existingItem.quantity * product.price
        } else {
             // Add new item to the cart, including the price
             cart.items.push({ product: productId, name: product.name, quantity, price: product.price });
              cart.total += product.price * quantity;
        }

      
        await cart.save();
        res.status(200).json(cart); // Ensure only one res is sent
    } catch (error) {
        console.error('Error adding item to cart:', error); // added for debugging
        if (!res.headersSent) { // to ensure headers are not sent before
            res.status(500).json({ error: error.message });
        }
    }
};

// Remove an item from the cart
const removeItemFromCart = async (req, res) => {
    try {
        let cart;
         if (req.user){
          cart = await Cart.findOne({ user: req.user.id });
        } else if(req.guestId){
          cart = await Cart.findOne({ guestID: req.guestId });
        }

        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const itemIndex = cart.items.findIndex(item => item.id === req.params.itemId);
        if (itemIndex === -1) return res.status(404).json({ message: 'Item not found' });

        // Adjust the total before removing the item
        cart.total -= cart.items[itemIndex].quantity * cart.items[itemIndex].price;
        

        cart.items.splice(itemIndex, 1);
        await cart.save();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update item quantity in the cart
const updateItemInCart = async (req, res) => {
    try {
        const { quantity } = req.body;
         let cart;
        if (req.user){
          cart = await Cart.findOne({ user: req.user.id });
        } else if(req.guestId){
          cart = await Cart.findOne({ guestID: req.guestId });
        }

        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const item = cart.items.find(item => item.id === req.params.itemId);
        if (!item) return res.status(404).json({ message: 'Item not found' });

         // Adjust total price before updating quantity
         const product = await Product.findById(item.product);

        if(product){
              cart.total -= item.quantity * item.price;
              item.quantity = quantity; // Update quantity
              item.price = product.price // updated the price in case the product price was updated
              cart.total += quantity * item.price; // Update total
        }
        
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get cart details for a user or guest
const getCartDetails = async (req, res) => {
    try {
        let cart;
        if (req.user) {
            cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        } else if(req.guestId) {
          cart = await Cart.findOne({ guestID: req.guestId }).populate('items.product');
        }else{
            return res.status(404).json({ message: 'Cart not found for user or guest' });
        }

        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createCart,
    addItemToCart,
    removeItemFromCart,
    updateItemInCart,
    getCartDetails,
};