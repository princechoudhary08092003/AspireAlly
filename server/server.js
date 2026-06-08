require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { sequelize } = require('./models');
const { seedAll } = require('./seed');
const app = require('./app');

const PORT = process.env.PORT || 5000;

// Start listening immediately so Hostinger/Passenger doesn't get a 503
const server = app.listen(PORT, () => {
  console.log(`MentorRise server running on port ${PORT}`);
});

// Then connect to DB and seed in the background
sequelize.sync({ alter: false })
  .then(async () => {
    console.log('Database connected and synced');
    await seedAll();
    console.log('Seed complete');
  })
  .catch(err => {
    console.error('DB sync error:', err.message);
  });
