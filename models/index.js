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
  config,
  {
    timezone: "Asia/Seoul",
    dialectOptions: {
      charset: "utf8mb4",
      dateStrings: true,
      typeCast: true,
    },
  }
);

const UserModel = require("./User")(sequelize, Sequelize);
const MessageModel = require("./Message")(sequelize, Sequelize);

db.User = require("./User")(sequelize, Sequelize);
db.Message = require("./Message")(sequelize, Sequelize);

UserModel.hasMany(MessageModel, {
  foreignKey: "userId",
  sourceKey: "userId",
});

MessageModel.belongsTo(UserModel, {
  foreignKey: "userId",
  targetKey: "userId",
});

db.User = UserModel;
db.Message = MessageModel;
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
