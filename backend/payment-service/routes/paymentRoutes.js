const express = require('express');
const router = express.Router();
const {
  createPayment,
  getPaymentById,
  getUserPayments,
} = require('../controllers/paymentController');

router.post('/create', createPayment);
router.get('/:id', getPaymentById);
router.get('/history/:userId', getUserPayments);

module.exports = router;
