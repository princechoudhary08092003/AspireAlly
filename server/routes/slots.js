const router = require('express').Router();
const { Op } = require('sequelize');
const { TimeSlot } = require('../models');
const { auth, requireRole } = require('../middleware/auth');

// Mentor: get my slots
router.get('/my', auth, requireRole('mentor'), async (req, res) => {
  try {
    const slots = await TimeSlot.findAll({
      where: { mentorId: req.user.id },
      order: [['date', 'ASC'], ['startTime', 'ASC']],
    });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mentor: add slots
router.post('/', auth, requireRole('mentor'), async (req, res) => {
  try {
    const { slots } = req.body;
    if (!Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ message: 'Provide an array of slots' });
    }

    const created = await TimeSlot.bulkCreate(
      slots.map(s => ({
        mentorId: req.user.id,
        date: s.date,
        startTime: s.startTime,
        endTime: s.endTime,
        durationMinutes: s.durationMinutes || 60,
      }))
    );
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mentor: delete a slot (only if not booked)
router.delete('/:id', auth, requireRole('mentor'), async (req, res) => {
  try {
    const slot = await TimeSlot.findOne({ where: { id: req.params.id, mentorId: req.user.id } });
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    if (slot.isBooked) return res.status(400).json({ message: 'Cannot delete a booked slot' });
    await slot.destroy();
    res.json({ message: 'Slot deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
