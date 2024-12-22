const { WorryList } = require("../models");
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
    const { Id, Responder_Content, responder_Id, Responder_Post_DateTime } =
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
