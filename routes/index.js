const express = require("express");
const UserController = require("../controller/CUser");
//고민봉
const WorryListController = require("../controller/CWorryList");
const ReadListController = require("../controller/CReadList");
const router = express.Router();

router.get("/", UserController.main);

// 새 고민 작성, 욕설필터

router.post("/regist", UserController.registUser);
router.post("/check-email", UserController.checkEmail);
router.post("/login", UserController.loginUser);
router.post("/token", UserController.validation);
router.patch("/change-pw", UserController.changePw);
router.get("/logout", UserController.logout);
router.post("/sendedMsg", UserController.sendedMsg);
router.get("/receivedMsg", UserController.receivedMsg);

//고민봉 유저 고민 등록 row생성
router.post("/addWorryList", WorryListController.createWorryList);

//고민봉 나의 고민 목록 row 가져오기
router.post("/myWorryList", WorryListController.myWorryList);

//고민봉 나의 답변 목록 row 가져오기
router.post("/myAnswerList", WorryListController.myAnswerList);

//고민봉 내가 본 고민 목록  row생성
router.post("/addReadList", ReadListController.createReadList);

//고민봉 고민 답변 row업데이트
router.patch("/addAnswer", WorryListController.answerWorryList);

//고민봉 새로운 고민 보기
router.get("/worryList", WorryListController.findAllWorryList);

module.exports = router;
