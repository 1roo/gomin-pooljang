const express = require("express");
const UserController = require("../controller/CUser");
const router = express.Router();

router.get("/", UserController.main);

router.post("/user/regist", UserController.registUser);
router.post("/user/login", UserController.loginUser);
router.post("/user/token", UserController.validation);
router.patch("/user/change-pw", UserController.changePw);
router.get("/user/logout", UserController.logout);

module.exports = router;
