const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { User, MentorProfile, Booking, Subscription, TimeSlot } = require('../models');
const { auth, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

const guard = [auth, requireRole('admin')];

// Dashboard stats
router.get('/stats', guard, async (req, res) => {
  try {
    const [totalMentors, totalMentees, totalBookings, activeSubscriptions, pendingMentors] = await Promise.all([
      User.count({ where: { role: 'mentor' } }),
      User.count({ where: { role: 'mentee' } }),
      Booking.count(),
      Subscription.count({ where: { status: 'active' } }),
      MentorProfile.count({ where: { isApproved: false } }),
    ]);
    res.json({ totalMentors, totalMentees, totalBookings, activeSubscriptions, pendingMentors });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List all mentors (with profile)
router.get('/mentors', guard, async (req, res) => {
  try {
    const mentors = await User.findAll({
      where: { role: 'mentor' },
      include: [{ model: MentorProfile, as: 'mentorProfile' }],
      order: [['createdAt', 'DESC']],
    });
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single mentor details
router.get('/mentors/:id', guard, async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.id, role: 'mentor' },
      include: [{ model: MentorProfile, as: 'mentorProfile' }],
    });
    if (!user) return res.status(404).json({ message: 'Mentor not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update mentor profile (admin can edit all fields)
router.put('/mentors/:id/profile', guard, upload.single('photo'), async (req, res) => {
  try {
    const profile = await MentorProfile.findOne({ where: { userId: req.params.id } });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const { title, company, bio, yearsExperience, expertise, linkedinUrl, sessionPrice } = req.body;
    const updates = {
      title, company, bio,
      yearsExperience: yearsExperience ? parseInt(yearsExperience) : profile.yearsExperience,
      expertise: expertise ? JSON.parse(expertise) : profile.expertise,
      linkedinUrl,
      sessionPrice: sessionPrice ? parseFloat(sessionPrice) : profile.sessionPrice,
    };
    if (req.file) updates.photoUrl = `/uploads/${req.file.filename}`;

    await profile.update(updates);
    res.json({ message: 'Mentor profile updated', profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve / unapprove mentor
router.put('/mentors/:id/approve', guard, async (req, res) => {
  try {
    const profile = await MentorProfile.findOne({ where: { userId: req.params.id } });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    await profile.update({ isApproved: req.body.isApproved });
    res.json({ message: `Mentor ${req.body.isApproved ? 'approved' : 'unapproved'}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle mentor visibility
router.put('/mentors/:id/visibility', guard, async (req, res) => {
  try {
    const profile = await MentorProfile.findOne({ where: { userId: req.params.id } });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    await profile.update({ isVisible: req.body.isVisible });
    res.json({ message: `Mentor visibility set to ${req.body.isVisible}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List all mentees
router.get('/mentees', guard, async (req, res) => {
  try {
    const mentees = await User.findAll({
      where: { role: 'mentee' },
      include: [{ model: Subscription, as: 'subscriptions', where: { status: 'active' }, required: false }],
      order: [['createdAt', 'DESC']],
    });
    res.json(mentees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle user active status
router.put('/users/:id/toggle-active', guard, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user || user.role === 'admin') return res.status(404).json({ message: 'User not found' });
    await user.update({ isActive: !user.isActive });
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// All bookings
router.get('/bookings', guard, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: User, as: 'mentee', attributes: ['firstName', 'lastName', 'email'] },
        { model: User, as: 'mentor', attributes: ['firstName', 'lastName'] },
        { model: TimeSlot, as: 'slot' },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// All subscriptions
router.get('/subscriptions', guard, async (req, res) => {
  try {
    const subs = await Subscription.findAll({
      include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName', 'email'] }],
      order: [['createdAt', 'DESC']],
    });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
