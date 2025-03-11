const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const connectDB = require('./db/database'); 
const userRoutes = require('./routes/usersRouters'); 
const orderRoutes = require('./routes/orderRouters');
const productRoutes = require('./routes/productRouters'); 
const productTypeRouters = require('./routes/productTypeRouters');
const reviewRoutes = require('./routes/reviewRouters');
const collectionRoutes = require('./routes/collectionRouters');
const cartRoutes = require('./routes/cartRouters');
const paymentRouters = require('./routes/paymentRouters');
const imageRoutes = require("./routes/imageRouters");
const fileUpload = require("express-fileupload");
const path = require("path");



const app = express();
const PORT = process.env.PORT || 3002;


// Middleware
app.use(fileUpload());
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded 
app.use(cookieParser()); // For parsing cookies
app.use(cors({
  origin: 'http://localhost:3000', // replace with your client URL
  credentials: true, // Allow cookies to be sent
}));

// Use user routes
app.use(userRoutes); 
app.use(productRoutes); 
app.use(collectionRoutes);
app.use(cartRoutes); 
app.use(reviewRoutes);
app.use(orderRoutes);
app.use(productTypeRouters);
app.use(paymentRouters);
app.use(imageRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));



async function startServer() {
  await connectDB();  // Connect to database
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

// Start the server
startServer();
