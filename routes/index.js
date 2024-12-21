const express = require("express");
const UserController = require("../controller/CUser");
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

module.exports = router;
