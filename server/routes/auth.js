const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, MentorProfile, Subscription } = require('../models');
const { auth } = require('../middleware/auth');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const allowed = ['mentor', 'mentee'];
    if (!allowed.includes(role)) return res.status(400).json({ message: 'Invalid role' });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password: hashed, firstName, lastName, role });

    if (role === 'mentor') {
      await MentorProfile.create({ userId: user.id });
    }

    const token = signToken(user.id);
    res.status(201).json({ token, user: { id: user.id, email, firstName, lastName, role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    if (!user.isActive) return res.status(403).json({ message: 'Account deactivated' });

    const token = signToken(user.id);
    res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', auth, async (req, res) => {
  const u = req.user;
  let profile = null;
  if (u.role === 'mentor') {
    profile = await MentorProfile.findOne({ where: { userId: u.id } });
  }

  // check active subscription for mentee
  let hasActiveSubscription = false;
  if (u.role === 'mentee') {
    const sub = await Subscription.findOne({
      where: { userId: u.id, status: 'active' },
    });
    hasActiveSubscription = !!sub;
  }

  res.json({
    id: u.id,
    email: u.email,
    firstName: u.firstName,
    lastName: u.lastName,
    role: u.role,
    mentorProfile: profile,
    hasActiveSubscription,
  });
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    await req.user.update({ firstName, lastName });
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const valid = await bcrypt.compare(currentPassword, req.user.password);
    if (!valid) return res.status(400).json({ message: 'Current password is incorrect' });
    const hashed = await bcrypt.hash(newPassword, 12);
    await req.user.update({ password: hashed });
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
