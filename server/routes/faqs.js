const router = require('express').Router();
const { Faq } = require('../models');

router.get('/', async (req, res) => {
  try {
    const faqs = await Faq.findAll({
      where: { isActive: true },
      order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']],
    });
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
