const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const {
  ReadList,
  User,
  WorryList,
  sequelize,
  Sequelize,
} = require("../models");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);

// 도메인 룰 테스트용 고민 10명의 유저 각각 10개씩 총 100개 생성성
exports.testCreateWorryList = async (req, res) => {
  try {
    const findUserId = await User.findAll({
      order: [["userId", "DESC"]],
      limit: 10,
    });

    for (let i = 0; i < 10; i++) {
      let userId = findUserId[i].userId;
      console.log("userId 확인 ===", userId);
      for (let j = 0; j < 10; j++) {
        const newWorryList = await WorryList.create({
          sender_Id: userId,
          title: userId + "의" + j + "번째 유저의 고민",
          senderContent: userId + "의" + j + "번째 유저의 고민",
          senderSwearWord: "N",
        });
      }
    }

    res.send({
      result: true,
      message:
        "성공적으로 10명의 유저 각각 10개씩 총 100개 고민 등록되었습니다.",
    });
  } catch (error) {
    console.log("post /addWorryList error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

exports.createWorryList = async (req, res) => {
  try {
    const { title, senderContent, sender_Id } = req.body;
    const filePath = path.join(__dirname, "../config/badwords.txt");

    // 파일 읽기
    const data = await readFileAsync(filePath, "utf8");

    // 데이터를 배열로 변환하고, 줄 바꿈, 캐리지 리턴, 쉼표 및 빈 문자열 제거
    const badwords = data
      .split(/[\n\r,]+/)
      .map((word) => word.trim())
      .filter((word) => word !== "");

    // badwords 배열에 있는 단어가 senderContent 문자열에 포함되어 있는지 검사
    const containsBadWord = badwords.some((word) =>
      senderContent.includes(word)
    );
    console.log("containsBadWord===", containsBadWord);
    if (containsBadWord) {
      senderSwearWord = "Y";
    } else {
      senderSwearWord = "N";
    }
    console.log("senderSwearWord===", senderSwearWord);
    const newWorryList = await WorryList.create({
      sender_Id,
      title,
      senderContent,
      senderSwearWord,
    });
    res.send({ result: true, message: "성공적으로 고민이 등록되었습니다." });
  } catch (error) {
    console.log("post /addWorryList error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

exports.answerWorryList = async (req, res) => {
  try {
    //Id 는 WorryList 테이블의 Id
    const { Id, responder_Id, responderContent } = req.body;
    const filePath = path.join(__dirname, "../config/badwords.txt");

    // 파일 읽기
    const data = await readFileAsync(filePath, "utf8");

    // 데이터를 배열로 변환하고, 줄 바꿈, 캐리지 리턴, 쉼표 및 빈 문자열 제거
    const badwords = data
      .split(/[\n\r,]+/)
      .map((word) => word.trim())
      .filter((word) => word !== "");

    // badwords 배열에 있는 단어가 senderContent 문자열에 포함되어 있는지 검사
    const containsBadWord = badwords.some((word) =>
      responderContent.includes(word)
    );
    console.log("containsBadWord===", containsBadWord);
    if (containsBadWord) {
      responderSwearWord = "Y";
    } else {
      responderSwearWord = "N";
    }

    const newAnswerWorryList = await WorryList.update(
      {
        responder_Id,
        responderContent,
        responderPostDateTime: new Date(),
        responderSwearWord,
        checkReviewScore: "N",
      },
      { where: { Id } }
    );

    res.send({ result: true, message: "성공적으로 답변을 했습니다." });
  } catch (error) {
    console.log("post /addAnswer error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

exports.myAnswerListContent = async (req, res) => {
  try {
    const { Id } = req.body;
    const myAnswerListContent = await WorryList.findOne({
      attributes: [
        "Id",
        "sender_Id",
        "title",
        "senderContent",
        "senderSwearWord",
        "senderPostDateTime",
        "responder_Id",
        "responderContent",
        "responderSwearWord",
        "responderPostDateTime",
        "tempRateresponder",
        "checkReviewScore",
      ],
      where: { Id },
    });
    res.send({ result: true, myAnswerListContent });
  } catch (error) {
    console.log("post /myAnswerList/content error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};
exports.myWorryListContent = async (req, res) => {
  // 나의 고민에 답변이 달렸을경우 checkReviewScore가 N로 바뀜
  // checkReviewScore 이 N면 리뷰점수를 줄수 있도록 해야함
  // 리뷰점수를 줬으면 N 값에서 Y값으로 변경하고 Y값이면 리뷰점수를 줄수 없도록 해야함
  try {
    const { Id } = req.body;
    const myWorryListContent = await WorryList.findOne({
      attributes: [
        "Id",
        "sender_Id",
        "title",
        "senderContent",
        "senderSwearWord",
        "senderPostDateTime",
        "responder_Id",
        "responderContent",
        "responderSwearWord",
        "responderPostDateTime",
        "tempRateresponder",
        "checkReviewScore",
      ],
      where: { Id },
    });
    res.send({ result: true, myWorryListContent });
  } catch (error) {
    console.log("post /myWorryList/content error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

exports.myWorryList = async (req, res) => {
  try {
    const { sender_Id } = req.body;
    const myWorryList = await WorryList.findAll({
      attributes: [
        "Id",
        "sender_Id",
        "title",
        "senderContent",
        "senderSwearWord",
        "senderPostDateTime",
        "responder_Id",
        "responderContent",
        "responderSwearWord",
        "responderPostDateTime",
        "tempRateresponder",
        "checkReviewScore",
      ],
      where: { sender_Id },
    });
    res.send({ result: true, myWorryList });
  } catch (error) {
    console.log("post /myWorryList error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

exports.myAnswerList = async (req, res) => {
  try {
    const { responder_Id } = req.body;
    const myAnswerList = await WorryList.findAll({
      attributes: [
        "Id",
        "sender_Id",
        "title",
        "senderContent",
        "senderSwearWord",
        "senderPostDateTime",
        "responder_Id",
        "responderContent",
        "responderSwearWord",
        "responderPostDateTime",
        "tempRateresponder",
        "checkReviewScore",
      ],
      where: { responder_Id },
    });
    res.send({ result: true, myAnswerList });
  } catch (error) {
    console.log("post /myAnswerList error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

exports.findAllWorryList = async (req, res) => {
  try {
    const { user_Id } = req.query;
    // 최근 20개 조회,  (내가 등록한 고민목록 제외, 내가 본 고민목록 제외, 답변한목록 제외)
    const findAllWorryList = await sequelize.query(
      `select worrylist.*, readlist.user_Id, readlist.worryList_Id from worrylist 
      left join readlist on worrylist.Id = readlist.worryList_Id where(user_Id is null or user_Id != :userId)
      and sender_Id != :userId and responder_Id is null order by worrylist_Id desc limit 20`,
      { replacements: { userId: user_Id }, type: Sequelize.QueryTypes.SELECT }
    );
    //20개중 5개를 랜덤으로 보냄
    let randomWorryList = [];
    for (let i = 0; i < 5; i++) {
      let randomIndex = Math.floor(Math.random() * findAllWorryList.length);
      randomWorryList.push(findAllWorryList[randomIndex]);
      findAllWorryList.splice(randomIndex, 1);
    }
    //콘솔로그로 출력
    console.log("randomWorryList", randomWorryList);

    //고민등록된 리스트가 없을경우 현제고민이 없다고 해줘야함
    //같은고민을 2명이 답변하고있는경우 마지막으로 답변한사람꺼로 덮어쓰기가 됨.. 답변등록시
    //답변된건지 아닌지 조회를 먼저하고 답변이 된거면 예외처리로 이미답변됫다고 해줌

    res.send({ result: true, randomWorryList });
  } catch (error) {
    console.log("get /worryList error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};
