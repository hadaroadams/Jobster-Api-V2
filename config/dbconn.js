const mongoose = require("mongoose");

const connectDB = async () => {
//   console.log(process.env.MONGO_DATABASE_URL);/
  try {
    await mongoose.connect(process.env.MONGO_DATABASE_URL);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
