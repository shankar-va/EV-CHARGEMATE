const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Station name is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  location: {
    lat: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: -90,
      max: 90
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: -180,
      max: 180
    }
  },
  totalSlots: {
    type: Number,
    required: [true, 'Total slots is required'],
    min: [1, 'Must have at least 1 slot']
  },
  availableSlots: {
    type: Number,
    required: [true, 'Available slots is required'],
    min: [0, 'Available slots cannot be negative']
  },
  chargingSpeed: {
    type: String,
    enum: ['Slow', 'Fast', 'Medium', 'Ultra'],
    required: [true, 'Charging speed is required']
  },
  pricePerHour: {
    type: Number,
    required: [true, 'Price per hour is required'],
    min: [0, 'Price cannot be negative']
  },
  connectorTypes: [{
    type: String,
    enum: ['Type 1', 'Type 2', 'CHAdeMO', 'CCS', 'Tesla Supercharger']
  }],
  amenities: [{
    type: String
  }],
  operatingHours: {
    open: {
      type: String,
      required: true
    },
    close: {
      type: String,
      required: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure availableSlots doesn't exceed totalSlots
stationSchema.pre('save', function(next) {
  if (this.availableSlots > this.totalSlots) {
    this.availableSlots = this.totalSlots;
  }
  next();
});

module.exports = mongoose.model('Station', stationSchema);