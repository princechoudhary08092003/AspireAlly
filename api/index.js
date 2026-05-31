const { sequelize } = require('../server/models');
const { seedAll } = require('../server/seed');
const app = require('../server/app');

let ready = false;

module.exports = async (req, res) => {
  if (!ready) {
    try {
      await sequelize.authenticate();
      await sequelize.sync({ alter: false });
      await seedAll();
      ready = true;
      console.log('DB ready and seeded');
    } catch (err) {
      console.error('Init error:', err.message);
      // Still attempt to handle request even if seed fails
    }
  }
  return app(req, res);
};
