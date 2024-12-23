const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { WorryList, sequelize, Sequelize } = require("../models");
const { ReadList } = require("../models");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);

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
    res.send({ result: true, message: "성공적으로 등록되었습니다." });
  } catch (error) {
    console.log("post /addWorryList error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

exports.answerWorryList = async (req, res) => {
  try {
    //Id 는 WorryList 테이블의 Id
    const { Id, responder_Id, responderContent, responderPostDateTime } =
      req.body;
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
        responderPostDateTime,
        responderSwearWord,
      },
      { where: { Id } }
    );

    res.send({ result: true, message: "성공적으로 업데이트 함함" });
  } catch (error) {
    console.log("post /addAnswer error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

exports.myWorryList = async (req, res) => {
  try {
    const { sender_Id } = req.body;
    const newMyWorryList = await WorryList.findAll({
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
      ],
      where: { sender_Id },
    });
    res.send({ result: true, newMyWorryList });
  } catch (error) {
    console.log("get /myWorryList error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

exports.myAnswerList = async (req, res) => {
  try {
    const { responder_Id } = req.body;
    const newMyAnswerList = await WorryList.findAll({
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
      ],
      where: { responder_Id },
    });
    res.send({ result: true, newMyAnswerList });
  } catch (error) {
    console.log("get /myAnswerList error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

exports.findAllWorryList = async (req, res) => {
  //내가 본 고민은 제외하고 WorryList테이블에서 id값 기준으로 맨뒤에 100개를 가져와야함.
  // 100개중 랜덤20개를 따로 저장하고 다음버튼 누룰시 20개중 다음 고민이 나오게 해야함.
  // 다음 버튼 누룰시 봤던고민은 ReadList 테이블에 추가함.
  // 답변 보내기 버튼을 누를시 WorryList 필드를 업데이트 함

  try {
    const { user_Id } = req.query;
    // 최근 100개 조회,  (내가 등록한 고민목록 제외, 내가 본 고민목록 제외, 답변한목록 제외)
    const findAllWorryList = await sequelize.query(
      `select worrylist.*, readlist.user_Id, readlist.worryList_Id from worrylist 
      left join readlist on worrylist.Id = readlist.worryList_Id where(user_Id is null or user_Id != :userId)
      and sender_Id != :userId and responder_Id is null order by worrylist_Id desc limit 100`,
      { replacements: { userId: user_Id }, type: Sequelize.QueryTypes.SELECT }
    );
    //20개를 랜덤으로 배열에 저장
    let randomWorryList = [];
    for (let i = 0; i < 2; i++) {
      let randomIndex = Math.floor(Math.random() * findAllWorryList.length);
      randomWorryList.push(findAllWorryList[randomIndex]);
      findAllWorryList.splice(randomIndex, 1);
    }
    //콘솔로그로 출력
    console.log("randomWorryList", randomWorryList);

    //고민등록된 리스트가 없을경우 현제고민이없다고 에러?
    //아니면 가짜 고민 1000개 넣어두기?
    //등록자가 답변자 점수평가시 입력안하면 기본 점수로

    res.send({ result: true, randomWorryList });
  } catch (error) {
    console.log("get /findAllWorryList error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};
