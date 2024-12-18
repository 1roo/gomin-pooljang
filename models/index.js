"use strict";

const Sequelize = require("sequelize");

let config = require(__dirname + "/../config/config.js");
console.log("config", config);
config = config["development"];

const db = {};

let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const UserModel = require("./User")(sequelize, Sequelize);
const MessageModel = require("./Message")(sequelize, Sequelize);

UserModel.hasMany(MessageModel, {
  foreignKey: "userId",
  sourceKey: "userId",
});
MessageModel.belongsTo(UserModel, {
  foreignKey: "userId",
  targetKey: "userId",
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require("./User")(sequelize, Sequelize);
db.Message = require("./Message")(sequelize, Sequelize);

module.exports = db;
