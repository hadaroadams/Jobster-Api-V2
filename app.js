require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// security
const cors = require("cors");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimite = require("express-rate-limit");

// middle ware
const notFound = require("./middleware/notfound");

const connectDB = require("./config/dbconn");

connectDB();

const PORT = process.env.PORT || 4000;

app.set("trust proxy", 1);

const limiter = rateLimite({
  windowMS: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extends: false }));

// security
app.use(cors());
app.use(helmet());
app.use(xss());

app.use(notFound);
mongoose.connection.once("open", () => {
  console.log("connected to mongoDB");
  app.listen(PORT, () => {
    console.log(`server running of Port:${PORT}`);
  });
});
