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
    dialectOptions: {
      charset: "utf8mb4",
      dateStrings: true,
      typeCast: true,
    },
  }
);

const UserModel = require("./User")(sequelize, Sequelize);
const WorryListModel = require("./WorryList")(sequelize, Sequelize);
const ReadListModel = require("./ReadList")(sequelize, Sequelize);

WorryListModel.belongsTo(UserModel, {
  foreignKey: "sender_Id",
  targetKey: "userId",
});

WorryListModel.belongsTo(UserModel, {
  foreignKey: "responder_Id",
  targetKey: "userId",
});

WorryListModel.hasMany(ReadListModel, {
  foreignKey: "worryList_Id",
  sourceKey: "Id",
});

ReadListModel.belongsTo(UserModel, {
  foreignKey: "user_Id",
  targetKey: "userId",
});

ReadListModel.belongsTo(WorryListModel, {
  foreignKey: "worryList_Id",
  targetKey: "Id",
});

db.User = UserModel;
db.WorryList = WorryListModel;
db.ReadList = ReadListModel;
db.sequelize = sequelize;
db.Sequelize = Sequelize;
console.log(db.Message);

module.exports = db;
