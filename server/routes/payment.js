const router = require('express').Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Subscription } = require('../models');
const { auth, requireRole } = require('../middleware/auth');

const PLANS = {
  monthly:   { amount: 99900,  label: 'Monthly',   months: 1 },
  quarterly: { amount: 249900, label: 'Quarterly',  months: 3 },
  annual:    { amount: 799900, label: 'Annual',     months: 12 },
};

const getRazorpay = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
router.post('/create-order', auth, requireRole('mentee'), async (req, res) => {
  try {
    const { plan } = req.body;
    if (!PLANS[plan]) return res.status(400).json({ message: 'Invalid plan' });

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: PLANS[plan].amount,
      currency: 'INR',
      receipt: `sub_${req.user.id}_${Date.now()}`,
    });

    const sub = await Subscription.create({
      userId: req.user.id,
      plan,
      amount: PLANS[plan].amount / 100,
      currency: 'INR',
      razorpayOrderId: order.id,
      status: 'pending',
    });

    res.json({ orderId: order.id, amount: PLANS[plan].amount, currency: 'INR', subscriptionId: sub.id, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify payment & activate subscription
router.post('/verify', auth, requireRole('mentee'), async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, subscriptionId } = req.body;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const sub = await Subscription.findOne({ where: { id: subscriptionId, userId: req.user.id } });
    if (!sub) return res.status(404).json({ message: 'Subscription record not found' });

    const now = new Date();
    const expires = new Date(now);
    expires.setMonth(expires.getMonth() + PLANS[sub.plan].months);

    await sub.update({
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: 'active',
      startsAt: now,
      expiresAt: expires,
    });

    res.json({ message: 'Payment successful! Subscription activated.', expiresAt: expires });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get subscription status
router.get('/subscription', auth, async (req, res) => {
  try {
    const sub = await Subscription.findOne({
      where: { userId: req.user.id, status: 'active' },
      order: [['expiresAt', 'DESC']],
    });
    res.json({ subscription: sub, plans: PLANS });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
