const { BadRequest } = require("../errors");

const testUser = (req, res, next) => {
  if (req.user.testUser) {
    next(new BadRequest("test user is only Read!!"));
  }
  next();
};
module.exports = testUser;
