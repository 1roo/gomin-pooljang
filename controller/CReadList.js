const { ReadList } = require("../models");
exports.createReadList = async (req, res) => {
  try {
    const { user_Id, worryList_Id } = req.body;
    const newReadList = await ReadList.create({
      user_Id,
      worryList_Id,
    });
    res.send({ result: true, message: "성공적으로 등록되었습니다." });
  } catch (error) {
    console.log("post /addReadList error", error);
    res.status(500).send({ message: "서버 에러" });
  }
};
