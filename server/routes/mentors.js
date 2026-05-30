const router = require('express').Router();
const { Op } = require('sequelize');
const { User, MentorProfile, TimeSlot, Booking } = require('../models');
const { auth, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const path = require('path');

// Public: list approved & visible mentors
router.get('/', async (req, res) => {
  try {
    const { search, expertise } = req.query;
    const profileWhere = { isApproved: true, isVisible: true };

    const mentors = await MentorProfile.findAll({
      where: profileWhere,
      include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] }],
      order: [['rating', 'DESC']],
    });

    let results = mentors;
    if (search) {
      const s = search.toLowerCase();
      results = results.filter(m =>
        m.user.firstName.toLowerCase().includes(s) ||
        m.user.lastName.toLowerCase().includes(s) ||
        (m.title || '').toLowerCase().includes(s) ||
        (m.company || '').toLowerCase().includes(s)
      );
    }
    if (expertise) {
      results = results.filter(m => m.expertise.some(e => e.toLowerCase().includes(expertise.toLowerCase())));
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public: single mentor profile + available slots
router.get('/:id', async (req, res) => {
  try {
    const profile = await MentorProfile.findOne({
      where: { userId: req.params.id, isApproved: true, isVisible: true },
      include: [{ model: User, as: 'user', attributes: ['id', 'firstName', 'lastName'] }],
    });
    if (!profile) return res.status(404).json({ message: 'Mentor not found' });

    const today = new Date().toISOString().split('T')[0];
    const slots = await TimeSlot.findAll({
      where: { mentorId: req.params.id, isBooked: false, date: { [Op.gte]: today } },
      order: [['date', 'ASC'], ['startTime', 'ASC']],
    });

    res.json({ ...profile.toJSON(), availableSlots: slots });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mentor: update own profile
router.put('/me/profile', auth, requireRole('mentor'), upload.single('photo'), async (req, res) => {
  try {
    const profile = await MentorProfile.findOne({ where: { userId: req.user.id } });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const { title, company, bio, yearsExperience, expertise, linkedinUrl, sessionPrice } = req.body;
    const updates = {
      title,
      company,
      bio,
      yearsExperience: yearsExperience ? parseInt(yearsExperience) : profile.yearsExperience,
      expertise: expertise ? JSON.parse(expertise) : profile.expertise,
      linkedinUrl,
      sessionPrice: sessionPrice ? parseFloat(sessionPrice) : profile.sessionPrice,
    };

    if (req.file) {
      updates.photoUrl = `/uploads/${req.file.filename}`;
    }

    await profile.update(updates);
    res.json({ message: 'Profile updated', profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mentor: get own full profile
router.get('/me/profile', auth, requireRole('mentor'), async (req, res) => {
  try {
    const profile = await MentorProfile.findOne({ where: { userId: req.user.id } });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
