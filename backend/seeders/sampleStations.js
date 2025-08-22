// backend/seeders/sampleStations.js

const sampleStations = [
  {
    name: "ChargeMate Station 1",
    address: "123 Main Road, Salem, Tamil Nadu",
    location: { lat: 11.6643, lng: 78.1460 },
    totalSlots: 6,
    availableSlots: 4,
    chargingSpeed: "Medium",
    pricePerHour: 120,
    operatingHours: { open: "06:00", close: "22:00" }
  },
  {
    name: "EV FastCharge Center 2",
    address: "456 Anna Nagar, Chennai, Tamil Nadu",
    location: { lat: 13.0827, lng: 80.2707 },
    totalSlots: 8,
    availableSlots: 5,
    chargingSpeed: "Fast",
    pricePerHour: 200,
    operatingHours: { open: "00:00", close: "23:59" }
  },
  {
    name: "GreenWheels Hub 3",
    address: "MG Road, Bengaluru, Karnataka",
    location: { lat: 12.9716, lng: 77.5946 },
    totalSlots: 10,
    availableSlots: 7,
    chargingSpeed: "Ultra",
    pricePerHour: 100,
    operatingHours: { open: "08:00", close: "20:00" }
  },
  // ... continue similar entries
];

// Generate many more (example: 100+)
const speedOptions = ["Slow", "Medium", "Fast", "Ultra"];
for (let i = 1; i <= 120; i++) {
  sampleStations.push({
    name: `EV Station ${i}`,
    address: `${i * 10} EV Street, Test City`,
    location: {
      lat: 11.5 + Math.random() * 2,
      lng: 78 + Math.random() * 2
    },
    totalSlots: Math.floor(Math.random() * 10) + 4,
    availableSlots: Math.floor(Math.random() * 6),
    chargingSpeed: speedOptions[Math.floor(Math.random() * speedOptions.length)],
    pricePerHour: Math.floor(Math.random() * 150) + 80,
    operatingHours: { open: "06:00", close: "22:00" }
  });
}

module.exports = sampleStations;
