const { StatusCodes } = require("http-status-codes");
const asyncFunc = require("../middleware/async");
const Jobs = require("../model/Jobs");
const { BadRequest, NotFound } = require("../errors");
const { default: mongoose } = require("mongoose");

const getAllJob = asyncFunc(async (req, res, next) => {
  const { search, status, jobType, sort } = req.query;
  const queryObject = {
    createdBy: req.user.userID,
  };
  if (search) {
    queryObject.position = { $regex: search, $option: "i" };
  }
  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }
  let result = Jobs.find(queryObject);
  if (sort === "latest") {
    result = result.sort("-createAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("position");
  }
  if (sort === "z-a") {
    result = result.sort("-position");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);
  const jobs = await result;
  const totalJobs = await Jobs.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);
  res.status(StatusCodes.OK).json({ jobs, page, totalJobs, numOfPages });
});

const getJob = asyncFunc(async (req, res, next) => {
  const {
    user: { userID },
    params: { id: jobId },
  } = req;

  const job = await Jobs.findOne({ _id: jobId, createdBy: userID });

  res.status(StatusCodes.OK).json({ job });
});

const createJob = asyncFunc(async (req, res, next) => {
  req.body.createdBy = req.user.userID;
  const job = await Jobs.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
});

const updateJob = asyncFunc(async (req, res, next) => {
  const {
    body: { company, position },
    user: { userID },
    params: { id: jobId },
  } = req;
  if (!company || !position)
    return next(new BadRequest("Company or position field cant be empty"));
  const job = await Jobs.findOne({ _id: jobId, createdBy: userID });
  if (!job) next(new NotFound(`No job with id${jobId} found`));
  job.position = position;
  job.company = company;
  res.status(StatusCodes.OK).json({ job });
});

const deleteJob = asyncFunc(async (req, res, next) => {
  const {
    user: { userID },
    params: { id: jobId },
  } = req;
  const job = await Jobs.findByIdAndDelete({ _id: jobId, createdBy: userID });
  if (!job) return next(new NotFound(`No job with id${jobId} found`));
  res.status(StatusCodes.OK).send();
});

const showStats = asyncFunc(async (req, res, next) => {
  let stats = await Jobs.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userID) } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  console.log(stats);
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});
  console.log(stats);
  return res.sendStatus(200);
});

module.exports = {
  getAllJob,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  showStats,
};
