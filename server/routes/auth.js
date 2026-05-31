const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const { User, MentorProfile, Subscription } = require('../models');
const { auth } = require('../middleware/auth');
const { sendVerificationEmail } = require('../utils/email');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const hashToken = (raw) => crypto.createHash('sha256').update(raw).digest('hex');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ── Register ──────────────────────────────────────────────────────────────────
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

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashToken(rawToken);
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
      email, password: hashed, firstName, lastName, role,
      isEmailVerified: false,
      emailVerificationToken: tokenHash,
      emailVerificationExpiry: expiry,
    });

    if (role === 'mentor') {
      await MentorProfile.create({ userId: user.id });
    }

    await sendVerificationEmail(email, firstName, rawToken);

    res.status(201).json({ message: 'Account created. Please check your email to verify your account.', emailSent: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Verify email ──────────────────────────────────────────────────────────────
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: 'Verification token is required' });

    const tokenHash = hashToken(token);
    const user = await User.findOne({
      where: {
        emailVerificationToken: tokenHash,
      },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired verification link' });
    if (new Date() > new Date(user.emailVerificationExpiry)) {
      return res.status(400).json({ message: 'Verification link has expired. Please request a new one.' });
    }

    await user.update({
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpiry: null,
    });

    const jwtToken = signToken(user.id);
    res.json({
      token: jwtToken,
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Resend verification email ─────────────────────────────────────────────────
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(200).json({ message: 'If that email exists, a verification link was sent.' });
    if (user.isEmailVerified) return res.status(400).json({ message: 'Email is already verified' });

    // Rate-limit: only allow resend if last token was set > 60s ago
    if (user.emailVerificationExpiry) {
      const lastSent = new Date(user.emailVerificationExpiry).getTime() - 24 * 60 * 60 * 1000;
      if (Date.now() - lastSent < 60 * 1000) {
        return res.status(429).json({ message: 'Please wait a minute before requesting another email' });
      }
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashToken(rawToken);
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await user.update({ emailVerificationToken: tokenHash, emailVerificationExpiry: expiry });
    await sendVerificationEmail(email, user.firstName, rawToken);

    res.json({ message: 'Verification email sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Login ─────────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !user.password) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    if (!user.isActive) return res.status(403).json({ message: 'Account deactivated' });

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: 'Please verify your email before signing in', code: 'EMAIL_NOT_VERIFIED', email: user.email });
    }

    const token = signToken(user.id);
    res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Google OAuth ──────────────────────────────────────────────────────────────
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: 'ID token required' });

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(503).json({ message: 'Google Sign-In is not configured on this server' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, given_name: firstName, family_name: lastName, sub: googleId } = payload;

    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        email,
        firstName: firstName || email.split('@')[0],
        lastName: lastName || '',
        googleId,
        role: 'mentee',
        isEmailVerified: true,
        isActive: true,
      });
    } else {
      // Link Google ID if not already set
      if (!user.googleId) await user.update({ googleId, isEmailVerified: true });
      if (!user.isActive) return res.status(403).json({ message: 'Account deactivated' });
    }

    const token = signToken(user.id);
    res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
  } catch (err) {
    console.error('Google auth error:', err.message);
    res.status(401).json({ message: 'Google sign-in failed. Please try again.' });
  }
});

// ── /me ───────────────────────────────────────────────────────────────────────
router.get('/me', auth, async (req, res) => {
  const u = req.user;
  let profile = null;
  if (u.role === 'mentor') {
    profile = await MentorProfile.findOne({ where: { userId: u.id } });
  }

  let hasActiveSubscription = false;
  if (u.role === 'mentee') {
    const sub = await Subscription.findOne({ where: { userId: u.id, status: 'active' } });
    hasActiveSubscription = !!sub;
  }

  res.json({
    id: u.id, email: u.email, firstName: u.firstName, lastName: u.lastName, role: u.role,
    mentorProfile: profile, hasActiveSubscription,
  });
});

// ── Update profile ────────────────────────────────────────────────────────────
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    await req.user.update({ firstName, lastName });
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Change password ───────────────────────────────────────────────────────────
router.put('/change-password', auth, async (req, res) => {
  try {
    if (!req.user.password) {
      return res.status(400).json({ message: 'Your account uses Google Sign-In and does not have a password' });
    }
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
