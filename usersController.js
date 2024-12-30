const express = require('express');
const router = express.Router();
const User = require('../Model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyAccessToken = require('../Middleware/verifyAuthAccess.js');
const verifyRefreshToken = require('../Middleware/verifyRefresh.js');
const arthorizeRole = require('../Middleware/arthorizeRole');

require('dotenv').config();

// Secret key for JWT generation
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;
const JWT_SECRET_REFRESH = process.env.REFRESH_TOKEN_SECRET;
// Create a new user
router.post('/users/registration', async (req, res) => {
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
});

// User login
router.post('/api/users/login', async (req, res) => {
  try {
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
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production only
      maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie will last for 7 days
    });

    res.status(200).json({ accessToken: ACCESS_TOKEN }); // Send access token
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Refresh access token using refresh token
router.post('/api/users/refresh',verifyRefreshToken, async (req, res) => {
  // The refresh token is already verified in the middleware,
  // so we can create a new access token
  const newAccessToken = jwt.sign({ id: req.user.id }, JWT_SECRET, { expiresIn: '30s' });
  res.json({ accessToken: newAccessToken });
});

// Logout user and invalidate refresh token
router.post('/api/users/logout', async (req, res) => {
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

    res.status(200).json({ message: 'Successfully logged out' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
router.get('/api/users',verifyRefreshToken,arthorizeRole('admin'), async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a user by ID
router.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a user
router.put('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a user
router.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
