require("dotenv").config();
const { default: mongoose } = require("mongoose");
const connectDB = require("./config/dbconn");
const mockData = require("./mock-data.json");

const Jobs = require("./model/Jobs");

const start = async () => {
  try {
    await connectDB();
    console.log("work");
    await Jobs.create(
      mockData.map((item) => {
        return {
          ...item,
          createdBy:new mongoose.Types.ObjectId("65ddffaf8f41c923a746a58e"),
        };
      })
    );
    console.log("success");
    process.exit(0);
  } catch (error) {
    console.log("Didnt work");
    console.log(error);
    process.exit(1);
  }
};

start();
