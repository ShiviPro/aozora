const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGODB;

const initialiseDatabase = async () => {
  await mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("Successfully connected to DB.");
    })
    .catch((error) => {
      console.log("Error connecting to DB:", error);
    });
};

module.exports = { initialiseDatabase };
