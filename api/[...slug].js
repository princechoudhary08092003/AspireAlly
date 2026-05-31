const { sequelize } = require('../server/models');
const { seedAll } = require('../server/seed');
const app = require('../server/app');

// Runs once per cold start — promise is shared across all requests in same instance
const init = sequelize.authenticate()
  .then(() => sequelize.sync({ alter: false }))
  .then(() => seedAll())
  .then(() => console.log('DB ready and seeded'))
  .catch(err => console.error('DB init error:', err.message));

module.exports = async (req, res) => {
  await init;
  return app(req, res);
};
