module.exports = (sequelize, Sequelize) => {
  const Message = sequelize.define(
    "message",
    {
      msgId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT, // 긴 메세지 저장을을 위해 STRING 대신 TEXT 사용
        allowNull: false,
      },
      receivedUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references: {
        //   model: 'Users',
        //   key: 'id',
        // }
      },
      readOrNot: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE, // Sequelize.DATE로 날짜와 시간을 저장
        allowNull: false, // null 값 허용하지 않음
        defaultValue: Sequelize.NOW, // 기본값으로 현재 시간을 설정
      },
      repliedOrNot: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      reportedOrNot: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      repliedDate: {
        type: Sequelize.DATE, // Sequelize.DATE로 날짜와 시간을 저장
        allowNull: true, // null 값 허용
      },
      repliedContent: {
        type: Sequelize.TEXT,
        allowNull: true, // null 값 허용
      },
    },
    {
      freezeTableName: true,
    }
  );
  return Message;
};
