const sequelize = require('../config/database');
const User = require('./User');
const MentorProfile = require('./MentorProfile');
const TimeSlot = require('./TimeSlot');
const Booking = require('./Booking');
const Subscription = require('./Subscription');
const Advisor = require('./Advisor');

// Associations
User.hasOne(MentorProfile, { foreignKey: 'userId', as: 'mentorProfile' });
MentorProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(TimeSlot, { foreignKey: 'mentorId', as: 'timeSlots' });
TimeSlot.belongsTo(User, { foreignKey: 'mentorId', as: 'mentor' });

User.hasMany(Booking, { foreignKey: 'menteeId', as: 'menteeBookings' });
User.hasMany(Booking, { foreignKey: 'mentorId', as: 'mentorBookings' });
Booking.belongsTo(User, { foreignKey: 'menteeId', as: 'mentee' });
Booking.belongsTo(User, { foreignKey: 'mentorId', as: 'mentor' });
Booking.belongsTo(TimeSlot, { foreignKey: 'slotId', as: 'slot' });
TimeSlot.hasOne(Booking, { foreignKey: 'slotId', as: 'booking' });

User.hasMany(Subscription, { foreignKey: 'userId', as: 'subscriptions' });
Subscription.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = { sequelize, User, MentorProfile, TimeSlot, Booking, Subscription, Advisor };
