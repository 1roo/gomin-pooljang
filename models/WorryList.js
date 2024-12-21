const UserModel = require("./User");
const User = UserModel.User;
const WorryListModel = (sequelize, Sequelize) => {
  const WorryList = sequelize.define(
    "worrylist",
    {
      Id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      Sender_Content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      Responder_Content: {
        type: Sequelize.TEXT,
      },
      Temp_Rate_responder: {
        type: Sequelize.FLOAT,
      },
      Sender_Swear_Word: {
        type: Sequelize.STRING(1),
      },
      Responder_Swear_Word: {
        type: Sequelize.STRING(1),
      },
      Sender_Post_DateTime: {
        type: Sequelize.DATE,
      },
      Responder_Post_DateTime: {
        type: Sequelize.DATE,
      },
      sender_Id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: "userId",
        },
      },
      responder_Id: {
        type: Sequelize.INTEGER,
        references: {
          model: User,
          key: "userId",
        },
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );
  return WorryList;
};

module.exports = WorryListModel;
