const { Op } = require("sequelize");
const { WorryList, sequelize, Sequelize } = require("../models");
const { ReadList } = require("../models");
exports.createWorryList = async (req, res) => {
  try {
    const { Title, Sender_Content, sender_Id } = req.body;
    const newWorryList = await WorryList.create({
      sender_Id,
      Title,
      Sender_Content,
    });
    res.send({ result: true, message: "성공적으로 등록되었습니다." });
  } catch (error) {
    console.log("post /addWorryList error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};

exports.answerWorryList = async (req, res) => {
  try {
    const { Id, responder_Id, Responder_Content, Responder_Post_DateTime } =
      req.body;
    const newAnswerWorryList = await WorryList.update(
      { responder_Id, Responder_Content, Responder_Post_DateTime },
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
        "Title",
        "Sender_Content",
        "Sender_Swear_Word",
        "Sender_Post_DateTime",
        "responder_Id",
        "Responder_Content",
        "Responder_Swear_Word",
        "Responder_Post_DateTime",
        "Temp_Rate_responder",
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
        "Title",
        "Sender_Content",
        "Sender_Swear_Word",
        "Sender_Post_DateTime",
        "responder_Id",
        "Responder_Content",
        "Responder_Swear_Word",
        "Responder_Post_DateTime",
        "Temp_Rate_responder",
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
    // 최근 100개 조회,  (내가 등록한 고민목록 제외, 내가 본 고민목록 제외)
    const findAllWorryList = await sequelize.query(
      `SELECT worrylist.*, readlist.user_Id, readlist.worryList_Id, readlist.create_DateTime FROM worrylist LEFT JOIN
       readlist ON worrylist.Id = readlist.worryList_Id WHERE
        readlist.user_Id IS NULL OR readlist.user_Id != :userId ORDER BY worrylist.Id DESC LIMIT 100`,
      { replacements: { userId: user_Id }, type: Sequelize.QueryTypes.SELECT }
    );
    res.send({ result: true, findAllWorryList });
  } catch (error) {
    console.log("get /findAllWorryList error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};
