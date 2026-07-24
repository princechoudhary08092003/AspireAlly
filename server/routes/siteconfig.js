const router = require('express').Router();
const { SiteConfig } = require('../models');

router.get('/', async (req, res) => {
  try {
    const configs = await SiteConfig.findAll();
    const result = {};
    configs.forEach(c => { result[c.key] = c.value; });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
