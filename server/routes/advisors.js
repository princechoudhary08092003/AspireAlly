const router = require('express').Router();
const { Advisor } = require('../models');

// Public: list active advisors
router.get('/', async (req, res) => {
  try {
    const advisors = await Advisor.findAll({
      where: { isActive: true },
      order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']],
    });
    res.json(advisors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
