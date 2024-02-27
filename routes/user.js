const express = require("express");
const Router = express.Router();
const { login, register, update } = require("./../controllers/authController");
const authentication = require("./../middleware/authentication");
const testUser = require("./../middleware/testUser");

Router.post("/register", register);
Router.post("/login", login);
Router.patch("/updateUser", authentication , testUser, update);

module.exports = Router;
