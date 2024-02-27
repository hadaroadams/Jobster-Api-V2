const asyncFunc = (func) => {
  return async (req, res, next) => {
    try {
      return await func(req, res, next);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
};

module.exports = asyncFunc;
