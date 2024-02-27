const User = require("./../model/Users");
const asyncFunc = require("./../middleware/async");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequest,
  CustomError,
  NotFound,
  Unathorized,
} = require("./../errors");

const register = asyncFunc(async (req, res, next) => {
  const user = await User.create({ ...req.body });
  console.log(user);
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
      jwt: token,
    },
  });
});

const login = asyncFunc(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new BadRequest("please provide email and password"));
  const user = await User.findOne({ email });
  if (!user) return next(new NotFound("Invalid credentials"));
  const isMatch = user.comparePassword(password);
  if (!isMatch) return next(new NotFound("Invalid credentials"));
  const token = user.createJWT();

  res.status(StatusCodes.OK).json({
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
      jwt: token,
    },
  });
});

const update = asyncFunc(async (req, res, next) => {
  const { firstName, lastName, location, email } = req.body;
  if (!(firstName || lastName || location || email))
    return next(new BadRequest("please provde all values"));

  const user = await User.findOne({ _id: req.user.userID });

  user.firstName = firstName;
  user.lastName = lastName;
  user.location = location;
  user.email = email;

  await user.save();
  const token = user.createJWT();
  res
    .status(StatusCodes.OK)
    .json({ user: { firstName, lastName, location, email, jwt: token } });
});

module.exports = { register, login, update };
