require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const { sequelize, User, MentorProfile } = require('./models');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/mentors', require('./routes/mentors'));
app.use('/api/slots', require('./routes/slots'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', env: process.env.NODE_ENV }));

const seedUser = async (data) => {
  const exists = await User.findOne({ where: { email: data.email } });
  if (!exists) {
    const hashed = await bcrypt.hash(data.password, 12);
    const user = await User.create({ ...data, password: hashed, isEmailVerified: true, isActive: true });
    if (data.role === 'mentor') await MentorProfile.create({ userId: user.id });
    console.log(`Seeded [${data.role}]: ${data.email}`);
  }
};

const seedAdmin = async () => {
  // Configurable production admin (set ADMIN_EMAIL + ADMIN_PASSWORD in .env)
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@aspireally.in';
  await seedUser({ email: adminEmail, password: process.env.ADMIN_PASSWORD || 'Admin@123', firstName: 'Admin', lastName: 'AspireAlly', role: 'admin' });

  // Fixed demo accounts for testing — always available, bypass email verification
  await seedUser({ email: 'demo.admin@aspireally.in', password: 'Demo@1234', firstName: 'Demo', lastName: 'Admin', role: 'admin' });
  await seedUser({ email: 'mentor@demo.com', password: 'Demo@1234', firstName: 'Arjun', lastName: 'Sharma', role: 'mentor' });
  await seedUser({ email: 'mentee@demo.com', password: 'Demo@1234', firstName: 'Priya', lastName: 'Kapoor', role: 'mentee' });
};

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: false }).then(async () => {
  await seedAdmin();
  app.listen(PORT, () => console.log(`MentorPath server running on http://localhost:${PORT}`));
}).catch(err => console.error('DB sync error:', err));
