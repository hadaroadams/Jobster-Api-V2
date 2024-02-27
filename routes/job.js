const express = require("express");
const Router = express.Router();
const testUser = require("./../middleware/testUser");
const {
  createJob,
  deleteJob,
  getAllJob,
  getJob,
  updateJob,
  showStats,
} = require("./../controllers/jobsController");

Router.route("/").get(getAllJob).post(testUser, createJob);
Router.route("/stats").get(showStats);

Router.route("/:id")
  .get(getJob)
  .patch(testUser, updateJob)
  .delete(testUser, deleteJob);

module.exports = Router;
