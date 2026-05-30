const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Subscription = sequelize.define('Subscription', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  plan: { type: DataTypes.ENUM('monthly', 'quarterly', 'annual'), allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  currency: { type: DataTypes.STRING, defaultValue: 'INR' },
  razorpayOrderId: { type: DataTypes.STRING },
  razorpayPaymentId: { type: DataTypes.STRING },
  razorpaySignature: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('pending', 'active', 'expired', 'cancelled'), defaultValue: 'pending' },
  startsAt: { type: DataTypes.DATE },
  expiresAt: { type: DataTypes.DATE },
}, {
  tableName: 'subscriptions',
  timestamps: true,
});

module.exports = Subscription;
