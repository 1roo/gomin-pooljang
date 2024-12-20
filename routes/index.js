const express = require("express");
const UserController = require("../controller/CUser");
const MessageController = require("../controller/CMessage");
const router = express.Router();

router.get("/", UserController.main);


// 새 고민 받아오기
router.get("/user/get-message", MessageController.getMessage);

// 새 고민 작성, 욕설필터
router.post("/message/write", MessageController.filterMessage);

router.post("/user/regist", UserController.registUser);
router.post("/user/login", UserController.loginUser);
router.post("/user/token", UserController.validation);
router.patch("/user/change-pw", UserController.changePw);
router.get("/user/logout", UserController.logout);

module.exports = router;
