const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  menteeId: { type: DataTypes.UUID, allowNull: false },
  mentorId: { type: DataTypes.UUID, allowNull: false },
  slotId: { type: DataTypes.UUID, allowNull: false },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'confirmed',
  },
  meetingLink: { type: DataTypes.STRING },
  meetingPlatform: { type: DataTypes.ENUM('zoom', 'teams', 'meet', 'other'), defaultValue: 'zoom' },
  menteeNotes: { type: DataTypes.TEXT },
  mentorNotes: { type: DataTypes.TEXT },
  paymentId: { type: DataTypes.STRING },
}, {
  tableName: 'bookings',
  timestamps: true,
});

module.exports = Booking;
