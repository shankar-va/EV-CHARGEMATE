const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createBooking,
  getUserBookings,
  getBooking,
  cancelBooking
} = require('../controllers/bookingController');

const router = express.Router();

// Routes
router.post('/', protect, createBooking);
router.get('/', protect, getUserBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
