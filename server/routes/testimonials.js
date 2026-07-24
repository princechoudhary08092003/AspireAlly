const router = require('express').Router();
const { Testimonial } = require('../models');

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

module.exports = router;
