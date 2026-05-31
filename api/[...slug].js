// Force Vercel bundler to include pg drivers (conditional requires get skipped otherwise)
require('pg');
require('pg-hstore');

const { sequelize } = require('../server/models');
const { seedAll } = require('../server/seed');
const app = require('../server/app');

const init = (async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: false });
  await seedAll();
  console.log('DB ready and seeded');
})();

module.exports = async (req, res) => {
  try {
    await init;
  } catch (err) {
    console.error('DB init failed:', err.message);
    return res.status(500).json({ message: 'Server error: ' + err.message });
  }
  return app(req, res);
};
