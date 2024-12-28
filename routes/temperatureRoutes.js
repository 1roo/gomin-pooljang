const express = require("express");
const router = express.Router();
const { User } = require("../models");
const { validation } = require("../controller/CUser");

router.post("/update-temperature", async (req, res) => {
  try {
    const userInfo = await validation(req);
    if (!userInfo?.id) {
      return res.send({
        success: false,
        message: "사용자 인증에 실패했습니다.",
      });
    }

    const { rating } = req.body;

    // 온도 변화 계산
    let tempChange = 0;
    switch (rating) {
      case 1:
        tempChange = -0.1;
        break;
      case 2:
        tempChange = -0.2;
        break;
      case 3:
        tempChange = 0;
        break;
      case 4:
        tempChange = 0.1;
        break;
      case 5:
        tempChange = 0.2;
        break;
      default:
        return res.send({ success: false, message: "잘못된 별점입니다." });
    }

    // 사용자 온도 업데이트
    const user = await User.findByPk(userInfo.id);
    if (!user) {
      return res.send({
        success: false,
        message: "사용자를 찾을 수 없습니다.",
      });
    }

    const newTemperature = Math.round((user.temp + tempChange) * 10) / 10;

    await user.update({ temp: newTemperature });

    res.send({ success: true, newTemperature });
  } catch (error) {
    console.error("온도 업데이트 오류:", error);
    res.status(500).send({
      success: false,
      message: "서버 오류가 발생했습니다. 나중에 다시 시도해주세요.",
    });
  }
});

module.exports = router;
