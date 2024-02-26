const notFound = (req, res) => res.status(400).send("Route can not be found");

module.exports = notFound;
