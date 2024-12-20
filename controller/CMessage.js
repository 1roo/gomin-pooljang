const Message = require("../models/Message");

// 고민 생성
// .then으로 filterMessage함수 사용하기 -> 마지막에 return Message
// readOrNot 이 F면
// receivedUserId int에 쏴주기

// 임시 사용자 데이터
const tempUsers = [
  { id: 1, name: "User1" },
  { id: 2, name: "User2" },
  { id: 3, name: "User3" },
  { id: 4, name: "User4" },
  { id: 5, name: "User5" },
];

// 임시 메시지 저장소
let messages = [];

exports.getMessage = async (req, res) => {
  try {
    // 임의의 사용자 ID 사용 (실제로는 인증 시스템에서 가져와야 함)
    const userId = 1;

    // 랜덤으로 수신자 선택 (자신 제외)
    const availableUsers = tempUsers.filter((user) => user.id !== userId);
    const randomUser =
      availableUsers[Math.floor(Math.random() * availableUsers.length)];

    if (!randomUser) {
      return res
        .status(404)
        .json({ message: "메시지를 받을 수 있는 사용자가 없습니다." });
    }

    // 새 메시지 생성
    const newMessage = {
      msgId: messages.length + 1,
      userId: userId,
      content: req.query.content,
      receivedUserId: randomUser.id,
      readOrNot: false,
      createdAt: new Date(),
      repliedOrNot: false,
      reportedOrNot: false,
    };

    messages.push(newMessage);

    res.status(201).json({
      message: "메시지가 성공적으로 생성되었습니다.",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      message: "메시지 생성 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

// 욕설필터
exports.filterMessage = (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "내용이 제공되지 않았습니다." });
    }

    const hasBadwords = Message.hasBadwords(content);
    const filteredContent = Message.filterMessage(content);

    res.json({
      originalContent: content,
      hasBadwords,
      filteredContent,
    });
  } catch (error) {
    console.error("내용 검증 오류:", error);
    res.status(500).json({ error: "내용 검증 중 오류가 발생했습니다." });
  }
};
