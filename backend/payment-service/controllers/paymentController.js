const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/paymentModel');

// Create a payment intent and store record
exports.createPayment = async (req, res) => {
  const { orderId, userId, amount, paymentMethod } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
    });

    const payment = new Payment({
      orderId,
      userId,
      amount,
      paymentMethod,
      status: 'pending', // You'll manually update status in dev/testing
      paymentIntentId: paymentIntent.id,
    });

    await payment.save();

    res.status(201).json({
      message: 'Payment intent created successfully',
      clientSecret: paymentIntent.client_secret,
      payment,
    });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: 'Payment creation failed' });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
};

// Get payment history for a user
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
};
