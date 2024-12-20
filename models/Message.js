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

// 욕설 필터링
const fs = require("fs").promises;

class Message {
  constructor() {
    this.badwordsList = [];
  }

  async loadBadwordsList() {
    try {
      const data = await fs.readFile("badwords.txt", "utf8");
      this.badwordsList = data.split("\n").map((word) => word.trim());
    } catch (err) {
      console.error("비속어 목록 로딩 오류: ", err);
    }
  }

  hasBadwords(content) {
    return this.badwordsList.some((word) =>
      content.toLowerCase().includes(word.toLowerCase())
    );
  }

  filterMessage(message) {
    let filteredMessage = message;
    this.badwordsList.forEach((word) => {
      const regex = new RegExp(word, "gi");
      filteredMessage = filteredMessage.replace(regex, "*".repeat(word.length));
    });
    return filteredMessage;
  }
}

module.exports = (sequelize, Sequelize) => {
  // Sequelize 모델 정의
  const MessageModel = sequelize.define("Message", {
    // 모델 필드 정의
  });

  // Message 클래스의 메서드를 MessageModel에 추가
  MessageModel.loadBadwordsList = async () => {
    const message = new Message();
    await message.loadBadwordsList();
    MessageModel.badwordsList = message.badwordsList;
  };

  MessageModel.hasBadwords = Message.prototype.hasBadwords;
  MessageModel.filterMessage = Message.prototype.filterMessage;

  return MessageModel;
};
