// backend/seeders/seedData.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Station = require("../models/Station");
const sampleStations = require("./sampleStations");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to DB");

    await Station.deleteMany({});
    console.log("Cleared existing stations...");

    await Station.insertMany(sampleStations);
    console.log(`${sampleStations.length} stations inserted successfully!`);

    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
