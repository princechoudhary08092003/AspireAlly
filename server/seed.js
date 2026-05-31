const bcrypt = require('bcryptjs');
const { User, MentorProfile } = require('./models');

const seedUser = async (data) => {
  const exists = await User.findOne({ where: { email: data.email } });
  if (!exists) {
    const hashed = await bcrypt.hash(data.password, 12);
    const user = await User.create({ ...data, password: hashed, isEmailVerified: true, isActive: true });
    if (data.role === 'mentor') await MentorProfile.create({ userId: user.id });
    console.log(`Seeded [${data.role}]: ${data.email}`);
  }
};

const seedAll = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@aspireally.in';
  await seedUser({ email: adminEmail, password: process.env.ADMIN_PASSWORD || 'Admin@123', firstName: 'Admin', lastName: 'AspireAlly', role: 'admin' });
  await seedUser({ email: 'demo.admin@aspireally.in', password: 'Demo@1234', firstName: 'Demo', lastName: 'Admin', role: 'admin' });
  await seedUser({ email: 'mentor@demo.com', password: 'Demo@1234', firstName: 'Arjun', lastName: 'Sharma', role: 'mentor' });
  await seedUser({ email: 'mentee@demo.com', password: 'Demo@1234', firstName: 'Priya', lastName: 'Kapoor', role: 'mentee' });
};

module.exports = { seedAll };
