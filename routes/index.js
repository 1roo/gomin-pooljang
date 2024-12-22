const express = require("express");
const UserController = require("../controller/CUser");
//고민봉
const WorryListController = require("../controller/CWorryList");
const ReadListController = require("../controller/CReadList");
const router = express.Router();

router.get("/", UserController.main);

// 새 고민 작성, 욕설필터

router.post("/user/regist", UserController.registUser);
router.post("/user/login", UserController.loginUser);
router.post("/user/token", UserController.validation);
router.patch("/user/change-pw", UserController.changePw);
router.get("/user/logout", UserController.logout);
router.post("/user/sendedMsg", UserController.sendedMsg);
router.get("/user/receivedMsg", UserController.receivedMsg);

//고민봉 유저 고민 등록 row생성
router.post("/addWorryList", WorryListController.createWorryList);

//고민봉 유저가 본 고민 row생성
router.post("/addReadList", ReadListController.createReadList);

//고민봉 고민 답변 row업데이트
router.patch("/addAnswer", WorryListController.answerWorryList);

module.exports = router;
