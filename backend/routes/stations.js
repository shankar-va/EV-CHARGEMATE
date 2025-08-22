const express = require('express');
//const { getStations, getStation } = require('../controllers/stationController');
const { protect } = require('../middleware/authMiddleware');

const stationController = require('../controllers/stationController');
console.log("stationController:", stationController);
const { getStations, getStation } = stationController;


const router = express.Router();

// Routes
router.get('/', protect, getStations);
router.get('/:id', protect, getStation);

module.exports = router;