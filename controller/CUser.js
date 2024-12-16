const models = require("../models/index");

/* '/' GET */
exports.main = (req, res) => {
  res.render("index");
};
