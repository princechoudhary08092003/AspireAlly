require('dotenv').config();
const { sequelize } = require('./models');
const { seedAll } = require('./seed');
const app = require('./app');

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: false }).then(async () => {
  await seedAll();
  app.listen(PORT, () => console.log(`AspireAlly server running on http://localhost:${PORT}`));
}).catch(err => console.error('DB sync error:', err));
