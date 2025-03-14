// Onstore-BE/routes/imageRouters.js
const express = require('express');
const router = express.Router();
const imageController = require('../routesControllers/imageController');

router.post('/api/images/upload', imageController.uploadImage);
router.get("/api/images/:imageName", imageController.getImage);
router.post("/api/images/delete/:imageName", imageController.deleteImage); 

module.exports = router;