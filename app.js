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

//고민봉 마이페이지
app.get("/mypage", (req, res) => {
  res.render("mypage");
});

//고민봉 내가보낸 고민탭
app.get("/mypage/content-send", (req, res) => {
  res.render("content_send");
});

//고민봉 내가받은은 고민탭
app.get("/mypage/content-res", (req, res) => {
  res.render("content_res");
});

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

/**
 * 내가 작성한 메시지, 답장 조회회
 * 작성자: 하나래
 */
app.post("/sendedMsg", UserController.sendedMsg);

/**
 * 새 메세지 생성
 * 작성자: 유혜리
 */

app.get("/user/get-message", (req, res) => {
  CMessage.getMessage(req, res);
});

/**
 * 욕설 필터링
 * 작성자: 유혜리
 */ // .then (promise사용)

// 비속어 목록 로드 함수
async function loadBadwordsList() {
  try {
    await db.Message.loadBadwordsList();
    console.log("비속어 목록이 로드되었습니다.");
  } catch (error) {
    console.error("비속어 목록 로드 중 오류 발생:", error);
  }
}

app.get("*", (req, res) => {
  res.render("404");
});

db.sequelize.sync({ force: false, alter: true }).then((result) => {
  console.log("DB연결 성공");
  console.log("------------------------------");
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});
