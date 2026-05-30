const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TimeSlot = sequelize.define('TimeSlot', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  mentorId: { type: DataTypes.UUID, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  startTime: { type: DataTypes.STRING, allowNull: false },
  endTime: { type: DataTypes.STRING, allowNull: false },
  durationMinutes: { type: DataTypes.INTEGER, defaultValue: 60 },
  isBooked: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'time_slots',
  timestamps: true,
});

module.exports = TimeSlot;
