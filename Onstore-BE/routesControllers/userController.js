// usersController.js

const User = require('../Model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Secret key for JWT generation
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;
const JWT_SECRET_REFRESH = process.env.REFRESH_TOKEN_SECRET;

// Create a new user
const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username, 
            email, 
            password: hashedPassword,
            role: role || 'user',
            refreshTokens: []
        });

        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// User login
const loginUser = async (req, res) => {
    try {
        console.log("loginUser",req.body);
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email }).select("+password"); // Select the password field
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const ACCESS_TOKEN = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30s' });
        const REFRESH_TOKEN = jwt.sign({ id: user._id }, JWT_SECRET_REFRESH, { expiresIn: '7d' });

        user.refreshTokens.push(REFRESH_TOKEN); // Store the refresh token
        await user.save(); // Save user document with new token

        // Set the refresh token in an HTTP-only cookie
        res.cookie('refreshToken', REFRESH_TOKEN, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie will last for 7 days
        });
        console.log(user)

        res.status(200).json({ accessToken: ACCESS_TOKEN, id: user._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const userAuthStatus = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken; // Access the cookie
        if (refreshToken && req.user) {
            if (req.user.role == "admin" || req.user.role == "employee") {
                res.status(200).json({isLoggedIn: true, isGuested: false, username: req.user.username, role: req.user.role})
            } else {
                res.status(200).json({ isLoggedIn: true, isGuested: false, username: req.user.username });
                console.log("passing through");
            }
        } else if(req.guestId) {
            res.status(200).json({ isLoggedIn: false, isGuested: true});
        } else {
          res.status(200).json({ isLoggedIn: false });
        }
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
};


// Refresh access token using refresh token
const refreshAccessToken = async (req, res) => {
    const newAccessToken = jwt.sign({ id: req.user.id }, JWT_SECRET, { expiresIn: '30s' });
    res.json({ accessToken: newAccessToken });
};

// Logout user and invalidate refresh token
const logoutUser = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token required' });
    }
    
    try {
        // Find the user by checking the refresh token
        const user = await User.findOne({ refreshTokens: refreshToken });

        if (!user) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        // Remove the refresh token from the user's refreshTokens array
        user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
        await user.save(); // Save the updated user document
        res.clearCookie('refreshToken');
        res.clearCookie('guestId');
        res.status(200).json({ message: 'Successfully logged out' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a user
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Export controller functions
module.exports = {
    registerUser,
    loginUser,
    userAuthStatus,
    refreshAccessToken,
    logoutUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};