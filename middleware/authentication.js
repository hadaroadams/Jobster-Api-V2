const asyncFunc = require("./async");
const { Unathorized } = require("./../errors/index");
const jwt = require("jsonwebtoken");

const authentication = asyncFunc(async (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization);
  // console.log(req.headers)
  if (!authorization || !authorization.startsWith("Bearer "))
    return next(new Unathorized("Authenication Invalid"));
  const token = authorization.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRETE_TOKEN);
    console.log(payload);
    const testUser = payload.userID === "65ddffaf8f41c923a746a58e";
    req.user = { userID: payload.userID, testUser };
    return next();
  } catch (error) {
    return next(new Unathorized("Authenication Invalid"));
  }
});

module.exports = authentication;
