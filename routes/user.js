const express = require("express");
const Router = express.Router();
const { login, register, update } = require("./../controllers/authController");

Router.post("/register", register);
Router.post("/login", login);
Router.post("/updateUser", update);

module.exports = Router;
