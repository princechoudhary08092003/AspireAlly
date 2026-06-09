const router = require('express').Router();
const { Booking, TimeSlot, User, MentorProfile } = require('../models');
const { auth, requireRole } = require('../middleware/auth');

// Mentee: book a slot
router.post('/', auth, requireRole('mentee'), async (req, res) => {
  try {
    const { slotId, menteeNotes } = req.body;
    const slot = await TimeSlot.findByPk(slotId);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    if (slot.isBooked) return res.status(400).json({ message: 'Slot already booked' });

    const booking = await Booking.create({
      menteeId: req.user.id,
      mentorId: slot.mentorId,
      slotId,
      menteeNotes,
      status: 'confirmed',
    });

    await slot.update({ isBooked: true });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mentee: my bookings
router.get('/my', auth, requireRole('mentee'), async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { menteeId: req.user.id },
      include: [
        { model: User, as: 'mentor', attributes: ['firstName', 'lastName'],
          include: [{ model: MentorProfile, as: 'mentorProfile', attributes: ['title', 'company', 'photoUrl'] }] },
        { model: TimeSlot, as: 'slot' },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mentor: my bookings
router.get('/mentor-bookings', auth, requireRole('mentor'), async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { mentorId: req.user.id },
      include: [
        { model: User, as: 'mentee', attributes: ['firstName', 'lastName', 'email'] },
        { model: TimeSlot, as: 'slot' },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mentor: add meeting link to booking
router.put('/:id/meeting-link', auth, requireRole('mentor'), async (req, res) => {
  try {
    const booking = await Booking.findOne({ where: { id: req.params.id, mentorId: req.user.id } });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    await booking.update({ meetingLink: req.body.meetingLink, meetingPlatform: req.body.meetingPlatform || 'zoom' });
    res.json({ message: 'Meeting link added', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mentor: mark completed
router.put('/:id/complete', auth, requireRole('mentor'), async (req, res) => {
  try {
    const booking = await Booking.findOne({ where: { id: req.params.id, mentorId: req.user.id } });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    await booking.update({ status: 'completed', mentorNotes: req.body.mentorNotes });

    const profile = await MentorProfile.findOne({ where: { userId: req.user.id } });
    await profile.update({ sessionCount: profile.sessionCount + 1 });

    res.json({ message: 'Session marked as completed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mentee: cancel booking
router.put('/:id/cancel', auth, requireRole('mentee'), async (req, res) => {
  try {
    const booking = await Booking.findOne({ where: { id: req.params.id, menteeId: req.user.id } });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'confirmed') return res.status(400).json({ message: 'Cannot cancel this booking' });

    await booking.update({ status: 'cancelled' });
    await TimeSlot.update({ isBooked: false }, { where: { id: booking.slotId } });
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
