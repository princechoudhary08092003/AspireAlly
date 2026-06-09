const router = require('express').Router();
const { Cofounder } = require('../models');

// Public: list active cofounders
router.get('/', async (req, res) => {
  try {
    const cofounders = await Cofounder.findAll({
      where: { isActive: true },
      order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']],
    });
    res.json(cofounders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
