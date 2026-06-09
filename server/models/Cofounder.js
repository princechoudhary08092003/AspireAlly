const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cofounder = sequelize.define('Cofounder', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  initials: { type: DataTypes.STRING(8), allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
  bio: { type: DataTypes.TEXT, allowNull: true },
  linkedinUrl: { type: DataTypes.STRING, allowNull: true },
  gradient: { type: DataTypes.STRING, allowNull: true, defaultValue: 'linear-gradient(135deg,#2563EB,#1E3A8A)' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'cofounders' });

module.exports = Cofounder;
