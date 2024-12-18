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
<<<<<<< HEAD
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
=======
      pw: {
        type: Sequelize.STRING,
        allowNull: false,
      },
>>>>>>> 260e4672ec79317e76f8170f8dfed33643067769
    },
    {
      freezeTableName: true,
    }
  );
  return User;
};
