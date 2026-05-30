const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MentorProfile = sequelize.define('MentorProfile', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false, unique: true },
  title: { type: DataTypes.STRING },
  company: { type: DataTypes.STRING },
  bio: { type: DataTypes.TEXT },
  yearsExperience: { type: DataTypes.INTEGER, defaultValue: 0 },
  expertise: {
    type: DataTypes.TEXT,
    get() {
      const val = this.getDataValue('expertise');
      return val ? JSON.parse(val) : [];
    },
    set(val) {
      this.setDataValue('expertise', JSON.stringify(val || []));
    },
  },
  linkedinUrl: { type: DataTypes.STRING },
  photoUrl: { type: DataTypes.STRING },
  sessionPrice: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  isApproved: { type: DataTypes.BOOLEAN, defaultValue: false },
  isVisible: { type: DataTypes.BOOLEAN, defaultValue: false },
  rating: { type: DataTypes.FLOAT, defaultValue: 0 },
  sessionCount: { type: DataTypes.INTEGER, defaultValue: 0 },
}, {
  tableName: 'mentor_profiles',
  timestamps: true,
});

module.exports = MentorProfile;
