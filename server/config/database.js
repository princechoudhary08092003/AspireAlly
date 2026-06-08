const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

let sequelize;

if (process.env.DATABASE_URL) {
  // Neon / any PostgreSQL connection string (used on Vercel)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
    logging: false,
  });
} else if (process.env.DB_DIALECT === 'mysql') {
  // Hostinger MySQL
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
  });
} else {
  // SQLite — local dev only
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'mentorpath.sqlite'),
    logging: false,
  });
}

module.exports = sequelize;
