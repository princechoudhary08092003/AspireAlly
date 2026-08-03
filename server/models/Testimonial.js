const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Testimonial = sequelize.define('Testimonial', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING },
  company: { type: DataTypes.STRING },
  quote: { type: DataTypes.TEXT, allowNull: false },
  rating: { type: DataTypes.INTEGER, defaultValue: 5 },
  initials: { type: DataTypes.STRING(4) },
  gradient: { type: DataTypes.STRING, defaultValue: 'linear-gradient(135deg,#2563EB,#1E3A8A)' },
  tag: { type: DataTypes.STRING },
  submittedByUserId: { type: DataTypes.UUID, allowNull: true },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'testimonials' });

module.exports = Testimonial;
