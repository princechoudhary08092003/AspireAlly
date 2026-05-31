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

const seedAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mentorpath.com';
  const exists = await User.findOne({ where: { email: adminEmail } });
  if (!exists) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 12);
    await User.create({ email: adminEmail, password: hashed, firstName: 'Admin', lastName: 'AspireAlly', role: 'admin', isEmailVerified: true });
    console.log(`Admin created: ${adminEmail}`);
  }
};

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(async () => {
  await seedAdmin();
  app.listen(PORT, () => console.log(`MentorPath server running on http://localhost:${PORT}`));
}).catch(err => console.error('DB sync error:', err));
