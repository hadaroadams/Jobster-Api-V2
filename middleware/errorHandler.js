const { StatusCodes } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
  const customError = {
    msg: err.message || "something went Wrong",
    status: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };
  if (err.name === "ValidationError") {
    console.log("valiiError");
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.status = 400;
  }
  if (err.code && err.code === 11000) {
    console.log("11000");
    customError.msg = `Duplication value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.status = 400;
    console.log(err);
  }
  if (err.name === "CastError") {
    customError.msg = `No item found with id:${err.value}`;
  }
  res.status(customError.status).json({ msg: customError.msg });
};

module.exports = errorHandler;
