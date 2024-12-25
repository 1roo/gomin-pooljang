const express = require("express");
const db = require("./models");
const app = express();
require("dotenv").config();
const UserController = require("./controller/CUser");
const PORT = process.env.PORT;
const cors = require("cors");

app.set("view engine", "ejs");
app.set("views", "./views");
app.use("/static", express.static(__dirname + "/static"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const indexRouter = require("./routes");

const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use("/", indexRouter);
app.use(cors());

/**
 * 이메일 중복여부
 * 작성자: 하나래
 */
app.post("/check-email", UserController.checkEmail);

/**
 * 회원가입
 * 작성자: 하나래
 */
app.post("/regist", UserController.registUser);

/**
 * 로그인
 * 작성자: 하나래
 */
app.post("/login", UserController.loginUser);

/**
 * 토큰 검증
 * 작성자: 하나래
 */
app.post("/token", UserController.validation);

/**
 * 비밀번호 수정
 * 작성자: 하나래
 */
app.patch("/changePw", UserController.changePw);

/**
 * 로그아웃
 * 작성자: 하나래
 */
app.post("/logout", UserController.logout);

/**
 * 회원탈퇴
 * 작성자: 하나래
 */
app.post("/deleteAccount", UserController.deleteAccount);

/**
 * 회원가입질문 일치 여부
 * 작성자: 하나래
 */
app.post("/findAccount", UserController.findAccount);

app.get("*", (req, res) => {
  res.render("404");
});

db.sequelize.sync({ force: false, alter: false }).then((result) => {
  console.log("DB연결 성공");
  console.log("------------------------------");
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});
