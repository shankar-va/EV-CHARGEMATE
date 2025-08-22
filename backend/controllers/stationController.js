const Station = require('../models/Station');
const Booking = require('../models/Booking');

// Get all charging stations
const getStations = async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;
    let query = { isActive: true };

    // If coordinates provided, find stations within radius
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const radiusKm = parseFloat(radius);

      query['location.lat'] = {
        $gte: latitude - (radiusKm / 111), // 111 km per degree latitude
        $lte: latitude + (radiusKm / 111)
      };
      query['location.lng'] = {
        $gte: longitude - (radiusKm / 111),
        $lte: longitude + (radiusKm / 111)
      };
    }

    const stations = await Station.find(query);

    res.json({
      success: true,
      count: stations.length,
      stations
    });
  } catch (error) {
    console.error('Get stations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching charging stations',
      error: error.message
    });
  }
};

// Get single charging station
const getStation = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);

    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Charging station not found'
      });
    }

    res.json({
      success: true,
      station
    });
  } catch (error) {
    console.error('Get station error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching charging station',
      error: error.message
    });
  }
};

// Update station availability (typically called after booking/cancellation)
const updateStationAvailability = async (stationId, change) => {
  try {
    const station = await Station.findById(stationId);
    if (station) {
      station.availableSlots = Math.max(0, Math.min(station.totalSlots, station.availableSlots + change));
      await station.save();
    }
  } catch (error) {
    console.error('Error updating station availability:', error);
  }
};

module.exports = {
  getStations,
  getStation,
  updateStationAvailability
};