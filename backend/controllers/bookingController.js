const Booking = require('../models/Booking');
const Station = require('../models/Station');
const { validationResult } = require('express-validator');

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { stationId, startTime, endTime, duration } = req.body;
    const userId = req.user.id;

    // Check if station exists and has availability
    const station = await Station.findById(stationId);
    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Charging station not found'
      });
    }

    if (station.availableSlots <= 0) {
      return res.status(400).json({
        success: false,
        message: 'No available slots at this station'
      });
    }

    // Check for overlapping bookings for the same user
    const existingBooking = await Booking.findOne({
      user: userId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          startTime: { $lt: new Date(endTime) },
          endTime: { $gt: new Date(startTime) }
        }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You already have a booking that overlaps with this time'
      });
    }

    // Calculate total amount
    const totalAmount = duration * station.pricePerHour;

    // Assign a slot number (simple logic - can be improved)
    const slotNumber = station.totalSlots - station.availableSlots + 1;

    // Create booking
    const booking = await Booking.create({
      user: userId,
      station: stationId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      duration,
      totalAmount,
      slotNumber,
      status: 'confirmed'
    });

    // Update station availability
    station.availableSlots -= 1;
    await station.save();

    // Populate the booking with user and station details
    await booking.populate('user', 'name email');
    await booking.populate('station', 'name address');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    let query = { user: userId };
    if (status) {
      query.status = status;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: 'station', select: 'name address location chargingSpeed' }
      ]
    };

    const bookings = await Booking.find(query)
      .populate('station', 'name address location chargingSpeed')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      count: bookings.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      bookings
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;

    const booking = await Booking.findOne({
      _id: bookingId,
      user: userId
    }).populate('station');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel this booking'
      });
    }

    // Check if cancellation is allowed (e.g., not too close to start time)
    const now = new Date();
    const timeDiff = booking.startTime - now;
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff < 1) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking less than 1 hour before start time'
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Update station availability
    const station = await Station.findById(booking.station._id);
    if (station) {
      station.availableSlots += 1;
      await station.save();
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
};

// Get single booking
const getBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;

    const booking = await Booking.findOne({
      _id: bookingId,
      user: userId
    }).populate('station', 'name address location chargingSpeed pricePerHour');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  cancelBooking,
  getBooking
};