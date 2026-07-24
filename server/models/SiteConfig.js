const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SiteConfig = sequelize.define('SiteConfig', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  key: { type: DataTypes.STRING, allowNull: false, unique: true },
  value: { type: DataTypes.TEXT, defaultValue: '' },
  label: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
}, { tableName: 'site_configs' });

module.exports = SiteConfig;
