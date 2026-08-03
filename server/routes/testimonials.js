const router = require('express').Router();
const { Testimonial, Booking } = require('../models');
const { auth, requireRole } = require('../middleware/auth');

// Public: get approved testimonials only
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.findAll({
      where: { isActive: true },
      order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']],
    });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mentee: submit a testimonial (pending admin approval)
router.post('/', auth, requireRole('mentee'), async (req, res) => {
  try {
    if (!req.user.isApproved) return res.status(403).json({ message: 'Your account is pending admin approval.' });

    // Check mentee has at least one booking
    const bookingCount = await Booking.count({ where: { menteeId: req.user.id } });
    if (bookingCount === 0) return res.status(403).json({ message: 'You need at least one session booking to submit a testimonial.' });

    const { quote, rating, tag } = req.body;
    if (!quote || quote.trim().length < 20) return res.status(400).json({ message: 'Testimonial must be at least 20 characters.' });

    const name = `${req.user.firstName} ${req.user.lastName}`;
    const initials = `${req.user.firstName[0]}${req.user.lastName[0]}`.toUpperCase();

    const t = await Testimonial.create({
      name,
      initials,
      quote: quote.trim(),
      rating: Math.min(5, Math.max(1, parseInt(rating) || 5)),
      tag: tag || '',
      isActive: false, // pending admin approval
      submittedByUserId: req.user.id,
      gradient: 'linear-gradient(135deg,#2563EB,#1D4ED8)',
      sortOrder: 0,
    });

    res.status(201).json({ message: 'Thank you! Your testimonial has been submitted and is pending review.', testimonial: t });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
