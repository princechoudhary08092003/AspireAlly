const { sequelize } = require('../server/models');
const { seedAll } = require('../server/seed');
const app = require('../server/app');

let ready = false;

module.exports = async (req, res) => {
  if (!ready) {
    await sequelize.sync({ alter: false });
    await seedAll();
    ready = true;
  }
  return app(req, res);
};
