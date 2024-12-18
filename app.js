const express = require("express");
const db = require("./models");
const app = express();
require("dotenv").config();
const UserController = require("./controller/CUser");
const PORT = process.env.PORT;

app.set("view engine", "ejs");
app.set("views", "./views");
app.use("/static", express.static(__dirname + "/static"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const indexRouter = require("./routes");

app.use("/", indexRouter);

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

app.get("*", (req, res) => {
  res.render("404");
});

db.sequelize.sync({ force: false }).then((result) => {
  console.log("DB연결 성공");
  console.log("------------------------------");
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});
