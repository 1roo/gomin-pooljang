module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "user",
    {
      userId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      temp: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      receicedUserId: {
        type: Sequelize.INTEGER,
      },
      msgId: {
        type: Sequelize.INTEGER,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return User;
};
