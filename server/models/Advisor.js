const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Advisor = sequelize.define('Advisor', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  initials: { type: DataTypes.STRING(8), allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
  company: { type: DataTypes.STRING, allowNull: true },
  location: { type: DataTypes.STRING, allowNull: true },
  bio: { type: DataTypes.TEXT, allowNull: true },
  tags: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
  followers: { type: DataTypes.STRING, allowNull: true },
  linkedinUrl: { type: DataTypes.STRING, allowNull: true },
  gradient: { type: DataTypes.STRING, allowNull: true, defaultValue: 'linear-gradient(135deg,#2563EB,#1E3A8A)' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'advisors' });

module.exports = Advisor;
