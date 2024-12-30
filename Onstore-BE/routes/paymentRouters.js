const express = require('express');
const router = express.Router();
const paymentController = require('../routesControllers/paymentController');

router.post('/api/payment', paymentController.paymentController);
router.post('/api/paymemtCallBack', paymentController.callbackController);
router.post('/api/paymentStatus', paymentController.checkPaymentStatus);
module.exports = router;