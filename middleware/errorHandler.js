const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
  const customError = {
    msg: err.message || "something went Wrong",
    status: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };
  if (err.name === "ValidationError") {
    console.log("valiiError");
    console.log(err);
  }
  if (err.code && err.code === 11000) {
    console.log("11000");
    console.log(err);
  }
  res.status(customError.status).json({ msg: customError.msg });
};


module.exports = errorHandler